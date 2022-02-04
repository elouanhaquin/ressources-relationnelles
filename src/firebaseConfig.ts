import { resolve } from 'dns';
import * as firebase from 'firebase'
import { getMessages, setMessages, Message } from './data/messages';


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
export  function getCurrentUser(){
    return new Promise((resolve, reject) => {
        const unsubscribe =  firebase.default.auth().onAuthStateChanged(function(user){
            if(user){
                resolve(user)
            }else{
                resolve(null)
            }
            unsubscribe()
        });
    })
  
}

export function logoutUser(){
    return firebase.default.auth().signOut();
}

export async function loginUser(username : string, password : string){
    try{
        const res = await firebase.default.auth().signInWithEmailAndPassword(username, password);
        return res;
    }
    catch(error){
    console.log(error);
    return false;
   }
}

export async function RegisterUser(username : string, password : string){
    try{

        const res = await firebase.default.auth().createUserWithEmailAndPassword(username, password);
        console.log(res);
        return true;
    }
    catch(error){
    console.log(error);
    return false;
   }
}

export async function exportMessagesToDB() {
    const ref =  await firebase.default.database().ref('message');
    ref.push(getMessages());
};

export const getMessagesFromDB = async () : Promise<Message[]> => {
    const ref = await firebase.default.database().ref('message');
    try{
        ref.on('value', (snapshot) => {
            const data = snapshot.val();
            const current : Message = data['-Mv4-nZYSk9PoE_cwkWw'][0];
           
            setMessages(current);
            return current;
        });
    }catch (e) {
        throw e; 
    }
    return getMessages();
    
};
