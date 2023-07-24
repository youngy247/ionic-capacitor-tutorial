import { useForm } from "react-hook-form";
import { GoogleMap } from "@capacitor/google-maps";
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
import { useEffect, useRef } from "react";
import {
  getCurrentUserUID,
  savePictureToStorage,
  saveObservation,
} from "../firebaseConfig";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
// import { v4 as uuidv4 } from 'uuid';

const UploadObservation: React.FC = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [image, setImage] = useState(null);
  const [showToast] = useIonToast();
  const router = useIonRouter();
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;
  const mapRef = useRef<HTMLElement>();
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [markerCoords, setMarkerCoords] = useState<{ lat: number, lng: number } | null>(null);


  const handleMapClick = async (event) => {
    const lat = event.latitude;
    const lng = event.longitude;

    setValue("latitude", lat);
    setValue("longitude", lng);

    setMarkerCoords({ lat, lng });

    map?.setOnMarkerClickListener(() => {
      setValue("latitude", lat);
      setValue("longitude", lng);
    });
  };

  useEffect(() => {
    if (markerCoords && map) { 
      // map.removeMarker(id).catch(error => console.error("Failed to remove marker", error));
      map.addMarker({
        coordinate: { lat: markerCoords.lat, lng: markerCoords.lng },
        // title: "My Location",
      }).catch(error => console.error("Failed to add marker", error));
    }
  }, [markerCoords, map]);
  
  async function createMap() {
    if (!mapRef.current) {
      console.log("mapRef.current is null"); 
      return;
    }

    let latitude, longitude;

    try {
      const position = await Geolocation.getCurrentPosition();
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (error) {
      latitude = 55.3781; // Default latitude for UK
      longitude = -3.436; // Default longitude for UK
      console.log("Could not fetch location, defaulting to UK", error);
    }

    try {
      const newMap = await GoogleMap.create({
        id: "my-cool-map",
        element: mapRef.current,
        apiKey: apiKey,
        config: {
          center: {
            lat: latitude,
            lng: longitude,
          },
          zoom: 8,
        },
      });

      newMap.setOnMapClickListener(handleMapClick);
      setMap(newMap); // store map reference in state

      // Enable the location after creating the map
      newMap.enableCurrentLocation(true);
    } catch (error) {
      console.log("Failed to create map", error); // Add this log
    }
  }

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
            <IonLabel>Date/Time (UTC+1)</IonLabel>
            <IonDatetime
              onIonChange={(e) => {
                // Convert the ISO 8601 string into a Date object
                if (typeof e.detail.value === "string") {
                  const date = new Date(e.detail.value);
                  setValue("timestamp", date);
                }
              }}
            ></IonDatetime>
          </IonItem>
          <capacitor-google-map
            ref={mapRef}
            style={{
              display: "inline-block",
              width: 275,
              height: 400,
            }}
          ></capacitor-google-map>
          <IonButton onClick={createMap}>Pinpoint the location</IonButton>

          <IonItem>
            <IonLabel>Latitude</IonLabel>
            <IonInput
              {...register("latitude")}
              placeholder="Latitude"
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel>Longitude</IonLabel>
            <IonInput
              {...register("longitude")}
              placeholder="Longitude"
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

export default UploadObservation;
