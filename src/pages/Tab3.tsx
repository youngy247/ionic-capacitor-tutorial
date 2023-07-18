import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Tab3: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
      <IonToolbar color={'success'}>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        UI goes here...
      </IonContent>
    </IonPage>
  );
};

export default Tab3;