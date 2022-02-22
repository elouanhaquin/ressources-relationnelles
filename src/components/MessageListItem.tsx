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
import { pin, chatboxOutline, giftOutline, shareSocialOutline, bookmarkOutline, thumbsUpOutline, thumbsDownOutline, eyeOutline, thumbsUp, arrowBack, arrowForwardCircleOutline, arrowForward, removeOutline, trashOutline, checkmarkDoneOutline, warningOutline, warning, checkmarkDone, bookmarkSharp } from 'ionicons/icons'
import './MessageListItem.css';
import { Reponse } from '../data/reponse';
import { useEffect, useState } from 'react';
import { DeleteRessoucesToDBFireStore, getImageTypeFromStorage, isMessageLiked, isMessageSaved, isMessageSignaled, isProfilSaysMessageSignaled, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore, ModifyReponse, RemoveSavedMessageFromDBFireStore, SavedMessageFromDBFireStore, signaledRessourceToFireStore, SignalToMessageFromDBFireStore, validateRessourceToFireStore } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from "react-pdf";
import CommentListItem from './CommentListItem';
import { randomInt } from 'crypto';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';
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
              <Page pageNumber={i + 1} />
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
  const [isOwnMessage, setIsOwn] = useState<Boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [modify, setModify] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");



  useEffect(() => {
    if (busy) {
      setIsOwn("" + message.fromId == uid)
      isMessageSignaled("" + message.id).then((d) => {
        setSignaledNumber(d)
        isMessageLiked(uid, "" + message.id).then(data => {
          showRessourceImageOrPdf();
          setLike(data);
          setBusy(false);
        });
      });
      isMessageSaved(uid ,"" + message.id).then((d) =>{
        setIsSaved(d)
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


  function deleteOwnItem(id: string) {
    if (isOwnMessage) {
      DeleteRessoucesToDBFireStore(id)
      setShow(false);

    }
  }

  function validateItem() {
    if (uid.length > 0) {
      validateRessourceToFireStore("" + message.id);
      setShow(false);

    }
  }
  function modifyItem() {
    if (uid.length > 0) {
      var isModified = !modify;
      setModify(!modify)
      //when we've been modifyng something
      if (!isModified && modify) {
        console.log("HHEEEY")
        ModifyReponse("" + message.id, title.length > 0 ? title : message.subject, category.length > 0 ? category.toLowerCase() : message.category.toLowerCase(), description.length > 0 ? description : message.content)
      }
    }
  }
  function saveItem() {
    if (uid.length > 0) {
      if(!isSaved){
        SavedMessageFromDBFireStore(uid, '' + message.id)
        setIsSaved(true)
      }
      else{
        RemoveSavedMessageFromDBFireStore(uid, '' + message.id)
        setIsSaved(false)
      }
    }
  }


  return (!busy && show ?
    <IonItem className="message-list-item" slot="start" detail={false}>
      <IonCard className="ion-text-wrap full-width">
        <IonCardHeader>
          <IonCardTitle hidden={modify}> {message.subject}</IonCardTitle>  <IonInput hidden={!modify} value={title.length > 0 ? title : message.subject} onIonChange={e => setTitle(e.detail.value!)}> </IonInput>
          <IonCardSubtitle hidden={modify} className="date" >{message.category.toUpperCase()}</IonCardSubtitle> <IonInput hidden={!modify} onIonChange={e => setCategory(e.detail.value!)} value={category.length > 0 ? category.toUpperCase() : message.category.toUpperCase()} className="date"> </IonInput>
          <IonCardSubtitle >{message.fromName}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonCardSubtitle hidden={modify} >{message.content}</IonCardSubtitle> <IonInput hidden={!modify} value={description.length > 0 ? description : message.content} onIonChange={e => setDescription(e.detail.value!)}> </IonInput>

          {isPDF && message.img && !display ?
            <div>

              <Carousel message={message} uid={uid} admin={admin} />


            </div>
            : !isPDF && message.img ?
              <img src={message.img} /> : <div />}
        </IonCardContent>

        {!admin && !isOwnMessage ?
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
            <IonItem onClick={e => saveItem()}><IonIcon icon={isSaved ?bookmarkSharp :  bookmarkOutline}></IonIcon><h3 className="hidden-md-down">Sauvegarder</h3></IonItem>
          </IonRow>
          :
          <IonRow class="footer" >

            {!isOwnMessage ? <IonButton expand="block" color='success' onClick={e => validateItem()}><IonIcon icon={checkmarkDoneOutline} /> Valider <IonIcon icon={checkmarkDoneOutline} /></IonButton> : <div />}
            <IonButton expand="block" fill="clear" onClick={e => modifyItem()}> Modifier </IonButton><IonButton expand="block" color='danger' onClick={e => deleteItem()}><IonIcon icon={trashOutline} /> Supprimer <IonIcon icon={trashOutline} /></IonButton>
          </IonRow>

        }

        <CommentListItem message={message} uid={uid} admin={admin} />


      </IonCard>

    </IonItem> : <div></div>

  );
};

export default MessageListItem;
