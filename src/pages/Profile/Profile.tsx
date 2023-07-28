import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, } from '@ionic/react';
import React from 'react';
import { Redirect, Route } from 'react-router';
import { cloudUploadOutline, eyeOutline } from 'ionicons/icons';
import UploadObservation from './UploadObservation';
import Collection from './Collection';

const Profile: React.FC = () => {

  return (
    <IonTabs>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/app/profile/uploadobservation">
          <IonIcon icon={cloudUploadOutline} />
          <IonLabel>Upload</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/app/profile/collection">
          <IonIcon icon={eyeOutline} />
          <IonLabel>My Observations</IonLabel>
        </IonTabButton>
      </IonTabBar>

     <IonRouterOutlet>
        <Route path="/app/profile/uploadobservation" component={UploadObservation} />
        <Route path="/app/profile/collection" component={Collection} />

        <Route exact path="/app/profile">
          <Redirect to="/app/profile/uploadobservation" />
        </Route>
     </IonRouterOutlet>

    </IonTabs>
  );
};

export default Profile;