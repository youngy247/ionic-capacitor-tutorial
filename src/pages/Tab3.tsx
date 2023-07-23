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
} from "../firebaseConfig";
import { trashBinOutline } from "ionicons/icons";
import './Tab3.css'

const Tab3: React.FC = () => {
  const [observations, setObservations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObservations, setSelectedObservations] = useState<any[]>([]);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

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
        {observations.map((observation, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardSubtitle>
                {observation.timestamp
                  ? observation.timestamp.toDate().toLocaleString()
                  : "DateTime not available"}
              </IonCardSubtitle>

              <IonCardTitle>
                {observation.species || "Species not available"}
              </IonCardTitle>
              <IonCheckbox
                className="checkbox"
                value={observation.id}
                onIonChange={() => handleCheckboxChange(observation)}
              />
            </IonCardHeader>

            <IonCardContent>
              

              <IonImg className="observationImage" src={observation.img || "Image URL not available"} />
              <p>
                Lat: {observation.latitude || "Latitude not available"}, Long:{" "}
                {observation.longitude || "Longitude not available"}
              </p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
