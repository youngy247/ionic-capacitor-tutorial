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
import React from "react";
import AuthSocialButton from "./AuthSocialButton";
import "./Form.css";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { BsGoogle } from "react-icons/bs";

const Register: React.FC = () => {
  const router = useIonRouter();
  const doRegister = (event: any) => {
    event.preventDefault();
    console.log("doRegister");
    router.goBack();
  };

  const socialAction = async (action: string) => {
    try {
      if (action === "google") {
        const user = await GoogleAuth.signIn();
        console.log('user: ', user);
        
        // Here you handle registration logic with user data
        // e.g., user.email, user.displayName
        // If registration is successful, redirect user to desired route

        router.push("/app", "root"); // or wherever you want to redirect the user after successful registration
      }
    } catch (error) {
      console.error('Registration failed:', error);
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
