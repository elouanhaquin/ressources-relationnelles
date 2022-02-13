
import {
  IonContent,
  IonHeader,
  IonItem,
  IonInput,
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
  IonNote,
  IonButton,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonTextarea,
  IonText
} from '@ionic/react';

import { documentAttachSharp, documentOutline, imageOutline, videocamOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Message } from '../data/messages';
import { exportMessageToDB, getCurrentUser } from '../firebaseConfig';

import './Submit.css';


function getDate() {
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const output = day + ' '+ month + ' ' + year;

  return output;
}

function Submit() {

  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  function submitMessage() {
    console.log("hey")
    getCurrentUser().then((user: any) => {
      if (user) {
        //I'm logged in
        const messages: Message =
        {
          fromName: user.email,
          subject: title,
          category: tags,
          content: message,
          img: "",
          like: 0,
          views: 0,
          date: "" + getDate(),
          id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
          reponse: { id: 0, idAuthor: 0, idMessage: 0, text: "" }
        }
        exportMessageToDB(messages);
      }

    })

  }

  return (
    <IonItem className="Submit">
      <IonCard className="ion-text-wrap full-width">

        <IonCardContent>

          <IonRow>
            <IonCol size="12" className="title">
              <IonItem>
                <IonCardTitle> Ajouter une ressource</IonCardTitle>
                <IonLabel position="floating"> Titre</IonLabel>
                <IonInput type="text" placeholder="" value={title} onIonChange={e => setTitle(e.detail.value!)}></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonTextarea rows={6} spellcheck placeholder="Ecrivez votre message" value={message} onIonChange={e => setMessage(e.detail.value!)}></IonTextarea>
              </IonItem>
              <IonItem>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput type="text" placeholder="Catégories (jusqu'à 4 catégories)" value={tags} onIonChange={e => setTags(e.detail.value!)}></IonInput>
                <input type="file" name="" id="" />

              </IonItem>
            </IonCol>
          </IonRow>
          {!(title?.length <= 5 || message?.length <= 5 || tags?.length <= 0) ? <IonButton className="button-submit" color="success" expand="block" onClick={submitMessage}> Soumettre</IonButton> : <IonButton className="button-submit" color="success" expand="block" disabled > Ecrivez un titre, un message et une catégorie</IonButton>}
        </IonCardContent>
      </IonCard>
    </IonItem>

  )
}

export default Submit;
