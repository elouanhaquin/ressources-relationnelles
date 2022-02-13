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
    <IonItem   className="message-list-item" slot="start" routerLink={`/message/${message.id}`} detail={false}>
      <IonCard  className="ion-text-wrap full-width">
     
      <IonCardHeader>
        <IonCardTitle> {message.subject}</IonCardTitle>
        <IonCardSubtitle className="date" >{message.category.toUpperCase()}</IonCardSubtitle>
        <IonCardSubtitle >{message.fromName}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonCardSubtitle >{message.content}</IonCardSubtitle>
        
        <img src= {message.img} />
      </IonCardContent>
      <IonRow class="footer">
      
            <IonItem><IonIcon  icon={thumbsUpOutline}></IonIcon><h3>{message.like}</h3></IonItem>
            <IonItem><IonIcon  icon={eyeOutline}></IonIcon><h3>{message.views}</h3></IonItem>
            <IonItem><IonIcon  icon={chatboxOutline}></IonIcon><h3>{message.reponse.idMessage}</h3> <h3 className="hidden-md-down"> réponses</h3></IonItem>
            <IonItem><IonIcon  icon={shareSocialOutline}></IonIcon><h3 className="hidden-md-down">Partager</h3></IonItem>
            <IonItem><IonIcon  icon={bookmarkOutline}></IonIcon><h3 className="hidden-md-down">Sauvegarder</h3></IonItem>
     
    </IonRow>
    
    </IonCard>
   
  </IonItem>
  );
};

export default MessageListItem;
