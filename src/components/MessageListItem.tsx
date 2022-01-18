import {
  IonItem,
  IonLabel,
  IonNote,
  IonCard, 
  IonIcon, 
  IonButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
  } from '@ionic/react';
import { Message } from '../data/messages';
import { pin } from 'ionicons/icons'
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
      <img src= {message.img} />
    </IonCard>
  </IonItem>
  );
};

export default MessageListItem;
