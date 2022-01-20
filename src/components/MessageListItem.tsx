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
import { pin , chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline} from 'ionicons/icons'
import './MessageListItem.css';

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  return (
    <IonItem   slot="start" routerLink={`/message/${message.id}`} detail={false}>
      <IonCard  className="ion-text-wrap full-width">
     
      <IonCardHeader>
        <IonCardSubtitle> {message.subject}</IonCardSubtitle>
        <IonCardTitle>{message.fromName}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {message.content}
      </IonCardContent>
      <IonRow class="">
      
            <IonItem><IonIcon  icon={thumbsUpOutline}></IonIcon><h3>460</h3></IonItem>
            <IonItem><IonIcon  icon={thumbsDownOutline}></IonIcon><h3>39</h3></IonItem>
            <IonItem><IonIcon  icon={chatboxOutline}></IonIcon><h3>50 réponses</h3></IonItem>
            <IonItem><IonIcon  icon={shareSocialOutline}></IonIcon><h3>Partager</h3></IonItem>
            <IonItem><IonIcon  icon={bookmarkOutline}></IonIcon><h3>Sauvegarder</h3></IonItem>
     
    </IonRow>
      <img src= {message.img} />
    </IonCard>
   
  </IonItem>
  );
};

export default MessageListItem;
