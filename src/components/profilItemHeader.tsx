import {
  IonItem,
  IonImg,
  IonAvatar,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/react';
import { Profil } from '../data/profil';
import { pin } from 'ionicons/icons'
import './ProfilItemHeader.css';
import { logoutUser } from '../firebaseConfig'
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

interface ProfilItemExample {
  profil: Profil;
}

const ProfilItemHeader: React.FC<ProfilItemExample> = ({ profil }) => {
  const username = useSelector((state: any) => state.userData.username)
  const profilImg = useSelector((state: any) => state.userData.profilImg)

  const history = useHistory();

  async function Deconnection() {
    await logoutUser();
    history.replace('/login');
  }
  async function Profil() {
    history.replace('/profil');
  }
  async function Options() {
    history.replace('/options');
  }

  return (
    <IonItem color="warning" className="ProfilItem">
      <IonAvatar>
        <IonImg className="addPic" src={profil == undefined ? "../assets/profile_pic/image.jpg" : profil.img}></IonImg>
      </IonAvatar>
      <IonLabel className='hidden-md-down'>{profil.pseudo == undefined ? "error" : profil.pseudo}</IonLabel>
      <IonSelect interface="popover"
        onIonChange={e=>e.detail.value == "deconnection" ? Deconnection() : e.detail.value == "profil" ? Profil() : e.detail.value == "options" ? Options() : Profil()}
      >
        <IonSelectOption value="profil">Profil</IonSelectOption>
        <IonSelectOption value="deconnection" onClick={Deconnection}>Deconnection</IonSelectOption>
      </IonSelect>


    </IonItem>

  );
};

export default ProfilItemHeader;
