import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, checkmarkDone, locateOutline, locationOutline, personAdd, removeOutline, searchOutline } from 'ionicons/icons'
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
import { acceptFriendToFireStore, addFriendToFireStore, exportMessagesToDB, getProfilFromFireStoreDBwithID, getProfilsArray, getProfilsWaitingToAccept, getProfilToAdd, getRessourcesfromUser, getRessourcesSavedByUser, getUIDCurrentUser } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { useParams } from 'react-router';



const ProfilView: React.FC = () => {

    const [busy, setBusy] = useState(true);
    const { id } = useParams<{ id: string }>();
    const [pro, setProfi] = useState<Profil>();
    const [profilsADD, setADD] = useState<Profil[]>([]);
    const [profilsWaiting, setProfilWaiting] = useState<Profil[]>([]);
    const [ressources, setRessources] = useState<Message[]>([]);
    const [savedRessources, setSavedRessources] = useState<Message[]>([]);
    const [query, setQuery] = useState<string>("");
    const [uidArray, setUidArray] = useState<string[]>([]);

    useIonViewWillEnter(() => {
        if (id == undefined) {
            getUIDCurrentUser().then(data => {
                getProfilFromFireStoreDBwithID("" + data).then((f) => {
                    setProfi(f)
                    getProfilsWaitingToAccept('' + data).then((d) => {
                        setUidArray(d)
                        getProfilsArray(d).then((data) => {

                            setProfilWaiting(data)
                        })  
                    })
                    
                    getRessourcesfromUser('' + data).then((d) => {
                        setRessources(d)
                    })

                    getRessourcesSavedByUser('' + data).then((d) => {
                        setSavedRessources(d)

                    })
                });
            });
        }
        else {
            getProfilFromFireStoreDBwithID("" + id).then((f) => {
             
                setProfi(f)
            });
        }

    
    });

    function addSomeone() {
        getProfilToAdd().then((data) => {
            setADD(data);
        })
    }

    function addFriend(friendUID: string) {
        addFriendToFireStore("" + pro?.uid, friendUID, true);
    }

    function acceptFriend(friendUID: string) {
        acceptFriendToFireStore("" + pro?.uid, friendUID, true);
    }
    function refuseFriend(friendUID: string) {
        acceptFriendToFireStore("" + pro?.uid, friendUID, false);
    }
    //todo ressources postées et sauvegardées - done
    //todo modifier ressources - IMPORTANT - WORKING
    //todo button  demande amis sur profil
    //todo recherche working - IMPORTANT 
    //todo css - IMPORTANT 
    //supprimer utilisateur - IMPORTANT 
    //modifier user - IMPORTANT 

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
                                <IonCardTitle> {'@' + pro?.lastName}</IonCardTitle>
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

                    <IonCard className="add-someone">
                        <IonCardTitle>Ils vous ont ajouté <IonBadge color="secondary">{profilsWaiting.length}</IonBadge> </IonCardTitle>
                        <IonRow >

                            <IonList>
                                {profilsWaiting.map(p =>
                                    <IonItem>
                                        <IonAvatar ><img src={p.img} /></IonAvatar><IonCardSubtitle>{p.name}</IonCardSubtitle> <IonButton fill="clear" onClick={e => acceptFriend(p.uid)}><IonIcon color='success' icon={checkmarkDone}></IonIcon></IonButton> <IonButton fill="clear" onClick={e => refuseFriend(p.uid)}><IonIcon color='danger' icon={removeOutline}></IonIcon></IonButton>
                                    </IonItem>
                                )}
                            </IonList>
                        </IonRow>
                    </IonCard>

                    <IonCard className="add-someone">
                        <IonCardTitle>Ajouter une connaissance</IonCardTitle>
                        <IonRow >
                            <IonInput onIonChange={e => setQuery(e.detail.value!)}></IonInput><IonButton fill="clear" onClick={e => addSomeone()}><IonIcon icon={searchOutline} />   Rechercher</IonButton>
                        </IonRow>
                        <IonRow >
                            <IonList>
                                {profilsADD.filter(p => (p.firstName?.toLowerCase().includes(query) || p.lastName?.toLowerCase().includes(query)) && p.uid != undefined && p.uid != pro?.uid && !uidArray.includes(p.uid) && query.length> 0).map(p =>
                                    <IonItem>
                                        <IonAvatar ><img src={p.img} /></IonAvatar><IonCardSubtitle>{p.name}</IonCardSubtitle> <IonButton fill="clear" onClick={e => addFriend(p.uid)}><IonIcon icon={personAdd}></IonIcon></IonButton>
                                    </IonItem>
                                )}
                            </IonList>
                        </IonRow>
                    </IonCard>

                    <IonCard hidden={ressources.length == 0} className="add-someone">
                        <IonCardTitle>Vos ressources publiées <IonBadge color="secondary">{ressources.length}</IonBadge></IonCardTitle>
                        <IonRow >
                            <IonList >
                                {ressources.map(m => <MessageListItem key={m.id} message={m} uid={id} admin={true}> {m.category}</MessageListItem>)}
                            </IonList>
                        </IonRow>
                    </IonCard>

                    <IonCard hidden={savedRessources.length == 0}  className="add-someone">
                        <IonCardTitle>Vos ressources sauvegardées <IonBadge color="secondary">{savedRessources.length}</IonBadge></IonCardTitle>
                        <IonRow >
                            <IonList>
                            {savedRessources.map(m => <MessageListItem key={m.id} message={m} uid={id} admin={true}> {m.category}</MessageListItem>)}

                            </IonList>
                        </IonRow>
                    </IonCard>

                </IonGrid>
            </IonContent>

        </IonPage>);
};

export default ProfilView;
