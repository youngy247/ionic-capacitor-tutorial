import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonMenuButton, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonTitle, IonToolbar, useIonAlert, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { trashBinOutline } from 'ionicons/icons';
import React, { useState } from 'react';

const List: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true); 
  const [users, setUsers] = useState<any[]>([]);
  const [showAlert] = useIonAlert() 
  const [showToast] = useIonToast()

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
      showAlert({
        header: 'Confirm!',
        message: 'Are you sure you want to delete all users?',
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', 
            handler: () => {
              setUsers([])  
              showToast({
                message: 'All users deleted',
                duration: 2000,
                color: 'danger'
              })
            }
          }
        ]
      })
  }

  const doRefresh = async (event: any) => {
    const data = await getUsers();
    setUsers(data)
    event.detail.complete()
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

        <IonRefresher slot="fixed" onIonRefresh={(ev) => doRefresh(ev)}>
          <IonRefresherContent />
        </IonRefresher>

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
                <IonChip slot="end" color={'primary'}>
                  {user.nat}
                </IonChip>
              </IonItem>
            </IonCardContent>

          </IonCard>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default List;