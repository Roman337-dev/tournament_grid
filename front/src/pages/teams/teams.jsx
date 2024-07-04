import React, { useEffect, useState } from "react";
import '../style.css';
import { useAuth } from '../../hooks/useAuth';
import axios from "axios";
import { Link } from 'react-router-dom';

const Teams = ()=>{
    const [teams, setTeams]=useState([]); 
    const { isAuthenticated, logout } = useAuth();

    useEffect(()=>{fetchTeam()},[])

    const fetchTeam = async ()=>{
        try{
            const response = await axios.get("http://localhost:3000/auth/teams", { withCredentials: true })
            console.log("Fetched teams:", response.data.teams); 
            setTeams(response.data.teams)
        }
        catch(error){
            console.error("Error fetching user info:", error);
        }
    }

    const addTeam = async(id)=>{
        try {
            const response = await axios.post("http://localhost:3000/auth/user/add/team", {
                id: id
            },{ withCredentials: true });
            if (response.status === 200) {
                alert("Вы успешно добавлены в команду!");
               
                fetchTeam();
            }
        } catch (error) {
            console.error("Ошибка при добавлении в команду:", error);
            alert("Ошибка при добавлении в команду: " + error.response.data);
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
                    {isAuthenticated ? (<button onclick={logout}>Выйти из аккаунта</button>)
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

            <h1>Команды</h1>
            <div id="teams-container" style={{color:'whitesmoke'}}>
           

            {teams.map((team)=>(
                <div key={team.id} id="team-container" style={{margin: '10px',color: "whitesmoke", border:'white 1px solid', borderRadius:"10px", width:'70%'}} >
                <p class="name" style={{fontSize:'24px', fontWeight:'bold'}}><Link className="link" to={`/auth/team_info?id=${team.id}`}>{team.teamname}</Link></p>
                <p class="retailer">Создатель:{team.retaileremail}</p>
                <p class="num_of_people">Максимум участников: {team.numofpeople}</p>

                <button onClick={()=>addTeam(team.id)}>Вступить</button>
               
            </div>
            ))}

            </div>
        </>
    )
}

export default Teams;
