import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Home from './Components/pages/Home';
import Signup from './Components/pages/Signup';
import UserBoard from './Components/pages/UserBoard';
import MessageBoard from './Components/pages/MessageBoard';
import Profile from './Components/pages/Profile';
import UpdateInfo from './Components/pages/UpdateInfo';
import ChangePass from './Components/pages/ChangePass';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

library.add(faArrowCircleUp);

function App() {
    return (
        <Router>
        <Switch>
            <Route exact path="/"><Home/></Route>
            <Route path="/register"><Signup/></Route>
            <Route path="/users"><UserBoard/></Route>
            <Route path="/messages"><MessageBoard/></Route>
            <Route path="/profile"><Profile/></Route>
            <Route path="/updateInfo"><UpdateInfo/></Route>
            <Route path="/changePass"><ChangePass/></Route>
        </Switch>
        </Router>
    );
}

export default App;
