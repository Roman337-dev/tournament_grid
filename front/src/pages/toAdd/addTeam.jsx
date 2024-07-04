import React,{useState} from "react";
import axios from "axios";
const AddTeam = ()=>{
    const [name, setName]=useState('');
    const [num_of_part, setNum_of_part]=useState('')
    const Submit = async(e) => {
        e.preventDefault();
   try {
        const response = await axios.post('http://localhost:3000/auth/user/create/team', {name, num_of_part}, {
            withCredentials: true
        });
        console.log('Create successfully',response);
        if(response.data == 'ok'){
            window.location.href = '/auth/teams';
        }
    } catch (error) {
        console.error('Error creating', error);
       
    }
    };

    return(
        <div className='form-container'>
        <form onSubmit={Submit}>
            <h1>Форма для создания команд</h1>
        <hr></hr>
    
        <label htmlFor="name"><b>Название команды</b></label>
        <input type="text" id="name" 
        placeholder="Введите название команды" 
        name="name" 
        value={name}
        onChange={(e)=>setName(e.target.value)}
        required />

        <label htmlFor="formate"><b>Количество людей для команды</b></label>
        <input type="text" 
        id="num_of_people" 
        placeholder="Введите кол-во людей в команде" 
        value={num_of_part}
        onChange={(e)=>setNum_of_part(e.target.value)}
        name="num_of_people" 
        required />
    
        <button type='submit'>Отправить</button>

        </form>
        </div>
    )
}

export default AddTeam