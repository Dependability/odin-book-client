import { mdiAccountMultiple, mdiArrowLeft} from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import PreviUser from "./PreviUser";
import pfpicon from '../assets/user-profile-icon.svg';

export default function AllFriends() {
    const [selected, setSelected] = useState(-1);
    const [friends, setFriends] = useState([])
    const navigate = useNavigate();
    useEffect(()=> {
        const bearer = Cookies.get('Authorization');
        let currentUserId = JSON.parse(Cookies.get('User'))._id;
        fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUserId}`, {headers: {'Authorization': `Bearer ${bearer}`}})
        .then((response) => response.json())
        .then((data) => {
            setFriends([...data.user.friends]);
        })
    }, [])


    

    return <Layout selected={'Friends'}>
        <div className='all-friend-page'>
            <div className='leftControls'>
                <div className='top-header'>
                    <div className='left' onClick={()=>{navigate('/friends')}}>
                        <Icon path={mdiArrowLeft}></Icon>
                    </div>
                    <div className='right'>
                        <Link to={'/friends'}>Friends</Link>
                        <h2>All Friends</h2>
                    </div>
                </div>
                <div className='bottom'>
                    <h2>{friends.length ? `${friends.length} friend${friends.length === 1 ? '' : 's'}` : 'Friends'}</h2>
                    {friends.length === 0 ? <div className='no-friends'>No friends to show</div> : ''}
                    {friends.map((val, ind) => {
                        return <div className={`all-friend-item ${selected === ind ? 'selected' : ''}`} key={ind} onClick={()=> {
                            setSelected(ind);
                        }}>
                        <div className='pfp'><img src={pfpicon} alt='' /></div>
                        <div className='right'>
                            <span className='username'>{val.username}</span>
                        </div>
                    </div>
                    })}
                </div>
            </div>
            <div className='right-panel'>
                {selected === -1 ? <div className='no-info'>
                    <Icon path={mdiAccountMultiple}></Icon>
                    {friends.length ? "Select people's name to preview their profile." : "When you become friends with people on OdinBook, you'll see them here." }
                </div> : <PreviUser userId={friends[selected]._id}/>}
            </div>
        </div>
    </Layout>
}