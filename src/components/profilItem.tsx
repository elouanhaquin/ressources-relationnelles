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

  interface ProfilItemExample {
    profil: Profil;
  }

  const ProfilItem: React.FC<ProfilItemExample> = ({ profil }) => {
    return (
   //   <IonItem   >
        <IonCard className="profileCard" routerLink={`/profil/${profil == undefined ? "error" : profil.id}`}>
        <IonCardHeader>
            <img  className="profilePic" src={profil == undefined ? "../assets/profile_pic/image.jpg" : profil.img}/>
          <IonCardTitle  >{profil == undefined ? "error" : profil.name}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
  //  </IonItem>
    );
  };

  export default ProfilItem;
