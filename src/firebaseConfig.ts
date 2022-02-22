import { resolve } from 'dns';
import * as firebase from 'firebase'
import { userInfo } from 'os';
import { Observable } from 'redux';
import { pathToFileURL } from 'url';
import { DBWrapper } from 'workbox-core/_private';
import { getMessages, setMessages, Message, setMessagesBDD } from './data/messages';
import { addProfilBBD, Profil, setProfilsBDD } from './data/profil';
import { Reponse } from './data/reponse';

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
        //console.log(firebase.default.auth().currentUser?.emailVerified);
        if (firebase.default.auth().currentUser?.emailVerified == true) {
            return "" + res;
        }
        else {
            return "undefined";
        }
    }
    catch (error) {
        console.log(error);
        return "undefined";
    }
}

export async function resetPassword(email: string) {
    try {
        var ValidMail = false;
        const res = await firebase.default.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert('Un mail de réinitialisation du mot de passe vous a été envoyé');
                ValidMail = true;
            })
            .catch(error => alert('Error'));
        return ValidMail;
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

export async function RegisterUser(email: string, password: string, profil: Profil) {
    try {

        const res = await firebase.default.auth().createUserWithEmailAndPassword(email, password).then(cred => {
            return firebase.default.firestore().collection('profils').doc("" + cred.user?.uid).set({
                email: email,
                pseudo: profil.name,
                firstName: profil.firstName,
                lastName: profil.lastName,
                img: profil.img,
                id: profil.id,
                likes: profil.likes,
                categories: profil.categories,
                signaled: profil.signaled,
                signaled_comments: profil.signaled_comments,
                friends: profil.friends,
                family: profil.family,
                interested: profil.interested,
                admin: profil.admin,
                uid: cred.user?.uid
            })
        });

        firebase.default.auth().currentUser?.sendEmailVerification();
        console.log(res);
        console.log(firebase.default.auth().currentUser?.emailVerified);
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



export async function uploadImageToStorage(path: Blob, imageName: string) {
    let reference = firebase.default.storage().ref("ressources").child(imageName);
    let task = reference.put(path);

    return task.then(() => {
        console.log('Image uploaded to the bucket!');
        return reference.getDownloadURL()

    }).catch((e) => console.log('uploading image error => ', e));


}

export async function getImageTypeFromStorage(imageName: string) {
    let reference = firebase.default.storage().ref("ressources").child(imageName);
    return reference.getMetadata().then(data => {
        return data;
    });

}

export async function deleteImageTypeFromStorage(imageName: string) {
    let reference = firebase.default.storage().ref("ressources").child(imageName);
    return reference.delete().then((data) => {
        return data;
    })

}


export const getProfilFromFireStoreDBwithID = (id: string) => {

    const te = firebase.default.firestore().collection('profils').where('uid', '==', id);
    return te.get().then((querySnapshot) => {
        let ress: Profil[] = [];
        querySnapshot.forEach((doc) => {
            let m: Profil = {
                name: doc.data().name,
                lastName: doc.data().lastName,
                firstName: doc.data().firstName,
                img: doc.data().img,
                id: doc.data().id,
                likes: doc.data().likes,
                categories: doc.data().categories,
                signaled: doc.data().signaled,
                signaled_comments: doc.data().signaled_comments,
                friends: doc.data().friends,
                friends_waiting: doc.data().friends_waiting,
                family: doc.data().family,
                interested: doc.data().interested,
                admin: doc.data().admin,
                uid: doc.data().uid
            };

            ress.push(m)
        });
        return ress[0];
    });

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

export const SignalToMessageFromDBFireStore = (id: string, like: number) => {
    console.log("signal value : " + like)
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    console.log(id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("signaled") + like;
            transaction.update(sfDocRef, { signaled: newPopulation });
            return newPopulation;
        });
    })

};

export const SignalToReponseFromDBFireStore = (id: string, idParent: string, like: number) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idParent);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: Reponse[] = sfDoc.get("reponse")
            var reponse = newPopulation.filter(r => r.id == Number.parseInt(id))
            if (reponse.length > 0 && reponse[0].signaled != undefined) {
                reponse[0].signaled += like;

                newPopulation = newPopulation.filter(r => r.id != Number.parseInt(id))
                newPopulation.push(reponse[0]);
                transaction.update(sfDocRef, { reponse: newPopulation });
            }
            else {
                throw "reponse not find"
            }

            return newPopulation;
        });
    })
};

