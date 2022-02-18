import {
    IonItem,
    IonLabel,
    IonNote,
    IonCard,
    IonIcon,
    IonRow,
    IonCol,
    IonButton,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    useIonViewWillEnter,
    IonImg,
    IonInput,
    IonSlides,
    IonSlide,
    IonAccordion,
    IonList,
    IonAccordionGroup,
    IonAvatar
} from '@ionic/react';
import { Message } from '../data/messages';
import { pin, chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline, eyeOutline, thumbsUp, arrowBack, arrowForwardCircleOutline, arrowForward, trashBinOutline, checkmarkDone, warningOutline, warning } from 'ionicons/icons'
import './MessageListItem.css';
import './CommentListItem.css';
import { Reponse } from '../data/reponse';
import { useEffect, useState } from 'react';
import { getImageTypeFromStorage, getProfilFromFireStoreDBwithID, getUserImage, isMessageLiked, isProfilSaysMessageSignaled, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore, ReplyToMessageFromDBFireStore, signaledRessourceToFireStore, SignalToMessageFromDBFireStore } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from "react-pdf";
import { randomInt } from 'crypto';
import { INSPECT_MAX_BYTES } from 'buffer';
import CommentItem from './CommentItem';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface MessageListItemProps {
    message: Message;
    uid: string;
    admin: boolean;
}


const CommentListItem: React.FC<MessageListItemProps> = ({ message, uid, admin }) => {
    const [numCom, setNumCom] = useState<number>(0);
    const [reponseText, setReponse] = useState<string>("");
    const [image, setProfilPic] = useState<string>("");
    const [reponseTextSendText, setReponseSendText] = useState<string>("");
    const [reponseTextSend, setReponseSend] = useState<boolean>(false);
    const username = useSelector((state: any) => state.userData.username);

    const [isSignaled, setSignaled] = useState<Boolean>(false);
    const [signaledNumber, setSignaledNumber] = useState<number>(0);

    useEffect(() => {
        setNumCom(message.reponse.filter(r => r.text.length > 0).length);
        getUserImage('' + uid).then((d) => {
            setProfilPic(d == undefined || d.length < 3 ? "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" : d)
        })
        /*message.reponse.map(m => getProfilFromFireStoreDBwithID("" + m.idAuthor).then((data) => {
            setProfilsNames(profilsNames.concat(data.name));
               console.log(data.name)
        }))*/
    })

    function sendMessage() {
        if (reponseText?.length > 0 && reponseText?.length < 244) {
            let m = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
            ReplyToMessageFromDBFireStore("" + message.id, "" + m, reponseText, uid, username)
            setReponseSend(true)
            setReponseSendText(reponseText)
            setReponse('');
        }
    }

    function signalItem(id: string) {
        if (uid.length > 0) {
            isProfilSaysMessageSignaled(uid, "" + message.id).then(data => {
                console.log("is signaled ? " + data)
                setSignaled(data);
                if (!data) {
                    SignalToMessageFromDBFireStore('' + message.id, 1)
                    signaledRessourceToFireStore(uid, "" + message.id, true)
                    setSignaled(true);

                } else {
                    SignalToMessageFromDBFireStore('' + message.id, -1)
                    console.log("removing...")
                    signaledRessourceToFireStore(uid, "" + message.id, false)
                    setSignaled(false);

                }

            })
        }
    }

    return (message.reponse.filter(r => r.text.length > 0).length > 0 ?
        <IonAccordionGroup className='comment'>
            <IonAccordion value="colors">
                <IonItem slot="header">
                    <IonLabel>Voir le{numCom > 1 ? 's ' + numCom : ''}  commentaire{numCom > 1 ? 's' : ''}...</IonLabel>
                </IonItem>
                <IonList slot="content">
                    {message.reponse.filter(g => g.text.length > 1).map(m =>
                       <CommentItem reponse={m} idParent={""+message.id} uid={uid} admin={admin} />
                    )}
                    {reponseTextSend ?
                        < IonItem key={uid}>
                            <div className="item-content">
                                <IonLabel className='text'>{reponseTextSendText.charAt(0).toUpperCase() + reponseTextSendText.slice(1, reponseTextSendText.length)}</IonLabel>
                                <a href={"Profil/" + uid}> <IonLabel className='name'>{username}</IonLabel></a>
                            </div>
                        </IonItem> : <div />
                    }
                    < IonItem >
                        <IonInput max="244" value={reponseText} placeholder='Ecrivez votre message.. (244 caractères maximum)' onIonChange={e => setReponse(e.detail.value!)}></IonInput>
                        <IonButton onClick={e => sendMessage()}>Envoyer</IonButton>
                    </IonItem>

                </IonList>
            </IonAccordion>
        </IonAccordionGroup >
        :
        <IonAccordionGroup className='comment'>
            <IonAccordion value="colors">
                <IonItem slot="header">
                    <IonLabel>Poster un commentaire...</IonLabel>
                </IonItem>
                <IonList slot="content">
                    {reponseTextSend ?
                        < IonItem key={uid}>
                            <div className="item-content">
                                <IonLabel className='text'>{reponseTextSendText.charAt(0).toUpperCase() + reponseTextSendText.slice(1, reponseTextSendText.length)}</IonLabel>
                                <IonLabel className='name'>{'@' + uid}</IonLabel>
                            </div>
                        </IonItem> : <div />
                    }
                    < IonItem >
                        <IonInput max="244" value={reponseText} placeholder='Ecrivez votre message.. (244 caractères maximum)' onIonChange={e => setReponse(e.detail.value!)}></IonInput>
                        <IonButton onClick={e => sendMessage()}>Envoyer</IonButton>
                    </IonItem>

                </IonList>
            </IonAccordion>
        </IonAccordionGroup >
    )
}

export default CommentListItem;
