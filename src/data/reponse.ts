export interface Reponse {
    id: number;
    idAuthor: number;
    idMessage: number;
    text: string;
  }
  
  const messages: Reponse[] = [
    {
      id: 0,
      idAuthor: 0,
      idMessage: 0, 
      text: "You are so stupid, I cant stand you anymore. Plz kill yourself now, like dont wait, do it rn. I cant even look at you, how ugly you are... Are you even a human?"
    }
  ];
  
  export const getResponses = () => messages;
  
  export const getResponse = (id: number) => messages.find(m => m.id === id);
  export const getResponseAuthor = (idAuthor: number) => messages.find(m => m.id === idAuthor);
  export const getResponseMessage = (idMessage: number) => messages.find(m => m.id === idMessage);
  