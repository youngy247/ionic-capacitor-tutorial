import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonMenuButton, IonPage, IonSearchbar, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
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
    return users.results;
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

        <IonToolbar color={'success'}>
          <IonSearchbar />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {users.map((user, index) => (
          <IonCard key={index}>

            <IonCardContent className="ion-no-padding">
              <IonItem lines="none">
                <IonAvatar slot="start">
                  <IonImg src={user.picture.large} />
                </IonAvatar>
                <IonLabel>
                  {user.name.first} {user.name.last}
                  <p>{user.email}</p>
                </IonLabel>
              </IonItem>
            </IonCardContent>

          </IonCard>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default List;