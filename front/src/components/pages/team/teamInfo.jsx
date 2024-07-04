import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style.css';
import { useAuth } from '../../../hooks/useAuth';

import { Link, useLocation } from 'react-router-dom';

const TeamInfo = ()=>{
    const [participant, setParticipants]=useState([]);
    const [team_info, setTeamInfo]=useState('')
      const { isAuthenticated,isAdmin,logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('id')
    fetchTeams(id);

    }, [location.search]);
    const fetchTeams = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/team_info?id=${id}`, { withCredentials: true });
            console.log(response.data.teams)
            setParticipants(response.data.teams);
            setTeamInfo(response.data.team_name)
        } catch (error) {
            console.error("Error fetching tournaments for team:", error);
        }
    }
    return (
        <>
        <header>
        <nav>
            <ul>
                <li><Link className="link" to="/">главная</Link></li>
                <li><Link className="link" to="/auth/tournaments">турниры</Link></li>
                <li><Link className="link" to="/news">новости</Link></li>
            </ul>
        </nav>
        <div id="user-actions">
            {isAuthenticated ? (<button onClick={logout}>Выйти из аккаунта</button>)
                :
                (<div>
                    <button><Link className="link" to="/Reg">регистрация</Link></button>
                    <button><Link className="link" to="/Login">вход</Link></button>
                </div>
                )}
        </div>
    </header>
    <aside id="profile-section">
        <div id="profile">
            <Link className="link" to="/auth/profile"> <h3>Профиль</h3></Link>

        </div>
        <div id="my-team">
            <Link className="link" to="/auth/my_team"><h3>Моя команда</h3></Link>

        </div>
        <div id="team-search">
            <Link className="link" to="/auth/teams"> <h3>Комманды</h3></Link>

        </div>
    </aside>
    <h3>{team_info}</h3>

    <main id="participants-container">

        <h4>Участники:</h4>
        {participant.map((part)=>(

            <div id="participant-container">
                
                <p className="name">{part.memberemail}</p>
            </div>
        ))}
    </main>
        </>
    )
}

export default TeamInfo;