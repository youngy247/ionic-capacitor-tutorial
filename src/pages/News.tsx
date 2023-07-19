import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const News: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
      <IonToolbar color={'success'}>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>News</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        UI goes here...
      </IonContent>
    </IonPage>
  );
};

export default News;