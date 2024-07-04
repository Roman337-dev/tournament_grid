import React,{useState,useEffect} from "react";
import '../style.css';
import axios from "axios";
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const News=()=>{
    const [news, setNews] = useState([]);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get('http://localhost:3000/news');
            setNews(response.data.news);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    return (
        <>
            <header>
                <nav>
                    <ul>
                        <li><Link className="link" to="/">главная</Link></li>
                        {isAuthenticated?(<li><Link className="link" to="/auth/tournaments">турниры</Link></li>) :(<></>)}
                        <li><Link className="link" to="/news">новости</Link></li>
                    </ul>
                </nav>
                <div id="user-actions">
                    {isAuthenticated ? (<button onClick={logout}>Выйти из аккаунта</button>) :
                        (<div>
                            <button><Link className="link" to="/Reg">регистрация</Link></button>
                            <button><Link className="link" to="/Login">вход</Link></button>
                        </div>)}
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
                <h1>Новости</h1>
                {news.length > 0 ? (
                        <>
                        {news.map((item) => (
                            <div id="new-container" key={item.id}>
                           
                                <h2>{item.title}</h2>
                                <p>{item.information}</p>
                                {item.image && <img src={`http://localhost:3000/public/avatars/${item.image}`} alt="News" />}
                            </div>
                        ))}
                    </>
                ) : (
                    <p>No news available</p>
                )}
            </main>
        </>
    );
}

export default News;