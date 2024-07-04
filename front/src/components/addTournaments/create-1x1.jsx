import React,{useState} from "react";
import axios from "axios";

const S1x1=({setType})=>{
    const [name, setName]=useState('');
   
    const [game, setGame]=useState('')

 
    const [date, setDate]=useState('')
    const [time_from, setTime_from]=useState('')
    const [time_to, setTime_to]=useState('')

    const Submit = async(e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3000/auth/user/create/tournament/1x1', { 
            name,
            game,
            date,
            time_from,
            time_to}, {
                withCredentials: true
            });
            console.log('Create successfully',response);
        if(response.data == 'ok'){
                window.location.href = '/auth/tournaments';
            }
        } catch (error) {
            console.error('Error creating', error);
        }
    };
return(
        <div className='form-container'>
           <div style={{display:"flex", flexDirection:"row",justifyContent:'center'}}>
            <button onClick={()=>setType('battleRoyal')}>Battle royal</button>
            <button onClick={()=>setType('battleRoyalT')}>Battle royal Team</button>
            <button onClick={()=>setType('1x1A')}>Турнир 1x1 всех</button>
            <button onClick={()=>setType('1x1')}>Турниры 1х1</button>
            <button onClick={()=>setType('tourn')}>Турниры для команд</button></div>
        <form onSubmit={Submit}>
        <h1>Форма для Турнира 1x1</h1>
        <hr></hr>


        <label for="name"><b>Название турнира</b></label>
        <input type="text" id="name" 
        placeholder="Введите название турнира"
        value={name} 
        onChange={(e)=>setName(e.target.value)}
        name="name"
         required/>


<label for="game"><b>Игра по которой турнир</b></label>
        <input type="text" id="game" 
        placeholder="Введите название игры"
        value={game} 
        onChange={(e)=>setGame(e.target.value)}
         name="game" required/>


<label for="date"><b>Дата</b></label>
        <input type="date" id="date" 
        placeholder="Введите дату" 
        value={date} 
        onChange={(e)=>setDate(e.target.value)}
        name="date" required/>

<label for="time_from"><b>Время c:</b></label>
        <input type="time" id="time_from"
         placeholder="Введите время от" 
         value={time_from} 
        onChange={(e)=>setTime_from(e.target.value)}
         name="time" required/>
        
       <label for="time_to"><b>Время до:</b></label>
        <input type="time" 
        id="time_to" 
        placeholder="Введите время до" 
        value={time_to} 
        onChange={(e)=>setTime_to(e.target.value)}
        name="time_2" required/>
        <button type='submit'>
        Создать
        </button>
        </form>
        </div>
    )
}

export default S1x1;