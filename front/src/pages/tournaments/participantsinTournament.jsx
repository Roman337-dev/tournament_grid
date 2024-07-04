import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const ParticipantsinTournament = () => {
    const [participants, setParticipants] = useState([]);
    const [newPart, setNewPart] = useState('');
    const [tournId, setTournamentId] = useState(null);
    const [type, setType] = useState('');
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const [isRetailer, setIsRetailer] = useState(false);
    const [isResult, setIsResult] = useState(false);
    const [tournamentName, setTournamentName] = useState('');
    
    const location = useLocation();
    
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('id');
        const type = query.get('type');
        setTournamentId(id);
        setType(type);
        fetchParticipants(id, type);
    }, [location.search]);

    const fetchParticipants = async (id, type) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/my_tournaments/part?id=${id}&type=${type}`, {
                withCredentials: true
            });
            console.log(response.data.tourn)
            console.log(response.data.isRetailer)
            setParticipants(response.data.tourn);
            setIsRetailer(response.data.isRetailer);
            setIsResult(response.data.isResult);
            setTournamentName(response.data.tournament_name);
        } catch (error) {
            console.error("Error fetching participants:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3000/auth/user/add/participant/tournament', { id:tournId,
            type:type,
            participant: newPart}, {
                withCredentials: true
            });
            if (response.status === 200) {
                setNewPart('');
                fetchParticipants(tournId, type);
            } else {
                console.error("Error adding participant:", response);
            }
        } catch (error) {
            console.error("Error adding participant:", error);
        }
    };

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
                    {isAuthenticated ? (<button onClick={logout}>Выйти из аккаунта</button>) :
                        (<div>
                            <button><Link className="link" to="/Reg">регистрация</Link></button>
                            <button><Link className="link" to="/Login">вход</Link></button>
                        </div>)
                    }
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
                    <Link className="link" to="/auth/teams"><h3>Комманды</h3></Link>
                </div>
            </aside>
            <main id="participants-container">
                <h2 id='h1'>{tournamentName}</h2>
                {isResult ?
                    (
                        <>
                            {isAdmin && (
                                <>
                                    {type === '1x1all' ? (
                                        <Link className="link" to={`/auth/fill/results1x1/r1?id=${tournId}`}>
                                            <button>Редактировать результаты</button>
                                        </Link>
                                    ) : (
                                        <Link className="link" to={`/auth/fill/results?id=${tournId}&type=${type}`}>
                                            <button>Редактировать результаты</button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {isRetailer && (
                                <>
                                    {type === '1x1all' ? (
                                        <Link className="link" to={`/auth/fill/results1x1/r1?id=${tournId}`}>
                                            <button>Заполнить результаты</button>
                                        </Link>
                                    ) : (
                                        <Link className="link" to={`/auth/fill/results?id=${tournId}&type=${type}`}>
                                            <button>Заполнить результаты</button>
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <>
                                            {type === '1x1all' ? (
                                                <Link className="link" to={`/auth/fill/results1x1/r1?id=${tournId}`}>
                                                    <button>Редактировать результаты</button>
                                                </Link>
                                            ) : (
                                                <Link className="link" to={`/auth/fill/results?id=${tournId}&type=${type}`}>
                                                    <button>Редактировать результаты</button>
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )
                }
                {isResult && (
                    <>
                        {type === '1x1all' ? (
                            <Link className="link" to={`/auth/get/results1x1?id=${tournId}`}>
                                <button>Просмотреть результаты</button>
                            </Link>
                        ) : (
                            <Link className="link" to={`/auth/get/results?id=${tournId}&type=${type}`}>
                                <button>Просмотреть результаты</button>
                            </Link>
                        )}
                    </>
                )}
                {participants.map((part) => (
                    <div id='participant-container' key={part.id}>
                        
                        <p className="name">{part.participantemail}</p>
                    </div>
                ))}
                {isRetailer && (
                    <>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <label><b>Добавить игрока</b></label>
                            <input type="text" id="participant" placeholder="Введите имя нового игрока" name="participant" value={newPart}
                                onChange={(e) => setNewPart(e.target.value)} required/>
                            <button type='submit'>Добавить</button>
                        </form>
                    </>
                )}
            </main>
        </>
    );
};

export default ParticipantsinTournament;