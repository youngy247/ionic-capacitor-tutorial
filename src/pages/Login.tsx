import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { logInOutline, personCircleOutline } from "ionicons/icons";
import fcc from "../assets/fcc.svg";
import Intro from "../components/Intro";
import { Preferences } from "@capacitor/preferences";

const INTRO_KEY = "intro-seen";

const Login: React.FC = () => {
  const router = useIonRouter();
  const [introSeen, setIntroSeen] = useState<boolean | null>(null);

  useEffect(() => { 
    const checkStorage = async () => {
      const seen = await Preferences.get({ key: INTRO_KEY });
      console.log("🚀 ~ file: Login.tsx:29 ~ checkStorage ~ seen:", seen)
      setIntroSeen(seen.value === "true")
    };
    checkStorage();
  }, [])

  const doLogin = (event: any) => {
    event.preventDefault();
    console.log("doLogin");

    router.push('/app', 'root')
  };

  const finishIntro = async() => {
    setIntroSeen(true)
    Preferences.set({ key: INTRO_KEY, value: "true" });
  }

  const seeIntroAgain = () => {
    setIntroSeen(false)
    Preferences.remove({ key: INTRO_KEY });
  }

  return (
    <>
    {introSeen === false ? (
        <Intro onFinish={finishIntro} />
    ) : introSeen === true && (
      <IonPage>
        <IonHeader>
          <IonToolbar color={"primary"}>
            <IonTitle>Free Code Camp</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent scrollY={false}>
          <div className="ion-text-center ion-padding">
            <img src={fcc} alt="fCC logo" width={"50%"} />
          </div>
          <IonCard>
            <IonCardContent>
              <form onSubmit={doLogin}>
                <IonInput
                  fill="outline"
                  labelPlacement="floating"
                  label="Email"
                  type="email"
                  placeholder="email@gmail.com"
                />
                <IonInput
                  className="ion-margin-top"
                  fill="outline"
                  labelPlacement="floating"
                  label="Password"
                  type="password"
                  placeholder="email@gmail.com"
                />
                <IonButton
                  type="submit"
                  expand="block"
                  className="ion-margin-top"
                >
                  Login
                  <IonIcon icon={logInOutline} slot="end" />
                </IonButton>
                <IonButton
                  routerLink="/register"
                  color={"secondary"}
                  type="button"
                  expand="block"
                  className="ion-margin-top"
                >
                  Create account
                  <IonIcon icon={personCircleOutline} slot="end" />
                </IonButton>
                <IonButton
                  onClick={seeIntroAgain}
                  fill="clear"
                  size="small"
                  color={"medium"}
                  type="button"
                  expand="block"
                  className="ion-margin-top"
                >
                  Watch intro again
                  <IonIcon icon={personCircleOutline} slot="end" />
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    )}
    </>
  );
};

export default Login;
