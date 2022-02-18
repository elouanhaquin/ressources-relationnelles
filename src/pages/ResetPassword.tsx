import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React, { useRef, useState } from 'react';
import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { IonItem, IonLabel, IonInput, IonButton, IonIcon, IonAlert } from '@ionic/react';
import {loginUser, resetPassword} from '../firebaseConfig'
import { setUserState } from '../reducers/action';
import { useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
//import {presentToast} from '../toast'
 
function validateEmail(email: string) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

const ResetPassword: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("ressources@relationelles.fr");
  const [iserror, setIserror] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const recaptchaRef: any = React.createRef();
  const dispatch = useDispatch();
  async function presentToast(message : string, duration = 2000){
    const toast =  document.createElement('ion-toast');
    toast.message = 'Your settings have been saved.';
    toast.duration = 2000;
  
    document.body.appendChild(toast);
    if(toast)
    console.log(toast);
    
       //return toast.present();
  }

  async function AskForPwdReset() {
    if (email == "ressources@relationelles.fr" || email == "") {
      setMessage("Entrez une adresse email");
      setIserror(true);
      setBusy(false);
      return;
    }

    if(!(recaptchaRef.current.getValue())){
      setMessage("Validez le ReCaptcha");
      setIserror(true);
      setBusy(false);
        return;
    }
    else {
      setBusy(false);
      const res : any = await resetPassword(email);
      console.log(res);
      if(res) {
        history.push('/Login');
      }
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Demande de réinitialisation du mot de passe</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonLoading message="Attendez s'il-vous-plait" duration={0} isOpen={busy}></IonLoading>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonGrid>
        <IonRow>
          <IonCol>
            <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass="my-custom-class"
                header={"Erreur !"}
                message={message}
                buttons={["J'ai compris"]}
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonIcon
                style={{ fontSize: "70px", color: "#0040ff" }}
                icon={personCircle}
            />
          </IonCol>
        </IonRow>
          <IonRow>
            <IonCol>
            <IonItem>
            <IonLabel position="floating"> Email</IonLabel>
            <IonInput
                type="email"
                placeholder={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>            
          <IonRow>       
            <IonCol>
            <div style={{display:"inline-block"}}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdrNIQeAAAAAKwFXn5c9xCjy5KfdwCkipOpVtPn"
              />
            </div>
            </IonCol>        
          </IonRow>

          <IonRow>    
            <IonCol>
              <IonButton onClick={AskForPwdReset}>Reinitialiser mon mot de passe</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
