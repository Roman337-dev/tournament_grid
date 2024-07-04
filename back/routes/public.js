const path = require('path');
const express = require('express');
const publicRouter = express.Router();
const multer  = require('multer');
const pool = require('../db/db');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/avatars');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });
publicRouter.use(express.json());
publicRouter.use('/public',express.static(path.join(__dirname, "../public")));

publicRouter.get('/', async(_,res)=>{
	
	 const results= await pool.query("SELECT * FROM news ORDER BY id DESC LIMIT 1")
	if (results.rows.length > 0) {
		res.status(200).json({res: results.rows[0]})
	}
})
publicRouter.get('/news', async(_,res)=>{

	 const results= await pool.query("SELECT * FROM news ORDER BY id DESC")
	if (results.rows.length > 0) {
		res.status(200).json({news: results.rows})
	}
})

publicRouter.post('/user/sign-up',upload.single('image'), async(req,res)=>{
	const { email,username, password, tel_numb, name, age } = req.body;
	if (!req.file) {
		res.status(400).send("No file uploaded.");
		return;
}
	const image = req.file.path;
	const role = 'user';
 	const banned = false;
	let admin;
	let user;
	if(role == 'user'){
		admin=false;
		user=true;
	}
	const status = 'offline';
	const tag = email;
	await pool.query("INSERT INTO users (email, username, password, telephonenumber, tag,name, age, role, banned, admin, person,image, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13)",[email, username, password, tel_numb, tag, name, age, role, banned, admin, user, image, status])
	res.status(200).send("ok");
	})

	publicRouter.post('/user/sign-in', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);

        if (result.rows.length > 0) {
            
            const idRes = await pool.query('SELECT id FROM users WHERE email= $1', [email]);
            req.session.userId = idRes.rows[0].id; 
            await pool.query("UPDATE users SET status = 'online' WHERE email = $1", [email]);
						req.session.auth = true;
            req.session.userEmail = email;
            return res.status(200).json({ message: 'ok' });
        } else {
            return res.status(401).json({ message: 'Неправильный email или пароль' });
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        return res.status(500).json({ message: 'Ошибка входа' });
    }
});




	module.exports = publicRouter;