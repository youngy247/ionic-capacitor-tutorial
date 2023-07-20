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
          result.taxon && result.taxon.default_photo
            ? result.taxon.default_photo.medium_url
            : null,
        commonName: result.taxon ? result.taxon.preferred_common_name : null,
        scientificName: result.taxon ? result.taxon.name : null,
        observedAt: result.observed_on,
        place: result.place_guess,
        qualityGrade: result.quality_grade,
        timeObservedAt: result.time_observed_at,
        positionalAccuracy: result.positional_accuracy,
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
          <IonTitle>Search Insects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchQuery}
          onIonChange={handleSearchChange}
        ></IonSearchbar>
        {!searchQuery && <h2>Most Recent Observations</h2>}
        {isMobileDevice && (
          <p className="centered-text">
            Click on an insect for more information.
          </p>
        )}
        {loading && searchQuery ? (
          <p>Loading insects...</p>
        ) : (
          <>
            {bugs.length === 0 && searchQuery ? (
              <p>No insects found.</p>
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
                          <div>
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
                <div>
                  More Details:
                  <ul>
                    <li>Quality Grade: {selectedBug?.qualityGrade}</li>
                    <li>Time Observed: {selectedBug?.timeObservedAt}</li>
                    <li>Positional Accuracy: {selectedBug?.positionalAccuracy}</li>
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
