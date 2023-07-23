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
} from "@ionic/react";
import { savePictureToStorage, saveObservation } from "../firebaseConfig";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useState } from "react";

const Tab1: React.FC = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [image, setImage] = useState(null);

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

    saveObservation(data);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Image Example</IonTitle>
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
            Take Picture
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
