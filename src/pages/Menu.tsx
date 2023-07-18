import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonMenu, IonMenuToggle, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import List from './List';
import Settings from './Settings';
import { Redirect, Route } from 'react-router';
import { homeOutline, logOutOutline, newspaperOutline, settingsOutline } from 'ionicons/icons';
import News from './News';

const Menu: React.FC = () => {
  const paths = [
    { name: 'Home', url: '/app/list', icon: homeOutline },
    { name: 'News', url: '/app/news', icon: newspaperOutline},
    { name: 'Settings', url: '/app/settings', icon: settingsOutline },
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
              <IonItem detail={false} routerLink={item.url} routerDirection="none">
                <IonIcon slot="start" icon={item.icon} />
                {item.name}
              </IonItem>
              </IonMenuToggle>
            ))}
            <IonMenuToggle autoHide={false}>
              <IonButton expand="full" routerLink='/' routerDirection="root">
                <IonIcon slot="start" icon={logOutOutline} />
                Logout
              </IonButton>
              </IonMenuToggle>
          </IonContent>
      </IonMenu>

      <IonRouterOutlet id="main">
        <Route exact path="/app/list" component={List} />
        <Route exact path="/app/news" component={News} />
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