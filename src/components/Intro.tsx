import { IonContent, IonHeader, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css'
import './Intro.css'
import Intro1Svg from '../assets/intro/1.svg';
import Intro2Svg from '../assets/intro/2.svg';
import Intro3Svg from '../assets/intro/3.svg';

interface ContainerProps { 
  onFinish: () => void;
}

const Intro: React.FC<ContainerProps> = () => {

  return (
    <Swiper>
      <SwiperSlide>
        <img src={Intro1Svg} alt="intro1" />
        <IonText>
          <h3>Build awesome apps with Ionic UI components!</h3>
        </IonText>
      </SwiperSlide>
      <SwiperSlide>easst</SwiperSlide>
    </Swiper>
  );
};

export default Intro;