export const ModifyReponse = (id: string, title: string, category: string, description: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    console.log(id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newTitle = title;
            var newCategory = category;
            var newDescription = description;
            transaction.update(sfDocRef, { subject: newTitle, content: newDescription, category: newCategory, signaled: 0 });
            return newDescription;
        });
    })
};


export async function setSignaledCommentToUserFirebase(id: string, idParent: string, uid: string, add: boolean) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + uid);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("signaled_comments");
            if (!add) {
                const index = newPopulation.indexOf(id);
                console.log("removing item : " + index)

                if (index > -1) {
                    newPopulation.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            else {
                if (!newPopulation.includes(id))
                    newPopulation.push(id)
            }

            transaction.update(sfDocRef, { signaled_comments: newPopulation });
            return id;
        });
    }).then((newPopulation) => {
        console.log("Like increased to ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
}

export async function isReponseSignaledFromUser(id: string, idRessource: string, uid: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + uid);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("signaled_comments");
            return newPopulation.includes(id);
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};


export async function isReponseSignaled(id: string, idParent: string) {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idParent);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: Reponse[] = sfDoc.get("reponse")
            var reponse = newPopulation.filter(r => r.id == Number.parseInt(id))

            return reponse[0];
        });
    }).then((data) => {
        return data
    });
}

export async function getTopicsUserIsInterested(id: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: string[] = sfDoc.get("interested")

            return newPopulation;
        });
    }).then((data) => {
        return data
    });
}

export async function getFriendsUser(id: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: string[] = sfDoc.get("friends")

            return newPopulation;
        });
    }).then((data) => {
        return data
    });
}


export async function getFamilyUser(id: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: string[] = sfDoc.get("family")

            return newPopulation;
        });
    }).then((data) => {
        return data
    });
}

export const getProfilToAdd = () => {
    const ref = firebase.default.firestore().collection('profils');
    return ref.get().then((querySnapshot) => {
        let ress: Profil[] = [];
        querySnapshot.forEach((doc) => {
            let m: Profil = {
                name: doc.data().name,
                lastName: doc.data().lastName,
                firstName: doc.data().firstName,
                img: doc.data().img,
                id: doc.data().id,
                likes: doc.data().likes,
                categories: doc.data().categories,
                signaled: doc.data().signaled,
                signaled_comments: doc.data().signaled_comments,
                friends: doc.data().friends,
                friends_waiting: doc.data().friends_waiting,
                family: doc.data().family,
                interested: doc.data().interested,
                admin: doc.data().admin,
                uid: doc.data().uid
            };

            ress.push(m)
        });
        return ress;
    });
}


export async function getRessourcesUserIsInterestedBy(id: string) {
    return getTopicsUserIsInterested(id).then((data) => {

        let ressources = firebase.default.firestore().collection('messages').where('category', 'in', data);
        return ressources.get().then((querySnapshot) => {
            let ress: Message[] = [];
            querySnapshot.forEach((doc) => {
                let m: Message = {
                    category: doc.data().category,
                    content: doc.data().content,
                    date: doc.data().date,
                    precise_date: doc.data().precise_date,
                    views: doc.data().views,
                    fromName: doc.data().fromName,
                    img: doc.data().img,
                    id: doc.data().id,
                    saved_by: doc.data().saved_by,
                    like: doc.data().like,
                    signaled: doc.data().signaled,
                    fromId: doc.data().fromId,
                    reponse: doc.data().reponse,
                    subject: doc.data().subject,
                    shareLevel: doc.data().shareLevel
                };

                ress.push(m)
            });
            return ress;
        });
    })
}

