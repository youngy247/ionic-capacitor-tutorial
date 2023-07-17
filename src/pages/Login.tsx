import { IonButton, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import fcc from '../assets/fcc.svg'

const Login: React.FC = () => {
    const doLogin = (event: any) => {
        event.preventDefault();
        console.log('doLogin');
    }
    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonTitle>Free Code Camp</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent scrollY={false}>
                <div className="ion-text-center ion-padding">
                    <img src={fcc} alt='fCC logo' width={'50%'}/>
                </div>
                <IonCard>
                    <IonCardContent>
                        <form onSubmit={doLogin}>
                            <IonInput fill="outline" labelPlacement="floating" label="Email" type="email" placeholder="email@gmail.com" />
                            <IonInput className="ion-margin-top" fill="outline" labelPlacement="floating" label="Password" type="password" placeholder="email@gmail.com" />
                            <IonButton type="submit" expand="block" className="ion-margin-top">
                                Login
                                <IonIcon icon={logInOutline} slot="end"/>
                            </IonButton>
                            <IonButton routerLink="/register" color={'secondary'} type="button" expand="block" className="ion-margin-top">
                                Create account
                                <IonIcon icon={personCircleOutline} slot="end"/>
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
            
        </IonPage>
    );
};

export default Login;