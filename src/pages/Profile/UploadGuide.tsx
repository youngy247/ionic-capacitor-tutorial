import React from 'react';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/react';
import '../Home/GlobalObservations.css'

interface UploadGuideProps {
  isOpen: boolean;
  handleDismiss: () => void;
}

const UploadGuide: React.FC<UploadGuideProps> = ({ isOpen, handleDismiss }) => (
  <IonModal
    isOpen={isOpen}
    onDidDismiss={handleDismiss}
    >
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonButton onClick={handleDismiss}>Close</IonButton>
          </IonButtons>
          <IonTitle className="ion-text-center">Upload Guide</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="card-modal-content">
        <ul>
          <li>
            <strong>Image Upload:</strong> Upload an image first to try image detection. The quality of the image affects the accuracy of species detection. Use clear, well-lit photos for the best results. If detection fails, use manual input.
          </li>
          <li>
            <strong>Date and Time:</strong> These are required to sort your observations in the &apos;My Observations&apos; tab. If you&apos;re unsure, make an estimate. Times are currently uploaded, stored and displayed in UTC +1 timezone.
          </li>
          <li>
            <strong>Location:</strong> Optionally, click &apos;Pinpoint the location&apos;. The map that appears will attempt to center over your location or default to the UK.
          </li>
          <li>
            <strong>After Submission:</strong> Visit &apos;My Observations&apos; to see your upload. If it&apos;s not there instantly, swipe down to refresh on mobile/tablet or click and drag down to refresh on a desktop. Addtionaly, you will also have the option of searching by species in the search bar.
          </li>
        </ul>
      </IonContent>
  </IonModal>
)

export default UploadGuide;
