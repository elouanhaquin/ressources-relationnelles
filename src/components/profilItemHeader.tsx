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

interface ProfilItemExample {
  profil: Profil;
}

const ProfilItemHeader: React.FC<ProfilItemExample> = ({ profil }) => {
  const history = useHistory();

  async function logout() {
    await logoutUser();
    history.replace('/login');
  }

  return (
    <IonItem color="warning" className="ProfilItem">
      <IonAvatar>
        <IonImg className="addPic" src={profil == undefined ? "../assets/profile_pic/image.jpg" : profil.img}></IonImg>
      </IonAvatar>
      <IonLabel>{profil == undefined ? "error" : profil.name}</IonLabel>
      <IonSelect interface="popover"
        onIonChange={logout}
      >
        <IonSelectOption value="profil">Profil</IonSelectOption>
        <IonSelectOption value="options">Options</IonSelectOption>
        <IonSelectOption onClick={logoutUser}>Deconnection</IonSelectOption>
      </IonSelect>


    </IonItem>

  );
};

export default ProfilItemHeader;
