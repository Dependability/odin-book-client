import Layout from './Layout';
import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Icon from '@mdi/react';
import '../assets/styles.css';
import Post from './Post';
import squareicon from '../assets/square-icon.svg';
import pfpicon from '../assets/user-profile-icon.svg';
import { mdiAccountPlus, mdiAccountRemove, mdiAccount } from '@mdi/js';
function User() {
    const [loading, setLoading] = useState(true);
    const [userInfo, setUser] = useState({});
    const navigate = useNavigate();
    const {userId} = useParams();
    const [mode, setMode] = useState('Post');
    const [currentUser, setCurrent] = useState({});
    const [friendState, setFriendState] = useState('None');
    const [userPosts, setUserPosts] = useState([]);
    useEffect(()=> {

        const bearer = Cookies.get('Authorization');
        let currentUserId = JSON.parse(Cookies.get('User'))._id;
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUserId}`, {headers: {'Authorization': `Bearer ${bearer}`}})
        .then((response) => response.json())
        .then((data) => {
            setCurrent({...data.user});
            if (data.user.friends.find((val)=> {return val._id === userId})) {
                setFriendState('Friend');
            } else if (data.user.outgoing.find((val)=> {return val._id === userId})) {
                setFriendState('Outgoing');
            } else if (data.user.incoming.find((val)=> {return val._id === userId})) {
                setFriendState('Incoming');
            } else {
               setFriendState('None'); 
            }   
        })

        fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/posts`)
        .then((response) => response.json())
        .then((data) => {
            setUserPosts([...data.posts]);
            console.log(data.posts)
           
        })
        
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {headers: {'Authorization': `Bearer ${bearer}`}})
        .then((response) => response.json())
        .then((data) => {
            console.log()
            setLoading(false);
            setUser({...data.user})
            console.log(data.user)
        })


        

    }, [userId])

    function friendRequest(friendId, type='friend') {
        
        const bearer = Cookies.get('Authorization');
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${friendId}/${type}`, {method: 'POST', headers: {'Authorization': `Bearer ${bearer}`}})
        .then((res) => res.json())
        .then((data) => {

            console.log(data)
            if (type === 'friend') {
                setFriendState('Outgoing');
            } else if (type === 'accept') {
                setFriendState('Friend');
            } else {
                setFriendState('None');
            }
            
        })
    }

    let friendButton;
    switch (friendState) {
        case 'Friend':
            friendButton = <div className='friend-button remove' onClick={()=>{
                friendRequest(userId, 'remove');
            }}>
                <Icon path={mdiAccountRemove}></Icon>
                Remove Friend
            </div>;
            break;
        case 'Outgoing':
            friendButton = <div className='friend-button' onClick={()=>{
                friendRequest(userId, 'cancel');
            }}>
                <Icon path={mdiAccountRemove}></Icon>
                Cancel request
            </div>;
            break;
        case 'Incoming':
            friendButton = <div className='friend-button incoming'>
                <Icon path={mdiAccount}></Icon>
                Incoming request
            </div>;
            break;
        default:
            friendButton = <div className='friend-button' onClick={()=>{
                friendRequest(userId);
            }}>
                <Icon path={mdiAccountPlus}></Icon>
                Add Friend
            </div>;
    }

    // Friend Request, Cancel Request, Accept Request, Remove Friend
    return (<Layout>{
        loading ? <div className='loadingScreen'></div> :
        <div className='userPage'>
            <div className='top-page'>
                <div className='top-page-inner'>
                    <div className='header-top'>
                        <div className='header-left'>
                            <div className='profile-picture'>
                                <img src={pfpicon} alt=''/>
                            </div>
                            <div className='profile-stats'>
                                <h2>{userInfo.username}</h2>
                                {userInfo.friends.length ? <span onClick={()=>{setMode('Friend')}}>{userInfo.friends.length} {userInfo.friends.length === 1 ? 'friend' : 'friends'}</span> : ''}
                            </div>
                        </div>
                        <div className='header-right'>
                            {(currentUser._id !== userId)  ? friendButton
                            : ''}
                        </div>
                    </div>
                    {friendState === 'Incoming' ? <div className='friend-request'>
                        <div className='left'>
                            {userInfo.username} has sent you a friend request
                        </div>
                        <div className='right'>
                            <button className='accept-friend' onClick={()=>{friendRequest(userId, 'accept')}}>Confirm request</button>
                            <button className='decline-friend' onClick={()=>{friendRequest(userId, 'cancel')}}>Delete request</button>
                        </div>
                    </div> : ''}
                    <div className='header-bottom'>
                        <div className={`menu-item ${mode === 'Post' ? 'selected' : ''}`} onClick={()=> {setMode('Post')}}>
                            <div className='inner'>
                                Posts
                            </div>
                        </div>
                        <div className={`menu-item ${mode === 'Friend' ? 'selected' : ''}`} onClick={()=> {setMode('Friend')}}>
                            <div className='inner'>
                                Friends
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {mode === 'Post' ? <div className='main-page'>
                <div className='main-page-left'>
                    <div className='friend-side'>
                        <div className='top'>
                            <h2>Friends</h2>
                            <button onClick={() => {setMode('Friend')}}>See all friends</button>
                        </div>{userInfo.friends.length ?
                        <span>
                            {userInfo.friends.length} {userInfo.friends.length === 1 ? 'friend' : 'friends'}
                        </span>: ''}
                        <div className='list'>
                            {
                                userInfo.friends.map((friend, index)=>{
                                    return <div className='friend-node' key={index} onClick={()=> {navigate(`/user/${friend._id}`)}}>
                                                <div className='pfp' onClick={()=> {navigate('/user/'+friend._id)}}><img src={squareicon} alt='' /></div>
                                                <div className='friend-name' onClick={()=> {navigate('/user/'+friend._id)}}>{friend.username}</div>
                                            </div>
                                })
                            }
                            

                        </div>
                    </div>
                </div>
                <div className='main-page-right'>
                    <div className='user-posts'>
                        <div className='top-header'>
                            Posts
                        </div>
                        {userPosts.length ? <div className='post-list'>
                            {userPosts.map((val)=> {
                            return <Post key={val._id} info={val} />
                            })

                            }
                        </div> : <div className='no-post'>No posts available</div>}
                    </div>
                </div>
            </div> : <div className='friend-page'>
                    <h2>Friends</h2>
                    <div className='list'>
                    {
                            userInfo.friends.map((friend, index)=>{
                                return <div className='friend-item' key={index}>
                                <div className='left'>
                                    <div className='pfp' onClick={()=> {navigate('/user/'+friend._id)}}>
                                        <img src={squareicon} alt='' /></div>
                                    <div className='friend-name' onClick={()=> {navigate('/user/'+friend._id)}}>{friend.username}</div>
                                </div>
                                {(currentUser.outgoing.find((val)=> {return val._id === friend._id}) || currentUser.incoming.find((val)=> {return val._id === friend._id}) || currentUser.friends.find((val)=> {return val._id === friend._id}) || friend._id === currentUser._id) ? '' : <div className='friend-button'>Add Friend</div>}
                            </div>
                            })
                        }
                        
                    </div>
                </div>}
        </div>
        
        
        }
        
    </Layout>)
}

export default User