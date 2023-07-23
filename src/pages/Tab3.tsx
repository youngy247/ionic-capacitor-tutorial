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
  IonSearchbar,
} from "@ionic/react";
import {
  fetchUserObservations,
  fetchUserObservationsBySpecies,
  getCurrentUserUID,
} from "../firebaseConfig";

const Tab3: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [observations, setObservations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      if (searchTerm) {
        const userUID = await getCurrentUserUID();
        if (userUID) {
          const userObservations = await fetchUserObservationsBySpecies(
            userUID,
            searchTerm
          );
          setObservations(userObservations);
        }
      }
    };
    if (searchTerm) fetchObservations();
  }, [searchTerm]);

  console.log(observations);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchTerm}
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
            </IonCardHeader>

            <IonCardContent>
              <IonImg src={observation.img || "Image URL not available"} />
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
