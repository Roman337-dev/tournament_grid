import React,{useState} from "react";

import axios from "axios";

const AddNews = ()=>{
   const [title, setTitle]=useState('');
   const [info, setInfo]=useState('');
   const [avatar, setAvatar]=useState(null);
    
   const avatarChange = async(e) => {
    const avatarSelect = document.getElementById('avatarSelect');
    const avatarImage = document.getElementById('avatarImage');
    const image = avatarSelect.files[0];

    if (image) {
        avatarImage.src = URL.createObjectURL(image);
        setAvatar(image); 
        avatarImage.classList.toggle("preview-avatar");
    }
};
const Submit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('info', info);
    formData.append('avatar', avatar);
    try {
        const response = await axios.post('http://localhost:3000/auth/user/admin/add/news', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },withCredentials: true
        });
        console.log('Create successfully',response);
        if(response.data == 'ok'){
            window.location.href = '/News';
        }
    } catch (error) {
         console.error('Error creating', error);
    }

};
    return(
        <div className='form-container'>
        <form onSubmit={Submit}>
            <h1>Форма для создания Новостей</h1>
        <hr></hr>
    
        <label for="title"><b>Заголовок</b></label>
        <input type="text" 
        id="title" 
        placeholder="Введи заголовок"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        name="title" 
        required/>
        
        <label for="info"><b>Информация</b></label>
        <textarea type="text" 
        id="info"
        style={{backgroundColor:"#333131", padding: "12px 15px",
        margin: "8px 0", borderRadius:'10px',width: '40%' }} 
        value={info}
        onChange={(e)=>setInfo(e.target.value)}
        placeholder="Введи информацию" 
        name="info" 

        required>

        </textarea>
    
        <img id="avatarImage" className="imageSignUp" alt="Avatar" src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"/>
                <input
                    id="avatarSelect"
                    type="file"
                    onChange={avatarChange}
                    name="avatarImgName"
                    className="disable"
                  
                    accept="image/*"
                />
        <button type='submit'>Отправить</button>

        </form>
        </div>
    )
}

export default AddNews;