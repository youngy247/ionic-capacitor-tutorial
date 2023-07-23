/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
import { trashBinOutline } from "ionicons/icons";
import "./Tab3.css";

const Tab3: React.FC = () => {
  const [observations, setObservations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObservations, setSelectedObservations] = useState<any[]>([]);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const [editing, setEditing] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<IObservationUpdate | null>(
    null
  );

  useEffect(() => {
    const fetchObservations = async () => {
      const userUID = await getCurrentUserUID();
      if (userUID) {
        const userObservations = await fetchUserObservations(userUID);
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
              ? `Your Observations of ${searchTerm}`
              : "Your Most Recent Observations"}
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
                          date.getMinutes() - date.getTimezoneOffset()
                        );
                        setEditingValues({
                          ...editingValues,
                          timestamp: Timestamp.fromDate(date),
                        });
                      }}
                    />
                  ) : observation.timestamp ? (
                    observation.timestamp.toDate().toLocaleString()
                  ) : (
                    "DateTime not available"
                  )}
                </IonCardSubtitle>

                <IonCardTitle>
                  {editing === observation.id ? (
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
                  ) : (
                    observation.species || "Species not available"
                  )}
                </IonCardTitle>
                <IonCheckbox
                  className="checkbox"
                  value={observation.id}
                  onIonChange={() => handleCheckboxChange(observation)}
                />
                {editing === observation.id ? (
                  <IonButton onClick={() => handleSaveClick(observation.id)}>
                    Save
                  </IonButton>
                ) : (
                  <IonButton
                    onClick={() => {
                      setEditing(observation.id);
                      setEditingValues({
                        species: observation.species,
                        timestamp: observation.timestamp,
                      });
                    }}
                  >
                    Edit
                  </IonButton>
                )}
              </IonCardHeader>
              <IonCardContent>
                <IonImg
                  className="observationImage"
                  src={observation.img || "Image URL not available"}
                />
                <p>
                  Lat: {observation.latitude || "Latitude not available"}, Long:{" "}
                  {observation.longitude || "Longitude not available"}
                </p>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
