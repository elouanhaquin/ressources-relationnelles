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
import { exportMessagesToDB, getProfilFromFireStoreDBwithID } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { useParams } from 'react-router';



const ProfilView: React.FC = () => {

    const [busy, setBusy] = useState(true);
    const { id } = useParams<{id: string}>();
    const [pro, setProfi] = useState<Profil>();
    const username = useSelector((state: any) => state.userData.username)
    const profilIMG = useSelector((state: any) => state.userData.profilImg)
    const location = useSelector((state: any) => state.userData.location)

    useIonViewWillEnter(() => {
        getProfilFromFireStoreDBwithID(id).then((data) => {
            const profi: Profil =
            {
                name: data.name,
                lastName: data.lastName,
                firstName: data.firstName,
                img: data.img,
                id: data.id
            };
            setProfi(profi)
        });

      });
    

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
                                <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                <IonCardTitle> {'@' + username}</IonCardTitle>
                                <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> { location}</IonCardTitle>
                            </IonCol>
                            <IonCol size="9" className="hidden-md-up">
                                <IonCard className="profile-pic">
                                    <IonImg src={profilIMG}></IonImg>
                                </IonCard>
                                <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                <IonCardTitle> {'@' + pro?.lastName}</IonCardTitle>
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
