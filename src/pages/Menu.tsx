import { IonContent, IonHeader, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import List from './List';
import Settings from './Settings';
import { Redirect, Route } from 'react-router';
import { homeOutline, newspaperOutline } from 'ionicons/icons';

const Menu: React.FC = () => {
  const paths = [
    { name: 'Home', url: '/app/list', icon: homeOutline },
    { name: 'Settings', url: '/app/settings', icon: newspaperOutline },
  ]
  return (
    <IonPage>
      <IonSplitPane contentId="main">
      <IonMenu contentId="main">
        <IonHeader>
          <IonToolbar color={'secondary'}>
            <IonTitle>Page Title</IonTitle>
          </IonToolbar>
        </IonHeader>
          <IonContent>
            {paths.map((item, index) => (
              <IonMenuToggle key={index} autoHide={false}>
              <IonItem routerLink={item.url} routerDirection="none">
                {item.name}
              </IonItem>
              </IonMenuToggle>
            ))}
          </IonContent>
      </IonMenu>

      <IonRouterOutlet id="main">
        <Route exact path="/app/list" component={List} />
        <Route path="/app/settings" component={Settings} />
        <Route exact path="/app">
          <Redirect to="/app/list" />
        </Route>
      </IonRouterOutlet>
    </IonSplitPane>
    </IonPage>
  );
};

export default Menu;