export const addInterestToFireStore = (id: string, idFriend: string, add: boolean) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("interested");
            if (!add) {
                const index = newPopulation.indexOf(idFriend);
                console.log("removing item : " + index)

                if (index > -1) {
                    newPopulation.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            else {
                if (!newPopulation.includes(idFriend))
                    newPopulation.push(idFriend)
            }
            console.log(newPopulation)

            transaction.update(sfDocRef, { interested: newPopulation });
            return idFriend;
        });
    }).then((newPopulation) => {
        console.log("Friend added ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};


export const addFriendToFireStore = (id: string, idFriend: string, add: boolean) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + idFriend);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("friends_waiting");
            if (!add) {
                const index = newPopulation.indexOf(id);
                console.log("removing item : " + index)

                if (index > -1) {
                    newPopulation.splice(index, 1); // 2nd parameter means remove one item only
                }
            }
            else {
                if (!newPopulation.includes(id))
                    newPopulation.push(id)
            }
            console.log(newPopulation)

            transaction.update(sfDocRef, { friends_waiting: newPopulation });
            return idFriend;
        });
    }).then((newPopulation) => {
        console.log("Friend added ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};

export const deleteFriendToFireStore = (id: string, idFriend: string) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation = sfDoc.get("family");
            var friends = sfDoc.get("friends");

            if (newPopulation.includes(idFriend)) {
                const index = newPopulation.indexOf(idFriend);
                if (index > -1) {
                    newPopulation.splice(index, 1); // 2nd parameter means remove one item only
                }
            }

            if (friends.includes(idFriend)) {
                const index = friends.indexOf(idFriend);
                if (index > -1) {
                    friends.splice(index, 1); // 2nd parameter means remove one item only
                }
            }

            transaction.update(sfDocRef, { family: newPopulation, friends: friends });
            return idFriend;
        });
    }).then((newPopulation) => {
        console.log("Friend deleted ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};

export const acceptFriendToFireStore = (id: string, idFriend: string, add: boolean) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation = sfDoc.get("friends_waiting");
            var friends = sfDoc.get("friends");
            if (add)
                friends.push(idFriend)

            const index = newPopulation.indexOf(idFriend);
            console.log("removing item : " + index)

            if (index > -1) {
                newPopulation.splice(index, 1); // 2nd parameter means remove one item only
            }
            transaction.update(sfDocRef, { friends_waiting: newPopulation, friends: friends });
            return idFriend;
        });
    }).then((newPopulation) => {
        console.log("Friend added ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};
export const acceptFamilyToFireStore = (id: string, idFriend: string, add: boolean) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation = sfDoc.get("friends_waiting");
            var friends = sfDoc.get("family");
            if (add)
                friends.push(idFriend)

            const index = newPopulation.indexOf(idFriend);
            console.log("removing item : " + index)

            if (index > -1) {
                newPopulation.splice(index, 1); // 2nd parameter means remove one item only
            }
            transaction.update(sfDocRef, { friends_waiting: newPopulation, family: friends });
            return idFriend;
        });
    }).then((newPopulation) => {
        console.log("Friend added ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};


export async function getRessourcesUserFriends(id: string) {
    return getFriendsUser(id).then((data) => {
        let ressources = firebase.default.firestore().collection('messages').where('fromId', 'in', data);
        return ressources.get().then((querySnapshot) => {
            let ress: Message[] = [];
            querySnapshot.forEach((doc) => {
                let m: Message = {
                    category: doc.data().category,
                    content: doc.data().content,
                    date: doc.data().date,
                    precise_date: doc.data().precise_date,
                    views: doc.data().views,
                    fromName: doc.data().fromName,
                    saved_by: doc.data().saved_by,
                    img: doc.data().img,
                    id: doc.data().id,
                    like: doc.data().like,
                    signaled: doc.data().signaled,
                    fromId: doc.data().fromId,
                    reponse: doc.data().reponse,
                    subject: doc.data().subject,
                    shareLevel: doc.data().shareLevel
                };

                ress.push(m)
            });
            return ress;
        });
    })
}

export async function getRessourcesfromUser(id: string) {
    let ressources = firebase.default.firestore().collection('messages').where('fromId', '==', id);
    return ressources.get().then((querySnapshot) => {
        let ress: Message[] = [];
        querySnapshot.forEach((doc) => {
            console.log(doc)
            let m: Message = {
                category: doc.data().category,
                content: doc.data().content,
                date: doc.data().date,
                precise_date: doc.data().precise_date,
                views: doc.data().views,
                fromName: doc.data().fromName,
                saved_by: doc.data().saved_by,
                img: doc.data().img,
                id: doc.data().id,
                like: doc.data().like,
                signaled: doc.data().signaled,
                fromId: doc.data().fromId,
                reponse: doc.data().reponse,
                subject: doc.data().subject,
                shareLevel: doc.data().shareLevel
            };

            ress.push(m);
        });
        return ress;
    });
}

export async function getRessourcesSavedByUser(id: string) {
    let ressources = firebase.default.firestore().collection('messages').where('saved_by', "array-contains", id);
    return ressources.get().then((querySnapshot) => {
        let ress: Message[] = [];
        querySnapshot.forEach((doc) => {
            let m: Message = {
                category: doc.data().category,
                content: doc.data().content,
                date: doc.data().date,
                precise_date: doc.data().precise_date,
                views: doc.data().views,
                fromName: doc.data().fromName,
                img: doc.data().img,
                saved_by: doc.data().saved_by,
                id: doc.data().id,
                like: doc.data().like,
                signaled: doc.data().signaled,
                fromId: doc.data().fromId,
                reponse: doc.data().reponse,
                subject: doc.data().subject,
                shareLevel: doc.data().shareLevel
            };

            ress.push(m);
        });
        return ress;
    });
}

export async function getProfilsWaitingToAccept(id: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: string[] = sfDoc.get("friends_waiting")

            return newPopulation;
        });
    }).then((data) => {
        return data
    });
}


