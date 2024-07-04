import React, { useEffect, useState } from "react";
import '../styles.css';
import axios from "axios";
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
const GetResultT = ()=>{
    const [resultsT, setResultsT] = useState([]);

    const [top3, setTop3] = useState([]);
  

    const { isAuthenticated,isAdmin,logout } = useAuth();


    const [type, setType] = useState('');
    const [tourn_id, setTournamentId] = useState(null); // 
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tourn_id = query.get('id');
        const type = query.get('type');
        setTournamentId(tourn_id);
        setType(type);
    fetchResT(tourn_id,type);

    }, [location.search]);
    
    const fetchResT = async (tourn_id,type) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/get/results/team?id=${tourn_id}&type=${type}`);
            setResultsT(response.data.results);
            setTop3(response.data.top3);//isAdmin

        } catch (error) {
            console.error("Error fetching results for team:", error);
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
            <main id="participants-container">
            <h2 id="h2">Результаты турнира</h2>
                
                {isAdmin?(<><Link className="link" to={`/auth/fill/results/team?id=${tourn_id}&type=${type}`}> <h3>Редактировать результаты</h3></Link></>):(<></>)}

                <h2 id="h1">Топ 3 игрока</h2>
                <div id="participant-container">
                   <ol> {top3.map((top)=>(
                        <li>
                             <p class="id">{top.TeamName} </p>
                        </li>
                    ))}
                    </ol>
                </div>
                    <hr style={{width:"100%"}}/>
                    <ol>
                    {resultsT.map((res)=>(
                        <li>
                            <div id="participant-container">
                            <p class="id">{res.TeamName} </p>
                        <p class="name">{res.Score}</p>
                            </div>
                        </li>
                    ))}
                    </ol>
            </main>
        </>
    )
}


export default GetResultT;