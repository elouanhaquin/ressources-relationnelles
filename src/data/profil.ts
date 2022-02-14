import { Message } from "./messages";

export interface Profil {
  name: string;
  firstName: string;
  lastName: string;
  likes?: Message[];
  categories?: string[];
  img: string;
  uid: string;
  id: number;
}

const profils: Profil[] = [
  {
    name: 'Matt Chorsey',
    firstName: "",
    lastName: "",
    img: "../assets/profile_pic/image.jpg",
    categories: ["chasse", "peche"],
    uid:"0",
    id: 0
  }
];

export const getProfil = () => profils;
export const setProfil = (pro : Profil[]) => {pro.map(m=> profils.includes(m)? m :  profils.push(m));};

export const getProfilWithID = (id: number) => profils.find(m => m.id === id);


