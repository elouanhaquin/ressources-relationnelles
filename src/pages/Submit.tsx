
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
    IonTextarea
} from '@ionic/react';

import { send, documentOutline, imageOutline, videocamOutline } from 'ionicons/icons';
import { useParams } from 'react-router';
import './Submit.css';

function Submit() {
  return (
    <IonItem className="Submit">    <IonCard  className="ion-text-wrap full-width">
     
    <IonCardHeader>
      <IonCardTitle> Ajouter une ressource</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
         <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Titre</IonLabel>
                <IonInput type="text" placeholder="Titre"></IonInput>
              </IonItem>
        
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Texte</IonLabel>
                <IonTextarea rows={6} spellcheck placeholder="Bonjour à tous, je suis très heureux de vous partager la nouvelle..."></IonTextarea>
                
              
               </IonItem>
               </IonCol>
              </IonRow>


            <IonRow>
              <IonCol>
              <IonItem>
                <IonLabel position="floating"> Catégorie</IonLabel>
                <IonInput type="text" placeholder="Nature"></IonInput>
           
              </IonItem>
              </IonCol>
            
              
          </IonRow>
      
     <IonRow className="center-things footer">
        <IonCol >
                <IonItem>
                  <IonButton expand="block" ><IonIcon slot="icon-only" icon={imageOutline} /></IonButton>
                  <IonButton expand="block" ><IonIcon slot="icon-only" icon={documentOutline} /></IonButton>
                  <IonButton expand="block" ><IonIcon slot="icon-only" icon={videocamOutline} /></IonButton>
                </IonItem>
              </IonCol>
     </IonRow>


     
    </IonCardContent>

  </IonCard>
  </IonItem>

        )
}

export default Submit;
