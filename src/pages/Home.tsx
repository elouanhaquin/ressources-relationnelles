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
import { exportMessagesToDB, getCurrentUIDUserFireBase, getMessagesFromFireStoreDB, getProfilFromFireStoreDB, getProfilFromFireStoreDBwithID, LikeToMessageFromDBWithoutCategory } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';



const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [profil, setProfil] = useState<Profil[]>([]);
  const [busy, setBusy] = useState(true);
  const username = useSelector((state: any) => state.userData.username)
  const [userUID, setUID] = useState<string>("");
  const [pro, setProfi] = useState<Profil>();
  const profilIMG = useSelector((state: any) => state.userData.profilImg)
  const location = useSelector((state: any) => state.userData.location)

  useIonViewWillEnter(() => {
    

    });

  useIonViewWillEnter(() => {
    getMessagesFromFireStoreDB();
    getProfilFromFireStoreDB();
    setUID('XOlTUoiYYegdK4Ay7Ng9HhTaSHr1');
    
    // getMessagesFromDBWithCategory("chasse")
    // const msgs = getMessages();
    // setMessages(msgs);
    //  const msgs = getMessages();
    //  setMessages([...messages, ...msgs]);
    setBusy(false)
    const prfl = getProfil();
    setProfil(prfl);

    /*getProfilFromFireStoreDBwithID('id').then((data) => {
      const profi: Profil =
      {
          name: data.name,
          lastName: data.lastName,
          firstName: data.firstName,
          img: data.img,
          id: data.id
      };
      setProfi(profi)
  });*/
  });

  useEffect(() => {
    // manually deep compare here before updating state
    return setMessages(messages)
  }, [messages])

  function refresh() {
    const msgs = getMessages();
    //if(messages.length != msgs.length){
    const newArray = msgs.concat(...messages);
    setMessages(newArray);
    setMessagesBDD(newArray);
    setUID('XOlTUoiYYegdK4Ay7Ng9HhTaSHr1');
    console.log(userUID);

    // }
  }


  return (
    <IonPage id="home-page">
      <HeaderBar />
      <IonContent fullscreen>

        <IonButton routerLink={"/home"} onClick={refresh}> {messages.length}</IonButton>
        <IonGrid>
          <IonRow>

            <IonCol className="hidden-md-down" size="3"> {profil.map(m => <ProfilItem key={m.id} profil={m} />)} </IonCol>

            <IonCol className="hidden-md-down" size="9">
              <IonList>
                {profil.map(m => <AddMessage key={m.id} profil={m} />)}
                {messages.map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""}> {m.category}</MessageListItem>)}
              </IonList>
            </IonCol>

            <IonCol className="hidden-md-up" size="12">
              <IonList>
                {profil.map(m => <AddMessage key={m.id} profil={m} />)}
                {!busy ? messages.map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""}> {m.category}</MessageListItem>) : <div />}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>

    </IonPage>);
};

export default Home;
