import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style.css';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const FillResultsT = () => {
	
	const [tourn_name,setTournName]= useState('')
	const [participant,setParticipants]=useState([])
    const [tourn_id, setTournamentId] = useState(null); // 
    const [isRet, setIsRet] = useState(false);
    const [type, setType] = useState('');
    const { isAuthenticated,isAdmin, logout } = useAuth();
    const location = useLocation();
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tourn_id = query.get('id');
        const type = query.get('type');
        setTournamentId(tourn_id);
        setType(type);
    fetchParticipants(tourn_id, type);

    }, [location.search]);
   
    const fetchParticipants = async (tourn_id,type) => {
			try {
					const response = await axios.get(`http://localhost:3000/auth/fill/results/team?id=${tourn_id}&type=${type}`, {
                        withCredentials: true
                    });

                    const part = response.data.teams.map(team=>({team, score: ''}))

					setParticipants(part);
                    setIsRet(response.data.isRet)
                    setTournName(response.data.tourn_name)
			} catch (error) {
					console.error("Error fetching user info:", error);
			}
	}
    const handleInputChange = (index, event) => {
        const values = [...participant];
        values[index][event.target.name] = event.target.value;
        setParticipants(values);
    };

    const handleSubmit = async (e,index) => {
        e.preventDefault();
        const part = participant[index];
        const formData = new FormData();
        formData.append('tournament_id', tourn_id);
        formData.append('type', type);
        formData.append('team', part.team);
        formData.append('score', part.score);
        try {
            await axios.post('http://localhost:3000/auth/user/rounds/tournament/team/addresult', {tourn_id:tourn_id, type:type, team:team.score, score: part.score}, {
                withCredentials: true
            }
            );
            alert('Результат успешно добавлены');
        } catch (error) {
            console.error('Ошибка при добавлении результатов:', error);
            alert('Ошибка при добавлении результатов');
        }
    }

 return (<>
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

						<main id="participants-container">\
						<h2 id='h1'>{tourn_name}</h2>
				{isRet?(<><Link className="link" to={`/auth/fill/results/team?id=${tourn_id}&type=${type}`}> <h3>Заполнить результаты</h3></Link>
				<Link className="link" to={`/auth/get/results/team?id=${tourn_id}&type=${type}`}> <h3>Посмотреть результаты</h3></Link></>):(<></>)}

				{participant.map((participant, index)=>(<div id="participant-container" key={participant.team}>
				
                           
				<form onSubmit={(e) => handleSubmit(e, index)}>
								
					<input type="text" placeholder='Команда' name='team' value={participant.team} onChange={(event) => handleInputChange(index, event)}/>
					<input type="text" placeholder='Очки' name='score' value={participant.score} onChange={(event) => handleInputChange(index, event)}/>
					<button type='submit'>Добавить</button>
								
							</form>
							</div>))}
						</main>
 </>)
}

export default FillResultsT;