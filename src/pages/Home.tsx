import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
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
    // const msgs = getMessages();
    // setMessages(msgs);
  //  const msgs = getMessages();
  //  setMessages([...messages, ...msgs]);
    setBusy(false)
    const prfl = getProfil();
    setProfil(prfl);
  });

  useEffect(() => {
    // manually deep compare here before updating state
    return setMessages(messages)
  }, [messages])

  function refresh() {

    const msgs = getMessages();
    //if(messages.length != msgs.length){
      const newArray = msgs.concat(...messages);
      if(newArray != msgs){
        setMessages( newArray);
        setMessagesBDD(newArray);
      }
   // }
  }


  return (
    <IonPage id="home-page">
      <IonHeader className="padding-headbar" slot="fixed">
        <IonGrid>
          <IonRow>
            <IonCol size="3">
              <img src="assets/icon/logoR.svg" width="246" height="43" />
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
      <IonContent fullscreen>


        <IonHeader collapse="condense">

          <IonToolbar>
            <IonTitle size="large">
              ResRel
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton routerLink={"/home"} onClick={refresh}> {messages.length}</IonButton>
        <IonGrid>
          <IonRow>
            
            <IonCol className="hidden-lg-down" size="3"> {profil.map(m => <ProfilItem key={m.id} profil={m} />)} </IonCol>
            <IonCol className="hidden-md-down" size="9">
              <IonList>
                {profil.map(m => <AddMessage key={m.id} profil={m} />)}
                {messages.map(m => <MessageListItem key={m.id} message={m}> {m.category}</MessageListItem>)}
              </IonList>
            </IonCol>

            <IonCol className="hidden-md-up" size="12">
              <IonList>
                {profil.map(m => <AddMessage key={m.id} profil={m} />)}
                {!busy ? messages.map(m => <MessageListItem key={m.id} message={m}> {m.category}</MessageListItem>) : <div/>}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>

    </IonPage>);
};

export default Home;
