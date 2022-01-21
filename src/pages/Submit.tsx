import { useState } from 'react';
import { Message, getMessage } from '../data/messages';
import {
    IonContent,
    IonHeader,
    IonItem,
    IonGrid, 
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
    IonCardSubtitle,
    IonCardContent
} from '@ionic/react';
import ProfilItemHeader from '../components/profilItemHeader';
import { Profil, getProfil } from '../data/profil';
import { personCircle, addOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import './Submit.css';

function Submit() {


  return (
      <IonItem>    <IonCard  className="ion-text-wrap full-width">
     
    <IonCardHeader>
      <IonCardTitle> Ajouter une ressource</IonCardTitle>
      <IonCardSubtitle className="date" > </IonCardSubtitle>
      <IonCardSubtitle ></IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
     

    </IonCardContent>
  </IonCard>
  </IonItem>

        )

  
}

export default Submit;
