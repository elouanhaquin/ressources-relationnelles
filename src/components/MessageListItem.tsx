import {
  IonItem,
  IonLabel,
  IonNote,
  IonCard, 
  IonIcon, 
  IonRow,
  IonCol,
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
  } from '@ionic/react';
import { Message } from '../data/messages';
import { pin , chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline, eyeOutline} from 'ionicons/icons'
import './MessageListItem.css';
import { Reponse } from '../data/reponse';

interface MessageListItemProps {
  message: Message;
}

interface ReponseItem {
  
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message}) => {
  return (
    <IonItem   slot="start" routerLink={`/message/${message.id}`} detail={false}>
      <IonCard  className="ion-text-wrap full-width">
     
      <IonCardHeader>
        <IonCardTitle> {message.subject}</IonCardTitle>
        <IonCardSubtitle className="date" >{message.category}</IonCardSubtitle>
        <IonCardSubtitle >{message.fromName}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        {message.content}
      </IonCardContent>
      <IonRow class="">
      
            <IonItem><IonIcon  icon={thumbsUpOutline}></IonIcon><h3>{message.like}</h3></IonItem>
            <IonItem><IonIcon  icon={eyeOutline}></IonIcon><h3>{message.dislike}</h3></IonItem>
            <IonItem><IonIcon  icon={chatboxOutline}></IonIcon><h3>{message.reponse.idMessage} réponses</h3></IonItem>
            <IonItem><IonIcon  icon={shareSocialOutline}></IonIcon><h3>Partager</h3></IonItem>
            <IonItem><IonIcon  icon={bookmarkOutline}></IonIcon><h3>Sauvegarder</h3></IonItem>
     
    </IonRow>
      <img src= {message.img} />
    </IonCard>
   
  </IonItem>
  );
};

export default MessageListItem;
