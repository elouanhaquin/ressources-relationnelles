

import {
  IonContent,
  IonHeader,
  IonItem,
  IonInput,
  IonRow,
  IonCol,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonSearchbar,
  IonNote,
  IonButton,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTextarea,
  IonText
} from '@ionic/react';

import { documentAttachSharp, documentOutline, imageOutline, videocamOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import Submit from '../pages/Submit';
import '../pages/Submit.css';

function SubmitPopOver() {
  return (

    <Submit></Submit>


  )
}

export default SubmitPopOver;
