import React, { useState, useEffect } from "react";
import axios from "axios";
import '../style.css';
import { useAuth } from '../../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';

const EditNews = () => {
    const [edNews, setEdNews] = useState({});
    const [avatar, setAvatar] = useState('');
    const [title, setTitle] = useState('');
    const [info, setInfo] = useState('');
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const news_id = query.get('id');
        fetchNews(news_id);
    }, [location.search]);

    const fetchNews = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/auth/user/admin/get/edit/news?id=${id}` , { withCredentials: true });
            console.log("Данные с сервера:", response.data);
            const news = response.data.news[0];
            setEdNews(news);
            setTitle(news.title);
            setInfo(news.information);
            setAvatar(news.image);
        } catch (error) {
            console.error("Ошибка при получении новости:", error);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            const avatarImage = document.getElementById('avatarImage');
            avatarImage.src = URL.createObjectURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', edNews.id);
        formData.append('title', title);
        formData.append('information', info);
        if (avatar instanceof File) {
            formData.append('image', avatar);
        }

        try {
            await axios.put('http://localhost:3000/auth/user/admin/edit/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            alert('Новость успешно обновлена!');
            window.location.href = '/news';
        } catch (error) {
            console.error("Ошибка при обновлении новости:", error);
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
                        </div>)}
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
            <main id="container">
                <form onSubmit={handleSubmit}>
                    <h1>Форма для редактирования новостей</h1>
                    <label htmlFor="avatar">
                        <img
                            id="avatarImage"
                            className="imageSignUp"
                            alt="Avatar"
                            src={avatar instanceof File ? URL.createObjectURL(avatar) : `http://localhost:3000/public/avatars/${avatar}` || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}
                        />
                    </label>
                    <input
                        id="avatarSelect"
                        type="file"
                        onChange={handleAvatarChange}
                        name="avatarImgName"
                        className="disable"
                        accept="image/*"
                    />
                    <div id="edit-fields">
                        <p className="user-title">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Редактирование заголовка"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </p>
                        <p className="user-info">
                            <input
                                type="text"
                                id="info"
                                name="info"
                                placeholder="Редактирование информации"
                                value={info}
                                onChange={(e) => setInfo(e.target.value)}
                            />
                        </p>
                    </div>
                    <button type='submit'>Редактировать</button>
                </form>
            </main>
        </>
    );
};

export default EditNews;