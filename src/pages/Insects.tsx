import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import "./Insects.css";
import { useMediaQuery } from "react-responsive";
import StockInsectImage from "../assets/StockInsectImage.jpg";
import { GoogleMap } from "@capacitor/google-maps";

const Insects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBug, setSelectedBug] = useState<any | null>(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  const page = useRef(null);
  const modal = useRef<HTMLIonModalElement>(null);
  const isMobileDevice = useMediaQuery({ maxWidth: 768 });
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;

  const mapRefs = useRef(new Map());

  useEffect(() => {
    // Initialize the maps after the bugs are fetched
    if (bugs.length > 0) {
      bugs.forEach(async (bug, index) => {
        const mapElement = mapRefs.current.get(index);
        if (mapElement && bug.lat && bug.lng) {
          const bugMap = await GoogleMap.create({
            id: `map-${index}`,
            element: mapElement,
            apiKey: apiKey,
            config: {
              center: {
                lat: bug.lat,
                lng: bug.lng,
              },
              zoom: 8,
            },
          });
          // Add marker at the bug's location
          bugMap.addMarker({
            coordinate: {
              lat: bug.lat,
              lng: bug.lng,
            },
          });
        }
      });
    }
  }, [bugs]);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    fetchBugs(searchQuery);
  }, []); // Only run once, when component mounts

  useEffect(() => {
    fetchBugs(searchQuery);
  }, [searchQuery]); // Only run when searchQuery changes, but not when it's initially an empty string

  const fetchBugs = async (query: string) => {
    setLoading(true);
    try {
      const endpoint = query
        ? `https://api.inaturalist.org/v1/observations?q=${encodeURIComponent(
            query
          )}&per_page=15`
        : `https://api.inaturalist.org/v1/observations?order_by=created_at&order=desc&per_page=15`;

      console.log(`Fetching data from ${endpoint}`);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log("Received data", data);

      const results = data.results.map((result: any) => ({
        image:
          result.photos && result.photos.length > 0
            ? result.photos[0].url // First try to use observer's photo
            : result.taxon && result.taxon.default_photo
            ? result.taxon.default_photo.medium_url // If not available, try to use iNaturalist's default photo
            : null,
        commonName: result.taxon ? result.taxon.preferred_common_name : null,
        scientificName: result.taxon ? result.taxon.name : null,
        observedAt: result.observed_on,
        place: result.place_guess,
        qualityGrade: result.quality_grade,
        timeObservedAt: result.time_observed_at
          ? result.time_observed_at.split("T")[1].split("+")[0]
          : null,
        positionalAccuracy: result.positional_accuracy,
        lat: result.geojson ? result.geojson.coordinates[1] : null, // Get the latitude
        lng: result.geojson ? result.geojson.coordinates[0] : null, // Get the longitude
        // Add more details as needed
      }));
      setBugs(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      setBugs([]);
      setLoading(false);
    }
  };

  const handleSearchChange = (event: CustomEvent) => {
    const query = event.detail.value;
    setSearchQuery(query);
  };

  const handleBugClick = (bug: any) => {
    setSelectedBug(bug);
    modal.current?.present();
  };

  const handleCloseModal = () => {
    modal.current?.dismiss();
    setSelectedBug(null);
  };

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Search Plants and Animals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="component-wrapper"></div>
        <IonSearchbar
          value={searchQuery}
          onIonChange={handleSearchChange}
        ></IonSearchbar>
        {!searchQuery && <h2>Most Recent Observation Posts</h2>}
        {isMobileDevice && (
          <p className="centered-text">
            Click on an insect for more information.
          </p>
        )}
        {loading && searchQuery ? (
          <p>Loading Observations...</p>
        ) : (
          <>
            {bugs.length === 0 && searchQuery ? (
              <p>No Observations found.</p>
            ) : (
              bugs.map((bug, index) => (
                <IonCard
                  key={index}
                  onClick={() => isMobileDevice && handleBugClick(bug)}
                  className="card-container"
                >
                  <IonCardContent
                    className={
                      isMobileDevice
                        ? "card-content-mobile"
                        : "card-content-desktop"
                    }
                  >
                    <div className="image-container">
                      <IonImg src={bug.image ? bug.image : StockInsectImage} />
                      {bug.image ? null : (
                        <p className="image-credit">
                          <a href="https://www.freepik.com/free-photo/mosquito-3d-illustration_13880913.htm#query=bug%20with%20question%20mark&position=0&from_view=search&track=ais">
                            Image by julos
                          </a>{" "}
                          on Freepik
                        </p>
                      )}
                    </div>
                    <div className="insect-details">
                      <div className="common-name">
                        <strong>{bug.commonName}</strong>
                      </div>
                      {!isMobileDevice && (
                        <div className="additional-info">
                          <div>
                            <i>{bug.scientificName}</i>
                          </div>
                          <div>Observed on: {bug.observedAt}</div>
                          <div>Place: {bug.place}</div>
                          <div className="more-details">
                            More Details:
                            <ul>
                              <li>Quality Grade: {bug.qualityGrade}</li>
                              <li>Time Observed: {bug.timeObservedAt}</li>
                              <li>
                                Positional Accuracy: {bug.positionalAccuracy}
                              </li>
                              {/* Add more details as needed */}
                            </ul>
                          </div>
                        </div>
                      )}
                      {bug.lat && bug.lng && (
                        <div
                          id={`map-${index}`}
                          style={{ width: "100%", height: "200px" }}
                          ref={(el) => mapRefs.current.set(index, el)}
                        ></div>
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </>
        )}

        <IonModal
          ref={modal}
          presentingElement={presentingElement!}
          onIonModalDidDismiss={handleCloseModal}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedBug?.commonName}</IonTitle>
              <IonButton slot="end" onClick={handleCloseModal}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="modal-content-container">
              <div className="image-container">
                <IonImg
                  src={
                    selectedBug?.image ? selectedBug.image : StockInsectImage
                  }
                />
                {selectedBug?.image ? null : (
                  <p className="image-credit">
                    <a href="https://www.freepik.com/free-photo/mosquito-3d-illustration_13880913.htm#query=bug%20with%20question%20mark&position=0&from_view=search&track=ais">
                      Image by julos
                    </a>{" "}
                    on Freepik
                  </p>
                )}
              </div>
              <div className="insect-details">
                <div className="common-name">
                  <strong>{selectedBug?.commonName}</strong>
                </div>
                <div>
                  <i>{selectedBug?.scientificName}</i>
                </div>
                <div>Observed on: {selectedBug?.observedAt}</div>
                <div>Place: {selectedBug?.place}</div>
                <div className="more-details">
                  More Details:
                  <ul>
                    <li>Quality Grade: {selectedBug?.qualityGrade}</li>
                    <li>Time Observed: {selectedBug?.timeObservedAt}</li>
                    <li>
                      Positional Accuracy: {selectedBug?.positionalAccuracy}
                    </li>
                    {/* Add more details as needed */}
                  </ul>
                </div>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Insects;
