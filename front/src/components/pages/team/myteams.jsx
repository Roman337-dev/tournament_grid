import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style.css';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';

const MyTeams=()=>{
    const [teams,setTeams]=useState([]);
    const [isRet, setIsRet] = useState(false)
    const { isAuthenticated,isAdmin,logout } = useAuth();
    useEffect(() => {

        fetchTeams();

    }, []);
    const fetchTeams = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/my_team" , { withCredentials: true });
            setTeams(response.data.teams);
            setIsRet(response.data.isRet)
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }

    const LeaveTeam=async(id)=>{
        try {
            const response = await axios.post("http://localhost:3000/auth/user/remove/from/team", {
                id: id
               
            }, { withCredentials: true });
            if (response.status === 200) {
                alert("Вы успешно вышли из команды!");
               
                fetchTeams();
            }
        } catch (error) {
            console.error("Ошибка при выходе из команды:", error);
            alert("Ошибка при выходе из команды: " + error.response.data);
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
                {isRet?(<div id="team-tour-search">
                    <Link className="link" to="/auth/tournamentsforTeam"> <h3>Турниры для Команды</h3></Link>

                </div>):(<></>)}
            </aside>
             <main id="teams-container" >
                 
             <Link className="link" to="/auth/createTeam"><button>Создать свою команду</button></Link>
                {teams.map((team)=>(
                    <div id="team-container" style={{margin: '10px',color: "whitesmoke", border:'white 1px solid', borderRadius:"10px", width:'70%'
                    }}>
                       <Link className="link" to={`/auth/my_team/part?id=${team.id}`}> <p class="name"  style={{fontSize:'24px', fontWeight:'bold'}}>{team.teamname}</p></Link>
                <p class="retailer">Создатель: <b>{team.retaileremail}</b></p>
                <p class="num_of_people">Максимум участников: <b>{team.numofpeople}</b></p>
                
                <button onClick={()=>{LeaveTeam(team.id)}}>Выйти</button>
                </div>
                ))}
                 
                 
            </main>                   
        </>
    )
}

export default MyTeams;