

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
import { useParams } from 'react-router';
import '../pages/Submit.css';

function SubmitPopOver() {
  return (
   
    <IonCard  className="Submit ion-text-wrap ">
    
      <IonCardContent>
        
         <IonRow>
            <IonCol>
              <IonItem>
              <IonCardTitle> Ajouter une ressource</IonCardTitle>
                <IonLabel position="floating"> Titre</IonLabel>
                <IonInput type="text" placeholder=""></IonInput>
              </IonItem>
        
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>          
                <IonTextarea rows={6} spellcheck placeholder="Ecrivez votre message"></IonTextarea>
            </IonItem>
               <IonItem>              
                </IonItem>
               </IonCol>
              </IonRow>


            <IonRow>
              <IonCol>
              <IonItem>
               
                <IonInput type="text" placeholder="Catégories"></IonInput>
                <IonButton expand="block" > Ajouter un Fichier   <IonIcon  icon={documentAttachSharp} /></IonButton>
              </IonItem>
              </IonCol>
            
              
          </IonRow>

  
     
    </IonCardContent>
    <IonButton className="button-submit" color="success" expand="block" > Soumettre</IonButton>
  </IonCard>


        )
}

export default SubmitPopOver;
