import { IonButton, IonText} from '@ionic/react';
import React from 'react';
import { Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import 'swiper/css'
import './Intro.css'
import Intro1Svg from '../assets/intro/1.svg';
import Slide1Jpg from '../assets/intro/slide1.jpg'
import Slide2Jpg from '../assets/intro/slide2.jpg'
import Slide4Jpg from '../assets/intro/slide4.jpg'
import Slide5Jpg from '../assets/intro/slide5.jpg'

interface ContainerProps { 
  onFinish: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return <IonButton onClick={() => swiper.slideNext()}>{children}</IonButton>;
}

const Intro: React.FC<ContainerProps> = ({ onFinish }) => {

  return (
    <Swiper>
      <SwiperSlide>
        <img src={Slide1Jpg} alt="intro1" />
        <IonText className="Travelling with a camera">
          <h2>Insect Identifier and Tracker</h2>
          <p>Welcome to the Insect Identifier and Tracker! Embrace your inner explorer and contribute to our collective understanding of global insect biodiversity!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>

      <SwiperSlide>
        <img src={Slide2Jpg} alt="Pinpointing sightings" />
        <IonText className="intro-text">
          <h2>Record and Map Your Sightings</h2>
          <p>Not just record, but also map your sightings. Provide details, capture a photo, pinpoint your location on Google Maps and leave your mark on the global insect map!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>

      <SwiperSlide>
        <img src={Intro1Svg} alt="Personal Dashboard" />
        <IonText className="intro-text">
          <h2>Your Personalised Observation Dashboard</h2>
          <p>Create your own account to manage and revisit your observations. Search through your findings, monitor your impact, and keep adding to your personal collection!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>
      <SwiperSlide>
        <img src={Slide4Jpg} alt="Globe" />
        <IonText className="intro-text">
          <h2>Explore Global Observations</h2>
          <p>Venture beyond your personal collection! Dive into observations made by others around the world. Browse, learn and discover unique sightings pinned on the global map!</p>
        </IonText>
        <SwiperButtonNext>Next</SwiperButtonNext>
      </SwiperSlide>
      <SwiperSlide>
        <img src={Slide5Jpg} alt="Person holding magnifying glass" />
        <IonText className="intro-text">
          <h2>Ready to Begin Your Journey?</h2>
          <p>Join us in our mission to better understand and conserve insect biodiversity. You&apos;re all set to start identifying, tracking, mapping, and exploring. Let&apos;s get started!</p>
        </IonText>
        <IonButton onClick={() => onFinish()}>Finish</IonButton>
      </SwiperSlide>
    </Swiper>
  );
};

export default Intro;