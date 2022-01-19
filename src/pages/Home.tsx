import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useState } from 'react';
import { Message, getMessages } from '../data/messages';
import { addOutline} from 'ionicons/icons'
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
  IonCard,
  IonButton,
  IonLabel,
  IonAvatar,
  IonIcon
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [profil, setProfil] = useState<Profil[]>([]);

  useIonViewWillEnter(() => {
    const msgs = getMessages();
    const prfl = getProfil();
    setMessages(msgs);
    setProfil(prfl);
  });

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page">
      <IonHeader className="dark"  slot="fixed">
      <IonGrid>
        <IonRow>
          <IonCol size="4">   
           <IonToolbar>
            <IonTitle>(Re)source Relationnelles</IonTitle>
           </IonToolbar> 
          </IonCol>
          <IonCol size="3">   
           <IonSearchbar>
           </IonSearchbar> 
          </IonCol>
          <IonCol size="4">   
          <IonButton className="buttonHeader">
            <IonIcon  icon={addOutline}> </IonIcon>

            </IonButton>
          
          </IonCol>
        </IonRow>
      </IonGrid>
      
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

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
            {messages.map(m => <MessageListItem key={m.id} message={m} />)}
            </IonList> </IonCol>
        </IonRow>
      </IonGrid> 

      </IonContent>
    
    </IonPage>
  );
};

export default Home;
