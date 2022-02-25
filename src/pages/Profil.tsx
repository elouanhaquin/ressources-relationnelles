import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, checkmarkDone, createOutline, ellipsisHorizontalOutline, homeOutline, hourglassOutline, locateOutline, locationOutline, optionsOutline, peopleOutline, personAdd, personRemoveOutline, removeOutline, searchOutline, trashOutline } from 'ionicons/icons'
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
import './Profil.css';
import HeadBar from '../components/headerBar';
import ProfilItemHeader from '../components/profilItemHeader';
import { useSelector } from 'react-redux';
import { acceptFamilyToFireStore, acceptFriendToFireStore, addFriendToFireStore, deleteFriendToFireStore, DeleteProfil, exportMessagesToDB, getFamilyUser, getFriendsUser, getProfilFromFireStoreDBwithID, getProfilsArray, getProfilsWaitingToAccept, getProfilToAdd, getRessourcesfromUser, getRessourcesSavedByUser, getUIDCurrentUser, UpdateProfil } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';



const ProfilView: React.FC = () => {

    const [busy, setBusy] = useState(true);
    const { id } = useParams<{ id: string }>();
    const [pro, setProfi] = useState<Profil>();

    const [pseudo, setPseudo] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    const [profilsADD, setADD] = useState<Profil[]>([]);
    const [profilsWaiting, setProfilWaiting] = useState<Profil[]>([]);
    const [ressources, setRessources] = useState<Message[]>([]);
    const [savedRessources, setSavedRessources] = useState<Message[]>([]);
    const [query, setQuery] = useState<string>("");
    const [uid, setUID] = useState<string>("");
    const [friendRequestSent, setFriendRequest] = useState<boolean>(false);
    const [isAlreadyFriend, setAlreadyFriend] = useState<boolean>(false);
    const [isNotFriendAnymore, setNotFriendAnymore] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [modify, setModify] = useState<boolean>(false);
    const [uidArray, setUidArray] = useState<string[]>([]);


    const username = useSelector((state: any) => state.userData.username)
    const profilIMG = useSelector((state: any) => state.userData.profilImg)
    const location = useSelector((state: any) => state.userData.location)
    const age = getAgeProfilWithBirthday(pro?.birthday);

    useIonViewWillEnter(() => {
        if (id == undefined) {
            getUIDCurrentUser().then(data => {
                getProfilFromFireStoreDBwithID("" + data).then((f) => {
                    setUID(f.uid)
                    setIsAdmin(f.admin > 0)
                    setProfi(f)
                    setLastName(f.lastName);
                    setFirstName(f.firstName);
                    setPseudo(f.pseudo ?? "");
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
            getUIDCurrentUser().then(data => {
                getProfilFromFireStoreDBwithID("" + data).then((f) => {
                    setUID(f.uid)
                    getFriendsUser('' + f.uid).then((d) => {
                        if (!isAlreadyFriend)
                            setAlreadyFriend(d.includes(id))
                    })

                    getFamilyUser('' + f.uid).then((d) => {
                        if (!isAlreadyFriend)
                            setAlreadyFriend(d.includes(id))
                    })

                });
            });
            getProfilFromFireStoreDBwithID("" + id).then((f) => {
                setProfi(f)
            });

            getRessourcesfromUser('' + id).then((d) => {
                console.log(id)
                setRessources(d)
            })

        }


    });

    function addSomeone() {
        getProfilToAdd().then((data) => {
            setADD(data);
        })
    }

    function addFriend(friendUID: string) {
        addFriendToFireStore("" + uid, friendUID, true);
        addFriendToFireStore(friendUID,"" + uid,  true);
        setFriendRequest(!friendRequestSent)
    }

    function acceptFriend(friendUID: string) {
        notify();
        acceptFriendToFireStore("" + pro?.uid, friendUID, true);
        acceptFriendToFireStore("" + friendUID,""+  pro?.uid, true);
    }
    function removeFriend(friendUID: string) {
        deleteFriendToFireStore("" + uid, friendUID);
        deleteFriendToFireStore(friendUID,"" + uid );
        setNotFriendAnymore(true)
    }
    function acceptFamily(friendUID: string) {
        notify();
        acceptFamilyToFireStore("" + pro?.uid, friendUID, true);
        acceptFamilyToFireStore( friendUID,"" + pro?.uid, true);


    }
    function refuseFriend(friendUID: string) {
        acceptFriendToFireStore("" + pro?.uid, friendUID, false);
        acceptFriendToFireStore( friendUID,"" + pro?.uid, false);
    }
    function updateProfil() {
        if (uid != undefined) {
            getProfilFromFireStoreDBwithID(uid).then((p) => {
                if (pseudo != undefined && pseudo != '') { p.pseudo = pseudo; }
                if (firstName != undefined && firstName != '') { p.firstName = firstName; }
                if (lastName != undefined && lastName != '') { p.lastName = lastName; }
                UpdateProfil(uid, p);
            });
        }
    }
    function deleteProfil() {
        if (uid != undefined)
            DeleteProfil(uid)
    }


    function getAgeProfilWithBirthday(birthday: string | undefined) {
        if (birthday != undefined) {
            return Math.floor((Math.abs(Date.now() - Date.parse(birthday)) / (1000 * 3600 * 24)) / 365);
        }

    }

    const notify = ()=>{
        toast.success('🤝 Et une relation de plus ! ' , {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
    



    return (
        <IonPage className="profil" id="profil-page">
            <HeaderBar />
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow  >
                        <IonCol className='profil-it'>
                            <IonCard className="content">
                                <IonRow >
                                    {id == undefined || isAdmin ? <div>
                                        <IonCol size="6" className="hidden-md-down">
                                            <IonCard className="profile-pic">
                                                <IonImg src={pro?.img}></IonImg>
                                            </IonCard>
                                        </IonCol>
                                        <IonCol size="6" className="hidden-md-down">
                                            <IonCardTitle> {pro?.pseudo} </IonCardTitle>
                                            <IonCardTitle>
                                                <IonInput
                                                    hidden={!modify}
                                                    type="text"
                                                    value={pseudo}
                                                    onIonChange={(e) => setPseudo(e.detail.value!)}>
                                                </IonInput>
                                            </IonCardTitle>
                                            <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                            <IonCardTitle>
                                                <IonInput
                                                    hidden={!modify}
                                                    type="text"
                                                    value={firstName}
                                                    onIonChange={(e) => setFirstName(e.detail.value!)}>
                                                </IonInput>
                                            </IonCardTitle>
                                            <IonCardTitle> {pro?.lastName}</IonCardTitle>
                                            <IonCardTitle>
                                                <IonInput
                                                    hidden={!modify}
                                                    type="text"
                                                    value={lastName}
                                                    onIonChange={(e) => setLastName(e.detail.value!)}>
                                                </IonInput>
                                            </IonCardTitle>
                                            <IonCardTitle>  {age + " ans (" + pro?.birthday + ")"}</IonCardTitle>
                                            <IonCardTitle> {'@' + pro?.pseudo}</IonCardTitle>
                                            <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> {location}</IonCardTitle>
                                        </IonCol>
                                    </div> :
                                        <div>
                                            <IonCol size="6" className="hidden-md-down">
                                                <IonCard className="profile-pic">
                                                    <IonImg src={pro?.img}></IonImg>
                                                </IonCard>
                                            </IonCol>
                                            <IonCol size="6" className="hidden-md-down">
                                                <IonCardTitle> {pro?.pseudo}</IonCardTitle>
                                                <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                                <IonCardTitle> {pro?.lastName}</IonCardTitle>
                                                <IonCardTitle> {pro?.birthday}</IonCardTitle>
                                                <IonCardTitle>  {age + "ans"}</IonCardTitle>
                                                <IonCardTitle> {'@' + pro?.pseudo}</IonCardTitle>
                                                <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> {location}</IonCardTitle>
                                            </IonCol>
                                        </div>}
                                    <IonCol size="6" className="hidden-md-up">
                                        <IonCard className="profile-pic">
                                            <IonImg src={pro?.img}></IonImg>
                                        </IonCard>
                                    </IonCol>

                                    <IonCol size="9" className="hidden-md-up">
                                    <IonCardTitle> {pro?.pseudo} </IonCardTitle>
                                            <IonCardTitle>
                                                <IonInput
                                                    hidden={!modify}
                                                    type="text"
                                                    value={pseudo}
                                                    onIonChange={(e) => setPseudo(e.detail.value!)}>
                                                </IonInput>
                                            </IonCardTitle>
                                            <IonCardTitle> {pro?.firstName}</IonCardTitle>
                                            <IonCardTitle>
                                                <IonInput
                                                    hidden={!modify}
                                                    type="text"
                                                    value={firstName}
                                                    onIonChange={(e) => setFirstName(e.detail.value!)}>
                                                </IonInput>
                                            </IonCardTitle>
                                            <IonCardTitle> {pro?.lastName}</IonCardTitle>
                                            <IonCardTitle>
                                                <IonInput
                                                    hidden={!modify}
                                                    type="text"
                                                    value={lastName}
                                                    onIonChange={(e) => setLastName(e.detail.value!)}>
                                                </IonInput>
                                            </IonCardTitle>
                                            <IonCardTitle>  {age + " ans (" + pro?.birthday + ")"}</IonCardTitle>
                                            <IonCardTitle> {'@' + pro?.pseudo}</IonCardTitle>
                                            <IonCardTitle> <IonIcon icon={locationOutline}></IonIcon> {location}</IonCardTitle>
                                    </IonCol>

                                    <IonCol size="3">
                                        {id == undefined || isAdmin ? <div>
                                            <IonButton fill="clear" onClick={e => setModify(!modify)}><IonIcon icon={createOutline} /></IonButton>
                                            <IonButton hidden={!modify} color='success' onClick={e => updateProfil()}>Valider</IonButton>
                                            <IonButton color='danger' onClick={e => deleteProfil()}> <IonIcon icon={trashOutline} /></IonButton></div>
                                            : isAlreadyFriend ? <div>
                                                <IonButton hidden={isNotFriendAnymore} onClick={e => removeFriend(id)} fill="clear" color='danger'><IonIcon icon={personRemoveOutline} /></IonButton></div>
                                                : !friendRequestSent ?
                                                    <div>
                                                        <IonButton onClick={e => addFriend(id)} fill="clear"><IonIcon icon={peopleOutline} /> + </IonButton></div>
                                                    : <div>
                                                        <IonButton fill="clear"><IonIcon icon={hourglassOutline} /> </IonButton></div>}
                                        {isNotFriendAnymore ? <div>
                                            <IonButton onClick={e => addFriend(id)} fill="clear"><IonIcon icon={peopleOutline} /> + </IonButton></div> : <div></div>}
                                    </IonCol>

                                </IonRow>
                            </IonCard>
                        </IonCol>

                        <IonCol>
                            <IonCard hidden={id != null} className="add-someone">
                                <IonCardTitle>Ils vous ont ajouté <IonBadge color="secondary">{profilsWaiting.length}</IonBadge> </IonCardTitle>
                                <IonRow >

                                    <IonList>
                                        {profilsWaiting.map(p =>
                                            <IonItem>
                                                <IonAvatar ><img src={p.img} /></IonAvatar><IonCardSubtitle>{p?.pseudo}</IonCardSubtitle>
                                                <IonButton fill="clear" onClick={e => acceptFamily(p.uid)}><IonIcon color='success' icon={homeOutline}></IonIcon></IonButton>
                                                <IonButton fill="clear" onClick={e => acceptFriend(p.uid)}><IonIcon color='success' icon={peopleOutline}></IonIcon></IonButton>
                                                <IonButton fill="clear" onClick={e => refuseFriend(p.uid)}><IonIcon color='danger' icon={removeOutline}></IonIcon></IonButton>
                                            </IonItem>
                                        )}
                                    </IonList>
                                </IonRow>
                            </IonCard>

                            <IonCard hidden={id != null} className="add-someone">
                                <IonCardTitle>Ajouter une connaissance</IonCardTitle>
                                <IonRow >
                                    <IonInput onIonChange={e => setQuery(e.detail.value!)}></IonInput><IonButton fill="clear" onClick={e => addSomeone()}><IonIcon icon={searchOutline} />   Rechercher</IonButton>
                                </IonRow>
                                <IonRow >
                                    <IonList>
                                        {profilsADD.filter(p => (p.firstName?.toLowerCase().includes(query) || p.lastName?.toLowerCase().includes(query)) && p.uid != undefined && p.uid != pro?.uid && !uidArray.includes(p.uid) && query.length > 0).map(p =>
                                            <IonItem>
                                                <IonAvatar ><img src={p.img} /></IonAvatar><IonCardSubtitle>{p.pseudo??""}</IonCardSubtitle> <IonButton fill="clear" onClick={e => addFriend(p.uid)}><IonIcon icon={personAdd}></IonIcon></IonButton>
                                            </IonItem>
                                        )}
                                    </IonList>
                                </IonRow>
                            </IonCard>

                            <IonCard hidden={ressources.length == 0} className="add-someone ressources">
                                <IonCardTitle>{id == undefined ? "Vos ressources publiées" : "Ses ressources publiées"} <IonBadge color="secondary">{ressources.length}</IonBadge></IonCardTitle>
                                <IonRow >
                                    <IonList >
                                        {ressources.map(m => <MessageListItem key={m.id} message={m} uid={uid} admin={false}> {m.category}</MessageListItem>)}
                                    </IonList>
                                </IonRow>
                            </IonCard>
                            <IonCard hidden={ressources.length != 0} className="add-someone">
                                <IonCardSubtitle>Aucune ressource publiée pour le moment</IonCardSubtitle>
                            </IonCard>

                            <IonCard hidden={savedRessources.length == 0} className="add-someone  ressources ">
                                <IonCardTitle>Vos ressources sauvegardées <IonBadge color="secondary">{savedRessources.length}</IonBadge></IonCardTitle>
                                <IonRow >
                                    <IonList>
                                        {savedRessources.map(m => <MessageListItem key={m.id} message={m} uid={uid} admin={false}> {m.category}</MessageListItem>)}

                                    </IonList>
                                </IonRow>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>);
};

export default ProfilView;


