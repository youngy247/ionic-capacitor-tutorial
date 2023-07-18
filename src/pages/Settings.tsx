import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';
import Tab1 from './Tab1';
import Tab2 from './Tab2';

const Seetings: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar>
        <IonTabButton tab="tab1" href="/app/settins/tab1"></IonTabButton>
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/settings/tab1" component={Tab1} />
        <Route path="/app/settings/tab2" component={Tab2} />

        <Route exact path="/app/settings">
          <Redirect to="/app/settings/tab1" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Seetings;