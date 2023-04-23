import { mdiAccountMultiple, mdiArrowLeft, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import PreviUser from "./PreviUser";

export default function Requests() {
    const [sentRequests, setSentRequests] = useState([]);
    const [incomingRequests, setIncoming] = useState([]);
    const [showSent, setSent] = useState(false);
    const [selected, setSelected] = useState(-1);
    const navigate = useNavigate();
    useEffect(()=> {
        const bearer = Cookies.get('Authorization');
        let currentUserId = JSON.parse(Cookies.get('User'))._id;
        fetch(`https://limitless-escarpment-37900.herokuapp.com/api/users/${currentUserId}`, {headers: {'Authorization': `Bearer ${bearer}`}})
        .then((response) => response.json())
        .then((data) => {
            setSentRequests([...data.user.outgoing]);
            setIncoming([...data.user.incoming]);
        })
    }, [])

    function acceptRequest(friendId, index) {
        const bearer = Cookies.get('Authorization');
        fetch(`https://limitless-escarpment-37900.herokuapp.com/api/users/${friendId}/accept`, {method: 'POST', headers: {'Authorization': `Bearer ${bearer}`}})
        .then((res) => res.json())
        .then((data) => {
            setIncoming((c)=> {
                let copy = [...c];
                copy[index].accepted = true;
                return copy;
            })
            
        })
    }
    function cancelRequest(friendId, index, type='outgoing') {
        const bearer = Cookies.get('Authorization');
        fetch(`https://limitless-escarpment-37900.herokuapp.com/api/users/${friendId}/cancel`, {method: 'POST', headers: {'Authorization': `Bearer ${bearer}`}})
        .then((res) => res.json())
        .then((data) => {
            if (type === 'outgoing') {
                setSentRequests((c)=> {
                    let copy = [...c];
                    copy[index].canceled = true;
                    return copy;
                })
            } else {
                setIncoming((c)=> {
                    let copy = [...c];
                    copy[index].canceled = true;
                    return copy;
                })
            }
            
            console.log(data)
            
        })
    }

    

    return <Layout selected={'Friends'}>
        {showSent ? 
        <div className='sent-request-outer' onClick={()=>{setSent(false)}}>
            <div className='sent-request' onClick={(e)=>{e.stopPropagation();}}>
                <div className='top'>
                    <h2>Sent Requests</h2>
                    <div className='close' onClick={()=>{setSent(false)}}>
                        <Icon path={mdiClose}></Icon>
                    </div>
                </div>
                <div className='sent-request-list'>
                    {sentRequests.length === 0 ? <div className='no-sent-request'>When you send someone a friend request, it will appear here.</div> : <div className='inner'>
                            <h2>{sentRequests.length} Sent Requests</h2>
                            {console.log(sentRequests)}
                            {sentRequests.map((val, i)=> {
                                return <div className='inner-item' key={i}>
                                    <div className='left'>
                                    <div className='pfp'></div>
                                    <div className='name'>
                                        <span>{val.username}</span>
                                        {val.canceled ? <div className='canceled'>Request canceled</div> : ''}
                                    </div>
                                    </div>
                                    {val.canceled ? '' : <div className='cancel-friend' onClick={()=>{cancelRequest(val._id, i)}}>Cancel Request</div>}
                                </div>
                            })}
                        </div>}
                </div>
            </div>
        </div>: ''}
        <div className='friend-request-page'>
            <div className='leftControls'>
                <div className='top-header'>
                    <div className='left' onClick={()=>{navigate('/friends')}}>
                        <Icon path={mdiArrowLeft}></Icon>
                    </div>
                    <div className='right'>
                        <Link to={'/friends'}>Friends</Link>
                        <h2>Friend Requests</h2>
                    </div>
                </div>
                <div className='bottom'>
                    <h2>{incomingRequests.length ? incomingRequests.length : ''} Friend Requests</h2>
                    <span className='sentReq' onClick={()=>{setSent(true)}}>View sent requests</span>
                    {incomingRequests.length === 0 ? <div className='no-friends'>No new requests</div> : ''}
                    {incomingRequests.map((val, ind) => {
                        return <div className={`friend-request-item ${selected === ind ? 'selected' : ''}`} key={ind} onClick={()=> {
                            setSelected(ind);
                        }}>
                        <div className='pfp'></div>
                        <div className='right'>
                            <span className='username'>{val.username}</span>
                            {(val.canceled || val.accepted) ? <div className='canceled'>{val.canceled ? 'Request declined' : 'Request accepted'}</div> : <div className='request-controls'>
                                <div className='accept' onClick={()=> {acceptRequest(val._id, ind)}}>Confirm</div>
                                <div className='decline' onClick={()=> {cancelRequest(val._id, ind, 'incoming')}}>Delete</div>
                            </div>}
                        </div>
                    </div>
                    })}
                </div>
            </div>
            <div className='right-panel'>
                {selected === -1 ? <div className='no-info'>
                    <Icon path={mdiAccountMultiple}></Icon>
                    {incomingRequests.length ? "Select people's name to preview their profile." : "When you have friend requests or suggestions, you'll see them here." }
                </div> : <PreviUser userId={incomingRequests[selected]._id}/>}
            </div>
        </div>
    </Layout>
}