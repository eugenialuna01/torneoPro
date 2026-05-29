import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from "../pages/Home";
import Navbar from"../components/Navbar";
import Login from '../pages/Login'
import Register from '../pages/Register'
import PrivateRoute from './PrivateRoute'
import Tournaments from '../pages/Tournaments'
import Teams from '../pages/Teams'
import Players from  '../pages/Players'
import Matches from '../pages/Matches'
import Users from "../pages/Users";
import { TournamentProvider } from '../context/TournamentContext'
import { TeamProvider } from '../context/TeamContext'
import { MatchProvider } from "../context/MatchContext";
import { PlayerProvider } from "../context/PlayerContext";

const AppRoutes = () => {
  return (
  
    <TournamentProvider>
    <TeamProvider>
    <MatchProvider>
    <PlayerProvider >
        <Navbar />
       <Routes>
          <Route path="/usuarios" element={<PrivateRoute><Users/></PrivateRoute> } />
          <Route path="/" element={<PrivateRoute> <Home /></PrivateRoute> } />  
          <Route path="/jugadores" element={<PrivateRoute><Players /></PrivateRoute>} />
          <Route path="/torneos" element={<PrivateRoute><Tournaments /></PrivateRoute>} />
          <Route path="/equipos" element={<PrivateRoute><Teams /></PrivateRoute>} />
          <Route path="/jugadores" element={<PrivateRoute><Players /></PrivateRoute>} />
          <Route path="/partidos" element={<PrivateRoute><Matches /></PrivateRoute>} />
          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
        </Routes>
    </PlayerProvider>
    </MatchProvider>
    </TeamProvider>
    </TournamentProvider>
    
    
  )
}

export default AppRoutes