import { useForm } from "react-hook-form";
import {
  IonInput,
  IonLabel,
  IonItem,
  IonDatetime,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import {
  getCurrentUserUID,
  savePictureToStorage,
  saveObservation,
} from "../firebaseConfig";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useState } from "react";

const Tab1: React.FC = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [image, setImage] = useState(null);
  const [showToast] = useIonToast();
  const router = useIonRouter();

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });

    const img = `data:image/jpeg;base64,${image.base64String}`;
    setImage(img);
    setValue("img", img); // Set value of img in form
  };

  const onSubmit = async (data) => {
    if (data.img) {
      const imageURL = await savePictureToStorage(data.img);
      data.img = imageURL;
    }

    const userUID = getCurrentUserUID();
    if (userUID) {
      data.userUID = userUID;
    } else {
      showToast({
        message: "You're not logged in. Please log in to continue.",
        duration: 3000,
        color: "danger",
      });
      router.push("/", "root"); 
      return;
    }

    saveObservation(data);

    // Reset form and image
    reset();
    setImage(null);

    showToast({
      message: "Successfully saved observation",
      duration: 3000,
      color: "success",
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Upload Observation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem>
            <IonLabel>Species</IonLabel>
            <IonInput {...register("species")} required></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Date/Time</IonLabel>
            <IonDatetime
              onIonChange={(e) => setValue("dateTime", e.detail.value)}
            ></IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel>Latitude</IonLabel>
            <IonInput
              type="number"
              {...register("latitude")}
              required
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Longitude</IonLabel>
            <IonInput
              type="number"
              {...register("longitude")}
              required
            ></IonInput>
          </IonItem>

          <IonButton expand="full" onClick={takePicture}>
            Upload Picture
          </IonButton>
          {image && <img src={image} alt="image" />}

          <IonButton type="submit" expand="full">
            Submit
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
