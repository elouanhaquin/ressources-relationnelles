import * as firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBfxVb5gDYd1cJehGGQwD468ZeQwNx7RVM",
    authDomain: "ressourcesrelationelles-d94f1.firebaseapp.com",
    projectId: "ressourcesrelationelles-d94f1",
    storageBucket: "ressourcesrelationelles-d94f1.appspot.com",
    messagingSenderId: "1097977878736",
    appId: "1:1097977878736:web:cdaaa47ff4fbc5ab05e6d5",
    measurementId: "G-3V12PWYHY8"
}

firebase.initializeApp(config);

export async function loginUser(username : string, password : string){

   // const email = '${username}'
    try{

        const res = await firebase.auth().signInWithEmailAndPassword(username, password);
        console.log(res);
        return true;
    }
    catch(error){
    console.log(error);
    return false;
   }
}