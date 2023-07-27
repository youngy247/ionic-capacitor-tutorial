import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';
import { search } from 'ionicons/icons';
import GlobalObservations from './GlobalObservations';

const Home: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/home/globalobservations">
          <IonIcon icon={search} />
          <IonLabel>Global Observations</IonLabel>
        </IonTabButton>
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/home/globalobservations" component={GlobalObservations} />
        <Route exact path="/app/home">
          <Redirect to="/app/home/globalobservations" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Home;