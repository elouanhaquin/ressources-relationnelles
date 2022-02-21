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
  IonIcon
} from '@ionic/react';
import ProfilItemHeader from '../components/profilItemHeader';
import { Profil, getProfil } from '../data/profil';
import { personCircle, addOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import './HeaderBar.css';
import { getProfilFromFireStoreDBwithID, getUIDCurrentUser } from '../firebaseConfig';

interface HeadBar {
  profil: Profil;
}

const HeaderBar: React.FC = () => {
  const [profil, setProfil] = useState<Profil>();

  useIonViewWillEnter(() => {
    getUIDCurrentUser().then(data => {
      getProfilFromFireStoreDBwithID("" + data).then((d) => {
        const profi: Profil =
        {
          name: d.name ? d.name : "",
          lastName: d.lastName? d.lastName : "",
          firstName: d.firstName? d.firstName : "",
          img: d.img? d.img : "",
          id: d.id? d.id : 0,
          likes: d.likes? d.likes : [],
          categories: d.categories? d.categories : [],
          signaled: d.signaled? d.signaled : [],
          signaled_comments: d.signaled_comments? d.signaled_comments : [],
          friends: d.friends? d.friends : [],
          friends_waiting: d.friends_waiting? d.friends_waiting : [],
          family: d.family? d.family : [],
          interested: d.interested? d.interested : [],
          admin: d.admin? d.admin : 0,
          uid: d.uid? d.uid : ""
        };
        setProfil(profi)
      });
    });
  });



  return (
    <IonHeader className="padding-headbar header-bar" slot="fixed">
      <IonGrid>
        <IonRow>
          <IonCol size="3">
            <IonItem href='/home'><img src="assets/icon/logoR.svg" width="246" height="43" /></IonItem>
          </IonCol>
          <IonCol size="5">
            <IonSearchbar>

            </IonSearchbar>
          </IonCol>
          <IonCol size="1">
            <IonButton href={"/submit"} className="buttonHeader" > <IonIcon icon={addOutline}> </IonIcon> </IonButton>

          </IonCol>
          <IonCol size="3">
            {profil != undefined ? <ProfilItemHeader profil={profil} /> : <div></div>}
          </IonCol>
        </IonRow>
      </IonGrid>

    </IonHeader>

  );
}

export default HeaderBar;
