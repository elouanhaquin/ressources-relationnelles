import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useState } from 'react';
import { Message, getMessages } from '../data/messages';
import { addOutline } from 'ionicons/icons'
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
  useIonViewDidEnter,
  IonSearchbar,
  IonCard,
  IonButton,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonSpinner
} from '@ionic/react';
import './Home.css';
import HeadBar from '../components/headerBar';
import ProfilItemHeader from '../components/profilItemHeader';
import { useSelector } from 'react-redux';
import { exportMessagesToDB, getMessagesFromDB } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';

const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [profil, setProfil] = useState<Profil[]>([]);
  const [busy, setBusy] = useState(true);

  const username = useSelector((state: any) => state.userData.username)

  useIonViewWillEnter(() => {
    getMessagesFromDB()
    const msgs = getMessages();
    setMessages(msgs);
    setBusy(false)
    const prfl = getProfil();
    setProfil(prfl);
  });


  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      const msgs = getMessages();
      setMessages(msgs);
      e.detail.complete();


    }, 1000);
  };


  return (
    <IonPage id="home-page">
      <IonHeader className="padding-headbar" slot="fixed">
        <IonGrid>
          <IonRow>
            <IonCol size="4">
              <img src="assets/icon/logoR.svg" width="246" height="43" />
            </IonCol>
            <IonCol size="3">
              <IonSearchbar>
                
              </IonSearchbar>
            </IonCol>
            <IonCol size="3">
              <IonButton routerLink={`/submit/`} className="buttonHeader" > <IonIcon icon={addOutline}> </IonIcon> </IonButton>

            </IonCol>
            <IonCol size="2">
              {profil.map(m => <ProfilItemHeader key={m.id} profil={m} />)}
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonHeader>
      <IonContent fullscreen>


        <IonHeader collapse="condense">

          <IonToolbar>
            <IonTitle size="large">
              ResRel
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonGrid>
          <IonRow>
            <IonCol size="3"> {profil.map(m => <ProfilItem key={m.id} profil={m} />)} </IonCol>
            <IonCol size="6"> <IonList>
              {profil.map(m => <AddMessage key={m.id} profil={m} />)}
              {busy ? <IonSpinner /> : messages.map(m => <MessageListItem key={m.id} message={m} />)}
            </IonList> </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>

    </IonPage>);
};

export default Home;
