import React, { useState } from 'react'
import axios from 'axios'

const Reg = ({ setType }) => {
	const [avatar, setAvatar] = useState(null)
	const [email, setEmail] = useState('')
	const [username, setUsername] = useState('')
	const [name, setName] = useState('')
	const [tel, setTel] = useState('')

	const [password, setPassword] = useState('')
	const [rep_password, setRep_Password] = useState('')

	const [age, setAge] = useState('')
	const [isChecked, setIsChecked] = useState(true)
	const [error, setError] = useState(null)
	const avatarChange = async (e) => {
		const avatarSelect = document.getElementById('avatarSelect')
		const avatarImage = document.getElementById('avatarImage')
		const image = avatarSelect.files[0]

		if (image) {
			avatarImage.src = URL.createObjectURL(image)
			setAvatar(image)
			avatarImage.classList.toggle('preview-avatar')
		}
	}

	const Submit = async (e) => {
		e.preventDefault()
		if (password !== rep_password) {
			setError('Passwords do not match')
			return
		}
		const formData = new FormData()
		formData.append('email', email)
		formData.append('username', username)
		formData.append('name', name)
		formData.append('tel_numb', tel)
		formData.append('password', password)
		formData.append('age', age)
		formData.append('image', avatar)

		try {
			const response = await axios.post(
				'http://localhost:3000/user/sign-up',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			)
			console.log('User signed up successfully', response)
			if (response.data == 'ok') {
				window.location.href = '/Login'
			}
		} catch (error) {
			console.error('Error in sign in', error)
			setError('An error occurred during sign in. Please try again.')
		}
	}

	return (
		<div className='form-container sign-up-container'>
			<button id='changeButt' onClick={() => setType('auth')}>
				Авторизация
			</button>
			<form onSubmit={Submit}>
				<h1>Регистрация</h1>
				<hr></hr>
				<img
					id='avatarImage'
					className='imageSignUp'
					alt='Avatar'
					src='https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png'
				/>
				<input
					id='avatarSelect'
					type='file'
					onChange={avatarChange}
					name='avatarImgName'
					className='disable'
					accept='image/*'
				/>
				<label htmlFor='Email'>
					<b>Email</b>
				</label>
				<input
					type='text'
					id='email'
					placeholder='Введите Email/Логин'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					name='email'
					required
				/>
				<label htmlFor='Username'>
					<b>Username</b>
				</label>
				<input
					type='text'
					id='username'
					placeholder='Введите Username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					name='username'
					required
				/>
				<label htmlFor='Name'>
					<b>Имя</b>
				</label>
				<input
					type='text'
					id='name'
					placeholder='Введите Ваше Имя'
					value={name}
					onChange={(e) => setName(e.target.value)}
					name='name'
					required
				/>
				<label htmlFor='tel'>
					<b>Телефон</b>
				</label>
				<input
					type='text'
					id='tel'
					placeholder='Введите телефон'
					value={tel}
					onChange={(e) => setTel(e.target.value)}
					name='tel'
					required
				/>
				<label htmlFor='psw'>
					<b>Пароль</b>
				</label>
				<input
					type='password'
					id='password'
					placeholder='Введите Пароль'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					name='psw'
					required
				/>
				<label htmlFor='rep_psw'>
					<b>Повторите пароль</b>
				</label>
				<input
					type='password'
					id='rep_password'
					placeholder='Подтвердите Пароль'
					value={rep_password}
					onChange={(e) => setRep_Password(e.target.value)}
					name='rep_psw'
					required
				/>
				<label for='age'>
					<b>Возраст</b>
				</label>
				<input
					type='number'
					placeholder='Введите ваш возраст'
					name='age'
					value={age}
					onChange={(e) => setAge(e.target.value)}
					required
				/>
				<input
					type='checkbox'
					checked={isChecked}
					onChange={(e) => setIsChecked(e.target.checked)}
					name='correct'
					id='check'
					required
				/>{' '}
				Я согласен с{' '}
				<a id='term' href=''>
					политикой конфиденциальности
				</a>
				{error && (
					<div style={{ color: 'red', fontWeight: '24px' }}>{error}</div>
				)}
				<button type='submit'>Sign Up</button>
			</form>
		</div>
	)
}

export default Reg
