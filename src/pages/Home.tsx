import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, calendar, home, homeOutline, informationCircle, locate, locationOutline, locationSharp, map, people, peopleOutline, personCircle, pinOutline } from 'ionicons/icons'
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
  IonSpinner,
  IonSlides,
  IonSlide,
  IonTabs,
  IonTabBar,
  IonBadge,
  IonTabButton,
  IonRouterOutlet,
  IonInput
} from '@ionic/react';
import './Home.css';
import HeadBar from '../components/headerBar';
import ProfilItemHeader from '../components/profilItemHeader';
import { useSelector } from 'react-redux';
import { addInterestToFireStore, exportMessagesToDB, getMessagesFromFireStoreDB, getProfilFromFireStoreDB, getProfilFromFireStoreDBwithID, getRessourcesUserFamily, getRessourcesUserFriends, getRessourcesUserIsInterestedBy, getTopicsUserIsInterested, getUIDCurrentUser, LikeToMessageFromDBWithoutCategory } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { Route, Redirect } from 'react-router';



const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesFriends, setFriendsMessages] = useState<Message[]>([]);
  const [messagesFamily, setFamilyMessages] = useState<Message[]>([]);
  const [scrollA, setScrollA] = useState<number>();
  const [scrollB, setScrollB] = useState<number>();
  const [scrollC, setScrollC] = useState<number>();
  const [profil, setProfil] = useState<Profil>();
  const [pageNumber, setPageNumber] = useState(1);
  const [busy, setBusy] = useState(true);
  const username = useSelector((state: any) => state.userData.username)
  const [userUID, setUID] = useState<string>("");
  const [interest, setInterest] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [pro, setProfi] = useState<Profil>();
  const profilIMG = useSelector((state: any) => state.userData.profilImg)
  const location = useSelector((state: any) => state.userData.location)

  useIonViewWillEnter(() => {
    getUIDCurrentUser().then(data => {
      setUID("" + data);
      getProfilFromFireStoreDBwithID("" + data);
      getRessourcesUserIsInterestedBy("" + data).then((d) => {
        setMessages(d)
        setBusy(false)
      });
      getRessourcesUserFriends("" + data).then((d) => {
        setFriendsMessages(d)
        console.log(d)

        setBusy(false)
      });
      getRessourcesUserFamily("" + data).then((d) => {
        setFamilyMessages(d)
        console.log(d)
        setBusy(false)
      });

    });
    getContent()?.scrollToTop(500);

  });

  useEffect(() => {

  })

  const slideOpts = {
    initialSlide: 2,
    speed: 400,
    lockSwipes: true,
    loop: true,
    allowTouchMove: false
  };

  function changePage(numpage: number) {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    switch (pageNumber) {
      case 0:
        setScrollA(top);
        break;
      case 1:
        setScrollB(top);
        break;
      case 2:
        setScrollC(top);
        break;
    }
    setPageNumber(numpage);
    window.scrollTo(0, 0);
    scrollToTop();
  }

  function getContent() {
    return document.querySelector('ion-content');
  }

  function scrollToTop() {
    getContent()?.scrollToTop(500);
  }

  function setInterestedBy(subject: string) {
    addInterestToFireStore(userUID, subject, true)
    setInterest("")

  }

  return (
    <IonPage className="home" id="home-page">
      <HeaderBar />
      <IonContent fullscreen>
        <IonCard className='search-for-cat'>
          <IonRow  hidden={pageNumber != 2}>
            <IonInput onIonChange={e => setInterest(e.detail.value!)} value={interest}></IonInput>
            <IonButton onClick={e => setInterestedBy(interest)} fill='outline'>Suivre</IonButton>
          </IonRow>
        </IonCard>

        <IonGrid>
          <IonRow>
            <IonCol className="hidden-md-down" size="3"> {profil != undefined ? <ProfilItem profil={profil} /> : <div></div>} </IonCol>
            <IonCol size="12">
              <IonSlide hidden={pageNumber != 0}>
                <IonList className='feed'>
                  {messagesFamily.sort((a, b) => a.precise_date - b.precise_date).map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""} admin={false}> {m.category}</MessageListItem>)}
                </IonList>
              </IonSlide>
              <IonSlide hidden={pageNumber != 1}>
                <IonList className='feed'>
                  {messagesFriends.sort((a, b) => a.precise_date - b.precise_date).map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""} admin={false}> {m.category}</MessageListItem>)}
                </IonList>
              </IonSlide>
              <IonSlide hidden={pageNumber != 2}>


                <IonList className='feed'>
                  {messages.sort((a, b) => a.precise_date / a.like + b.precise_date / b.like).map(m => <MessageListItem key={m.id} message={m} uid={userUID != undefined ? userUID : ""} admin={false}> {m.category}</MessageListItem>)}
                </IonList>
              </IonSlide>

            </IonCol>
          </IonRow>

        </IonGrid>
        <IonItem className="footer-home-page">
          <IonButton fill="clear" onClick={e => changePage(0)}>{pageNumber == 0 ? <IonIcon icon={home} /> : <IonIcon icon={homeOutline} />}</IonButton>
          <IonButton fill="clear" onClick={e => changePage(1)}>{pageNumber == 1 ? <IonIcon icon={people} /> : <IonIcon icon={peopleOutline} />}</IonButton>
          <IonButton fill="clear" onClick={e => changePage(2)}> {pageNumber == 2 ? <IonIcon icon={locationSharp} /> : <IonIcon icon={locationOutline} />} </IonButton>
        </IonItem>
      </IonContent>

    </IonPage>);
};

export default Home;
