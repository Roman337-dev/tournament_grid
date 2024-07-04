const {Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    password:'852274',
    host: 'localhost',
    port: 5432,
    database:'cybersport_db'
});

pool.connect((err)=>{
    if(err){
        console.log('connetion error', err.stack)
    }
    else{
        console.log("connected!");
    }
})


module.exports=pool;