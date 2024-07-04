import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
const Auth = ({ setType}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/user/sign-in', {
                email: email,
                password: password
            });

            console.log('User signed in successfully', response);
            if (response.data.message === 'ok') {
                window.location.href = '/'; 
                login(email,password)
            } else {
                alert('Неправильный email или пароль');
            }
        } catch (error) {
            console.error('Error signing in', error);
            alert('Ошибка входа: ' + error.message);
        }
    };

    return (
        <div className='form-container sign-in-container'>
            <button id='changeButt' onClick={() => setType('reg')}>
                Регистрация
            </button>
            <form onSubmit={handleSubmit}>
                <h1>Авторизация</h1>
                <hr></hr>
                <label htmlFor='email'><b>Email</b></label>
                <input
                    type='text'
                    id='email'
                    placeholder='Введите Email/Логин'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    name='email'
                    required
                />
                <label htmlFor='password'><b>Пароль</b></label>
                <input
                    type='password'
                    id='password'
                    placeholder='Введите Пароль'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name='password'
                    required
                />
                <button type='submit'>Sign In</button>
            </form>
        </div>
    );
};

export default Auth;