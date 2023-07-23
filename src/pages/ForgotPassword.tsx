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
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { sendPasswordReset } from "../firebaseConfig";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showToast] = useIonToast();

  const errorMessages: { [key: string]: string } = {
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-not-found': 'There is no user associated with this email.',
  };
  

  const sendResetEmail = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordReset(email);
      showToast({
        message:
          "If there's an account associated with this email, a password reset link has been sent",
        duration: 2000,
        color: "success",
      });
    } catch (error) {
      const userFriendlyMessage = errorMessages[error.code] || 'An error occurred while sending the reset email.';
      showToast({
        message: userFriendlyMessage,
        duration: 3000,
        color: "danger",
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"primary"}>
        <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Reset Password</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <IonGrid fixed>
          <IonRow class="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
                <IonCardContent>
                  <form onSubmit={sendResetEmail}>
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
                    <IonButton
                      type="submit"
                      expand="block"
                      className="ion-margin-top"
                    >
                      Send reset link
                    </IonButton>
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

export default ForgotPassword;
