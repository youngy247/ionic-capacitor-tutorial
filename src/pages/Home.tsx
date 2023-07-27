import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';


import { search } from 'ionicons/icons';

// import List from './List';
import GlobalObservations from './GlobalObservations';

const Home: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/home/globalobservations">
          <IonIcon icon={search} />
          <IonLabel>Global Observations</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="tab2" href="/app/home/list">
          <IonIcon icon={ellipse} />
          <IonLabel>Rankings</IonLabel>
        </IonTabButton> */}
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/home/globalobservations" component={GlobalObservations} />
        {/* <Route path="/app/home/list" component={List} /> */}

        <Route exact path="/app/home">
          <Redirect to="/app/home/globalobservations" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Home;