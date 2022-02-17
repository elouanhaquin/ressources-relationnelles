import { resolve } from 'dns';
import * as firebase from 'firebase'
import { Observable } from 'redux';
import { pathToFileURL } from 'url';
import { DBWrapper } from 'workbox-core/_private';
import { getMessages, setMessages, Message, setMessagesBDD } from './data/messages';
import { addProfilBBD, Profil, setProfilsBDD } from './data/profil';


const config = {
    apiKey: "AIzaSyBfxVb5gDYd1cJehGGQwD468ZeQwNx7RVM",
    authDomain: "ressourcesrelationelles-d94f1.firebaseapp.com",
    databaseURL: "https://ressourcesrelationelles-d94f1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ressourcesrelationelles-d94f1",
    storageBucket: "ressourcesrelationelles-d94f1.appspot.com",
    messagingSenderId: "1097977878736",
    appId: "1:1097977878736:web:cdaaa47ff4fbc5ab05e6d5",
    measurementId: "G-3V12PWYHY8"
}


firebase.default.initializeApp(config);
export function getCurrentUser() {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.default.auth().onAuthStateChanged(function (user) {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
            unsubscribe()
        });
    })
}


export function logoutUser() {
    return firebase.default.auth().signOut();
}

export async function loginUser(username: string, password: string) {
    try {
        const res = await firebase.default.auth().signInWithEmailAndPassword(username, password);
        return "" + res;
    }
    catch (error) {
        console.log(error);
        return "undefined";
    }
}

export async function loginUserGetUID(username: string, password: string) {
    const res = (await firebase.default.auth().signInWithEmailAndPassword(username, password)).user?.uid;
    return "" + res;
}

export async function getUIDCurrentUser() {
    const auth = firebase.default.auth();
    const user = auth.currentUser;

    return auth.currentUser?.uid;
}

export async function RegisterUser(username: string, password: string) {
    try {
         
        const res = await firebase.default.auth().createUserWithEmailAndPassword(username, password).then(cred => {
            return firebase.default.firestore().collection('profils').doc("" + cred.user?.uid).set({
                name: username,
                id: 0
            })
        });
        console.log(res);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export async function exportMessagesToDB() {
    const ref = await firebase.default.database().ref('message');
    ref.push(getMessages());
};

export async function exportMessageToDBInGivenCategory(data: Message) {
    const ref = await firebase.default.database().ref();
    ref.child('Messages').child('' + data.category).child('' + data.id).set(data);

};

export async function exportMessageToFireStoreDB(data: Message) {
    const ref = await firebase.default.firestore().collection('messages');
    ref.doc("" + data.id).set(data);
};
export async function exportProfilToFireStoreDB(data: Profil) {
    const ref = await firebase.default.firestore().collection('profils');
    ref.doc("" + data.id).set(data);
};

export async function exportMessageToDB(data: Message) {
    const ref = await firebase.default.database().ref();
    ref.child('Messages').child('' + data.id).set(data);
};


export async function exportProfilToDB(data: Profil) {
    const ref = await firebase.default.database().ref();
    ref.child('Profils').child('' + data.id).set(data);
};

export const snapshotToArray = (snapshot: any) => {
    const returnArr: any[] = []

    snapshot.forEach((childSnapshot: any) => {
        const item = childSnapshot.data()
        item.key = childSnapshot.key
        returnArr.push(item)
    });

    return returnArr;
}





/*
export const getMessagesFromDBWithoutCategory = () => {
    const ref = firebase.default.database().ref('Messages/').once('value').then((snapshot) => {
        const data = snapshotToArray(snapshot);

        const current: Message[] = data;
        console.log(current)
        setMessagesBDD(current);
    });
};


export const getMessagesFromDBWithCategory = (category: string) => {
    const ref = firebase.default.database().ref('Messages/' + category).once('value').then((snapshot) => {
        const data = snapshotToArray(snapshot);

        const current: Message[] = data;
        console.log(current)
        setMessagesBDD(current);

    });

};


export const getMessagesFromDB = () => {
    const ref = firebase.default.database().ref('Messages/chasse').once('value').then((snapshot) => {
        const data = snapshotToArray(snapshot);
        console.log(data)

        const current: Message[] = data;
        console.log(current)
        setMessagesBDD(current);

    });
};*/

export async function  uploadImageToStorage(path: Blob, imageName: string){
    let reference = firebase.default.storage().ref("ressources").child(imageName);
    let task = reference.put(path);

    return task.then(() => {
        console.log('Image uploaded to the bucket!');
        return reference.getDownloadURL() 

    }).catch((e) => console.log('uploading image error => ', e));


}

export async function  getImageTypeFromStorage(imageName: string){
    let reference = firebase.default.storage().ref("ressources").child(imageName);
    return reference.getMetadata().then(data => {
        return data;
    });

}




export const getProfilFromFireStoreDBwithID = (id: string) => {

    const te = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(te).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist! : " + "profils/" + id;
            }
            const profi: Profil =
            {
                name: sfDoc.get("name"),
                lastName: sfDoc.get("lastName"),
                firstName: sfDoc.get("firstName"),
                img: sfDoc.get("img"),
                id: Number.parseInt(id)
            };
            return profi;
        });
    })

}


