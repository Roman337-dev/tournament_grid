import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style.css';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from "react-router-dom";

const MyTournaments=()=>{
    const [tournaments,setTournaments]=useState([]);
    const { isAuthenticated,isAdmin,logout } = useAuth();
    useEffect(() => {

        fetchTourn();

    }, []);
    const fetchTourn = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/my_tournaments", { withCredentials: true });
            console.log(response.data.my_tournaments)
            setTournaments(response.data.my_tournaments);
        } catch (error) {
            console.error("Error fetching Tournaments:", error);
        }
    }

    
    return(
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
             <main id="tournaments-container">
                 
             <Link className="link" to="/auth/createtourn"><button>Создать свой турнир</button></Link>
                {tournaments.map((tourn)=>(
                    <div id="tournament-container">
                        <Link className="link" to={`/auth/my_tournaments/part?id=${tourn.id}&type=${tourn.type}`}><p class="name">{tourn.tournamentname}</p></Link>
                        <p className="retailer">Максимум игроков: {tourn.numofparticipants}</p>
                        <p className="num_of_people">Дата: {tourn.date}</p>
                <p className="num_of_people">Время с: {tourn.timefrom}</p>
                <p className="num_of_people">Время по: {tourn.timeto}</p>
                
                
                
                </div>
                ))}
                 
                 
            </main>                   
        </>
    )
}

export default MyTournaments;