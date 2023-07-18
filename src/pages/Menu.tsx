import { IonContent, IonHeader, IonMenu, IonPage, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import List from './List';
import Settings from './Settings';
import { Redirect, Route } from 'react-router';

const Menu: React.FC = () => {

  return (
    <IonPage>
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Page Title</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonContent className="ion-padding">menu items</IonContent>
      </IonMenu>

      <IonRouterOutlet id="main">
        <Route exact path="/app/list" component={List} />
        <Route path="/app/settings" component={Settings} />
        <Route exact path="/app">
          <Redirect to="/app/list" />
        </Route>
      </IonRouterOutlet>

    </IonPage>
  );
};

export default Menu;