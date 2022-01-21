import { Reponse } from "./reponse";

export interface Message {
  fromName: string;
  subject: string;
  category: string;
  content: string;
  like: number;
  dislike: number;
  img: string;
  date: string;
  id: number;
  reponse: Reponse;
}

const messages: Message[] = [
  {
    fromName: 'Matt Chorsey',
    subject: 'New event: Trip to Vegas',
    category: "DIY",
    content: "It had become a far too common an event in her life. She has specifically placed the key to the box in a special place so that she wouldn't lose it and know exactly where it was when the key was needed. Now that she needed to open the box, she had absolutely no idea where that special spot she placed the key might be.",
    img:"",
    like:0,
    dislike:0,
    date: '9:32 AM',
    id: 0,
    reponse: {id:0,idAuthor:0,idMessage:0,text:""}
  },
  {
    fromName: 'Scott Pilgrim',
    subject: 'Against the world',
    category: "Chasse et pêche",
    content: "It had become a far too common an event in her life. She has specifically placed the key to the box in a special place so that she wouldn't lose it and know exactly where it was when the key was needed. Now that she needed to open the box, she had absolutely no idea where that special spot she placed the key might be.",
    img:"",
    like:0,
    dislike:0,
    date: '9:32 AM',
    id: 1,
    reponse: {id:0,idAuthor:0,idMessage:0,text:""}
  },
  {
    fromName: 'Phil Beggars',
    subject: 'How to find love ? ',
    category: "Musique",
    content: "It had become a far too common an event in her life. She has specifically placed the key to the box in a special place so that she wouldn't lose it and know exactly where it was when the key was needed. Now that she needed to open the box, she had absolutely no idea where that special spot she placed the key might be.",
    img:"",
    like:0,
    dislike:0,
    date: '9:32 AM',
    id: 2,
    reponse: {id:0,idAuthor:0,idMessage:0,text:""}
  },
  {
    fromName: 'Katherine Vult',
    subject: 'New event: Trip to Vegas',
    category: "France",
    content: "It had become a far too common an event in her life. She has specifically placed the key to the box in a special place so that she wouldn't lose it and know exactly where it was when the key was needed. Now that she needed to open the box, she had absolutely no idea where that special spot she placed the key might be.",
    img:"",
    like:0,
    dislike:0,
    date: '9:32 AM',
    id: 3,
    reponse: {id:0,idAuthor:0,idMessage:0,text:""}
  },
  {
    fromName: 'Philiiiiiip Rock',
    subject: 'I key stuck, please help',
    category: "Litterature",
    content: "It had become a far too common an event in her life. She has specifically placed the key to the box in a special place so that she wouldn't lose it and know exactly where it was when the key was needed. Now that she needed to open the box, she had absolutely no idea where that special spot she placed the key might be.",
    img:"",
    like:0,
    dislike:0,
    date: '9:32 AM',
    id: 4,
    reponse: {id:0,idAuthor:0,idMessage:0,text:""}
  },

];

export const getMessages = () => messages;

export const getMessage = (id: number) => messages.find(m => m.id === id);
