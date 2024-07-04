import React, { useState } from "react";
import axios from "axios";

const BattleRoyal = ({ setType }) => {
    const [name, setName] = useState('');
    const [game, setGame] = useState('');
    const [num_of_part, setNum_of_part] = useState('');
    const [date, setDate] = useState('');
    const [time_from, setTime_from] = useState('');
    const [time_to, setTime_to] = useState('');

    const Submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/user/create/tournament/battle-royal', {
                name,
                game,
                num_of_part,
                date,
                time_from,
                time_to
            }, {
                withCredentials: true
            });

            console.log('Create successfully', response);
            if (response.data === 'ok') {
                window.location.href = '/auth/tournaments';
            }
        } catch (error) {
            console.error('Error creating', error);
        }
    };

    return (
        <div className='form-container'>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}>
                <button onClick={() => setType('battleRoyal')}>Battle Royal</button>
                <button onClick={() => setType('battleRoyalT')}>Battle Royal Team</button>
                <button onClick={() => setType('1x1A')}>Турнир 1x1 всех</button>
                <button onClick={() => setType('1x1')}>Турниры 1х1</button>
                <button onClick={() => setType('tourn')}>Турниры для команд</button>
            </div>
            <form onSubmit={Submit}>
                <h1>Форма для Турнира Battle Royal</h1>
                <hr />

                <label htmlFor="name"><b>Название турнира</b></label>
                <input
                    type="text"
                    id="name"
                    placeholder="Введите название турнира"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="game"><b>Игра по которой турнир</b></label>
                <input
                    type="text"
                    id="game"
                    placeholder="Введите название игры"
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    required
                />

                <label htmlFor="num_of_part"><b>Максимальное кол-во человек</b></label>
                <input
                    type="number"
                    id="num_of_part"
                    placeholder="Введите кол-во людей в команде"
                    value={num_of_part}
                    onChange={(e) => setNum_of_part(e.target.value)}
                    required
                />

                <label htmlFor="date"><b>Дата</b></label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <label htmlFor="time_from"><b>Время с:</b></label>
                <input
                    type="time"
                    id="time_from"
                    value={time_from}
                    onChange={(e) => setTime_from(e.target.value)}
                    required
                />

                <label htmlFor="time_to"><b>Время до:</b></label>
                <input
                    type="time"
                    id="time_to"
                    value={time_to}
                    onChange={(e) => setTime_to(e.target.value)}
                    required
                />

                <button type='submit'>Создать</button>
            </form>
        </div>
    );
}

export default BattleRoyal;