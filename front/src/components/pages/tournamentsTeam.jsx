import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';


const TournamentsTeam=()=>{
    const [tournTeam,setTournTeam]=useState([])
     const { isAuthenticated,isAdmin,logout } = useAuth();
    useEffect(() => {

    fetchtournTeams();

    }, []);
    const fetchtournTeams = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/tournamentsforTeam",{ withCredentials: true });
            setTournTeam(response.data.tournTeam);
        } catch (error) {
            console.error("Error fetching tournaments for team:", error);
        }
    }
    const addTourn = async(id, type)=>{
        try {
            const response = await axios.post("http://localhost:3000/auth/user/add/tournament/team", {
                tournament_id: id,
                type: type
            },{ withCredentials: true });
            if (response.status === 200) {
                alert("Вы успешно добавлены в турнир!");
               
                fetchTourn();
            }
        } catch (error) {
            console.error("Ошибка при добавлении в турнир:", error);
            alert("Ошибка при добавлении в турнир: " + error.response.data);
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
            <main id="tournaments-container">
            <Link className="link" to="/auth/my_Teamtournaments"><button >Турниры для команд</button></Link>
                {tournTeam.map((tournT,index)=>(
                    <div key={index} id="tournament-container">
                        <p class="name">{tournT.tournamentname}</p>
                <p class="retailer">Игра: {tournT.game}</p>
                <p class="retailer">Количество комманд: {tournT.numofcommandsme}</p>
                <p class="num_of_people">Дата: {tournT.date}</p>
                <p class="num_of_people">Время с: {tournT.timefrom}</p>
                <p class="num_of_people">Время по: {tournT.timeto}</p>
                
                {tournT.results.lenght>0?(<div>
                    
                        <button><Link className="link" to={`/auth/get/results/team?id=${tournT.id}`}>Результаты</Link></button>   
                   
                </div>):(<button onClick={()=>addTourn(tournT.id, tournT.type)}>Вступить</button>)}
                    </div>
                ))}
            </main>
        </>
    )
}

export default TournamentsTeam;