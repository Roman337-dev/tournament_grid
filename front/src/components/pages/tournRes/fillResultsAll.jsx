import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const FillResultsAll = () => {
    const [rounds, setRounds] = useState([]);
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const [tourn_id, setTournamentId] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tourn_id = query.get('id');
        setTournamentId(tourn_id);
        fetchParticipants(tourn_id);
    }, [location.search]);

    const fetchParticipants = async (tourn_id) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/fill/results1x1/r1?id=${tourn_id}`, {
                withCredentials: true
            });
            const part = response.data.participants.map(participant => ({ id: participant.id, email: participant.participantemail, score: '' }));
            setRounds([part]);
            generateRounds(part.length);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const generateRounds = (length) => {
        const roundsArr = [];
        let currentLength = length;
        while (currentLength > 1) {
            roundsArr.push(new Array(Math.ceil(currentLength / 2)).fill({ id: null, email: '', score: '' }));
            currentLength = Math.ceil(currentLength / 2);
        }
        setRounds(prevRounds => [...prevRounds, ...roundsArr]);
    };

    const handleScoreChange = (roundIndex, index, score) => {
        const updatedRounds = [...rounds];
        updatedRounds[roundIndex][index].score = score;
        setRounds(updatedRounds);
    };

    const handleNextRound = async (roundIndex, pairIndex) => {
        const player1 = rounds[roundIndex][pairIndex * 2];
        const player2 = rounds[roundIndex][pairIndex * 2 + 1];
        const winner = player1.score > player2.score ? { ...player1, score: '' } : { ...player2, score: '' };;

        const updatedNextRound = [...rounds[roundIndex + 1]];
        updatedNextRound[pairIndex] = winner;
        const updatedRounds = [...rounds];
        updatedRounds[roundIndex + 1] = updatedNextRound;
        setRounds(updatedRounds);

        try {
            const response = await axios.post(`http://localhost:3000/auth/user/rounds/tournament/1x1A/r${roundIndex + 1}`, {
                tournament_id: tourn_id,
                participant1: player1.email,
                participant2: player2.email,
                score1: player1.score,
                score2: player2.score
            }, {
                withCredentials: true
            });
            console.log('Save successfully', response);
        } catch (error) {
            console.error("Error Saved Score:", error);
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
                <h2 id="h1">Результаты турнира</h2>
                {isAdmin ? (<Link className="link" to={`/auth/fill/results1x1/r1?id=${tourn_id}`}> <h3>Редактировать результаты</h3></Link>) : (<></>)}
                <Link className="link" to={`/auth/get/results1x1?id=${tourn_id}`}> <h3>Посмотреть результаты</h3></Link>
                <ol><div id='container'>
                {rounds.map((round, roundIndex) => (
                   
                    <div key={roundIndex} id={`container${roundIndex + 1}`}>
                        <h3>{roundIndex + 1} round</h3>
                        {[...Array(Math.ceil(round.length / 2))].map((_, pairIndex) => (
                            <div key={pairIndex}>
                                <li>
                                    <div id="participant-container">
                                        <div id='row'>
                                            <input type="text" value={round[pairIndex * 2]?.email || ''} readOnly />
                                            <input
                                                type="number"
                                                value={round[pairIndex * 2]?.score || 0}
                                                onChange={(e) => handleScoreChange(roundIndex, pairIndex * 2, e.target.value)}
                                            />
                                        </div>
                                        <div id='row'>
                                            <input
                                                type="text"
                                                value={round[pairIndex * 2 + 1]?.email || ''}
                                                readOnly
                                            />
                                            <input
                                                type="number"
                                                value={round[pairIndex * 2 + 1]?.score || 0}
                                                onChange={(e) => handleScoreChange(roundIndex, pairIndex * 2 + 1, e.target.value)}
                                            />
                                        </div>
                                        {roundIndex < rounds.length - 1 && (
                                            <button onClick={() => handleNextRound(roundIndex, pairIndex)}>
                                                Добавить
                                            </button>
                                        )}
                                    </div>
                                </li>
                            </div>
                        ))}
                    </div>
                    
                ))}
                </div></ol>
            </main>
        </>
    );
};

export default FillResultsAll;