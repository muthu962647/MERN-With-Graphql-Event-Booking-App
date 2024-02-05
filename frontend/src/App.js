import React, { Component } from 'react';
import { BrowserRouter, Route , Routes, Navigate} from 'react-router-dom'

import './App.css'

import Eventspage from './pages/Events';
import Bookingspage from './pages/Bookings';
import Authpage from './pages/Auth';
import NoPage from './pages/NoPage';
import MainNavigation from './components/Navigation/MainNavigation.js';
import AuthContext from './context/auth-context.js';


class App extends Component {

  state = {
    token: null,
    userId: null
  };

  login = (token, userId, tokenExpiration) => {
    this.setState({token: token, userId: userId})
  }

  logout = () => {
    this.setState({ token: null, userId: null})
  }

render() {
  return (
    <BrowserRouter>
     <>
     <AuthContext.Provider value={{

      token: this.state.token,
      userId: this.state.userId,
      login: this.login,
      logout: this.logout

      }}>

      <MainNavigation />
      <div className="main-content">
      {!this.context.token && <Navigate from = "/" to = "/auth"/>}
      {this.context.token &&<Navigate from = "/" to = "/events"/>}
      {this.context.token &&<Navigate from = "/auth" to = "/events"/>}
        <Routes>
          {!this.state.token &&  <Route  path='/auth' element={<Authpage/>} />}
          {!this.state.token && <Route  path='/events' element={<Eventspage/>} />}
          {this.state.token && <Route  path='/bookings' element={<Bookingspage/>} />}
          <Route  path='*' element={<NoPage/>} />
        </Routes>
      </div>
      </AuthContext.Provider>
    </>
    </BrowserRouter>
   );
  }
  }

  export default App;