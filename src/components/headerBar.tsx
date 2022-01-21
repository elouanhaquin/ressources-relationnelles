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

interface HeadBar {
    profil: Profil;
  }

const HeaderBar: React.FC<HeadBar> = () =>  {
    const [profil, setProfil] = useState<Profil[]>([]);
  
    useIonViewWillEnter(() => {
      const prfl = getProfil();
      setProfil(prfl);
    });
  
    const refresh = (e: CustomEvent) => {
      setTimeout(() => {
        e.detail.complete();
      }, 3000);
    };
  
  return (
    <IonHeader className="padding-headbar"   slot="fixed">
    <IonGrid>
      <IonRow>
        <IonCol size="4">   
        <img  src="assets/icon/logoR.svg" width="246" height="43" />
        </IonCol>
        <IonCol size="3">   
         <IonSearchbar>
         </IonSearchbar> 
        </IonCol>
        <IonCol size="3">   
          <IonButton routerLink={`/submit/`}  className="buttonHeader" > <IonIcon  icon={addOutline}> </IonIcon> </IonButton>

        </IonCol>
        <IonCol size="2">   
          {profil.map(m => <ProfilItemHeader key={m.id} profil={m} />)}
        </IonCol>
      </IonRow>
    </IonGrid>
    
    </IonHeader>

  );
}

export default HeaderBar;
