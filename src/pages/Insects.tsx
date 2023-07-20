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

const Insects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedBug, setSelectedBug] = useState<any | null>(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  const page = useRef(null);

  const isMobileDevice = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    fetchBugs();
  }, [searchQuery]);

  const fetchBugs = async () => {
    if (searchQuery) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.inaturalist.org/v1/observations?q=${encodeURIComponent(
            searchQuery
          )}&per_page=15`
        );
        const data = await response.json();
        const results = data.results.map((result: any) => ({
          image: result.taxon.default_photo?.medium_url,
          commonName: result.taxon.preferred_common_name,
          scientificName: result.taxon.name, // Added
          observedAt: result.observed_on, // Added
          place: result.place_guess, // Added
        }));
        setBugs(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bugs:", error);
        setBugs([]);
        setLoading(false);
      }
    } else {
      setBugs([]);
    }
  };

  const handleSearchChange = (event: CustomEvent) => {
    setSearchQuery(event.detail.value);
  };

  const handleBugClick = (bug: any) => {
    setSelectedBug(bug);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        {isMobileDevice && <p className="centered-text">Click on an insect for more information.</p>}
        {loading ? (
          <p>Loading insects...</p>
        ) : (
          <>
            {bugs.length === 0 ? (
              <p>No insects found.</p>
            ) : (
              bugs.map((bug, index) => (
                <IonCard
                  key={index}
                  onClick={() => isMobileDevice && handleBugClick(bug)}
                >
                  <IonCardContent
                    className={
                      isMobileDevice
                        ? "card-content-mobile"
                        : "card-content-desktop"
                    }
                  >
                    <div className="image-container">
                      {bug.image && <IonImg src={bug.image} />}
                    </div>
                    <IonLabel>
                      <strong>{bug.commonName}</strong>
                    </IonLabel>
                    {!isMobileDevice && (
                      <>
                        <IonLabel>
                          <i>{bug.scientificName}</i>
                        </IonLabel>
                        <IonLabel>Observed at: {bug.observedAt}</IonLabel>
                        <IonLabel>Place: {bug.place}</IonLabel>
                      </>
                    )}
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </>
        )}

        <IonModal
          isOpen={showModal}
          presentingElement={presentingElement!}
          onDidDismiss={handleCloseModal}
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
                {selectedBug?.image && <IonImg src={selectedBug.image} />}
              </div>
              <IonLabel className="centered-text">
                <strong>{selectedBug?.commonName}</strong>
              </IonLabel>
              <IonLabel>
                <i>{selectedBug?.scientificName}</i>
              </IonLabel>
              <IonLabel>Observed at: {selectedBug?.observedAt}</IonLabel>
              <IonLabel>Place: {selectedBug?.place}</IonLabel>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Insects;
