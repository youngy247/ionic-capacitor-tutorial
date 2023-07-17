import { IonButton, IonCard, IonCardContent, IonContent, IonFooter, IonHeader, IonInput, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Login: React.FC = () => {
    const doLogin = (event: any) => {
        event.preventDefault();
        console.log('doLogin');
    }
    

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color={'primary'}>
                    <IonTitle>Title</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardContent>
                        <form onSubmit={doLogin}>
                            <IonInput fill="outline" labelPlacement="floating" label="Email" type="email" placeholder="email@gmail.com" />
                            <IonInput className="ion-margin-top" fill="outline" labelPlacement="floating" label="Password" type="password" placeholder="email@gmail.com" />
                            <IonButton type="submit" expand="block" className="ion-margin-top">Login</IonButton>
                            <IonButton routerLink="/register" color={'secondary'} type="button" expand="block" className="ion-margin-top">Create account</IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
            
        </IonPage>
    );
};

export default Login;