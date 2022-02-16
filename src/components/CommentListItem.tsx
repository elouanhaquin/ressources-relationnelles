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
import { getImageTypeFromStorage, getProfilFromFireStoreDBwithID, isMessageLiked, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore } from '../firebaseConfig';
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

    useEffect(() => {
        setNumCom(message.reponse.filter(r => r.text.length > 0).length);
       /* message.reponse.map(m => getProfilFromFireStoreDBwithID("" + m.idAuthor).then((data) => {
            setProfilsNames(profilsNames.concat(data.name));
          
        }))*/
    })

    return (message.reponse.filter(r => r.text.length > 0).length > 0 ?
        <IonAccordionGroup className='comment'>
            <IonAccordion value="colors">
                <IonItem slot="header">
                    <IonLabel>Voir le{numCom > 1 ? 's ' + numCom : ''}  commentaire{numCom > 1 ? 's' : ''}...</IonLabel>
                </IonItem>
                <IonList slot="content">
                    {message.reponse.map(m => 
                        < IonItem key={m.idAuthor}>
                            <IonLabel>{m.text}</IonLabel>
                            <IonLabel>{m.idAuthor}</IonLabel>
                        </IonItem>
                    )}

                </IonList>
            </IonAccordion>
        </IonAccordionGroup >
        :
        <div></div>
    )
}

export default CommentListItem;
