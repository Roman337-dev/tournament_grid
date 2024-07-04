import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.jsx";



import Authentification from './pages/AUTH/authentification';
import AddNews from './pages/toAdd/addNews';

import AddTeam from './pages/toAdd/addTeam';
import General from './pages/general';
import News from './pages/News/News.jsx';
import EditNews from './components/pages/admin/adm-edit-news.jsx';
import Teams from './pages/teams/teams.jsx'
import Tournaments from './pages/tournaments/tournaments.jsx';
import Profile from './pages/profile.jsx';
import AddTourn from './pages/toAdd/addTourn';

import TeamInfo from './components/pages/team/teamInfo.jsx';
import FillResultsT from './components/pages/teamtourn/fillResultsT.jsx';
import MyTournamentsT from './components/pages/teamtourn/myteamtournament.jsx';
import MyTournaments from './components/pages/teamtourn/mytournament.jsx';
import ParticipantsinTeamTournament from './components/pages/teamtourn/partinTeamTourn.jsx';
import FillResultsAll from './components/pages/tournRes/fillResultsAll.jsx';
import GetResultsAll from './components/pages/tournRes/getResultsAll.jsx';
import TournamentsTeam from './components/pages/tournamentsTeam.jsx';
import Moderate_users from './pages/admin/moderate-users.jsx';
import NewsForAdm from './pages/News/NewsForAdmin.jsx';
import MyTeams from './components/pages/team/myteams.jsx';
import PartinTeam from './pages/teams/participantsinTeam.jsx';
import FillResults from './pages/tournaments/fillResults.jsx';
import GetResult from './pages/tournaments/getResults.jsx';
import GetResultT from './pages/tournaments/getResultsT.jsx';
import ParticipantsinTournament from './pages/tournaments/participantsinTournament.jsx';


function App() {
  const { isAuthenticated } = useAuth();

  if(!isAuthenticated)
  return (
    <>
        <Router>
          <Routes>
          <Route
              path="/"
              exact
              element={
                <General/>
              }
            />
            <Route
              path="/Reg"
              exact
              element={
                <Authentification types={'reg'}/>
              }
            />
            <Route
              path="/Login"
              exact
              element={
                <Authentification types={'auth'}/>
              }
              
            />
             <Route
              path="/News"
              exact
              element={
                <News/>
              }
              
            />
          </Routes>
        </Router>
    </>
  )


  return (
    <>
        <Router>
          <Routes>
          <Route
              path="/"
              exact
              element={
                <General />
              }
            />
            <Route
              path="/Reg"
              exact
              element={
                <Authentification types={'reg'}/>
              }
            />
            <Route
              path="/Login"
              exact
              element={
                <Authentification types={'auth'}/>
              }
              
            />
             <Route
              path="/News"
              exact
              element={
                <News/>
              }
              
            />
             <Route
              path="/auth/adm-news"
              exact
              element={
                <NewsForAdm/>
              }
              
            />
            <Route path="/auth/get/edit/news" 
            exact
            element={
              <EditNews />
            }/>
            <Route path="/auth/teams" 
            exact
            element={
              <Teams />
            }/>
            
            <Route path="/auth/tournaments" 
            exact
            element={
              <Tournaments />
            }/>
            <Route path="/auth/profile" 
            exact
            element={
              <Profile />
            }/>
            <Route path="/auth/my_team" 
            exact
            element={
              <MyTeams />
            }/>
            
            <Route path="/auth/my_tournaments" 
            exact
            element={
              <MyTournaments />
            }/>
             <Route path="/auth/get/results1x1" 
            exact
            element={
              <GetResultsAll />
            }/>
            <Route path="/auth/get/results/team" 
            exact
            element={
              <GetResultT />
            }/>
            <Route path="/auth/get/results" 
            exact
            element={
              <GetResult />
            }/>
            
            <Route path="/auth/fill/results" 
            exact
            element={
              <FillResults />
            }/>
           <Route path="/auth/fill/results1x1/r1" 
            exact
            element={
              <FillResultsAll />
            }/>
           <Route path="/auth/fill/results/team" 
            exact
            element={
              <FillResultsT />
            }/>
            
         
         
         <Route path="/auth/team_info" 
            exact
            element={
              <TeamInfo/>
            }/>
           <Route path="/auth/my_Teamtournaments" 
            exact
            element={
              <MyTournamentsT />
            }/>
          <Route path="/auth/tournamentsforTeam" 
            exact
            element={
              <TournamentsTeam />
            }/>
        
        <Route path="/auth/get/edit/news" 
            exact
            element={
              <EditNews />
            }/>
        <Route path="/auth/user/admin" 
            exact
            element={
              <Moderate_users />
            }/>
           
           <Route path="/auth/addNews" 
            exact
            element={
              <AddNews />
            }/>

            <Route path="/auth/my_tournaments/part" 
            exact
            element={
              <ParticipantsinTournament />
            }/>
          <Route path="/auth/createTourn" 
            exact
            element={
              <AddTourn/>
            }/>
            <Route path="/auth/myTeamTournaments/part" 
            exact
            element={
              <ParticipantsinTeamTournament/>
            }/>
            <Route path="/auth/createTeam" 
            exact
            element={
              <AddTeam />
            }/>
            
            <Route path="/auth/my_team/part" 
            exact
            element={
              <PartinTeam />
            }/>
          </Routes>
        </Router>
    </>
  )
}

export default App;
