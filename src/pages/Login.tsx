import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonLoading,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { logInOutline, personCircleOutline } from "ionicons/icons";
import InsectInspectLogo from "../assets/InsectInspectLogo.png";
import Intro from "../components/Intro";
import { Preferences } from "@capacitor/preferences";
import AuthSocialButton from "./AuthSocialButton";
import { BsGoogle } from "react-icons/bs";
import "./Form.css";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { loginUser, loginWithGoogle } from "../firebaseConfig";

const INTRO_KEY = "intro-seen";

const Login: React.FC = () => {
  const router = useIonRouter();
  const [introSeen, setIntroSeen] = useState<boolean | null>(null);
  const [present, dismiss] = useIonLoading();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast] = useIonToast();

  if (!isPlatform("capacitor")) {
    GoogleAuth.initialize();
  }

  useEffect(() => {
    const checkStorage = async () => {
      const seen = await Preferences.get({ key: INTRO_KEY });
      console.log("🚀 ~ file: Login.tsx:29 ~ checkStorage ~ seen:", seen);
      setIntroSeen(seen.value === "true");
    };
    checkStorage();
  }, []);

  const doLogin = async (event: any) => {
    event.preventDefault();
    await present("Logging in...");
    try {
      const res = await loginUser(email, password);
      console.log(`${res ? "Login successful" : "Login failed"}`);
      Preferences.set({ key: "login-method", value: "form" });
      await dismiss();
      router.push("/app", "root");
      showToast({
        message: "Login successful",
        duration: 2000,
        color: "success",
      });
      // Other successful login code...
    } catch (error) {
      console.error("Login failed:", error);
      await dismiss();
      showToast({
        message: "Invalid credentials or user does not exist",
        duration: 3000,
        color: "danger",
      });
    }
  };

  const finishIntro = async () => {
    setIntroSeen(true);
    Preferences.set({ key: INTRO_KEY, value: "true" });
  };

  const seeIntroAgain = () => {
    setIntroSeen(false);
    Preferences.remove({ key: INTRO_KEY });
  };

  const socialAction = async (action: string) => {
    await present("Logging in...");

    try {
      if (action === "google") {
        const result = await GoogleAuth.signIn();
        const idToken = result.authentication.idToken;
        console.log("Google user: ", result);
        if (result && idToken) {
          const user = await loginWithGoogle(idToken);
          console.log("Firebase user: ", user);
          Preferences.set({ key: "login-method", value: "google" });

          // Check if user exists, if yes then show "welcome back" toast
          if (user) {
            showToast({
              message: `Welcome back, ${result.name}`,
              duration: 2000,
              color: "success",
            });
          }
        }
      }

      await dismiss();
      router.push("/app", "root");
    } catch (error) {
      console.error("Login failed:", error);
      await dismiss();
    }
  };

  return (
    <>
      {introSeen === false ? (
        <Intro onFinish={finishIntro} />
      ) : (
        introSeen === true && (
          <IonPage>
            <IonHeader>
              <IonToolbar color={"primary"}>
                <IonTitle>InsectInsight</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent scrollY={false} className="ion-padding">
              <IonGrid fixed>
                <IonRow className="ion-justify-content-center">
                  <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                    <div className="ion-text-center ion-padding">
                      <img
                        src={InsectInspectLogo}
                        alt="InsectInspect Logo"
                        width={"50%"}
                      />
                    </div>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-justify-content-center">
                  <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                    <IonCard>
                      <IonCardContent>
                        <form onSubmit={doLogin} id="open-toast">
                          <IonInput
                            required
                            mode="md"
                            fill="outline"
                            labelPlacement="floating"
                            label="Email"
                            type="email"
                            placeholder="email@gmail.com"
                            onIonChange={(e) => setEmail(e.detail.value!)}
                          />
                          <IonInput
                            required
                            mode="md"
                            className="ion-margin-top"
                            fill="outline"
                            labelPlacement="floating"
                            label="Password"
                            type="password"
                            placeholder="password"
                            onIonChange={(e) => setPassword(e.detail.value!)}
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
                          <div className="line-divider">
                            <div className="line"></div>
                            <span>Or continue with</span>
                            <div className="line"></div>
                          </div>
                          <IonRow className="ion-margin-top">
                            <IonCol size="12" className="ion-text-center">
                              <AuthSocialButton
                                icon={BsGoogle}
                                onClick={() => socialAction("google")}
                              />
                            </IonCol>
                          </IonRow>

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
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </IonPage>
        )
      )}
    </>
  );
};

export default Login;
