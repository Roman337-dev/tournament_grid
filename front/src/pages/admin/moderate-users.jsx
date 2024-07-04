import React, { useEffect, useState } from "react";
import '../styles.css';
import axios from "axios";
import { Link } from 'react-router-dom';

const Moderate_users = ()=>{
    const [users, setUsers] = useState([]);

    
  
    useEffect(() => {

    fetchUsers();

    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/user/admin", { withCredentials: true });
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }
    const deleteUser = async(id)=>{
        
        try{const response = await axios.delete('http://localhost:3000/auth/user/admin/delete/users',{id:id}, { withCredentials: true });
        setUsers(response.data.users);}
        catch(error){
            console.error("Error deleting user:", error);
        }
    }
    const UnBanUser = async(id)=>{
        try {
            const response = await axios.put("http://localhost:3000/auth/user/admin/give/unban",  {id:id} , { withCredentials: true });
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error unbanning user:", error);
        }
    }
    const BanUser = async(id)=>{
        try {
            const response = await axios.put("http://localhost:3000/auth/user/admin/give/ban", { id:id }, { withCredentials: true });
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error banning user:", error);
        }
    }
    return(
        <>
        <Link className="link" to="/auth/profile"> <h3>Обратно</h3></Link>
        <div>
            <div className='cont'>
                {users.map((user)=>(
                    <div className='containerADm'>
                        {user.image?(<img src={`http://localhost:3000/public/avatars/${user.image}`}/>):( <img src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"/>)}
                        <p>{user.email}</p>
                        <p>{user.username}</p>
                        
                        <button onClick={() => deleteUser(user.id)}>Удалить пользователя</button>
                        {user.banned?( <button onClick={() => UnBanUser(user.id)}>Разблокировать пользователя</button>):( <button onClick={() => BanUser(user.id)}>Заблокировать пользователя</button>)}
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}
export default Moderate_users;