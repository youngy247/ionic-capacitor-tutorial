import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';
import Tab1 from './Tab1';
import Tab2 from './Tab2';
import { cloudUploadOutline, eyeOutline } from 'ionicons/icons';
import Tab3 from './Tab3';

const Settings: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/settings/tab1">
          <IonIcon icon={cloudUploadOutline} />
          <IonLabel>Upload</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="tab2" href="/app/settings/tab2">
          <IonIcon icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton> */}
        <IonTabButton tab="tab3" href="/app/settings/tab3">
          <IonIcon icon={eyeOutline} />
          <IonLabel>My Observations</IonLabel>
        </IonTabButton>
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/settings/tab1" component={Tab1} />
        <Route path="/app/settings/tab2" component={Tab2} />
        <Route path="/app/settings/tab3" component={Tab3} />

        <Route exact path="/app/settings">
          <Redirect to="/app/settings/tab1" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Settings;