// CardModal.jsx
import React from 'react';
import { IonModal, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent } from '@ionic/react';
import './GlobalObservations.css'

interface CardModalProps {
  isOpen: boolean;
  handleDismiss: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ isOpen, handleDismiss }) => (
  <IonModal
    isOpen={isOpen}
    onDidDismiss={handleDismiss}
    >
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonButtons slot="start">
            <IonButton onClick={handleDismiss}>Close</IonButton>
          </IonButtons>
          <IonTitle className="ion-text-center">Guide</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="card-modal-content">
        <ul>
          <li>
            <strong>Searching:</strong> When you&apos;re searching for a
            species, using the scientific name can yield better results than the
            common name.
          </li>
          <li>
            <strong>Images:</strong> The images you see are from the
            observer&apos;s submissions. If an observer didn&apos;t provide an
            image, we use a generic image from iNaturalist. If that&apos;s not
            available, a stock image is used.
          </li>
          <li>
            <strong>Map:</strong> The pin on the Google map represents the
            location where the observation was made.
          </li>
          <li>
            <strong>Quality Grades:</strong> Observations from iNaturalist have
            different quality grades. These can be &quot;casual&quot;,
            &quot;needs ID&quot;, or &quot;research&quot;. &quot;Research&quot;
            grade observations are the most reliable and have been confirmed by
            multiple identifiers. &quot;Needs ID&quot; observations are awaiting
            more identifiers for verification. &quot;Casual&quot; observations
            don&apos;t meet the criteria for either of the other grades, but are
            still valuable records.
          </li>
          <li>
            <strong>Positional Accuracy:</strong> This represents the accuracy
            of the location data for an observation. A lower value indicates
            higher accuracy. Note that the accuracy might be affected by various
            factors, including the observer&apos;s device, their settings, and
            their actual physical location.
          </li>
        </ul>
      </IonContent>
  </IonModal>
)

export default CardModal;
