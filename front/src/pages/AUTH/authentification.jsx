
import React,{ useState } from 'react'
import '../style.css';
import axios from "axios";
import Auth from '../../components/auth/Auth';
import Reg from '../../components/auth/Reg';


const Authentification = ({types})=>{
const [type, setType]=useState(types);
return(
    <>
    <div className={`container ${type === 'reg' ? 'reg-panel-active' : ''}`}>

    <Reg setType={setType}/>
    <Auth setType={setType}/>
    </div>
    </>
)
}

export default Authentification;
