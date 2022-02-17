
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
import firebase from 'firebase';

import { documentAttachSharp, documentOutline, imageOutline, videocamOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useParams } from 'react-router';
import HeaderBar from '../components/headerBar';
import { Message } from '../data/messages';
import { exportMessageToDB, exportMessageToFireStoreDB, getCurrentUser, uploadImageToStorage } from '../firebaseConfig';
import { useHistory } from "react-router-dom";
import './Submit.css';


function getDate() {
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const output = day + ' ' + month + ' ' + year;

  return output;
}



function Submit() {

  const history = useHistory();
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string>("");


  function submitMessage() {
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
          reponse: [{ id: 0, idAuthor: 0, idMessage: 0, text: "" }]
        }
       // uploadImageToStorage(selectedImage, selectedImage.toLowerCase().split("\\")[selectedImage.toLowerCase().split("\\").length-1])
        //uploadImageToStorage(imageAsFile, selectedImage.toLowerCase().split("\\")[selectedImage.toLowerCase().split("\\").length-1] )

        exportMessageToFireStoreDB(messages);
        history.push("/home");
      }

    })

  }

  return (
    <IonPage>
      <HeaderBar />
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
                  <IonInput type="text" placeholder="Catégorie" value={tags} onIonChange={e => setTags(e.detail.value!.toLowerCase())}></IonInput>
                  <input type="file" accept="image/*,.pdf" name="" id="upload-file"  onChange={(event) => { setSelectedImage(event.target.value!);}} />
                </IonItem>
              </IonCol>
            </IonRow>
            {!(title?.length <= 5 || message?.length <= 5 || tags?.length <= 0) ? <IonButton className="button-submit" color="success" expand="block" onClick={submitMessage}> Soumettre</IonButton> : <IonButton className="button-submit" color="success" expand="block" disabled > Ecrivez un titre, un message et une catégorie</IonButton>}
          </IonCardContent>
        </IonCard>
      </IonItem>
    </IonPage>
  )
}

export default Submit;
