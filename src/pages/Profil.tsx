import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, locateOutline, locationOutline, personAdd } from 'ionicons/icons'
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
import { exportMessagesToDB, getProfilFromFireStoreDBwithID, getUIDCurrentUser } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { useParams } from 'react-router';



const ProfilView: React.FC = () => {

    const [busy, setBusy] = useState(true);
    const { id } = useParams<{ id: string }>();
    const [pro, setProfi] = useState<Profil>();

    useIonViewWillEnter(() => {
        if (id == undefined) {
            getUIDCurrentUser().then(data => {
                getProfilFromFireStoreDBwithID("" + data).then((f) => {
                    const profi: Profil =
                    {
                        name: f.name,
                        lastName: f.lastName,
                        firstName: f.firstName,
                        img: f.img,
                        id: f.id,
                        likes: f.likes,
                        categories: f.categories,
                        signaled: f.signaled,
                        signaled_comments: f.signaled_comments,
                        friends: f.friends,
                        family: f.family,
                        interested: f.interested,
                        admin: f.admin,
                        uid: f.uid
                    };
                    setProfi(profi)
                });
            });
        }
        else {
            getProfilFromFireStoreDBwithID("" + id).then((f) => {
                const profi: Profil =
                {
                    name: f.name,
                    lastName: f.lastName,
                    firstName: f.firstName,
                    img: f.img,
                    id: f.id,
                    likes: f.likes,
                    categories: f.categories,
                    signaled: f.signaled,
                    signaled_comments: f.signaled_comments,
                    friends: f.friends,
                    family: f.family,
                    interested: f.interested,
                    admin: f.admin,
                    uid: f.uid
                };
                setProfi(profi)
            });
        }
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
                                    <IonImg src={pro?.img}></IonImg>
                                </IonCard>
                            </IonCol>
                            <IonCol size="6" className="hidden-md-down">
                                <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                <IonCardTitle> {'@' + pro?.name}</IonCardTitle>
                                <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> {"location"}</IonCardTitle>
                            </IonCol>
                            <IonCol size="9" className="hidden-md-up">
                                <IonCard className="profile-pic">
                                    <IonImg src={pro?.img}></IonImg>
                                </IonCard>
                                <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                <IonCardTitle> {'@' + pro?.lastName}</IonCardTitle>
                                <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> {"location"}</IonCardTitle>
                            </IonCol>
                            <IonCol size="3" className="hidden-md-up">
                                <IonButton>Modifier</IonButton>
                            </IonCol>
                        </IonRow>
                    </IonCard>

                    <IonCard className="content">
                        <IonRow >
                            <IonCol size="6" >
                                <IonButton><IonIcon icon={personAdd}/>   Ajouter un ami</IonButton>
                            </IonCol>
                            <IonCol size="6" >
                            </IonCol>
                        </IonRow>
                    </IonCard>


                </IonGrid>
            </IonContent>

        </IonPage>);
};

export default ProfilView;
