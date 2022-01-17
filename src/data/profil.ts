export interface Profil {
    name: string;
    img: string;
    id: number;
  }
  
  const profils: Profil[] =[
    {
        name: 'Matt Chorsey',
        img:"../assets/profile_pic/image.jpg",
        id: 0
      }
  ] ;
  
  export const getProfil = () => profils;

  export const getMessage = (id: number) => profils.find(m => m.id === id);

  
  