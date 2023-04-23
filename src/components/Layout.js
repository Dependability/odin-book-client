import Icon from '@mdi/react';
import '../assets/styles.css'
import { mdiHomeOutline, mdiAccountMultipleOutline, mdiHome, mdiAccountMultiple, mdiLogout } from '@mdi/js';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import pfpicon from '../assets/user-profile-icon.svg';
import { useState, useEffect } from 'react';
function Layout(props) {
    const navigate = useNavigate();
    const [showPopup, setPopup] = useState(false);
    const [userInfo, setUser] = useState({username: '', _id: 0});

    useEffect(()=>{
        if (Cookies.get('User')) {
            let currentUser = JSON.parse(Cookies.get('User'));  
            setUser((c)=> {
                let copy = {...c};
                copy.username = currentUser.username;
                copy._id = currentUser._id;
                return copy;
            })
        } else {
            navigate('/login')
            return;
        }
        
    },[navigate])
    return <div className='layout'>
        {showPopup ? <div className='user-popup-wrapper' onClick={()=>{setPopup(false)}}>
            <div className='user-popup'>
                <div className='user-profile' onClick={()=>{navigate('/user/' + userInfo._id)}}>
                    <div className='pfp'>
                        <img src={pfpicon} alt='' />
                    </div>
                    <span className='username'>{userInfo.username}</span>
                </div>
                <div className='log-out-button' onClick={()=> {
            Cookies.remove('Authorization');
            Cookies.remove('User');
            navigate('/login');
        }}>
                    <div className='log-out-icon'>
                        <Icon path={mdiLogout}></Icon>
                    </div>
                    <span>Log out</span>
                    
                </div>
            </div>
        </div> : ''}
        <header>
            <div className='left'>
            <h1 className='logo' onClick={()=> {navigate('/')}}>OdinBook</h1>
            </div>
            <nav>
                <div className={'navItem ' + (props.selected === 'Home' ? 'selected' : 'unselected')}><a href={process.env.PUBLIC_URL + '/'} ><Icon path={props.selected === 'Home' ? mdiHome : mdiHomeOutline} /></a></div>
                <div className={'navItem ' + (props.selected === 'Friends' ? 'selected' : 'unselected')}><a href={process.env.PUBLIC_URL + '/friends'} ><Icon path={props.selected === 'Friends' ?mdiAccountMultiple : mdiAccountMultipleOutline}/></a></div>
            </nav>
            <div className='right'>
            <div className='navProfile' onClick={()=>{setPopup(true)}}><img src={pfpicon} alt='' /></div>
            </div>
        </header>
        <main>{props.children}</main>
    </div>
}

export default Layout;