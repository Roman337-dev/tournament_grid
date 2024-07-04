import React, { useEffect, useState } from "react";
import './styles.css';
import axios from "axios";
import { useAuth } from "../hooks/useAuth.jsx";
import { Link } from "react-router-dom";

const Profile = () => {
    const [avatar, setAvatar] = useState(null);
    const [prof, setProf] = useState({
        username: '',
        name: '',
        age: '',
    });

    const { isAuthenticated, isAdmin, logout } = useAuth();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/profile", { withCredentials: true });
            setProf(response.data.profInfo); 
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    const avatarChange = (e) => {
        const image = e.target.files[0];
        if (image) {
            setAvatar(image); 
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProf(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const Submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', prof.username);
        formData.append('name', prof.name);
        formData.append('age', prof.age);

        if (avatar) {
            formData.append('image', avatar);
        }
        try {
            const response = await axios.put('http://localhost:3000/auth/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (response.status === 200) {
                console.log('Profile updated successfully');
                fetchUser();
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
            <header>
                <nav>
                    <ul>
                        <li><Link className="link" to="/">Главная</Link></li>
                        <li><Link className="link" to="/auth/tournaments">Турниры</Link></li>
                        <li><Link className="link" to="/news">Новости</Link></li>
                    </ul>
                </nav>
                <div id="user-actions">
                    {isAuthenticated ? (<button onClick={logout}>Выйти из аккаунта</button>) :
                        (<div>
                            <button><Link className="link" to="/Reg">Регистрация</Link></button>
                            <button><Link className="link" to="/Login">Вход</Link></button>
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
                    <Link className="link" to="/auth/teams"><h3>Команды</h3></Link>
                </div>
            </aside>

            <main id='container'>
                {isAdmin && (
                    <div id='admincont'>
                        <button><Link className="link" to="/auth/user/admin">Модерация пользователей</Link></button>
                        <button><Link className="link" to="/auth/addNews">Подача новостей</Link></button>
                        <button><Link className="link" to="/auth/adm-news">Новости для админа</Link></button>
                    </div>
                )}
                <form onSubmit={Submit}>
                    <label htmlFor="avatar">
                        <img
                            id="avatarImage"
                            className="imageSignUp"
                            alt="Avatar"
                            src={avatar ? URL.createObjectURL(avatar) : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}
                        />
                    </label>
                    <input
                        style={{width:'300px'}}
                        id="avatarSelect"
                        type="file"
                        onChange={avatarChange}
                        name="avatarImgName"
                        className="disable"
                        accept="image/*"
                    />
                    <div id="edit-fields">
                        <p className="user-display-name">
                            <input
                            style={{width:'150px'}}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Новое имя пользователя"
                                value={prof.username}
                                onChange={handleChange}
                            />
                        </p>
                        <p className="user-name">
                            <input
                            style={{width:'150px'}}
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Новое имя"
                                value={prof.name}
                                onChange={handleChange}
                            />
                        </p>
                        <p className="user-age">
                            <input
                            
                                type="number"
                                id="age"
                                name="age"
                                placeholder="Новый возраст"
                                value={prof.age}
                                onChange={handleChange}
                            />
                        </p>
                    </div>
                    <button type='submit'>Изменить</button>
                </form>
               
            </main>
        </>
    )
};

export default Profile;