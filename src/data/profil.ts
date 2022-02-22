import { Message } from "./messages";

export interface Profil {
  name: string;
  firstName: string;
  lastName: string;
  pseudo?: string;
  birthday: string;
  likes: string[];
  pseudo: string;
  birthday: string;
  likes?: Message[];
  categories?: string[];
  signaled: string[];
  signaled_comments: string[];
  friends: string[];
  friends_waiting: string[];
  family: string[];
  interested: string[];
  img: string;
  admin: number
  uid: string;
  id: number;
}

const profils: Profil[] = [
 /* {
    name: 'Matt Chorsey',
    firstName: "",
    lastName: "",
    img: "../assets/profile_pic/image.jpg",
    categories: ["chasse", "peche"],
    uid:"0",
    id: 0
  }*/
];

export const getProfil = () => profils[0];
export const setProfilsBDD = (pro : Profil[]) => {pro.map(m=> profils.filter(g => g.id == m.id).length > 0? m :  profils.push(m));};
export const addProfilBBD = (pro : Profil) =>  profils.push(pro);
export const getProfilWithID = (id: number) => profils.find(m => m.id === id);


