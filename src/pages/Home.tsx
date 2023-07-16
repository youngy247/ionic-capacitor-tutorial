import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>FreeCodeCamp LIVE</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        Hello World
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
