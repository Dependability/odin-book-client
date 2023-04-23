import Cookies from 'js-cookie';
import Icon from '@mdi/react';
import { mdiClose, mdiMessageOutline, mdiSend, mdiShareOutline, mdiThumbUp, mdiThumbUpOutline } from '@mdi/js';
import {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pfpicon from '../assets/user-profile-icon.svg';

function Post({info}) {

    const [commentText, setComment] = useState('');
    const navigate = useNavigate();
    const [commentList, setCommentList] = useState([...info.comments]);
    const [showPost, setShow] = useState(false);
    const [liked, setLike] = useState(false);
    const [likeList, setLikedList] = useState([...info.likes]);

    useEffect(()=> {
        let currentUser = JSON.parse(Cookies.get('User'));
        if (likeList.includes(currentUser._id)) {
            setLike(true);
        } else {
            setLike(false);
        }
    },[likeList])
    function like() {
        const bearer = `Bearer ${Cookies.get('Authorization')}`;
        fetch(`http://limitless-escarpment-37900.herokuapp.com/api/posts/${info._id}/like`, {method: "POST", headers: {Authorization: bearer}})
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let currentUser = JSON.parse(Cookies.get('User'));
            if (data.message === "Liked") {
                setLikedList((c)=> {
                    let copy = [...c];
                    copy.push(currentUser._id);
                    return copy;
                });
            } else {
                setLikedList((c) => {
                    let copy = [...c];
                    copy.splice(copy.findIndex( n => n === currentUser._id), 1);
                    return copy;
                })
            }
        })
    }

    function comment() {
        const bearer = `Bearer ${Cookies.get('Authorization')}`;
        fetch(`http://limitless-escarpment-37900.herokuapp.com/api/posts/${info._id}/comment`, {method: "POST", headers: {Authorization: bearer, 'Content-Type': 'application/json'}, body: JSON.stringify({text: commentText})})
        .then(res => res.json())
        .then(data => {

            console.log(data);
            setCommentList((c) => {
                let copy = [...c];
                copy.push(data.comment);
                console.log(data.comment)
                return copy;
            })
        })

    }
    return (<div className="post">
        {showPost ? (
        <div className='post-popup-wrapper' onClick={()=>{setShow(false)}}>
            <div className='post-popup' onClick={(e)=>{e.stopPropagation()}}>
                <div className='name-stick'>
                    <span className='name'>{info.author.username}'s Post</span>
                    <div className='close-button' onClick={()=>{setShow(false)}}>
                        <Icon path={mdiClose}></Icon>
                    </div>
                </div>
                <div className='post-popup-body'>
                    <div className='top'>
                        <div className='pfp'>
                            <img src={pfpicon} alt='' />
                        </div>
                        <div className='info'>
                            <Link to={'/user/' + info.author._id}>{info.author.username}</Link>
                            <div className='time'>3d</div>
                        </div>
                    </div>
                    <div className='postText'>{info.text}</div>
                    <div className='postCounts'>
                        <div className='likes-count'>
                            <div className='likeIcon'>
                                <Icon path={mdiThumbUp} />
                            </div>
                            {liked ? `You and ${likeList.length - 1} ${((likeList.length - 1 ) === 1) ? 'other' : 'others'}` : likeList.length}
                        </div>
                        <div className='comment-count'>{commentList.length} comments</div>
                    </div>
                    <div className='post-buttons'>
                        <div className={liked ? 'post-likes liked' : 'post-likes'} onClick={like}><Icon path={liked ? mdiThumbUp : mdiThumbUpOutline} /> Like</div>
                        <div className='post-comment'><Icon path={mdiMessageOutline} /> Comment</div>
                        <div className='post-share'><Icon path={mdiShareOutline} /> Share</div>
                    </div>
                    <div className='comment-list'>
                        {commentList.map((val, i)=> {
                            return <div className='comment-node' key={i}>
                                <div className='pfp' onClick={()=> {navigate('/user/' + val.author._id)}}><img src={pfpicon} alt='' /></div>
                                    <div className='comment-desc-wrapper'>
                                        <div className='comment-desc'>
                                            <div className='commenter' onClick={()=> {navigate('/user/' + val.author._id)}}>{val.author.username}</div>
                                            <div className='comment-body'>{val.text}</div>
                                        </div>
                                    </div>
                                </div>
                        })}
                    </div>
                </div>
                <div className='create-comment'>
                    <div className='create-comment-inner'>
                    <div className='pfp'><img src={pfpicon} alt='' /></div>
                    <div className='comment-input'>
                        <div className='input-area' placeholder={"Write a comment..."} onInput={(e)=> {
                            setComment(e.target.innerText);
                        }}contentEditable={true}></div>
                        <div className={commentText ? "sendIcon valid" : 'sendIcon'} onClick={()=> {
                            if (commentText) {
                                comment();
                                document.querySelector('.comment-input .input-area').innerText = '';
                            }
                        }}>
                            
                            <Icon path={mdiSend}></Icon>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>) : ''}

        <div className='top'>
            <div className='pfp' onClick={()=> {navigate('/user/' + info.author._id)}}><img src={pfpicon} alt='' /></div>
            <div className='info'>
                <Link to={'/user/' + info.author._id}>{info.author.username}</Link>
                <div className='time'>3d</div>
            </div>

        </div>
        <div className='postText'>{info.text}</div>
        <div className='postCounts'>
            <div className='likes-count'>
                <div className='likeIcon'>
                    <Icon path={mdiThumbUp} />
                </div>
                {liked ? `You and ${likeList.length - 1} ${((likeList.length - 1) === 1) ? 'other' : 'others'}` : likeList.length}
                </div>
                    <div className='comment-count' onClick={()=>{setShow(true)}}>{commentList.length} comments</div>
        </div>
        <div className='post-buttons'>
            <div className={liked ? 'post-likes liked' : 'post-likes'} onClick={like}><Icon path={liked ? mdiThumbUp : mdiThumbUpOutline}  /> Like</div>
            <div className='post-comment' onClick={()=>{setShow(true)}}><Icon path={mdiMessageOutline} /> Comment</div>
            <div className='post-share'><Icon path={mdiShareOutline} /> Share</div>
        </div>
        {/* <button onClick={like}>Like [{info.likes.length}]</button>

        <form onSubmit={comment}> 
        <input name='text'>
        </input>
        <input type='submit' value='Comment' />
        <div>
            {info.comments.map((val, i)=> {
                return <div key={i}>
                    <h3>{val.author.username}</h3>
                    <p>{val.text}</p>
                </div>
            }) }
        </div>
        </form> */}
    </div>)
}

export default Post;