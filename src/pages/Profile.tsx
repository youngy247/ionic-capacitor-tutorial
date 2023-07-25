import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';
import Tab2 from './Tab2';
import { cloudUploadOutline, eyeOutline } from 'ionicons/icons';
import UploadObservation from './Tab1';
import Collection from './Tab3';

const Profile: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/profile/uploadobservation">
          <IonIcon icon={cloudUploadOutline} />
          <IonLabel>Upload</IonLabel>
        </IonTabButton>
        {/* <IonTabButton tab="tab2" href="/app/settings/tab2">
          <IonIcon icon={ellipse} />
          <IonLabel>Tab 2</IonLabel>
        </IonTabButton> */}
        <IonTabButton tab="tab3" href="/app/profile/collection">
          <IonIcon icon={eyeOutline} />
          <IonLabel>My Observations</IonLabel>
        </IonTabButton>
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/profile/uploadobservation" component={UploadObservation} />
        <Route path="/app/profile/tab2" component={Tab2} />
        <Route path="/app/profile/collection" component={Collection} />

        <Route exact path="/app/profile">
          <Redirect to="/app/profile/uploadobservation" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Profile;