export const getProfilFromFireStoreDB = () => {
    const ref = firebase.default.firestore().collection('profils').get().then((snapshot) => {
        const data = snapshotToArray(snapshot.docs);
        const current: Profil[] = data;
        console.log(current)
        setProfilsBDD(current);
    });
}

export const getMessagesFromFireStoreDB = () => {
    const ref = firebase.default.firestore().collection('messages').get().then((snapshot) => {
        const data = snapshotToArray(snapshot.docs);
        const current: Message[] = data;
        console.log(current)
        setMessagesBDD(current);
    });
}

export const LikeToMessageFromDBWithoutCategory = (id: string, like: number) => {
    var adaRankRef = firebase.default.database().ref('Messages/' + id + '/like');
    adaRankRef.transaction(function (currentRank) {
        // If users/ada/rank has never been set, currentRank will be `null`.
        return currentRank + like;
    });
};


export const LikeToMessageFromDBFireStore = (id: string, like: number) => {
    console.log("like value : " + like)
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    console.log(id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("like") + like;
            transaction.update(sfDocRef, { like: newPopulation });
            return newPopulation;
        });
    })

};

export const ReplyToMessageFromDBFireStore = (id: string, message: string, sender : string, senderName: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("reponse")
            newPopulation = newPopulation.concat({...{id: newPopulation.length, idAuthor: sender, text: message, username: senderName}});
            transaction.update(sfDocRef, { reponse: newPopulation });
            return newPopulation;
        });
    })

};

export async function isMessageLiked (id: string, idRessource: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return  firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("like");
            return newPopulation.includes(idRessource);
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};


export const LikeToProfilFromDBFireStore = (id: string, idRessource: string, add: boolean) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("like");
            if (!add) {
                const index = newPopulation.indexOf(idRessource);
                console.log("removing item : " + index)

                if (index > -1) {
                     newPopulation.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            else {
                if (!newPopulation.includes(idRessource))
                    newPopulation.push(idRessource)
            }

            transaction.update(sfDocRef, { like: newPopulation });
            return idRessource;
        });
    }).then((newPopulation) => {
        console.log("Like increased to ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};





export const ViewMessageFromDBFireStore = (id: string, like: number) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    console.log(id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation = sfDoc.get("views") + 1;
            transaction.update(sfDocRef, { views: newPopulation });
            return newPopulation;
        });
    }).then((newPopulation) => {
        console.log("Views increased to ", newPopulation);
    }).catch((err) => {
        console.error(err);
    });

};



export const ViewToMessageFromDBWithoutCategory = (id: string, like: number) => {
    var adaRankRef = firebase.default.database().ref('Messages/' + id + '/views');
    adaRankRef.transaction(function (currentRank) {
        // If users/ada/rank has never been set, currentRank will be `null`.
        return currentRank + like;
    });
};
