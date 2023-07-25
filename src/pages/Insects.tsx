import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonModal,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import "./Insects.css";
import { useMediaQuery } from "react-responsive";
import { Clipboard } from "@capacitor/clipboard";
import StockInsectImage from "../assets/StockInsectImage.jpg";
import { GoogleMap } from "@capacitor/google-maps";
import { Share } from "@capacitor/share";
import { addOutline, shareSocialOutline } from "ionicons/icons";

const Insects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [presentingElement, setPresentingElement] =
    useState<HTMLElement | null>(null);
  const page = useRef(null);
  const modal = useRef<HTMLIonModalElement>(null);
  const isMobileDevice = useMediaQuery({ maxWidth: 768 });
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_KEY;
  const [showToast, dismissToast] = useIonToast();
  const [currentPage, setCurrentPage] = useState(1);
  const cardModal = useRef<HTMLIonModalElement>(null);

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
            forceCreate: true,
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

  const loadSelectedBugMap = async () => {
    const mapElement = mapRefs.current.get("selected");
    if (mapElement) {
      // Use setTimeout to defer execution to the next tick of the event loop

      const bugMap = await GoogleMap.create({
        id: `map-selected`,
        element: mapElement,
        forceCreate: true,
        apiKey: apiKey,
        config: {
          center: {
            lat: selectedBug.lat,
            lng: selectedBug.lng,
          },
          zoom: 8,
        },
      });
      bugMap.addMarker({
        coordinate: {
          lat: selectedBug.lat,
          lng: selectedBug.lng,
        },
      });
    }
  };

  useEffect(() => {
    if (selectedBug?.lat && selectedBug?.lng) {
      loadSelectedBugMap();
    }
  }, [selectedBug]);

  useEffect(() => {
    setPresentingElement(page.current);
  }, []);

  useEffect(() => {
    fetchBugs(searchQuery, currentPage);
  }, []); // Only run once, when component mounts

  useEffect(() => {
    fetchBugs(searchQuery, currentPage);
  }, [searchQuery]); // Only run when searchQuery changes, but not when it's initially an empty string

  const fetchBugs = async (query: string, page: number) => {
    setLoading(true);

    try {
      const endpoint = query
        ? `https://api.inaturalist.org/v1/observations?q=${encodeURIComponent(
            query
          )}&page=${page}&per_page=10`
        : `https://api.inaturalist.org/v1/observations?order_by=created_at&order=desc&page=${page}&per_page=10`;

      console.log(`Fetching data from ${endpoint}`);

      const response = await fetch(endpoint);
      const data = await response.json();

      console.log("Received data", data);

      const results = data.results.map((result) => ({
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
          ? result.time_observed_at
              .split("T")[1]
              .split(":")
              .slice(0, 2)
              .join(":")
          : null,
        uri: result.uri,
        positionalAccuracy: result.positional_accuracy,
        lat: result.geojson ? result.geojson.coordinates[1] : null, // Get the latitude
        lng: result.geojson ? result.geojson.coordinates[0] : null, // Get the longitude
        // Add more details as needed
      }));
      setBugs(results);
    } catch (error) {
      console.error("Error fetching bugs:", error);
      setBugs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  const handleSearchChange = (event: CustomEvent) => {
    const query = event.detail.value;
    setSearchQuery(query);
  };

  const handleBugClick = async (bug) => {
    setSelectedBug(bug);

    modal.current?.present();
  };

  const handleCloseModal = () => {
    const selectedMapElement = mapRefs.current.get("selected");
    if (selectedMapElement) {
      // Remove all child nodes from map element
      while (selectedMapElement.firstChild) {
        selectedMapElement.removeChild(selectedMapElement.firstChild);
      }
    }

    modal.current?.dismiss();
    setSelectedBug(null);
  };

  const getQualityGradeDescription = (grade) => {
    switch (grade) {
      case "needs_id":
        return "Needs identification";
      case "research":
        return "Research grade";
      case "casual":
        return "Casual observation";
      default:
        return "Unknown grade";
    }
  };

  const handleShareClick = async (bug) => {
    try {
      await Share.share({
        title: bug.commonName,
        text: `Check out this observation of a ${bug.commonName}`,
        url: bug.uri,
      });
      console.log("Content shared successfully");
    } catch (error) {
      console.error("Error sharing", error);

      // If the share action was cancelled, do not copy to clipboard
      if (error.message !== "Share canceled") {
        // Fallback for devices that do not support sharing
        // Here we will copy the URL to the clipboard
        try {
          await Clipboard.write({
            string: bug.uri,
          });
          await dismissToast();
          showToast({
            message: "Link copied to clipboard",
            duration: 2000,
            color: "success",
          });
          console.log("Link copied to clipboard");
        } catch (err) {
          await dismissToast();
          showToast({
            message: "Failed to share",
            duration: 3000,
            color: "danger",
          });
          console.error("Failed to copy", err);
        }
      }
    }
  };

  return (
    <IonPage ref={page}>
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Search Plants and Animals</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="component-wrapper">
          <IonSearchbar
            value={searchQuery}
            onIonChange={handleSearchChange}
          ></IonSearchbar>
          {!searchQuery && (
            <h2 className="centered-text">Most Recent Observation Posts</h2>
          )}
          {isMobileDevice && (
            <p className="centered-text">
              Click on a card for more information.
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
                      {isMobileDevice && (
                      <div className="common-name">
                          <strong>{bug.commonName || "Unknown"}</strong>
                        </div>
                      )}
                        <IonImg
                          src={bug.image ? bug.image : StockInsectImage}
                        />
                        {bug.image ? null : (
                          <p className="image-credit">
                            <a href="https://www.freepik.com/free-photo/mosquito-3d-illustration_13880913.htm#query=bug%20with%20question%20mark&position=0&from_view=search&track=ais">
                              Image by julos
                            </a>{" "}
                            on Freepik
                          </p>
                        )}
                        <IonButton
                        color="secondary"
                        fill="outline"
                        shape="round"
                        slot="end"
                        className="share-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareClick(bug);
                        }}
                      >
                        <IonIcon slot="start" icon={shareSocialOutline} />
                        Share
                      </IonButton>
                      </div>
                      <div className="insect-details">
                      {!isMobileDevice && (
                        <>
                        <div className="common-name">
                          <strong>{bug.commonName || "Unknown"}</strong>
                        </div>
                          <div className="additional-info">
                            <div>
                              <i>{bug.scientificName || "Unknown"}</i>
                            </div>
                            <div>
                              Observed on: {bug.observedAt || "Unknown"}
                            </div>
                            <div>Place: {bug.place || "Unknown"}</div>
                            <div className="more-details">
                              More Details:
                              <ul>
                                <li>
                                  Quality Grade:{" "}
                                  {getQualityGradeDescription(
                                    bug.qualityGrade
                                  ) || "Unknown"}
                                </li>
                                <li>
                                  Time Observed:{" "}
                                  {bug.timeObservedAt || "Unknown"}
                                </li>
                                <li>
                                  Positional Accuracy:{" "}
                                  {bug.positionalAccuracy || "Unknown"}
                                </li>
                                {/* Add more details as needed */}
                              </ul>
                            </div>
                          </div>
                          </>
                        )}
                        {!isMobileDevice && bug.lat && bug.lng && (
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
            ref={cardModal}
            trigger="card-modal"
            presentingElement={presentingElement!}
            className="my-card-modal"
          >
            <IonHeader>
              <IonToolbar color={"success"}>
                <IonButtons slot="start">
                  <IonButton onClick={() => cardModal.current?.dismiss()}>
                    Close
                  </IonButton>
                </IonButtons>
                <IonTitle>Guide</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent className="card-modal-content">
              <ul>
                <li>
                  <strong>Searching:</strong> When you&apos;re searching for a
                  species, using the scientific name can yield better results
                  than the common name.
                </li>
                <li>
                  <strong>Images:</strong> The images you see are from the
                  observer&apos;s submissions. If an observer didn&apos;t
                  provide an image, we use a generic image from iNaturalist. If
                  that&apos;s not available, a stock image is used.
                </li>
                <li>
                  <strong>Map:</strong> The pin on the Google map represents the
                  location where the observation was made.
                </li>
                <li>
                  <strong>Quality Grades:</strong> Observations from iNaturalist
                  have different quality grades. These can be
                  &quot;casual&quot;, &quot;needs ID&quot;, or
                  &quot;research&quot;. &quot;Research&quot; grade observations
                  are the most reliable and have been confirmed by multiple
                  identifiers. &quot;Needs ID&quot; observations are awaiting
                  more identifiers for verification. &quot;Casual&quot;
                  observations don&apos;t meet the criteria for either of the
                  other grades, but are still valuable records.
                </li>
                <li>
                  <strong>Positional Accuracy:</strong> This represents the
                  accuracy of the location data for an observation. A lower
                  value indicates higher accuracy. Note that the accuracy might
                  be affected by various factors, including the observer&apos;s
                  device, their settings, and their actual physical location.
                </li>
              </ul>
            </IonContent>
          </IonModal>

          <IonFab
            className="fab-container"
            vertical="bottom"
            horizontal="end"
            slot="fixed"
          >
            <IonFabButton onClick={() => cardModal.current?.present()}>
              <IonIcon icon={addOutline} />
            </IonFabButton>
          </IonFab>

          <IonFooter>
            <div className="page-buttons">
              <IonButton
                fill="clear"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </IonButton>

              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <IonButton
                    key={pageNumber}
                    fill={pageNumber === currentPage ? "solid" : "clear"}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </IonButton>
                )
              )}

              <IonButton
                fill="clear"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === 5}
              >
                Next
              </IonButton>
            </div>
          </IonFooter>
        </div>
        <IonModal
          ref={modal}
          presentingElement={presentingElement!}
          onIonModalDidDismiss={handleCloseModal}
          onIonModalDidPresent={loadSelectedBugMap}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>{selectedBug?.commonName || "Unknown"}</IonTitle>
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
                  <strong>{selectedBug?.commonName || "Unknown"}</strong>
                </div>
                <div>
                  <i>{selectedBug?.scientificName || "Unknown"}</i>
                </div>
                <div>Observed on: {selectedBug?.observedAt || "Unknown"}</div>
                <div>Place: {selectedBug?.place || "Unknown"}</div>
                <div className="more-details">
                  More Details:
                  <ul>
                    <li>
                      Quality Grade:{" "}
                      {getQualityGradeDescription(selectedBug?.qualityGrade) ||
                        "Unknown"}
                    </li>
                    <li>
                      Time Observed: {selectedBug?.timeObservedAt || "Unknown"}
                    </li>
                    <li>
                      Positional Accuracy:{" "}
                      {selectedBug?.positionalAccuracy || "Unknown"}
                    </li>
                    {/* Add more details as needed */}
                  </ul>
                </div>
              </div>
              {selectedBug?.lat && selectedBug?.lng && (
                <div
                  id="map-selected"
                  style={{ width: "100%", height: "200px" }}
                  ref={(el) => {
                    if (el) {
                      console.log("Setting map element for selected bug", el);
                      mapRefs.current.set("selected", el);
                    }
                  }}
                ></div>
              )}
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Insects;
