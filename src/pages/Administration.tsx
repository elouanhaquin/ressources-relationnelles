import MessageListItem from '../components/MessageListItem';
import AddMessage from '../components/AddMessage';
import ProfilItem from '../components/profilItem';
import { Profil, getProfil } from '../data/profil';
import { useEffect, useState } from 'react';
import { Message, getMessages, setMessagesBDD } from '../data/messages';
import { addOutline, locateOutline, locationOutline, optionsOutline, refreshOutline, warningOutline } from 'ionicons/icons'
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
import { exportMessagesToDB, getMessagesFromFireStoreDB, getProfilFromFireStoreDBwithID } from '../firebaseConfig'
import { resolve } from 'dns';
import React from 'react';
import HeaderBar from '../components/headerBar';
import { useHistory, useParams } from 'react-router';



const Administration: React.FC = () => {

    const [busy, setBusy] = useState(true);
    const { id } = useParams<{ id: string }>();
    const [pro, setProfi] = useState<Profil>();
    const [messages, setMessages] = useState<Message[]>([]);

    const history = useHistory();

    const username = useSelector((state: any) => state.userData.username)
    const profilIMG = useSelector((state: any) => state.userData.profilImg)
    const location = useSelector((state: any) => state.userData.location)

    useIonViewWillEnter(() => {
        if (id == undefined)
            history.replace('/home');

        getProfilFromFireStoreDBwithID(id).then((data) => {
            const profi: Profil =
            {
                name: data.name,
                lastName: data.lastName,
                firstName: data.firstName,
                img: data.img,
                id: data.id,
                admin: data.admin
            };
            if (profi.admin == undefined || profi.admin == 0)
                history.replace('/home');

            getMessagesFromFireStoreDB();
            const msgs = getMessages();
            //if(messages.length != msgs.length){
            const newArray = msgs.concat(...messages);
            setMessages(newArray);
            setMessagesBDD(newArray);

            setProfi(profi)
            setBusy(false)
        });

    });
    function refresh() {
        const msgs = getMessages();
        const newArray = msgs;
        setMessages(newArray);

    }

    return (
        <IonPage className="admin" id="admin-page">
            <HeaderBar />
            <IonContent fullscreen>
                <IonGrid>
                    <IonRow>

                        <IonCol size="8">
                            <IonCard className="content">
                                <IonTitle> <IonIcon icon={optionsOutline} />  Administration :<IonCardSubtitle>Enregistré en tant que : {pro?.name}</IonCardSubtitle> </IonTitle>

                            </IonCard>
                        </IonCol>
                    </IonRow>

                    <IonRow>
                        <IonCol size="8">
                            <IonCard className="content">
                                <IonTitle> <IonIcon color="danger" icon={warningOutline} /> Liste des ressources signalées : </IonTitle>
                                <IonButton onClick={e => refresh()}> <IonIcon icon={refreshOutline}></IonIcon></IonButton>
                                <IonList >
                                    {messages.map(m => <MessageListItem key={m.id} message={m} uid={id} admin={true}> {m.category}</MessageListItem>)}
                                </IonList>

                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>

        </IonPage>);
};

export default Administration;
