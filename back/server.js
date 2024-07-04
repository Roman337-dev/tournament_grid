const express = require('express')
const session = require('express-session')
const http = require('http')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const history = require('connect-history-api-fallback')
const bodyParser = require('body-parser')
const app = express()
const server = http.createServer(app)

app.use(
	express.urlencoded({
		extended: true,
	})
)

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)
app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['POST', 'PUT', 'GET', 'DELETE'],
		credentials: true,
	})
)
app.use((req, res, next) => {
	res.setHeader('Content-Type', 'text/plain; charset=UTF-8')
	next()
})
app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname, '../public')))
app.use(morgan(':method :url :status :user-agent - :response-time ms'))
app.use(history())
const sessionMw = session({
	secret: 'messenger-session',
	resave: false,
	saveUninitialized: true,
})

app.use(sessionMw)
// io.use(
//   sharedSession(sessionMw, {
//     autoSave: true,
//   }),
// );

const { logger } = require('./middleware/all.middleware')
const { authInit } = require('./middleware/auth.middleware')
const publicRouter = require('./routes/public')
const privateRouter = require('./routes/private')
// const socketIORouter = require('./routes/socetIO');
app.use(express.json())

app.use(authInit())
app.use(logger)

app.use(publicRouter)
app.use('/auth', privateRouter)
// io.use( socketIORouter(io))

server.listen(3000, () => {
	console.log(`Сервер запущен! 3000`)
}) //hosting///
