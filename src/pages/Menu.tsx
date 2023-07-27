import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenu,
  IonMenuToggle,
  IonPage,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React from "react";
import Profile from "./Profile";
import { Redirect, Route } from "react-router";
import {
  homeOutline,
  logOutOutline,
  personOutline,
} from "ionicons/icons";

import './Menu.css'
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Preferences } from "@capacitor/preferences";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import Home from "./Home";

const Menu: React.FC = () => {
  const paths = [
    { name: "Home", url: "/app/home", icon: homeOutline },
    { name: "My profile", url: "/app/profile", icon: personOutline },
  ];

  const router = useIonRouter();

  const signOut = async () => {
    const loginMethod = await Preferences.get({ key: "login-method" });

    if (loginMethod.value === "google") {
      try {
        await GoogleAuth.signOut();
      } catch (error) {
        console.error("Error during GoogleAuth.signOut: ", error);
      }
    }
    // Handle other logout methods here
    Preferences.remove({ key: "login-method" });

    // Firebase Auth sign out
    const auth = getAuth();
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out from Firebase: ", error);
    }

    router.push("/"); // navigate to login page after successful logout
  };

  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar color={"secondary"}>
              <IonTitle>Menu</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {paths.map((item, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  detail={true}
                  routerLink={item.url}
                  routerDirection="none"
                >
                  <IonIcon slot="start" icon={item.icon} />
                  {item.name}
                </IonItem>
              </IonMenuToggle>
            ))}
            <IonMenuToggle autoHide={false}>
              <IonButton className="center-button" onClick={signOut}>
                <IonIcon slot="start" icon={logOutOutline} />
                Logout
              </IonButton>
            </IonMenuToggle>
          </IonContent>
        </IonMenu>

        <IonRouterOutlet id="main">
          <Route path="/app/home" component={Home} />
          <Route path="/app/profile" component={Profile} />
          <Route exact path="/app">
            <Redirect to="/app/home" />
          </Route>
        </IonRouterOutlet>
      </IonSplitPane>
    </IonPage>
  );
};

export default Menu;
