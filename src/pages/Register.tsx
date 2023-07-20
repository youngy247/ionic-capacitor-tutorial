import {
  IonBackButton,
  IonButton,
  IonButtons,
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
  useIonRouter,
} from "@ionic/react";
import { checkmarkDoneOutline } from "ionicons/icons";
import React, { useState } from "react";
import AuthSocialButton from "./AuthSocialButton";
import "./Form.css";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { BsGoogle } from "react-icons/bs";

const Register: React.FC = () => {
  const router = useIonRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const doRegister = (event: any) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    console.log("doRegister");
    router.goBack();
  };

  const socialAction = async (action: string) => {
    try {
      if (action === "google") {
        const user = await GoogleAuth.signIn();
        console.log("user: ", user);

        router.push("/app", "root");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"primary"}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <IonGrid fixed>
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
                <IonCardContent>
                  <form onSubmit={doRegister}>
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
                    <IonInput
                      required
                      mode="md"
                      className="ion-margin-top"
                      fill="outline"
                      labelPlacement="floating"
                      label="Confirm Password"
                      type="password"
                      placeholder="confirm password"
                      onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    />
                    <IonButton
                      type="submit"
                      expand="block"
                      className="ion-margin-top"
                    >
                      Create my account
                      <IonIcon icon={checkmarkDoneOutline} slot="end" />
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
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
