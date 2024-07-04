import React, { useState, useEffect } from "react";
import axios from "axios";
import './style.css'
import { useAuth } from '../../../hooks/useAuth';

import { Link, useLocation } from 'react-router-dom';

const GetResultsAll = ()=>{
    
    
    
    const [round1, setRound1] = useState([]);
    const [round2, setRound2] = useState([]);
    const [round3, setRound3] = useState([]);
    const [round4, setRound4] = useState([]);
    const [round5, setRound5] = useState([]);
    const [round6, setRound6] = useState([]);
    const [round7, setRound7] = useState([]);
    const [round8, setRound8] = useState([]);
    const [round9, setRound9] = useState([]);
    const [round10, setRound10] = useState([]);
    // const [round3dpl, setRound3dpl] = useState([]);
    const location = useLocation();
    const { isAuthenticated,isAdmin,logout } = useAuth();
    const [tourn_id, setTournamentId] = useState(null); 

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tourn_id = query.get('id');
        setTournamentId(tourn_id);
    fetchResAll(tourn_id);

    }, [location.search]);
    
    const fetchResAll = async (id ) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/get/results1x1?id=${id}` , { withCredentials: true });
            
            setRound1(response.data.resultsR1);
            setRound2(response.data.resultsR2);
            setRound3(response.data.resultsR3);
            setRound4(response.data.resultsR4);
            setRound5(response.data.resultsR5);
            setRound6(response.data.resultsR6);
            setRound7(response.data.resultsR7);
            setRound8(response.data.resultsR8);
            setRound9(response.data.resultsR9);
            setRound10(response.data.resultsR10);

        } catch (error) {
            console.error("Error fetching results:", error);
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
            <h2 id="h1">Результаты турнира</h2>
            {isAdmin?(<Link className="link" to={`/auth/fill/results1x1/r1?id=${tourn_id}`}> <h3>Редактировать результаты</h3></Link>):(<></>)}
            <ol>
            <div id="container">
            <div id="container1">
            <h3> 1 round</h3>
                {round1.map((r1)=>(
                    <li>
                    <div id="participant-container">
                        <div id = 'row'>
                        <p class="id">{r1.participant1} </p>
                        <p class="name"> {r1.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r1.participant2} </p>
                        <p class="name"> {r1.score2}</p></div>
                   </div>
                   </li>
                ))}
            </div>
            <div id="container2">
            <h3> 2 round</h3>
            {round2.map((r2)=>(
                <li> 
                <div id="participant-container">
                <div id = 'row'>
                        <p class="id">{r2.participant1} </p>
                        <p class="name"> {r2.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r2.participant2} </p>
                        <p class="name"> {r2.score2}</p></div>
                </div>
                </li>
            ))}        
            </div>
           {round3.length>0?(<div id="container3">
               <h3> 3 round</h3>
                {round3.map((r3)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r3.participant1} </p>
                            <p class="name"> {r3.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r3.participant2} </p>
                            <p class="name"> {r3.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}
            {round4.length>0?(<div id="container4">
               <h3> 4 round</h3>
                {round4.map((r4)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r4.participant1} </p>
                            <p class="name"> {r4.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r4.participant2} </p>
                            <p class="name"> {r4.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}

            {round5.length>0?(<div id="container5">
               <h3> 5 round</h3>
                {round5.map((r5)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r5.participant1} </p>
                            <p class="name"> {r5.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r5.participant2} </p>
                            <p class="name"> {r5.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}

            {round6.length>0?(<div id="container6">
               <h3> 6 round</h3>
                {round6.map((r6)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r6.participant1} </p>
                            <p class="name"> {r6.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r6.participant2} </p>
                            <p class="name"> {r6.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}

            {round7.length>0?(<div id="container7">
               <h3> 7 round</h3>
                {round7.map((r7)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r7.participant1} </p>
                            <p class="name"> {r7.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r7.participant2} </p>
                            <p class="name"> {r7.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}


            {round8.length>0?(<div id="container8">
               <h3> 8 round</h3>
                {round8.map((r8)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r8.participant1} </p>
                            <p class="name"> {r8.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r8.participant2} </p>
                            <p class="name"> {r8.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}

            {round9.length>0?(<div id="container9">
               <h3> 9 round</h3>
                {round9.map((r9)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r9.participant1} </p>
                            <p class="name"> {r9.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r9.participant2} </p>
                            <p class="name"> {r9.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}


            {round10.length>0?(<div id="container10">
               <h3> 10 round</h3>
                {round10.map((r10)=>(
                    <li> 
                    <div id="participant-container">
                    <div id = 'row'>
                            <p class="id">{r10.participant1} </p>
                            <p class="name"> {r10.score1}</p></div>
                            <br/>
                            <div id = 'row'><p class="id">{r10.participant2} </p>
                            <p class="name"> {r10.score2}</p></div>
                    </div>
                    </li>
                ))}
            {/* {round3dpl.map((r3dpl)=>(
                <li> 
                <div id="participant-container">
                <h3> 3d place round</h3>
                <div id = 'row'>
                        <p class="id">{r3dpl.participant1} </p>
                        <p class="name"> {r3dpl.score1}</p></div>
                        <br/>
                        <div id = 'row'><p class="id">{r3dpl.participant2} </p>
                        <p class="name"> {r3dpl.score2}</p></div>
                </div>
                </li>
            ))} */}
            </div>):(<></>)}
            </div>
            </ol>           
            </main>

        </>
    )
}

export default GetResultsAll;