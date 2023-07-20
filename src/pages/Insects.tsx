import { IonCard, IonCardContent, IonContent, IonHeader, IonImg, IonLabel, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Insects.css'

const Insects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bugs, setBugs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
        }));
        setBugs(results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bugs:', error);
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Insects</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar value={searchQuery} onIonChange={handleSearchChange}></IonSearchbar>

        {loading ? (
          <p>Loading insects...</p>
        ) : (
          <>
            {bugs.length === 0 ? (
              <p>No insects found.</p>
            ) : (
              bugs.map((bug, index) => (
                <IonCard key={index}>
                  <IonCardContent>
                  <div className="image-container">    
                      {bug.image && <IonImg src={bug.image} />}
                    </div>
                    <IonLabel>{bug.commonName}</IonLabel>
                  </IonCardContent>
                </IonCard>
              ))
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Insects;