export async function getProfilsArray(id: Array<string>) {
    let profils = firebase.default.firestore().collection('profils').where('uid', 'in', id);
    return profils.get().then((querySnapshot) => {
        let ress: Profil[] = [];
        querySnapshot.forEach((doc) => {
            let m: Profil = {
                name: doc.data().name,
                lastName: doc.data().lastName,
                firstName: doc.data().firstName,
                img: doc.data().img,
                id: doc.data().id,
                likes: doc.data().likes,
                categories: doc.data().categories,
                signaled: doc.data().signaled,
                signaled_comments: doc.data().signaled_comments,
                friends: doc.data().friends,
                friends_waiting: doc.data().friends_waiting,
                family: doc.data().family,
                interested: doc.data().interested,
                admin: doc.data().admin,
                uid: doc.data().uid
            };

            ress.push(m)
        });

        return ress;
    });
}

export async function getAllProfilsArray() {
    let profils = firebase.default.firestore().collection('profils');
    return profils.get().then((querySnapshot) => {
        let ress: Profil[] = [];
        querySnapshot.forEach((doc) => {
            let m: Profil = {
                name: doc.data().name,
                lastName: doc.data().lastName,
                firstName: doc.data().firstName,
                img: doc.data().img,
                id: doc.data().id,
                likes: doc.data().likes,
                categories: doc.data().categories,
                signaled: doc.data().signaled,
                signaled_comments: doc.data().signaled_comments,
                friends: doc.data().friends,
                friends_waiting: doc.data().friends_waiting,
                family: doc.data().family,
                interested: doc.data().interested,
                admin: doc.data().admin,
                uid: doc.data().uid
            };

            ress.push(m)
        });

        return ress;
    });
}

export async function getRessourcesAllRessources() {

    let ressources = firebase.default.firestore().collection('messages');
    return ressources.get().then((querySnapshot) => {
        let ress: Message[] = [];
        querySnapshot.forEach((doc) => {
            let m: Message = {
                category: doc.data().category,
                content: doc.data().content,
                date: doc.data().date,
                precise_date: doc.data().precise_date,
                saved_by: doc.data().saved_by,
                views: doc.data().views,
                fromName: doc.data().fromName,
                img: doc.data().img,
                id: doc.data().id,
                like: doc.data().like,
                signaled: doc.data().signaled,
                fromId: doc.data().fromId,
                reponse: doc.data().reponse,
                subject: doc.data().subject,
                shareLevel: doc.data().shareLevel
            };

            ress.push(m)
        });
        return ress;
    });

}



export async function getRessourcesUserFamily(id: string) {
    return getFamilyUser(id).then((data) => {
        let ressources = firebase.default.firestore().collection('messages').where('fromId', 'in', data);
        return ressources.get().then((querySnapshot) => {
            let ress: Message[] = [];
            querySnapshot.forEach((doc) => {
                let m: Message = {
                    category: doc.data().category,
                    content: doc.data().content,
                    date: doc.data().date,
                    precise_date: doc.data().precise_date,
                    saved_by: doc.data().saved_by,
                    views: doc.data().views,
                    fromName: doc.data().fromName,
                    img: doc.data().img,
                    id: doc.data().id,
                    like: doc.data().like,
                    signaled: doc.data().signaled,
                    fromId: doc.data().fromId,
                    reponse: doc.data().reponse,
                    subject: doc.data().subject,
                    shareLevel: doc.data().shareLevel
                };

                ress.push(m)
            });
            return ress;
        });
    })
}




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

export const SavedMessageFromDBFireStore = (id: string, idRessource: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idRessource);
    console.log(id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("saved_by");
            if (!newPopulation.includes(id))
                newPopulation.push(id)

            transaction.update(sfDocRef, { saved_by: newPopulation });
            return newPopulation;
        });
    })
};

