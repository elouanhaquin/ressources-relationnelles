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
import Submit from '../pages/Submit';
import './MessageListItem.css';
import './ProfilItem.css';
import './AddMessage.css';
import SubmitPopOver from './SubmitPopOver';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

interface ProfilItemExample {
  profil: Profil;
}

const AddMessage: React.FC<ProfilItemExample> = ({ profil }) => {
  const history = useHistory();
  const profilIMG = useSelector((state: any) => state.userData.profilImg)


  function redirectToSubmit(){
    history.replace('/Submit');

  }
  return (
    <IonItem onClick={redirectToSubmit} className="add-message" id="trigger-button" slot="start" detail={false}>
      <IonCard className="ion-text-wrap full-width">

        <IonCardContent className="centerThings">
          <IonAvatar>
            <IonImg className="addPic" src={profil == undefined ? "../assets/profile_pic/image.jpg" : profilIMG}></IonImg>
          </IonAvatar>

          <IonTitle>Ecrivez quelque chose ...</IonTitle>
          <IonIcon className="iconAdd" icon={addOutline} ></IonIcon>
        </IonCardContent>
      </IonCard>

  
    </IonItem>
  );
};


export default AddMessage;
