import Cookies from "js-cookie";
import Post from "./Post";
import Layout from './Layout';
import {useState, useEffect} from 'react';
import Icon from '@mdi/react';
import '../assets/styles.css'
import { mdiAccountMultiple, mdiClose } from '@mdi/js';
import { useNavigate } from "react-router-dom";
import pfpicon from '../assets/user-profile-icon.svg';
function Home() {
    const [currentUser, setCurrentUser] = useState({username: '', _id: 0});
    const [postText, setText] = useState('');
    const navigate = useNavigate();
    useEffect(()=> {
        console.log('stay')
        fetch('http://limitless-escarpment-37900.herokuapp.com/api/posts')
        .then((res) => res.json())
        .then((data) => {
            setPosts([...data.posts])})
        
        let currentInfo = JSON.parse(Cookies.get('User'));
        console.log(currentInfo)
        setCurrentUser((c) => {
            let copy = {...c};
            copy._id = currentInfo._id;
            copy.username = currentInfo.username;
            return copy;
        })

    }, [])
    
    function createPost() {
        const bearer = Cookies.get('Authorization');
        fetch(`http://limitless-escarpment-37900.herokuapp.com/api/posts`, {method: 'POST', headers: {'Content-Type': 'application/json','Authorization': `Bearer ${bearer}`}, body: JSON.stringify({
            text: postText})})
        .then((res) => res.json())
        .then((data) => {
            console.log(data);   
        })
    }

    const [posts, setPosts] = useState([]);
    const [showCreate, setCreate] = useState(false);
    return (<Layout selected={'Home'}>
        {showCreate ? <div className='create-post-popup' onClick={(e) => {setCreate(false)}}>
            <div className='create-post' onClick={(e)=>{e.stopPropagation()}}>
                <div className='top-header'>Create Post <div className='close' onClick={()=> {setCreate(false)}}><Icon path={mdiClose}></Icon></div></div>
                <div className='bottom'>
                    <div className='user-cred'>
                        <div className='pfp'>
                            <img src={pfpicon} alt='' />
                        </div>
                        <span className='username'>{currentUser.username}</span>
                    </div>
                    <div className='input-text' contentEditable={true} placeholder={`What's on your mind, ${currentUser.username}?` } onInput={(e)=> {
                        setText(e.target.innerText);
                        if (postText.length > 150) {
                            e.target.classList.add('small');
                        } else {
                            e.target.classList.remove('small');
                        }
                    }}></div>
                    <div className={`post-button ${postText ? 'valid' : ''}`} onClick={() => {createPost(postText); setCreate(false)}}>Post</div>
                </div>
            </div>

        </div> : ''}
        <div className="leftMenu">
            <div className='menuOption' onClick={()=>{navigate(`/user/${currentUser._id}`)}}><div className='pfp'>
                            <img src={pfpicon} alt='' /></div> User Profile</div>
            <div className='menuOption' onClick={()=>{navigate(`/friends`)}}><div className='friendIcon'><Icon path={mdiAccountMultiple} /></div>Friends</div>
            <div className="disclaimer">Made by Seyi Bakare</div>
        </div>
        <div className='homePosts'>
        <div className='homeCreatePost'>
            <div className='top'>
                <div className='pfp'>
                    <img src={pfpicon} alt='' />
                </div>
                <div className='postInput' onClick={(e) => {
                    setCreate(true); }}>
                    <button>{`What's on your mind, ${currentUser.username}?`}</button>
                </div>
            </div>
            <div className='bottom'>
                Photo
            </div>
        </div>
    { posts.length ? posts.map((val, i)=>{
        return <Post key={val._id} info={val} />
    }): ''
    
        

    }
    </div>
    </Layout>)
}

export default Home