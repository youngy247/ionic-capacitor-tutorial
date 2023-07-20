import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';


import { ellipse, triangle } from 'ionicons/icons';

import List from './List';
import Insects from './Insects';

const Home: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/home/insects">
          <IonIcon icon={triangle} />
          <IonLabel>Insects</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/app/home/list">
          <IonIcon icon={ellipse} />
          <IonLabel>Rankings</IonLabel>
        </IonTabButton>
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/home/insects" component={Insects} />
        <Route path="/app/home/list" component={List} />

        <Route exact path="/app/home">
          <Redirect to="/app/home/insects" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Home;