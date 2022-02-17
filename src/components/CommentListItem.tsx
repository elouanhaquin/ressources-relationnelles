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
    IonAccordionGroup
} from '@ionic/react';
import { Message } from '../data/messages';
import { pin, chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline, eyeOutline, thumbsUp, arrowBack, arrowForwardCircleOutline, arrowForward } from 'ionicons/icons'
import './MessageListItem.css';
import './CommentListItem.css';
import { Reponse } from '../data/reponse';
import { useEffect, useState } from 'react';
import { getImageTypeFromStorage, getProfilFromFireStoreDBwithID, isMessageLiked, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore, ReplyToMessageFromDBFireStore } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface MessageListItemProps {
    message: Message;
    uid: string
}


const CommentListItem: React.FC<MessageListItemProps> = ({ message, uid }) => {
    const [numCom, setNumCom] = useState<number>(0);
    const [profilsNames, setProfilsNames] = useState<string[]>([]);
    const [reponseText, setReponse] = useState<string>("");
    const [reponseTextSendText, setReponseSendText] = useState<string>("");
    const [reponseTextSend, setReponseSend] = useState<boolean>(false);
    const username = useSelector((state: any) => state.userData.username)

    useEffect(() => {
        setNumCom(message.reponse.filter(r => r.text.length > 0).length);
        /*message.reponse.map(m => getProfilFromFireStoreDBwithID("" + m.idAuthor).then((data) => {
            setProfilsNames(profilsNames.concat(data.name));
               console.log(data.name)
        }))*/
    })

    function sendMessage() {
        if (reponseText?.length > 0 && reponseText?.length < 244) {
            ReplyToMessageFromDBFireStore("" + message.id, reponseText, uid, username)
            setReponseSend(true)
            setReponseSendText(reponseText)
            setReponse('');
        }
    }
    function routeToUser(pathUrl: string) {

    }

    return (message.reponse.filter(r => r.text.length > 0).length > 0 ?
        <IonAccordionGroup className='comment'>
            <IonAccordion value="colors">
                <IonItem slot="header">
                    <IonLabel>Voir le{numCom > 1 ? 's ' + numCom : ''}  commentaire{numCom > 1 ? 's' : ''}...</IonLabel>
                </IonItem>
                <IonList slot="content">
                    {message.reponse.filter(g => g.text.length > 1 && g.id + 11 > message.reponse.length).map(m =>
                        < IonItem key={m.id}>
                            <div className="item-content">

                                <IonLabel className='text'>{m.text.charAt(0).toUpperCase() + m.text.slice(1, m.text.length)}</IonLabel>
                                <a href={"Profil/" + m.idAuthor}><IonLabel className='name'>{'@' + m.username}</IonLabel></a>

                            </div>
                        </IonItem>
                    )}
                    {reponseTextSend ?
                        < IonItem key={uid}>
                            <div className="item-content">
                                <IonLabel className='text'>{reponseTextSendText.charAt(0).toUpperCase() + reponseTextSendText.slice(1, reponseTextSendText.length)}</IonLabel>
                                <a href={"Profil/" + uid}> <IonLabel className='name'>{'@' + username}</IonLabel></a>
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
