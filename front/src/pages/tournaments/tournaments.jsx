import React, { useEffect, useState } from "react";
import '../style.css';
import { useAuth } from '../../hooks/useAuth';
import axios from "axios";
import { Link } from 'react-router-dom';

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/tournaments", { withCredentials: true });
            console.log("Fetched tournaments:", response.data.tournaments); 
            setTournaments(response.data.tournaments);
        } catch (error) {
            console.error("Error fetching tournaments for team:", error);
        }
    }

    const addTournament = async (id, type) => {
        try {
            const response = await axios.post("http://localhost:3000/auth/user/add/tournament/1x1", {
                id: id,
                type: type
            }, { withCredentials: true });

            if (response.status === 200) {
                alert("Вы успешно добавлены в турнир!");
                fetchTournaments();
            }
        } catch (error) {
            console.error("Ошибка при добавлении в турнир:", error);
            alert("Ошибка при добавлении в турнир: " + (error.response?.data || error.message));
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
                    <Link className="link" to="/auth/profile"><h3>Профиль</h3></Link>
                </div>
                <div id="my-team">
                    <Link className="link" to="/auth/my_team"><h3>Моя команда</h3></Link>
                </div>
                <div id="team-search">
                    <Link className="link" to="/auth/teams"><h3>Команды</h3></Link>
                </div>
            </aside>
            <div id="tournaments-container">
                <button><Link className="link" to="/auth/my_tournaments">Мои турниры</Link></button>
                {tournaments.map((tourn, index) => (
                    <div key={index} id="tournament-container">
                        <p className="name">{tourn.tournamentname}</p>
                        <p className="retailer">Количество мест: {tourn.numofparticipants}</p>
                        <p className="retailer">Игра: {tourn.game}</p>
                        <p className="num_of_people">Дата: {tourn.date}</p>
                        <p className="num_of_people">Время с: {tourn.timefrom}</p>
                        <p className="num_of_people">Время по: {tourn.timeto}</p>
                {tourn.results>0?(<div>
                    
                    {tourn.type === '1x1all'?(
                         <button><Link className="link" to={`/auth/get/results1x1?id=${tourn.id}`}>Результаты</Link></button>   
                         
                    ):(
                        <button><Link className="link" to={`/auth/get/results?id=${tourn.id}&type=${tourn.type}`}>Результаты</Link></button>   
                        )}
                </div>):(<button onClick={() => addTournament(tourn.id, tourn.type)}>Добавить</button>)}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Tournaments;
 