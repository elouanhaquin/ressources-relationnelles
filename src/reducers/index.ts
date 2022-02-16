const defaultState = {
    user: {}
}


export default function reducer(state = defaultState, {type, payload} : {type:string, payload:any}) : any{
    //work with state
    switch(type){
        case 'SET_USER_STATE':
            return {...state, 
            userData:{
                username: payload != undefined ? (payload.charAt(0).toUpperCase() + payload.slice(1)).split('@')[0] : "undefined",
                email: payload,
                uid: payload,
                profilImg:  'https://pbs.twimg.com/media/EWZwV1WWsAAMhkv.jpg',
                location:  'Lannion',
            }
        }
    }
    return state;
}