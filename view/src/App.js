import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import './styles/app.css'

function App() {
  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path = '/signup' component={Signup}/>
      </Switch>
    </div>
  );
}

export default App;
