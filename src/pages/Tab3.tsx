/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import {
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonCheckbox,
  IonSearchbar,
  IonButton,
  IonIcon,
  useIonAlert,
  useIonToast,
  IonActionSheet,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import {
  fetchUserObservations,
  fetchUserObservationsBySpecies,
  getCurrentUserUID,
  deleteObservations,
  updateObservation,
  IObservationUpdate,
} from "../firebaseConfig";
import { Timestamp } from "firebase/firestore";
import {
  trashBinOutline,
  ellipsisVertical,
  createOutline,
  checkmarkOutline,
} from "ionicons/icons";
import "./Tab3.css";
import { GoogleMap } from "@capacitor/google-maps";

const Collection: React.FC = () => {
  const [observations, setObservations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObservations, setSelectedObservations] = useState<any[]>([]);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;
  const [editing, setEditing] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<IObservationUpdate | null>(
    null
  );
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionSheetObservationId, setActionSheetObservationId] =
    useState(null);
    const mapRefs = useRef(new Map());
    

  useEffect(() => {
    const fetchObservations = async () => {
      const userUID = await getCurrentUserUID();
      if (userUID) {
        const userObservations = await fetchUserObservations(userUID);
        console.log("Fetched Observations:", userObservations);
        setObservations(userObservations);
      }
    };
    fetchObservations();
  }, []);

  useEffect(() => {
    const fetchObservations = async () => {
      const userUID = await getCurrentUserUID();
      if (userUID) {
        let userObservations;
        if (searchTerm) {
          userObservations = await fetchUserObservationsBySpecies(
            userUID,
            searchTerm
          ).catch((error) =>
            console.error("Error fetching by species:", error)
          );
        } else {
          userObservations = await fetchUserObservations(userUID).catch(
            (error) => console.error("Error fetching user observations:", error)
          );
        }
        setObservations(userObservations);
      }
    };
    fetchObservations();
  }, [searchTerm]);

  useEffect(() => {
    // Initialize the maps after the observations are fetched
    if (observations.length > 0) {
      observations.forEach(async (observation, index) => {
        const mapElement = mapRefs.current.get(index);
        console.log("Map Element:", mapElement);
        if (mapElement && observation.latitude && observation.longitude) {
          console.log("Observation has Lat and Lng:", observation);
          const observationsMap = await GoogleMap.create({
            id: `map-${index}`,
            element: mapElement,
            forceCreate: true,
            apiKey: apiKey,
            config: {
              center: {
                lat: observation.latitude,
                lng: observation.longitude,
              },
              zoom: 8,
            },
          });
          console.log("Observations Map: ", observationsMap);
          // Add marker at the bug's location
          observationsMap.addMarker({
            coordinate: {
              lat: observation.latitude,
              lng: observation.longitude,
            },
          })
          }
        })
    }
  }, [observations]);

  const handleCheckboxChange = (observation) => {
    // New function to handle checkbox changes
    if (selectedObservations.includes(observation.id)) {
      setSelectedObservations(
        selectedObservations.filter((id) => id !== observation.id)
      );
    } else {
      setSelectedObservations([...selectedObservations, observation.id]);
    }
  };

  const handleSaveClick = async (id: string) => {
    if (editingValues) {
      await updateObservation(id, editingValues);
      const userUID = await getCurrentUserUID();
      if (userUID) {
        const userObservations = await fetchUserObservations(userUID);
        setObservations(userObservations);
      }
      // stop editing
      setEditing(null);
      setEditingValues(null);
    }
  };

  const handleDeleteClick = () => {
    if (selectedObservations.length > 0) {
      presentAlert({
        header: "Confirm!",
        message: "Are you sure you want to delete selected observations?",
        buttons: [
          { text: "Cancel", role: "cancel" },
          {
            text: "Delete",
            handler: async () => {
              await deleteObservations(selectedObservations);
              setSelectedObservations([]);

              const userUID = await getCurrentUserUID();
              if (userUID) {
                const userObservations = await fetchUserObservations(userUID);
                setObservations(userObservations);
              }

              presentToast({
                message: "Selected observations deleted",
                duration: 2000,
                color: "danger",
              });
            },
          },
        ],
      });
    }
  };

  const doRefresh = async (event) => {
    const userUID = await getCurrentUserUID();
    let newObservations;
    
    if (userUID) {
      if (searchTerm) {
        newObservations = await fetchUserObservationsBySpecies(userUID, searchTerm);
      } else {
        newObservations = await fetchUserObservations(userUID);
      }
  
      setObservations(newObservations);
    }
  
    event.detail.complete();
  };
  

  console.log(observations);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            {searchTerm
              ? `Observations of ${searchTerm}`
              : "Most Recent Observations"}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleDeleteClick}>
              <IonIcon
                slot="icon-only"
                icon={trashBinOutline}
                color={"danger"}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchTerm}
          placeholder="Search By Species"
          onIonChange={(e) => setSearchTerm(e.detail.value)}
          debounce={500}
        />
        <IonRefresher slot="fixed" onIonRefresh={(ev) => doRefresh(ev)}>
          <IonRefresherContent />
        </IonRefresher>
        <div className="cardContainer">
          {observations.map((observation, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardSubtitle>
                  {editing === observation.id ? (
                    <input
                      type="datetime-local"
                      value={editingValues?.timestamp
                        ?.toDate()
                        .toISOString()
                        .slice(0, -1)}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        date.setMinutes(
                          date.getMinutes() + date.getTimezoneOffset() - 60
                        );
                        setEditingValues({
                          ...editingValues,
                          timestamp: Timestamp.fromDate(date),
                        });
                      }}
                    />
                  ) : observation.timestamp ? (
                    `${observation.timestamp
                      .toDate()
                      .toLocaleString()
                      .slice(0, -3)} (UTC+1)`
                  ) : (
                    "DateTime not available"
                  )}
                </IonCardSubtitle>

                <IonCardTitle>
                  {editing === observation.id ? (
                    <div className="input-container">
                    <input
                      type="text"
                      value={editingValues?.species}
                      onChange={(e) =>
                        setEditingValues({
                          ...editingValues,
                          species: e.target.value,
                        })
                      }
                    />
                    </div>
                  ) : (
                    observation.species || "Species not available"
                  )}
                </IonCardTitle>
                {editing === observation.id ? (
                <IonButton
                  className="square-button"
                  onClick={() => handleSaveClick(observation.id)}
                >
                  <IonIcon slot="icon-only" icon={checkmarkOutline} />
                </IonButton>
              ) : (
                <IonButton
                  className="square-button"
                  onClick={() => {
                    setShowActionSheet(true);
                    setActionSheetObservationId(observation.id);
                  }}
                >
                  <IonIcon slot="icon-only" icon={ellipsisVertical} />
                </IonButton>
              )}
              </IonCardHeader>
              <IonCardContent>
                <IonImg
                  className="observationImage"
                  src={observation.img || "Image URL not available"}
                />
                {observation.latitude && observation.longitude && (
                          <div
                            id={`map-${index}`}
                            style={{ width: "95%", height: "200px" }}
                            ref={(el) => mapRefs.current.set(index, el)}
                          ></div>
                        )}
                <p>
                  Lat: {observation.latitude || "Latitude not available"}, Long:{" "}
                  {observation.longitude || "Longitude not available"}
                </p>
              </IonCardContent>
              
              <IonCheckbox
                  className="checkbox"
                  value={observation.id}
                  onIonChange={() => handleCheckboxChange(observation)}
                />
              <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                buttons={[
                  {
                    text: "Edit",
                    icon: createOutline,
                    handler: () => {
                      setEditing(actionSheetObservationId);
                      const observation = observations.find(
                        (obs) => obs.id === actionSheetObservationId
                      );
                      if (observation) {
                        setEditingValues({
                          species: observation.species,
                          timestamp: observation.timestamp,
                        });
                      }
                    },
                  },
                  {
                    text: "Cancel",
                    role: "cancel",
                  },
                ]}
              />
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Collection;
