
import React,{ useState } from 'react'
import '../style.css';

import Tourn from '../../components/addTournaments/create-tourn';

import BattleRoyal from '../../components/addTournaments/create-B-R';
import BattleRoyalT from '../../components/addTournaments/create-B-RT';
import All1x1 from '../../components/addTournaments/create-1x1A';
import S1x1 from '../../components/addTournaments/create-1x1';


const AddTourn = ()=>{
const [type, setType]=useState('tourn');
return(
    <>
     <div className={`container ${type}`}>
                {type === 'tourn' && <Tourn setType={setType} />}
                {type === 'battleRoyal' && <BattleRoyal setType={setType} />}
                {type === 'battleRoyalT' && <BattleRoyalT setType={setType} />}
                {type === '1x1A' && <All1x1 setType={setType} />}
                {type === '1x1' && <S1x1 setType={setType} />}
            </div>
    </>
)
}

export default AddTourn;
