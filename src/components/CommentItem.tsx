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
import { pin, chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline, eyeOutline, thumbsUp, arrowBack, arrowForwardCircleOutline, arrowForward, trashBinOutline, checkmarkDone, warningOutline, warning, trashOutline } from 'ionicons/icons'
import './MessageListItem.css';
import './CommentListItem.css';
import './CommentItem.css';
import { Reponse } from '../data/reponse';
import { useEffect, useState } from 'react';
import { DeleteCommentToDBFireStore, getImageTypeFromStorage, getProfilFromFireStoreDBwithID, getUserImage, isMessageLiked, isProfilSaysMessageSignaled, isReponseSignaled, isReponseSignaledFromUser, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore, ReplyToMessageFromDBFireStore, setSignaledCommentToUserFirebase, signaledRessourceToFireStore, SignalToMessageFromDBFireStore, SignalToReponseFromDBFireStore } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from "react-pdf";
import { randomInt } from 'crypto';
import { INSPECT_MAX_BYTES } from 'buffer';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface MessageListItemProps {
    reponse: Reponse;
    idParent: string;
    uid: string;
    admin: boolean;
}


const CommentItem: React.FC<MessageListItemProps> = ({ reponse, idParent, uid, admin }) => {
    const [image, setProfilPic] = useState<string>("https://firebasestorage.googleapis.com/v0/b/ressourcesrelationelles-d94f1.appspot.com/o/static%2FIllustration_sans_titre.png?alt=media&token=1e53ba9a-e126-41ed-8e80-49cd3c2340d7");
    const username = useSelector((state: any) => state.userData.username);

    const [isSignaled, setSignaled] = useState<Boolean>(false);
    const [isOwnComment, setOwnComment] = useState<Boolean>(false);
    const [deleted, setDeleted] = useState<Boolean>(false);
    const [signaledNumber, setSignaledNumber] = useState<number>(0);

    useEffect(() => {
        getUserImage('' + uid).then((d) => {
            setOwnComment("" + reponse.idAuthor == uid)

            isReponseSignaledFromUser("" + reponse.id, idParent, uid).then((data) => {
                setSignaled(data)
            })
            setProfilPic(d == undefined || d.length < 3 ? image : d)
        })
    })



    function signalItem(id: string) {
        if (uid.length > 0 && !isOwnComment) {
            isReponseSignaledFromUser("" + reponse.id, idParent, uid).then((data) => {

                setSignaled(!data)
                SignalToReponseFromDBFireStore("" + reponse.id, idParent, 1 * (!data ? 1 : -1))
                setSignaledCommentToUserFirebase("" + reponse.id, idParent, uid, !data)


            })
        }
    }

    
    function deleteItem(id: string) {
        if (isOwnComment) {
            DeleteCommentToDBFireStore(idParent, id)
            setDeleted(true)
        }
    }

    return ( !deleted ? 
        < IonItem key={reponse.id} className='comment-item'>
            <IonAvatar className='avatar' >
                <IonImg src={image} />
            </IonAvatar>
            <div className="item-content">
                <IonLabel className='text'>{reponse.text.charAt(0).toUpperCase() + reponse.text.slice(1, reponse.text.length)}</IonLabel>
                <a href={"Profil/" + reponse.idAuthor}><IonLabel className='name'>{reponse.username}</IonLabel></a>
            </div>

            {isOwnComment ?
                <IonItem   className="signal" onClick={e => deleteItem("" + reponse.id)} >
                     <IonIcon color="danger" icon={trashOutline} />
                </IonItem>

                :
                signaledNumber != -2 ?
                    <IonItem className="signal" onClick={e => signalItem("" + reponse.id)} >
                        {!isSignaled ?
                            <IonIcon icon={warningOutline} />
                            :
                            <IonIcon color="danger" icon={warning} />}</IonItem> :
                    <IonItem > <IonIcon color="success" icon={checkmarkDone} /></IonItem>
            }

            {admin ? <IonRow> <IonButton color='danger'> <IonIcon icon={trashBinOutline} /></IonButton>
                <IonButton color='success'> <IonIcon icon={checkmarkDone} /></IonButton></IonRow> : <div />}

        </IonItem>: 
        <div/>

    )
}

export default CommentItem;