import React, { useState, useEffect } from 'react'
import '../style.css'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'

const NewsForAdm = () => {
	const [news, setNews] = useState([])
	const { isAuthenticated, logout } = useAuth()

	useEffect(() => {
		fetchNews()
	}, [])

	const fetchNews = async () => {
		try {
			const response = await axios.get('http://localhost:3000/auth/adm-news', {
				withCredentials: true,
			})
			setNews(response.data.news)
		} catch (error) {
			console.error('Error fetching news:', error)
		}
	}
	const handleDelete = async (id) => {
		try {
			await axios.delete(
				`http://localhost:3000/auth/user/admin/delete/news?id=${id}`,
				{ withCredentials: true }
			)

			fetchNews()
		} catch (error) {
			console.error('Error deleting news:', error)
		}
	}

	return (
		<>
			<header>
				<nav>
					<ul>
						<li>
							<Link className='link' to='/'>
								главная
							</Link>
						</li>
						<li>
							<Link className='link' to='/auth/tournaments'>
								турниры
							</Link>
						</li>
						<li>
							<Link className='link' to='/news'>
								новости
							</Link>
						</li>
					</ul>
				</nav>
				<div id='user-actions'>
					{isAuthenticated ? (
						<button onClick={logout}>Выйти из аккаунта</button>
					) : (
						<div>
							<button>
								<Link className='link' to='/Reg'>
									регистрация
								</Link>
							</button>
							<button>
								<Link className='link' to='/Login'>
									вход
								</Link>
							</button>
						</div>
					)}
				</div>
			</header>
			<h1>Новости</h1>
			<main id='container'>
				{news.length > 0 ? (
					<ul>
						{news.map((item) => (
							<li key={item.id}>
								<h2>{item.title}</h2>
								<p>{item.information}</p>
								{item.image && (
									<img
										src={`http://localhost:3000/public/avatars/${item.image}`}
										alt='News'
									/>
								)}

								<button onClick={() => handleDelete(item.id)}>Delete</button>
								<Link className='link' to={`/auth/get/edit/news?id=${item.id}`}>
									{' '}
									<button>Edit</button>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<p>No news available</p>
				)}
			</main>
		</>
	)
}

export default NewsForAdm
