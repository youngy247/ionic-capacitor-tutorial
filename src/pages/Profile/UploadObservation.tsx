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
  useIonLoading,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { useEffect, useRef } from "react";
import {
  getCurrentUserUID,
  savePictureToStorage,
  saveObservation,
} from "../../firebaseConfig";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import "./UploadObservation.css";
import UploadGuide from "./UploadGuide";
import { addOutline } from "ionicons/icons";
import React from "react";
// import { v4 as uuidv4 } from 'uuid';

const UploadObservation: React.FC = () => {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
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
  const [present, dismiss] = useIonLoading();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sortedObjects = [...detectedObjects].sort((a, b) => b.score - a.score);
  const [showLabelContainer, setShowLabelContainer] = useState(true);
  const species = watch("species");

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

  // Destroy Map useEffect
  useEffect(() => {
    if (!showMap && map) {
      map
        .destroy()
        .catch((error) => console.error("Failed to destroy map", error));
      setMap(null);
    }
  }, [showMap, map]);

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
      console.log("Failed to create map", error);
      showToast({
        message:
          "Failed to load map. Please check your internet connection and try again.",
        duration: 3000,
        color: "danger",
      });
    }
  }

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });
      console.log(image)

      // Check if the image type is supported
      const imageType = image.format.toLowerCase(); 
      if (imageType !== "jpeg" && imageType !== "png") {
        showToast({
          message: "Only JPEG and PNG files are supported. Please upload a different file type.",
          duration: 3000,
        });
        return;
      }
      

      const img = `data:image/jpeg;base64,${image.base64String}`;

      // Send the base64 image data to your backend
      const response = await fetch(
        "https://portfolio-backend-3jb1.onrender.com/vision",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageURL: img }),
        }
      );

      // Parse the objects from the response
      const objects = await response.json();
      setDetectedObjects(objects);

      if (objects.length === 1) {
        // Show a toast message with the detected object
        showToast({
          message: `${objects[0].name} detected!`,
          duration: 3000,
          color: "success",
        });
      } else if (objects.length > 1) {
        showToast({
          message: `Detection successful!`,
          duration: 3000,
          color: "success",
        });
      } else {
        // Show a toast message if no species could be detected
        showToast({
          message: `No species could be detected from the image.`,
          duration: 3000,
          color: "warning",
        });
      }

      setImage(img);
      setValue("img", img); // Set value of img in form
      setShowLabelContainer(true);

      const imgElement = new Image();
      imgElement.src = img;
      imgElement.onload = (event) => {
        const target = event.target as HTMLImageElement;
        setImageSize({
          width: target.naturalWidth,
          height: target.naturalHeight,
        });
      };
    } catch (error) {
      showToast({
        message: "Failed to upload photo. Please try again.",
        duration: 3000,
        color: "danger",
      });
    }
  };

  const onSubmit = async (data) => {
    await present("Saving Observation...");
    data.species = data.species.trim();
    if (!data.species) {
      await dismiss();
      showToast({
        message: "Species is required. Please fill it to continue.",
        duration: 3000,
        color: "danger",
      });
      return;
    }
    if (!data.timestamp) {
      await dismiss();
      showToast({
        message: "Date/Time is required. Please fill it to continue.",
        duration: 3000,
        color: "danger",
      });
      return;
    }
    try {
      if (data.img) {
        const imageURL = await savePictureToStorage(data.img);
        data.img = imageURL;
      }
    } catch (error) {
      showToast({
        message: "Failed to save picture to storage",
        duration: 3000,
        color: "danger",
      });
      console.error("Failed to save picture to storage: ", error);
      return;
    } finally {
      await dismiss();
    }

    const userUID = getCurrentUserUID();
    if (userUID) {
      data.userUID = userUID;
    } else {
      await dismiss();
      showToast({
        message: "You're not logged in. Please log in to continue.",
        duration: 3000,
        color: "danger",
      });
      router.push("/", "root");
      return;
    }

    try {
      await saveObservation(data);
    } catch (error) {
      await dismiss();
      showToast({
        message: "Failed to save observation",
        duration: 3000,
        color: "danger",
      });
      console.error("Failed to save observation: ", error);
      return;
    }

    // Reset form and image
    reset();
    setImage(null);
    setShowLabelContainer(false);
    setShowMap(false);
    await dismiss();

    showToast({
      message: "Successfully saved observation",
      duration: 3000,
      color: "success",
    });
  };

  const handleGuideModalDismiss = () => {
    setShowGuideModal(false);
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
          <div className="image-label-container">
            {showLabelContainer && image && (
              <div style={{ position: "relative" }}>
                <img
                  className="upload-picture"
                  src={image}
                  alt="image"
                  onLoad={(event) => {
                    const imgElement = event.target as HTMLImageElement;
                    const { width, height } = imgElement;
                    setImageSize({ width, height });
                  }}
                />
                {sortedObjects.map((object, index) => {
                  const vertices = object.boundingPoly.normalizedVertices;
                  const boxWidth =
                    Math.abs(vertices[2].x - vertices[0].x) * imageSize.width;
                  const boxHeight =
                    Math.abs(vertices[2].y - vertices[0].y) * imageSize.height;
                  const boxLeft = vertices[0].x * imageSize.width;
                  const boxTop = vertices[0].y * imageSize.height;

                  const hovered = hoveredIndex === index;
                  const handleMouseOver = () => setHoveredIndex(index);
                  const handleMouseOut = () => setHoveredIndex(null);
                  const handleClick = () => setValue("species", object.name);

                  const commonStyles =
                    species === object.name
                      ? { borderColor: "green", cursor: "pointer" }
                      : hovered
                      ? { borderColor: "yellow", cursor: "pointer" }
                      : { borderColor: "transparent", cursor: "default" };

                  return (
                    <div
                      key={index}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                      onClick={handleClick}
                      style={{
                        position: "absolute",
                        left: boxLeft,
                        top: boxTop,
                        width: boxWidth,
                        height: boxHeight,
                        border: "2px solid",
                        ...commonStyles,
                      }}
                    />
                  );
                })}
              </div>
            )}
            {showLabelContainer && (
              <div
                style={{
                  marginLeft: 20,
                  alignSelf: "center",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                }}
              >
                {sortedObjects.map((object, index) => {
                  const handleMouseOver = () => setHoveredIndex(index);
                  const handleMouseOut = () => setHoveredIndex(null);
                  const handleClick = () => setValue("species", object.name);

                  return (
                    <div
                      key={index}
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                      onClick={handleClick}
                      style={{
                        margin: 8,
                        border: "none",
                        padding: 12,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "13rem",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ marginBottom: 5 }}>{object.name}</span>
                        <span>{Math.round(object.score * 100)}%</span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: 8,
                          backgroundColor: "#CCCCCC",
                        }}
                      >
                        <div
                          style={{
                            width: `${object.score * 100}%`,
                            height: "100%",
                            backgroundColor: "green",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <IonButton
            onClick={() => {
              setShowMap(true);
              createMap();
            }}
          >
            Pinpoint the location
          </IonButton>
          {!showMap && (
            <IonButton type="submit" expand="full">
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

          {showMap && (
            <IonButton type="submit" expand="full">
              Submit
            </IonButton>
          )}
        </form>
        <UploadGuide
          isOpen={showGuideModal}
          handleDismiss={handleGuideModalDismiss}
        />
        <IonFab
          className="fab-container"
          vertical="bottom"
          horizontal="end"
          slot="fixed"
        >
          <IonFabButton onClick={() => setShowGuideModal(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default UploadObservation;