export const RemoveSavedMessageFromDBFireStore = (id: string, idRessource: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idRessource);
    console.log(id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("saved_by");

            const index = newPopulation.indexOf(id);
            if (index > -1) {
                newPopulation.splice(index, 1); // 2nd parameter means remove one item only
            }


            transaction.update(sfDocRef, { saved_by: newPopulation });
            return newPopulation;
        });
    })
};

export const ReplyToMessageFromDBFireStore = (id: string, idReponse: string, message: string, sender: string, senderName: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("reponse")
            newPopulation = newPopulation.concat({ ...{ id: idReponse, idAuthor: sender, text: message, username: senderName, signaled: 0 } });
            transaction.update(sfDocRef, { reponse: newPopulation });
            return newPopulation;
        });
    })

};

export async function isMessageLiked(id: string, idRessource: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
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

export async function isMessageSaved(id: string, idRessource: string) {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idRessource);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("saved_by");
            return newPopulation.includes(id);
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};

export async function isProfilSaysMessageSignaled(id: string, idRessource: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("signaled");
            return newPopulation.includes(idRessource);
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};

export async function isFriend(id: string, idFriend: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("friends");
            return newPopulation.includes(idFriend);
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};

export async function isMessageSignaled(idRessource: string) {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idRessource);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("signaled");
            if (newPopulation != undefined)
                return newPopulation;
            else
                return -2
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};

export async function getUserImage(idRessource: string) {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + idRessource);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("img");
            if (newPopulation != undefined)
                return newPopulation;
            else
                return "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
        });
    }).then((newPopulation) => {
        return newPopulation;
    })
};
export const DeleteCommentToDBFireStore = (id: string, idComm: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("reponse");
            let index: Reponse[] = newPopulation;
            let newarray = index.filter(n => n.id != Number.parseInt(idComm));

            transaction.update(sfDocRef, { reponse: newarray });
            return index;
        });
    }).then((newPopulation) => {
        console.log("Deleted ", id);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};
export const DeleteProfil = (id: string) => {
    var sfDocRef = firebase.default.firestore().collection('profil').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            getRessourcesfromUser(id).then((d) => {
                d.forEach(element => {
                    DeleteRessoucesToDBFireStore("" + element.id)
                });
            })
            transaction.delete(sfDocRef);

        });
    }).then((newPopulation) => {
        console.log("Deleted ", id);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};


export const DeleteRessoucesToDBFireStore = (id: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            let t = sfDoc.get("img")

            if (t.length > 1)
                deleteImageTypeFromStorage(id);
            transaction.delete(sfDocRef);
        });
    }).then((newPopulation) => {
        console.log("Deleted ", id);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};

export const validateRessourceToFireStore = (idRessource: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idRessource);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }


            transaction.update(sfDocRef, { signaled: -1 });
            return idRessource;
        });
    }).then((newPopulation) => {
        console.log(" Document id " + idRessource + " is now validated");
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
};

export const validateCommentToFireStore = (idRessource: string, idComm: string) => {
    var sfDocRef = firebase.default.firestore().collection('messages').doc('' + idRessource);
    return firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newPopulation: Reponse[] = sfDoc.get("reponse")
            var reponse = newPopulation.filter(r => r.id == Number.parseInt(idComm))
            if (reponse.length > 0 && reponse[0].signaled != undefined) {
                reponse[0].signaled = -1;
                console.log(reponse[0].signaled)
                newPopulation = newPopulation.filter(r => r.id != Number.parseInt(idComm))
                newPopulation.push(reponse[0]);
                transaction.update(sfDocRef, { reponse: newPopulation });
            }
            else {
                throw "reponse not find"
            }

            return newPopulation;
        });
    })
};

export const signaledRessourceToFireStore = (id: string, idRessource: string, add: boolean) => {
    var sfDocRef = firebase.default.firestore().collection('profils').doc('' + id);
    firebase.default.firestore().runTransaction((transaction) => {
        return transaction.get(sfDocRef).then((sfDoc) => {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }

            var newPopulation = sfDoc.get("signaled");
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

            transaction.update(sfDocRef, { signaled: newPopulation });
            return idRessource;
        });
    }).then((newPopulation) => {
        console.log("Signaled increased to ", newPopulation);
    }).catch((err) => {
        // This will be an "population is too big" error.
        console.error(err);
    });
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
function sendEmailVerification(currentUser: any) {
    throw new Error('Function not implemented.');
}
