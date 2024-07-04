import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth.jsx";

import './styles.css';
import axios from "axios";

const General = () => {
    const [news, SetNews] = useState({});
    const { isAuthenticated, logout } = useAuth();
    
    useEffect(() => {
       
    fetchNews();
        
    }, []);
    
    const fetchNews = async () => {
        try {
           
            const response = await axios.get("http://localhost:3000/");
            SetNews(response.data.res);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    }
    return (
        <>
            <header>
                <nav>
                    <ul>
                        <Link className="link" to="/"><li>главная</li></Link>   
                        {isAuthenticated?(<li><Link className="link" to="/auth/tournaments">турниры</Link></li>) :(<></>)}
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
            
           {isAuthenticated?(<aside id="profile-section">
                <div id="profile">
                    <Link className="link" to="/auth/profile"> <h3>Профиль</h3></Link>

                </div>
                <div id="my-team">
                    <Link className="link" to="/auth/my_team"><h3>Моя команда</h3></Link>

                </div>
                <div id="team-search">
                    <Link className="link" to="/auth/teams"> <h3>Комманды</h3></Link>

                </div>
            </aside>):(<></>) } 
            <main id="news-container">
                <h1>
                    Самая свежая новость!
                </h1>
               

                    <div id="new-container">
                    <h2>{news.title}</h2>
                    <div>{news.information}</div>
                    {news.image && <img src={`http://localhost:3000/public/avatars/${news.image}`} alt="News" />}
                        
                    </div>

           
            </main>
        </>
    )
}

export default General;