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
import { Reponse } from '../data/reponse';
import { useEffect, useState } from 'react';
import { getImageTypeFromStorage, isMessageLiked, LikeToMessageFromDBFireStore, LikeToMessageFromDBWithoutCategory, LikeToProfilFromDBFireStore } from '../firebaseConfig';
import { useSelector } from 'react-redux';
import { Document, Page, pdfjs } from "react-pdf";
import CommentListItem from './CommentListItem';
import { randomInt } from 'crypto';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface MessageListItemProps {
  message: Message;
  uid: string
}

interface ReponseItem {

}

const arrayOfNumbers = [ 0,1,2,3,4,5];

const MessageListItem: React.FC<MessageListItemProps> = ({ message, uid }) => {
  const [isLike, setLike] = useState<Boolean>();
  const [busy, setBusy] = useState<Boolean>(true);
  const [isPDF, setPDF] = useState<Boolean>(false);
  const [display, setDisplay] = useState<Boolean>(false);
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);




  function onDocumentLoadSuccess(_numPages: number) {
    setNumPages(_numPages);
    setPDF(true)
  }
  function onDocumentLoadError(e: any) {
    console.log(e)
    setPDF(false)
  }


  useEffect(() => {
    if (busy) {
      isMessageLiked(uid, "" + message.id).then(data => {
        showRessourceImageOrPdf();
        setLike(data);
        setBusy(false);
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

  function changePage(numpage: number) {
    if (pageNumber + numpage > 1 && pageNumber + numpage < numPages + 1)
      setPageNumber(pageNumber + numpage);
  }

  const slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  return (!busy ? 
    <IonItem className="message-list-item" slot="start" detail={false}>
      <IonCard className="ion-text-wrap full-width">
        <IonCardHeader>
          <IonCardTitle> {message.subject}</IonCardTitle>
          <IonCardSubtitle className="date" >{message.category.toUpperCase()}</IonCardSubtitle>
          <IonCardSubtitle >{message.fromName}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonCardSubtitle >{message.content}</IonCardSubtitle>

          {isPDF && message.img && !display?
            <div>


              <Document file={message.img} error="" onLoadSuccess={e => onDocumentLoadSuccess(e.numPages)} onLoadError={e => onDocumentLoadError(e)}>
                <IonSlides pager={true} options={slideOpts}  onIonSlideDoubleTap={e=>changePage(1) }>
                    {arrayOfNumbers.map((e, i) => {
              

                      return (
                      <IonSlide  >
                        <Page key={i} pageNumber={i + 1}  />    
                        </IonSlide>)
                    })}
                </IonSlides>
              </Document>
             
            </div>
            : !isPDF && message.img ?
              <img src={message.img} /> : <div />}
        </IonCardContent>
        <IonRow class="footer">

          <IonItem onClick={e => likeItem()}>{isLike ? <IonIcon icon={thumbsUp}></IonIcon> : <IonIcon icon={thumbsUpOutline}> </IonIcon>}<h3>{isLike ? message.like + 1 : message.like}</h3> </IonItem>
          <IonItem><IonIcon icon={eyeOutline}></IonIcon><h3>{message.views}</h3></IonItem>
          <IonItem><IonIcon icon={chatboxOutline}></IonIcon><h3>{message.reponse.filter(r => r.text.length > 0).length}</h3> <h3 className="hidden-md-down"> réponses</h3></IonItem>
          <IonItem><IonIcon icon={shareSocialOutline}></IonIcon><h3 className="hidden-md-down">Partager</h3></IonItem>
          <IonItem><IonIcon icon={bookmarkOutline}></IonIcon><h3 className="hidden-md-down">Sauvegarder</h3></IonItem>

        </IonRow>
        <CommentListItem  key={message.id} message={message} uid={uid}/>
       
  
      </IonCard>

    </IonItem> : <div></div>

  );
};

export default MessageListItem;
