import {
  IonItem,
  IonLabel,
  IonNote,
  IonCard,
  IonIcon,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/react';
import { Profil } from '../data/profil';
import { pin } from 'ionicons/icons'
import './ProfilItem.css';
import { useSelector } from 'react-redux';

interface ProfilItemExample {
  profil: Profil;
}

const ProfilItem: React.FC<ProfilItemExample> = ({ profil }) => {
  const username = useSelector((state: any) => state.userData.username)

  return (

    <IonCard className="profileCard" routerLink={`/profil/${profil == undefined ? "error" : profil.id}`}>
      <IonCardHeader>
        <img className="profilePic" src={profil == undefined ? "../assets/profile_pic/image.jpg" : profil.img} />
        <IonCardTitle  >{username == undefined ? "error" : username}</IonCardTitle>
      </IonCardHeader>
    </IonCard>

  );
};

export default ProfilItem;
