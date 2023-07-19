import { IonButton, IonText} from '@ionic/react';
import React from 'react';
import { Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import 'swiper/css'
import './Intro.css'
import Intro1Svg from '../assets/intro/1.svg';
import Intro2Svg from '../assets/intro/2.svg';
import Intro3Svg from '../assets/intro/3.svg';

interface ContainerProps { 
  onFinish: () => void;
}

const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return <IonButton onClick={() => swiper.slideNext()}>{children}</IonButton>;
}

const Intro: React.FC<ContainerProps> = ({ onFinish }) => {

  return (
    <Swiper>
      <SwiperSlide>
        <img src={Intro1Svg} alt="intro1" />
        <IonText className="intro-text">
          <h2>Insect Identifier and Tracker</h2>
          <p>Welcome to the Insect Identifier and Tracker. Become a citizen scientist and contribute to the understanding of insect biodiversity!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>

      <SwiperSlide>
        <img src={Intro2Svg} alt="intro2" />
        <IonText className="intro-text">
          <h2>Identify and Record Sightings</h2>
          <p>Input descriptive details to identify insects. Record your sightings with date, location, and a photo. Every observation matters!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>

      <SwiperSlide>
        <img src={Intro3Svg} alt="intro3" />
        <IonText className="intro-text">
          <h2>Sharing Data and Challenges</h2>
          <p>Your data is shared with conservation projects. Engage in fun challenges like spotting a certain number of species to contribute more!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>
      <SwiperSlide>
        <img src={Intro3Svg} alt="intro3" />
        <IonText className="intro-text">
          <h2>Always Ready, Anywhere</h2>
          <p>No internet? No problem. Save your sightings offline and upload when ready. Plus, we&apos;re available on iOS, Android, and web.</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>
      <SwiperSlide>
        <img src={Intro3Svg} alt="intro3" />
        <IonText className="intro-text">
          <h2>Ready to Begin?</h2>
          <p>You&apos;re all set to contribute to insect conservation. Let&apos;s start identifying and tracking!</p>
        </IonText>
        <IonButton onClick={() => onFinish()}>Finish</IonButton>
      </SwiperSlide>
    </Swiper>
  );
};

export default Intro;