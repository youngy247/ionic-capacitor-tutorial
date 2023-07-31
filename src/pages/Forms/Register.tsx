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
  useIonToast,
  useIonRouter,
  useIonLoading,
} from "@ionic/react";
import { checkmarkDoneOutline, eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import AuthSocialButton from "../AuthSocialButtons/AuthSocialButton";
import "./Form.css";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { BsGoogle } from "react-icons/bs";
import { registerUser, registerWithGoogle } from "../../firebaseConfig";
import { validate as validateEmail } from "email-validator";

const Register: React.FC = () => {
  const router = useIonRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showToast, dismissToast] = useIonToast();
  const [present, dismiss] = useIonLoading();
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already registered. Please use another email or sign in.";
      // add more cases as needed
      default:
        return "An unknown error occurred. Please try again.";
    }
  };

  const getFriendlyErrorMessageForGoogle = (errorCode) => {
    switch (errorCode) {
      case "popup_closed_by_user":
      case "-5":
        return "It seems like you've closed the sign-in window. Please try again.";
      case "access_denied":
        return "Access was denied. Please make sure you've granted the necessary permissions.";
      case "operation_not_supported_in_this_environment":
        return "This operation isn't supported in your current environment.";
      case "invalid_credential":
        return "The provided credentials are invalid. Please try again.";
      default:
        return "Oops! An unknown error occurred. Please try registering again.";
    }
  };

  const doRegister = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      await dismissToast();
      return showToast({
        message: "Please enter a valid email",
        duration: 3000,
        color: "danger",
      });
    }

    if (password !== confirmPassword) {
      await dismissToast();
      return showToast({
        message: "Passwords do not match",
        duration: 3000,
        color: "danger",
      });
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      await dismissToast();
      return showToast({
        message:
          "Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number.",
        duration: 5000,
        color: "danger",
      });
    }

    if (email.trim() === "" || password.trim() === "") {
      await dismissToast();
      return showToast({
        message: "Email and password are required",
        duration: 3000,
        color: "danger",
      });
    }

    await present("Registering...");

    try {
      await registerUser(email, password);
      await dismiss();
      if (router.canGoBack()) {
        router.goBack();
      } else {
        router.push('/');
      }
      await dismissToast();
      showToast({
        message: `A verification email has been sent to ${email}. Please check your inbox and follow the instructions to complete your registration.`,
        duration: 8000,
        color: "success",
      });
    } catch (error) {
      await dismiss();
      const friendlyErrorMessage = getFriendlyErrorMessage(error.code);
      await dismissToast();
      showToast({
        message: friendlyErrorMessage,
        duration: 3000,
        color: "danger",
      });
    }
  };

  const socialAction = async (action: string) => {
    await present("Registering...");
    try {
      if (action === "google") {
        const result = await GoogleAuth.signIn();
        const idToken = result.authentication.idToken;
        if (!idToken) {
          console.error("Google Auth failed");
          return;
        }
        const user = await registerWithGoogle(idToken);
        if (user) {
          await dismissToast();
          showToast({
            message: `Welcome, ${result.name}`,
            duration: 2000,
            color: "success",
          });
        }
        await dismiss();
        router.push("/app", "root");
      }
    } catch (error) {
      await dismiss();
      // Checking for errorCode in both error.error and error.code
      const errorCode = error.error || error.code;
      const friendlyErrorMessageForGoogle =
        getFriendlyErrorMessageForGoogle(errorCode);
      await dismissToast();
      showToast({
        message: friendlyErrorMessageForGoogle,
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
                    <div className="password-container">
                      <IonInput
                        clearOnEdit={false}
                        required
                        mode="md"
                        className="ion-margin-top"
                        labelPlacement="floating"
                        label="Password"
                        fill="outline"
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        onKeyUp={(e) => {
                          const val = (e.target as HTMLInputElement).value;
                          setPassword((prev) => (prev === val ? prev : val));
                          setHasMinLength(val.length >= 8);
                          setHasUppercase(/[A-Z]/.test(val));
                          setHasLowercase(/[a-z]/.test(val));
                          setHasNumber(/[0-9]/.test(val));
                        }}
                      />
                      <a
                        onClick={() => setShowPassword(!showPassword)}
                        className="input-icon"
                      >
                        <IonIcon icon={showPassword ? eyeOff : eye} />
                      </a>
                    </div>

                    <div className="password-requirements">
                      <p style={{ color: hasMinLength ? "green" : "red" }}>
                        Password must be at least 8 characters
                      </p>
                      <p style={{ color: hasUppercase ? "green" : "red" }}>
                        Password must contain at least one uppercase letter
                      </p>
                      <p style={{ color: hasLowercase ? "green" : "red" }}>
                        Password must contain at least one lowercase letter
                      </p>
                      <p style={{ color: hasNumber ? "green" : "red" }}>
                        Password must contain at least one number
                      </p>
                    </div>
                    <div className="password-container">
                    <IonInput
                      clearOnEdit={false}
                      required
                      mode="md"
                      className="ion-margin-top"
                      fill="outline"
                      labelPlacement="floating"
                      label="Confirm Password"
                      type={showPassword ? "text" : "password"} // if showPassword is true, type is "text", else it's "password"
                      placeholder="confirm password"
                      onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                    />
                    <a
                        onClick={() => setShowPassword(!showPassword)}
                        className="input-icon"
                      >
                        <IonIcon icon={showPassword ? eyeOff : eye} />
                      </a>
                    </div>
                  

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
