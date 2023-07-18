import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Seetings: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        UI goes here...
      </IonContent>
    </IonPage>
  );
};

export default Seetings;