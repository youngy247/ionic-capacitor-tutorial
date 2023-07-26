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
import './Tab1.css';
// import { v4 as uuidv4 } from 'uuid';

const UploadObservation: React.FC = () => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [image, setImage] = useState(null);
  const [showToast] = useIonToast();
  const router = useIonRouter();
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;
  const mapRef = useRef<HTMLElement>();
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [markerCoords, setMarkerCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [markerId, setMarkerId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

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

  // Remove Marker useEffect
  useEffect(() => {
    if (markerId && map) {
      map
        .removeMarker(markerId)
        .catch((error) => console.error("Failed to remove marker", error));
      setMarkerId(null);
    }
  }, [markerCoords, map]);

  // Add Marker useEffect
  useEffect(() => {
    if (markerCoords && map && !markerId) {
      map
        .addMarker({
          coordinate: { lat: markerCoords.lat, lng: markerCoords.lng },
        })
        .then((id) => setMarkerId(id))
        .catch((error) => console.error("Failed to add marker", error));
    }
  }, [markerCoords, map, markerId]);

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
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
  
      const img = `data:image/jpeg;base64,${image.base64String}`;
      setImage(img);
      setValue("img", img); // Set value of img in form
    } catch (error) {
      showToast({
        message: "Failed to upload photo. Please try again.",
        duration: 3000,
        color: "danger",
      });
    }
  };

  const onSubmit = async (data) => {
    data.species = data.species.trim();
    if (!data.species) {
      showToast({
        message: "Species is required. Please fill it to continue.",
        duration: 3000,
        color: "danger",
      });
      return;
    }
    if (!data.timestamp) {
      showToast({
        message: "Date/Time is required. Please fill it to continue.",
        duration: 3000,
        color: "danger",
      });
      return;
    }
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
        <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
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
          <IonButton expand="full" onClick={takePicture}>
            Upload Picture
          </IonButton>
          {image && <img className="upload-picture" src={image} alt="image" />}
          <IonButton onClick={() => {
            setShowMap(true)
            createMap()
            }}>
              Pinpoint the location
              </IonButton>
              {!showMap && (<IonButton type="submit" expand="full">
            Submit
          </IonButton>
          )}
          <capacitor-google-map
            ref={mapRef}
            style={{
              display: "inline-block",
              width: "85%",
              maxWidth: "48rem",
              height: 400,
              margin: "0 auto",
            }}
          ></capacitor-google-map>

          <IonItem className="hidden-input">
            <IonLabel>Latitude</IonLabel>
            <IonInput
              readonly
              {...register("latitude")}
              placeholder="Latitude"
            ></IonInput>
          </IonItem>

          <IonItem className="hidden-input">
            <IonLabel>Longitude</IonLabel>
            <IonInput
              readonly
              {...register("longitude")}
              placeholder="Longitude"
            ></IonInput>
          </IonItem>

          {showMap && (<IonButton type="submit" expand="full">
            Submit
          </IonButton>
          )}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default UploadObservation;
