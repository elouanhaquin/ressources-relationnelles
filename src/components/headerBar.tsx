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
import { personCircle, addOutline, arrowForwardOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router';
import './HeaderBar.css';
import '../pages/Home';
import { getProfilFromFireStoreDBwithID, getUIDCurrentUser } from '../firebaseConfig';

interface HeadBar {
  profil: Profil;
}

const HeaderBar: React.FC = () => {
  const [profil, setProfil] = useState<Profil>();
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  
  useIonViewWillEnter(() => {
    getUIDCurrentUser().then(data => {
      getProfilFromFireStoreDBwithID("" + data).then((d) => {
       
        setProfil(d)
      });
    });
  });



  return (
    <IonHeader className="padding-headbar header-bar" slot="fixed">
      <IonGrid>
        <IonRow>
          <IonCol className='hidden-md-down' size="3">
            <IonItem   onClick={e=> history.push('/home')}><img src="assets/icon/logoR.svg" width="246" height="43" /></IonItem>
          </IonCol>
          <IonCol className='hidden-md-up' size="2">
          <IonItem    onClick={e=> history.push('/home')}><img src="assets/icon/logoRSmall.png"/></IonItem>
          </IonCol>
      
          <IonCol className='hidden-md-up' size={searchText.length > 0 ? "6" : "7"}>
            <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" enterkeyhint="enter" >
            </IonSearchbar>
          </IonCol>

          <IonCol className='hidden-md-down' size={searchText.length > 0 ? "4" : "5"}>
            <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus" enterkeyhint="enter" >
            </IonSearchbar>
          </IonCol>

      
          <IonCol hidden={!(searchText.length > 0)} size="1">
            <IonButton href={"/search/" +searchText }  fill='clear' > <IonIcon icon={arrowForwardOutline}> </IonIcon> </IonButton>
          </IonCol>
  

          <IonCol className='hidden-md-down' size="1">
            <IonButton fill="clear"  href={"/submit"} className="buttonHeader" > <IonIcon icon={addOutline}> </IonIcon> </IonButton>
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
