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
import { exportMessagesToDB, getMessagesFromFireStoreDB, getProfilFromFireStoreDB, getProfilFromFireStoreDBwithID, getUIDCurrentUser, LikeToMessageFromDBWithoutCategory } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';



const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [profil, setProfil] = useState<Profil>();
  const [busy, setBusy] = useState(true);
  const username = useSelector((state: any) => state.userData.username)
  const [userUID, setUID] = useState<string>("");
  const [pro, setProfi] = useState<Profil>();
  const profilIMG = useSelector((state: any) => state.userData.profilImg)
  const location = useSelector((state: any) => state.userData.location)

  useIonViewWillEnter(() => {
    getMessagesFromFireStoreDB();
    getUIDCurrentUser().then(data => {
      setUID("" + data);
      getProfilFromFireStoreDBwithID("" + data);

    });


    // getMessagesFromDBWithCategory("chasse")
    // const msgs = getMessages();
    // setMessages(msgs);
    //  const msgs = getMessages();
    //  setMessages([...messages, ...msgs]);
 
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
    if(busy){
      const msgs = getMessages();
      //if(messages.length != msgs.length){
      const newArray = msgs.concat(...messages);
      setMessages(newArray);
      setMessagesBDD(newArray);
      getUIDCurrentUser().then(data => {
        setUID("" + data);
        getProfilFromFireStoreDBwithID("" + data);
  
      });
      setBusy(false)
    }

  })

  function refresh() {
    const msgs = getMessages();
    //if(messages.length != msgs.length){
    const newArray = msgs.concat(...messages);
    setMessages(newArray);
    setMessagesBDD(newArray);
    getUIDCurrentUser().then(data => {
      setUID("" + data);
      getProfilFromFireStoreDBwithID("" + data);

    });

    // }
  }


  return (
    <IonPage id="home-page">
      <HeaderBar />
      <IonContent fullscreen>

        <IonButton routerLink={"/home"} onClick={refresh}> {messages.length}</IonButton>
        <IonGrid>
          <IonRow>

            <IonCol className="hidden-md-down" size="3"> {profil != undefined ? <ProfilItem profil={profil} /> : <div></div>} </IonCol>

            <IonCol className="hidden-md-down" size="9">
              <IonList>
                {profil != undefined ? <ProfilItem profil={profil} /> : <div></div>}
                {messages.map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""} admin={false}> {m.category}</MessageListItem>)}
              </IonList>
            </IonCol>

            <IonCol className="hidden-md-up" size="12">
              <IonList>
                {profil != undefined ? <ProfilItem profil={profil} /> : <div></div>}
                {!busy ? messages.map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""} admin={false}> {m.category}</MessageListItem>) : <div />}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>

      </IonContent>

    </IonPage>);
};

export default Home;
