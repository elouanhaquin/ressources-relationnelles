import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSpinner, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Submit from './pages/Submit';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';
import Login from './pages/Login';
import Register from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';
import { getCurrentUser, getMessagesFromDB } from './firebaseConfig'
import { setUserState } from './reducers/action';
import { useDispatch } from 'react-redux';
import React from 'react';

setupIonicReact();

const Routing: React.FC = () => {
  return (

    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" exact={true}>
          <Redirect to="/home" />
        </Route>
        <Route path="/home" exact={true}>
          <Home />
        </Route>
        <Route path="/message/:id">
          <ViewMessage />
        </Route>
        <Route path="/submit">
          <Submit />
        </Route>

        <Route path="/login" component={Login} exact={true} />
        <Route path="/register" component={Register} exact={true} />

      </IonRouterOutlet>
    </IonReactRouter>

  )
}




const App: React.FC = () => {
  const [busy, setBusy] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser().then((user: any) => {
      if (user) {
        //I'm logged in
        dispatch(setUserState(user.email))
       // window.history.replaceState({}, '', '/home')
      }
      else {
        window.history.replaceState({}, '', '/login')
      }
      setBusy(false)
    })
  }, [])

  return (

    <IonApp>{busy ? <IonSpinner /> : <Routing />}

    </IonApp>

  )
};

export default App;
