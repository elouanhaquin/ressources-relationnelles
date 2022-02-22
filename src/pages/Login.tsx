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
import {loginUser} from '../firebaseConfig'
import { setUserState } from '../reducers/action';
import { useDispatch } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
 
function validateEmail(email: string) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}

const Home: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>("ressources@relationelles.fr");
  const [password, setPassword] = useState<string>("cesi");
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
  
  }

  async function Logged() {
    if (email == "ressources@relationelles.fr" || email == "") {
      setMessage("Entrez une adresse email");
      setIserror(true);
      setBusy(false);
      //recaptchaRef.reset();
      return;
    }
    if (!password) {
      setMessage("Entrez un mot de passe");
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
    setBusy(true);
    let  n =  await loginUser(email, password).then((data) => {
      console.log(data);
      return data;
    })
    setBusy(false);
      if(n != "undefined"){
        dispatch(setUserState(n));
        history.push('/home');
        toast('Bienvenue' + n,
        {position: toast.POSITION.BOTTOM_CENTER})
        setBusy(false);
        console.log(`${n}`);
      }
  //  if(!false)
 // presentToast("dede");

    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
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
            <IonItem>
              <IonLabel position="floating"> Mot de passe</IonLabel>
              <IonInput
                type="password"
                placeholder={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
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
              <p style={{ fontSize: "small" }}>
                  En cliquant sur se connecter vous acceptez nos <a href="#">conditions d'utilisations</a>.
              </p>
              <IonButton  onClick={Logged}>Login</IonButton>
              <p style={{ fontSize: "medium" }}><Link to="reset_password">Mot de passe oublié</Link></p>
              <p style={{ fontSize: "medium" }}>
                  Vous n'avez pas de compte ? <Link to="register">Inscrivez-vous !</Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
