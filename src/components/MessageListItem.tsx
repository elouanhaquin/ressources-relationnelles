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
import { Message, setMessages } from '../data/messages';
import { pin, chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline, eyeOutline, thumbsUp, arrowBack, arrowForwardCircleOutline, arrowForward, removeOutline, trashOutline, checkmarkDoneOutline, warningOutline, warning, checkmarkDone } from 'ionicons/icons'
import './MessageListItem.css';
import { Reponse } from '../data/reponse';
import { useEffect, useState } from 'react';
import { DeleteRessoucesToDBFireStore, getImageTypeFromStorage, isMessageLiked, isMessageSignaled, isProfilSaysMessageSignaled, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore, signaledRessourceToFireStore, SignalToMessageFromDBFireStore, validateRessourceToFireStore } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from "react-pdf";
import CommentListItem from './CommentListItem';
import { randomInt } from 'crypto';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface MessageListItemProps {
  message: Message;
  uid: string;
  admin: boolean
}

interface ReponseItem {

}

const arrayOfNumbers = [0, 1, 2, 3, 4, 5];

const Carousel: React.FC<MessageListItemProps> = ({ message, uid }) => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPDF, setPDF] = useState<Boolean>(false);
  const [busy, setBusy] = useState<Boolean>(true);


  function onDocumentLoadSuccess(_numPages: number) {
    setNumPages(_numPages);
    setPDF(true)
  }
  function onDocumentLoadError(e: any) {
    console.log(e)
    setPDF(false)
  }
  function changePage(numpage: number) {
    if (pageNumber + numpage > 1 && pageNumber + numpage < numPages + 1)
      setPageNumber(pageNumber + numpage);
  }
  useEffect(() => {
    if (busy) {
      setBusy(false);
    }
  });


  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  return (!busy ?
    <Document file={message.img} error="" onLoadSuccess={e => onDocumentLoadSuccess(e.numPages)} onLoadError={e => onDocumentLoadError(e)}>
      <IonSlides pager={true} options={slideOpts} onIonSlideDoubleTap={e => changePage(1)}>
        {arrayOfNumbers.map((e, i) => {
          return (
            <IonSlide  >
              <Page key={i} pageNumber={i + 1} />
            </IonSlide>)
        })}
      </IonSlides>
    </Document> : <div />)
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message, uid, admin }) => {
  const [isLike, setLike] = useState<Boolean>();
  const [isSignaled, setSignaled] = useState<Boolean>(false);
  const [signaledNumber, setSignaledNumber] = useState<number>(0);
  const [busy, setBusy] = useState<Boolean>(true);
  const [show, setShow] = useState<Boolean>(true);
  const [isPDF, setPDF] = useState<Boolean>(false);
  const [display, setDisplay] = useState<Boolean>(false);



  useEffect(() => {
    if (busy) {
      isMessageSignaled("" + message.id).then((d) => {
        console.log(d)
        setSignaledNumber(d)
        isMessageLiked(uid, "" + message.id).then(data => {
          showRessourceImageOrPdf();
          setLike(data);
          setBusy(false);
        });
      });
    }

  });

  function showRessourceImageOrPdf() {
    if (message.img.length > 1) {
      getImageTypeFromStorage('' + message.id).then(data => {
        if (data.contentType == "application/pdf") {
          setPDF(true)

        }
        else {
          setPDF(false)

        }
      })

    }

  }

  function likeItem() {
    if (uid.length > 0) {
      isMessageLiked(uid, "" + message.id).then(data => {
        console.log("is like ? " + data)
        setLike(data);
        if (!data) {
          console.log("Value of liked message : " + isMessageLiked(uid, "" + message.id))
          LikeToMessageFromDBFireStore('' + message.id, 1)
          LikeToProfilFromDBFireStore(uid, "" + message.id, true)
          setLike(true);

        } else {
          LikeToMessageFromDBFireStore('' + message.id, -1)
          console.log("removing...")
          LikeToProfilFromDBFireStore(uid, "" + message.id, false)
          setLike(false);

        }

      })
    }
  }


  function signalItem() {
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



  function deleteItem() {
    if (uid.length > 0) {
      DeleteRessoucesToDBFireStore("" + message.id);
      setShow(false);
    }
  }


  function validateItem() {
    if (uid.length > 0) {
      validateRessourceToFireStore("" + message.id);
      setShow(false);

    }
  }



  return (!busy && show ?
    <IonItem className="message-list-item" slot="start" detail={false}>
      <IonCard className="ion-text-wrap full-width">
        <IonCardHeader>
          <IonCardTitle> {message.subject}</IonCardTitle>
          <IonCardSubtitle className="date" >{message.category.toUpperCase()}</IonCardSubtitle>
          <IonCardSubtitle >{message.fromName}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonCardSubtitle >{message.content}</IonCardSubtitle>

          {isPDF && message.img && !display ?
            <div>

              <Carousel key={message.id} message={message} uid={uid} admin={admin} />


            </div>
            : !isPDF && message.img ?
              <img src={message.img} /> : <div />}
        </IonCardContent>

        {!admin ?
          <IonRow class="footer">
            <IonItem onClick={e => likeItem()}>{isLike ? <IonIcon icon={thumbsUp}></IonIcon> : <IonIcon icon={thumbsUpOutline}> </IonIcon>}<h3>{isLike ? message.like + 1 : message.like}</h3> </IonItem>
            <IonItem><IonIcon icon={eyeOutline}></IonIcon><h3>{message.views}</h3></IonItem>
            <IonItem><IonIcon icon={chatboxOutline}></IonIcon><h3>{message.reponse.filter(r => r.text.length > 0).length}</h3> <h3 className="hidden-md-down"> réponses</h3></IonItem>
            {signaledNumber != -2 ?
              <IonItem onClick={e => signalItem()} >{!isSignaled ? <IonIcon icon={warningOutline} />
                :
                <IonIcon color="danger" icon={warning} />}<h3 className="hidden-md-down">Signaler</h3></IonItem> :
              <IonItem > <IonIcon color="success" icon={checkmarkDone} /><h3 className="hidden-md-down">Validée</h3></IonItem>
            }
            <IonItem><IonIcon icon={bookmarkOutline}></IonIcon><h3 className="hidden-md-down">Sauvegarder</h3></IonItem>
          </IonRow>
          :
          <IonRow class="footer" >

            <IonButton expand="block" color='success' onClick={e => validateItem()}><IonIcon icon={checkmarkDoneOutline} /> Valider <IonIcon icon={checkmarkDoneOutline} /></IonButton>
            <IonButton expand="block" color='danger' onClick={e => deleteItem()}><IonIcon icon={trashOutline} /> Supprimer <IonIcon icon={trashOutline} /></IonButton>
          </IonRow>

        }

        <CommentListItem key={message.id} message={message} uid={uid} admin={admin}/>


      </IonCard>

    </IonItem> : <div></div>

  );
};

export default MessageListItem;
