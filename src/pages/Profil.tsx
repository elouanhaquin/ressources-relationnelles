import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, locateOutline, locationOutline } from 'ionicons/icons'
import {
    IonContent,
    IonHeader,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter,
    useIonViewDidEnter,
    IonSearchbar,
    IonCard,
    IonButton,
    IonLabel,
    IonAvatar,
    IonIcon,
    IonSpinner,
    IonImg,
    IonCardSubtitle,
    IonCardTitle
} from '@ionic/react';
import './Profil.css';
import HeadBar from '../components/headerBar';
import ProfilItemHeader from '../components/profilItemHeader';
import { useSelector } from 'react-redux';
import { exportMessagesToDB, getMessagesFromDB } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';



const ProfilView: React.FC = () => {

    const [busy, setBusy] = useState(true);

    const username = useSelector((state: any) => state.userData.username)
    const profilIMG = useSelector((state: any) => state.userData.profilImg)
    const location = useSelector((state: any) => state.userData.location)


    return (
        <IonPage className="profil" id="profil-page">
            <HeaderBar />
            <IonContent fullscreen>
                <IonGrid>
                    <IonCard className="content">

                        <IonRow >
                            <IonCol size="6" className="hidden-md-down">
                                <IonCard className="profile-pic">
                                    <IonImg src={profilIMG}></IonImg>
                                </IonCard>
                            </IonCol>
                            <IonCol size="6" className="hidden-md-down">
                                <IonCardTitle> {username}</IonCardTitle>
                                <IonCardTitle> {'@' + username}</IonCardTitle>
                                <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> { location}</IonCardTitle>
                            </IonCol>
                            <IonCol size="9" className="hidden-md-up">
                                <IonCard className="profile-pic">
                                    <IonImg src={profilIMG}></IonImg>
                                </IonCard>
                                <IonCardTitle> {username}</IonCardTitle>
                                <IonCardTitle> {'@' + username}</IonCardTitle>
                                <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> { location}</IonCardTitle>
                            </IonCol>
                            <IonCol size="3" className="hidden-md-up">
                                <IonButton>Modifier</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCard>

                </IonGrid>
            </IonContent>

        </IonPage>);
};

export default ProfilView;
