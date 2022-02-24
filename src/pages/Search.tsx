import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, checkmarkDone, ellipsisHorizontalOutline, eyeOffOutline, eyeOutline, homeOutline, hourglassOutline, locateOutline, locationOutline, optionsOutline, peopleOutline, personAdd, personRemoveOutline, removeOutline, searchOutline } from 'ionicons/icons'
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
    IonCardTitle,
    IonInput,
    IonBadge
} from '@ionic/react';
import './Profil.css';
import HeadBar from '../components/headerBar';
import ProfilItemHeader from '../components/profilItemHeader';
import { useSelector } from 'react-redux';
import { acceptFamilyToFireStore, acceptFriendToFireStore, addFriendToFireStore, deleteFriendToFireStore, DeleteProfil, exportMessagesToDB, getAllProfilsArray, getFamilyUser, getFriendsUser, getProfilFromFireStoreDBwithID, getProfilsArray, getProfilsWaitingToAccept, getProfilToAdd, getRessourcesAllRessources, getRessourcesfromUser, getRessourcesSavedByUser, getUIDCurrentUser } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { useParams } from 'react-router';



const Search: React.FC = () => {

    const [busy, setBusy] = useState(true);
    const { id } = useParams<{ id: string }>();

    const [profilsADD, setADD] = useState<Profil[]>([]);
    const [ressources, setRessources] = useState<Message[]>([]);
    const [hideProfils, setHideProfils] = useState<boolean>(false);
    const [hideRessources, setHideRessources] = useState<boolean>(false);
    const [uid, setUID] = useState<string>("");


    useIonViewWillEnter(() => {

        getUIDCurrentUser().then(data => {
            getProfilFromFireStoreDBwithID("" + data).then((f) => {
                setUID(f.uid)
                getAllProfilsArray().then((data) => {
                    setADD(data)
                })

                getRessourcesAllRessources().then((data) => {
                    setRessources(data)
                })
            });
        });
    });

  


    return (
        <IonPage className="profil" id="profil-page">
            <HeaderBar />
            <IonContent fullscreen>
                <IonGrid>
                    <IonCard className="content">

                    <IonCardTitle>Recherche : {id} </IonCardTitle>


                        <IonCard  hidden={profilsADD.filter(p => (p.firstName?.toLowerCase().includes(id.toLowerCase()) || p.lastName?.toLowerCase().includes(id.toLowerCase())) && p.uid != undefined ).length == 0} className="add-someone">
                            <IonCardTitle>Profils </IonCardTitle>
                            <IonButton fill='clear' onClick={e=> setHideProfils(!hideProfils)}><IonIcon icon={ hideProfils ? eyeOffOutline: eyeOutline}/></IonButton>
                            <IonRow  hidden={hideProfils}>
                                <IonList>
                                    {profilsADD.filter(p => (p.firstName?.toLowerCase().includes(id.toLowerCase()) || p.lastName?.toLowerCase().includes(id.toLowerCase())) && p.uid != undefined ).map(p =>
                                        <IonItem  href={"/profil/" +p.uid }>
                                            <IonAvatar ><img src={p.img} /></IonAvatar><IonCardSubtitle>{p.pseudo}</IonCardSubtitle> 
                                        </IonItem>
                                    )}
                                </IonList>
                            </IonRow>
                        </IonCard>

                        <IonCard className="add-someone"  hidden={ressources.filter(p => (p.category?.toLowerCase().includes(id.toLowerCase()) || p.subject?.toLowerCase().includes(id.toLowerCase()) || p.content?.toLowerCase().includes(id.toLowerCase()))).length == 0}>
                            <IonCardTitle>Ressources </IonCardTitle>
                            <IonButton fill='clear' onClick={e=> setHideRessources(!hideRessources)}><IonIcon icon={ hideRessources ? eyeOffOutline: eyeOutline}/></IonButton>

                            <IonRow hidden={hideRessources }>
                                <IonList>
                                    {ressources.filter(p => (p.category?.toLowerCase().includes(id.toLowerCase()) || p.subject?.toLowerCase().includes(id.toLowerCase()) || p.content?.toLowerCase().includes(id.toLowerCase()))).map(p =>
                                         <MessageListItem key={p.id} message={p} uid={uid != undefined ? uid : ""} admin={false}></MessageListItem>
                                    )}
                                </IonList>
                            </IonRow>
                        </IonCard>
                    </IonCard>
                </IonGrid>
            </IonContent>

        </IonPage>);
};

export default Search;
