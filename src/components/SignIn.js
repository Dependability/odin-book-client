import Cookies from "js-cookie";
import Icon from "@mdi/react";
import { useState } from "react";
import { mdiArrowLeft } from "@mdi/js";
import { useNavigate } from "react-router-dom";
function SignIn() {
    const [mode, setMode] = useState('main');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    function submitForm(e) {
        e.preventDefault();
        let url = '/login'
        let body = {}
        body.username=  e.target.username.value;
        body.password = e.target.password.value;
        if (mode==='register') {
            url = '/users';
            body.confirmPassword = e.target['cfm-password'].value;
        }


        fetch('https://limitless-escarpment-37900.herokuapp.com/api' + url, {headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body), method: "POST"})
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if (data.success) {
                Cookies.set('Authorization', data.token);
                Cookies.set('User', JSON.stringify(data.user))
                console.log('Authorization Complete', data);
                navigate('/');
            } else {
                setError(data.message);
            }
        })
    }
    switch (mode) {
        case 'main':
            return <div className='first-page'>
                        <h1>OdinBook</h1>
                        <div className='sign-in-buttons'>
                        <div className='register-button' onClick={()=>{setMode('register')}}>Register</div>
                        <div className='login-button' onClick={()=>{setMode('login')}}>Login</div>
                        <div className='guest-button' onClick={()=> {
                            submitForm({target: {username: {value: 'Guest'}, password: {value: 'password'}}, preventDefault: function() {}});
                        }}>Guest Sign In</div>
                        </div>
                        </div>
        case 'login':
            return <div className='first-page'>
                        <h1>OdinBook</h1>
                        <div className='body'>
                        <div className='back-button' onClick={()=> {setMode('main'); setError('')}}><Icon path={mdiArrowLeft} />Go Back</div>
                        <form onSubmit={submitForm}>
                        <label>Username
                            <input type='text' name='username' required></input>
                        </label>
                        <label>Password
                            <input type='password' name='password' required></input>
                        </label>
                        {error ? <div className='error'>{error}</div> : ''}
                        
                        <button>Submit</button>
                    </form></div></div>;
        case 'register':
            return <div className='first-page'>
                        <h1>OdinBook</h1>
                        <div className='body'>
                        <div className='back-button' onClick={()=> {setMode('main'); setError('')}}><Icon path={mdiArrowLeft} /> Go Back</div>
                        <form onSubmit={submitForm}>
                        <label>Username
                            <input type='text' name='username' required></input>
                        </label>
                        <label>Password
                            <input type='password' name='password' required></input>
                        </label>
                        <label>Confirm Password
                            <input type='password' name='cfm-password' required></input>
                        </label>
                        {error ? <div className='error'>{error}</div> : ''}
                        <button>Submit</button>
                    </form></div></div>;
        default:
            break;
    }
    
}

export default SignIn