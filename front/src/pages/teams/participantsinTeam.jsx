import React, {useEffect, useState} from "react";
import '../style.css'
import axios from "axios";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'



const PartinTeam = ()=>{
    const [participants, setPartic]=useState([]); 
    const [addparticipants, setAddPartic]=useState(''); 
    const [Delparticipants, setDelPartic]=useState('');
    const [lead,setLead]=useState('')
    const [isRet, setIsRet] = useState(false);
    const location = useLocation();
    const [team_id, setTeamId]=useState(null);
    const { isAuthenticated,isAdmin, logout } = useAuth();
    
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('id');
       
        setTeamId(id);
       
        fetchParticipants(id);
        
    }, [location.search]);
   
    const fetchParticipants = async(id)=>{
        try{ 
            const response = await axios.get(`http://localhost:3000/auth/my_team/part?id=${id}`,{ withCredentials: true });
            console.log(response.data.teams);
            
            console.log(response.data.isRetailer);
            setPartic(response.data.teams);
            setIsRet(response.data.isRetailer);

        }
        catch(error){}
    }
    
  
    const deleteTeam=async()=>{
        try {
            await axios.delete('http://localhost:3000/auth/user/delete/team', {
               id: team_id 
            }
            ,{ withCredentials: true });
            window.location.href = '/teams';
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    }
    const signInParticipant=async(e)=>{
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/user/add/participant/team', {
                id: team_id,
                participant: addparticipants
            }
            ,{ withCredentials: true });
            setAddPartic('');
            fetchParticipants(team_id);
        } catch (error) {
            console.error('Error adding participant:', error);
        }

    }
    const deleteUser=async(e)=>{
        e.preventDefault();
        try {
            await axios.delete('http://localhost:3000/auth/user/delete/person', {
                data: {
                    email: Delparticipants
                },
                withCredentials: true
            }
            );
            console.log(Delparticipants);
            fetchParticipants(team_id);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    
    }
    const ChangeLead=async(e)=>{
        e.preventDefault();
        try {
            await axios.put('http://localhost:3000/auth/user/give/captain', {
                newCapName: lead
            }
            ,{ withCredentials: true });
            fetchParticipants(team_id);
        } catch (error) {
            console.error('Error changing lead:', error);
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
                {isRet?(
                    <div id="team-tour-search">
                  <Link className="link" to="/auth/tournamentsforTeam"><h3>Турниры для Команды</h3></Link>
                </div>
                ):(<></>)}
            </aside>

            <div id="participants-container">
            <button> <Link className="link" to="/auth/my_Teamtournaments">Турниры команды</Link></button>
            
            {isRet?(
                
                <button onClick={deleteTeam}>Удалить команду</button>
                ):(<></>)}
            {participants.map((participant)=>(
                <div id="participant-container">
                
                <p class="name">{participant.memberemail}</p>

               
               
            </div>
            ))}
            {isRet?(<div style={{margin:"20px"}}>
               <form onSubmit={signInParticipant} style={{margin:"20px", padding:'10px',backgroundColor: "#333", border: '1px solid black', borderRadius: '10px'}}>
               <label htmlFor="participant"><b>Добавить игрока</b></label>
                <input type="text" id="participant" placeholder="Введите имя нового игрока" name="participant" value={addparticipants} onChange={(e)=>{setAddPartic(e.target.value)}}
                />
                 <button type='submit'>Добавить</button>
               </form>
               <form onSubmit={deleteUser} style={{margin:"20px", padding:'10px',backgroundColor: "#333", border: '1px solid black', borderRadius: '10px'}}>
               <label htmlFor="participant"><b>Удалить игрока</b></label>
                <input type="text" id="participant" placeholder="Введите имя игрока, которого хотите удалить" name="participant2" value={Delparticipants} onChange={(e)=>{setDelPartic(e.target.value)}}
                />
                 <button type='submit'>Удалить</button>
               </form>
               
               <form onSubmit={ChangeLead} style={{margin:"20px", padding:'10px',backgroundColor: "#333", border: '1px solid black', borderRadius: '10px'}}>
               <label htmlFor="participant"><b>Назначить Командира</b></label>
                <input type="text" id="participant" placeholder="Введите имя игрока, которого хотите назначить командиром" name="participant3" value={lead} onChange={(e)=>{setLead(e.target.value)}}
                />
                 <button type='submit'>Назначить</button>

               </form>
               
               </div>):(<></>)}
            </div>
        </>
    )
}

export default PartinTeam;
