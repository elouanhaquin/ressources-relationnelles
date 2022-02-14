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

const HeaderBar: React.FC = () => {
  const [profil, setProfil] = useState<Profil[]>([]);

  useIonViewWillEnter(() => {
    const prfl = getProfil();
    setProfil(prfl);
  });



  return (
      <IonHeader className="padding-headbar header-bar" slot="fixed">
        <IonGrid>
          <IonRow>
            <IonCol  size="3">
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
              {profil.map(m => <ProfilItemHeader key={m.id} profil={m} />)}
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonHeader>

      );
}

      export default HeaderBar;
