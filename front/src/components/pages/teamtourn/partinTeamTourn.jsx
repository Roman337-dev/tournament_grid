import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style.css';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const ParticipantsinTeamTournament = ()=>{
    const [teams,setTeams]=useState([]);
    const [type, setType] = useState();
    const [tourn_id, setTourn_id] = useState();
    const { isAuthenticated,isAdmin, logout } = useAuth();
    const location = useLocation();

    const [isRetailer, setisRetailer] = useState(false)
    const [isResult, setisResult] = useState(false)
    const [torunament_name, setTournName] = useState('')

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('id');
        const type = query.get('type');
        setTourn_id(id);
        setType(type);
        
    fetchTeams(id, type);
    

    }, [location.search]);

    const fetchTeams = async (id,type) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/myTeamTournaments/part?id=${id}&type=${type}`, {
                withCredentials: true
            });
            console.log(response.data.tourn)
            setTeams(response.data.team_tourn);
            setisRetailer(response.data.isRetailer)
            setisResult(response.data.isResult)
            setTournName(response.data.tournament_name)

        } catch (error) {
            console.error("Error fetching news:", error);
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

            <main id="participants-container">
                <h2 id='h1'>{torunament_name}</h2>
                {isResult?
                (<>{isAdmin?( <Link className="link" to={`/auth/fill/results/team?id=${tourn_id}&type=${type}`}><button>Редактировать результаты</button></Link>):(<></>)}</>)
                :
                (<>{isRetailer?(<><Link className="link" to={`/auth/fill/results/team?id=${tourn_id}&type=${type}`}><button>Заполнить результаты</button></Link>{isAdmin?( <Link className="link" to={`/auth/fill/results/team?id=${tourn_id}&type=${type}`}><button>Редактировать результаты</button></Link>):(<></>)}</>):(<></>)}</>)}
                {isResult?(<Link className="link" to={`/auth/get/results/team?id=${tourn_id}&type=${type}`}><button>Редактировать результаты</button></Link>):(<></>)}
                
                {teams.map((team)=>(
                    <div id='participant-container'>
                       
                         <Link className="link" to={`/auth/team_info?id=${team.id}`}><p class="name">{team.teamname}</p></Link>
                    </div>
                ))}
           
            </main>
        </>
    )
}

export default ParticipantsinTeamTournament;