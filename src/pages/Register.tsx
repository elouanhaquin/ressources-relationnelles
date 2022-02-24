import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading, IonPicker, IonSelectOption, IonSelect, IonAvatar } from '@ionic/react';
import React, { useState } from 'react';
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
import { exportProfilToDB, getCurrentUser, loginUserGetUID, RegisterUser } from '../firebaseConfig'
import { Profil } from '../data/profil';
import { useDispatch, useSelector } from 'react-redux';
import { calendar } from 'ionicons/icons';
import ReCAPTCHA from "react-google-recaptcha";
import './Login.css'


function validateEmail(email: string) {
    const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
    return re.test(String(email).toLowerCase());
}
const Register: React.FC = () => {
  const history = useHistory();
  
  const [busy, setBusy] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("exemple@exemple.com");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [iserror, setIserror] = useState<boolean>(false);
  const [pseudo, setPseudo] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [profil, setProfil] = useState<Profil>();
  const [birthDay, setBirthDay] = useState<string>("");
  const [society, setSociety] = useState<string>("");
  const recaptchaRef: any = React.createRef();
  const [isRegistred, setIsRegistred] = useState<boolean>(false);

 async  function registration() {
  setBusy(true);
  if (!email) {
        setMessage("Entrez une adresse email valide");
        setIserror(true);
        setBusy(false);
        return;
    }
    if (validateEmail(email) === false) {
        setMessage("Votre email n'est pas valide");
        setIserror(true);
        setBusy(false);
        return;
    }

    if (!password || password.length < 6) {
        setMessage("Entrez un mot de passe valide");
        setIserror(true);
        setBusy(false);
        return;
    }

    if (password != password2) {
        setMessage("Entrez un mot de passe identique");
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

  
    
    const profi: Profil =
    {
      name: pseudo,
      lastName: lastName,
      firstName: firstName,
      img: "data.img",
      id: 0,
      likes: [],
      categories: [],
      signaled: [],
      signaled_comments: [],
      friends: [],
      friends_waiting: [],
      family: [],
      interested: [],
      admin: 0,
      uid: "0"
    };
    const res = await RegisterUser(email, password ,profi);

    loginUserGetUID(email, password).then(data=> profi.uid = data);
    
    if(res) exportProfilToDB(profi)

    setBusy(false);
    setMessage("Un mail de confirmation vous a été envoyé, merci de le consulter afin de valider votre inscription");
    setIsRegistred(true);
    history.push('/');

  };

  return (
    <IonPage id='register-page'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>S'inscrire</IonTitle>
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
            <IonAlert
                isOpen={isRegistred}
                onDidDismiss={() => setIsRegistred(false)}
                cssClass="my-custom-class"
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
            <IonLabel position="floating">Email *</IonLabel>
            <IonInput
                type="email"
                placeholder={email}
                required
                onIonChange={(e) => setEmail(e.detail.value!)}
                >
            </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
            <IonItem>
              <IonLabel position="floating">Mot de passe *</IonLabel>
              <IonInput
                type="password"
                placeholder={password}
                required
                onIonChange={(e) => setPassword(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Confirmation mot de passe *</IonLabel>
              <IonInput
                type="password"
                placeholder={password2}
                required
                onIonChange={(e) => setPassword2(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
            <IonItem>
              <IonLabel position="floating">Pseudo *</IonLabel>
              <IonInput
                type="text"
                placeholder={pseudo}
                required
                onIonChange={(e) => setPseudo(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Nom *</IonLabel>
              <IonInput
                type="text"
                placeholder={firstName}
                required
                onIonChange={(e) => setFirstName(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Prénom *</IonLabel>
              <IonInput
                type="text"
                placeholder={lastName}
                required
                onIonChange={(e) => setLastName(e.detail.value!)}
                >
              </IonInput>
            </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Date de naissance *</IonLabel>
                  <IonInput
                    type="date"
                    value={birthDay}
                    required
                    placeholder="Saisissez votre date de naissance"
                    onIonChange={(e) => setBirthDay(e.detail.value!)}
                  >
                  </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Société</IonLabel>
                  <IonInput
                  type="text"
                  placeholder={society}
                  onIonChange={(e) => setSociety(e.detail.value!)}
                  >
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol>
            <p style={{ fontSize: "small" }}>
                  * Champs obligatoires
            </p>
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
                  En cliquant sur "S'inscrire" vous acceptez nos <a href="#">conditions d'utilisation</a>.
              </p>
              <IonButton onClick={registration}>S'inscrire</IonButton>
              <p style={{ fontSize: "medium" }}>
                  Vous avez un compte ? <Link to="Login">Se connecter !</Link>
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
