import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Icon from '@mdi/react';
import '../assets/styles.css'
import squareicon from '../assets/square-icon.svg';
import { mdiAccountPlus, mdiAccountMultiple, mdiAccountDetails } from '@mdi/js';
import {useNavigate} from 'react-router-dom';
function Friends() {
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
        const bearer = `Bearer ${Cookies.get('Authorization')}`;
        
        fetch(`https://limitless-escarpment-37900.herokuapp.com/api/users`, {method: 'GET', headers: {Authorization: `${bearer}`}}).then((res) => res.json())
        .then(data => {
            setUserList([...data.users])
        })

    }, [])


    function friendRequest(friendId, type='friend') {
        
        const bearer = Cookies.get('Authorization');
        fetch(`https://limitless-escarpment-37900.herokuapp.com/api/users/${friendId}/${type}`, {method: 'POST', headers: {'Authorization': `Bearer ${bearer}`}})
        .then((res) => res.json())
        .then((data) => {

            console.log(data)
            
        })
    }

    return <Layout selected={'Friends'}>
        <div className='friendPage'>
            <div className='leftControls'>
                <h2>Friends</h2>
                <div className='selected'><div className='friendIcon'><Icon path={mdiAccountMultiple} /></div> Home</div>
                <div onClick={()=> {navigate('/friends/requests')}}><div className='friendIcon'><Icon path={mdiAccountPlus}  /></div>Friend Requests</div>
                <div onClick={()=> {navigate('/friends/list')}}><div className='friendIcon'><Icon path={mdiAccountDetails}  /></div>All Friends</div>
            </div>
            <div className='right-panel'>
                <div className='suggestions'>
                    <h2>Others on OdinBook</h2>
                    <div className='suggestion-list'>
                        {userList.map((user, ind)=> {
                            return <div className='suggestion-item' key={ind}>
                            <div className='photo' onClick={()=> {navigate(`/user/${user._id}`)}}><img src={squareicon} alt='' /></div>
                            <div className='bottom'>
                                <span className='username' onClick={()=> {navigate(`/user/${user._id}`)}}>
                                    {user.username}
                                </span>
                                <div className='friend-button' onClick={(e)=> {friendRequest(user._id); e.target.classList.add('hidden')}}>
                                    Add Friend
                                </div>
                            </div>
                        </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    </Layout>
    
}

export default Friends;