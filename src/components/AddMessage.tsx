import {
  IonItem,
  IonLabel,
  IonNote,
  IonCard, 
  IonIcon, 
  IonAvatar,
  IonModal,
  IonContent,
  IonButton,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonTitle,
  IonImg
  } from '@ionic/react';
import { Message } from '../data/messages';
import { addOutline } from 'ionicons/icons'
import { Profil } from '../data/profil';
import './MessageListItem.css';
import './ProfilItem.css';
  
  interface ProfilItemExample {
    profil: Profil;
  }
  

/*          <IonCardHeader>
            <IonCardSubtitle> <IonInput></IonInput></IonCardSubtitle>
            <IonCardTitle> <IonInput></IonInput></IonCardTitle>
          </IonCardHeader> */


const AddMessage: React.FC<ProfilItemExample> = ({ profil }) => {
      return (
        <IonItem   id="trigger-button" slot="start"  detail={false}>
          <IonCard  className="ion-text-wrap full-width">

          <IonCardContent className="centerThings">
            <IonAvatar>
          <IonImg className="addPic" src={profil == undefined ? "../assets/profile_pic/image.jpg" : profil.img}></IonImg>
          </IonAvatar> 
          
          <IonTitle>Ecrivez quelque chose ...</IonTitle>
          <IonIcon className="iconAdd" icon={addOutline} ></IonIcon>
          </IonCardContent>
        </IonCard>

        <IonModal trigger="trigger-button" isOpen={false} swipeToClose={true}>
          <IonContent>//Todo load adding data</IonContent>
        </IonModal>
      </IonItem>
      );
  };


export default AddMessage;
