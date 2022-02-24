import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading, IonAvatar } from '@ionic/react';
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
import './Login.css'

toast.configure()
 
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

    const notify = ()=>{
        toast('Hello Geeks 4',
           {position: toast.POSITION.BOTTOM_LEFT})
        toast('Hello Geeks 6',
           {position: toast.POSITION.BOTTOM_RIGHT})
        toast('Hello Geeks 5',
           {position: toast.POSITION.BOTTOM_CENTER})
        toast('Hello Geeks 1',
           {position: toast.POSITION.TOP_LEFT})
        toast('Hello Geeks 3',
           {position: toast.POSITION.TOP_RIGHT})
        toast('Hello Geeks 2',
           {position: toast.POSITION.TOP_CENTER})
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
    const res : any = await loginUser(email, password);
    setBusy(false);
    if(res != "undefined"){
      dispatch(setUserState(res));
      history.push('/home');

    }
    
  //  if(!false)
 // presentToast("dede");
 
    console.log(`${res}`);
    }
  }

  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Connexion</IonTitle>
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
            <IonAvatar>
              <img src="assets/icon/logoRSmall.png"></img>
            </IonAvatar>
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
                  En cliquant sur se connecter vous acceptez nos <a target="_blank" href="https://firebasestorage.googleapis.com/v0/b/ressourcesrelationelles-d94f1.appspot.com/o/static%2FCGU.pdf?alt=media&token=2a1085b7-67c1-44f5-8c3d-387b6ae20ffa">conditions d'utilisations</a>.
              </p>
              <IonButton  onClick={Logged}>Se connecter</IonButton>
              <p style={{ fontSize: "medium" }}><Link to="reset_password">Mot de passe oublié</Link></p>
              <p style={{ fontSize: "medium" }}>
                  Vous n'avez pas de compte? <Link to="register">Créez votre compte!</Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
