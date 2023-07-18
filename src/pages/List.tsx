import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import React, { useState } from 'react';

const List: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); 
  const [users, setUsers] = useState<any[]>([]);

  useIonViewWillEnter(async () => {
    const users = await getUsers();
    console.log("🚀 ~ file: List.tsx:10 ~ useIonViewWillEnter ~ users:", users)
    setUsers(users)
    setLoading(false);
  });

  const getUsers = async () => {
    const data = await fetch('https://randomuser.me/api/?results=10');
    const users = await data.json();
    return users;
  }

  const clearList = () => {

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'success'}>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>List</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={clearList}>
              <IonIcon slot="icon-only" icon={trashBinOutline} color={'danger'}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        UI goes here...
      </IonContent>
    </IonPage>
  );
};

export default List;