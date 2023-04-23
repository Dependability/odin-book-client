import Cookies from 'js-cookie';
import Layout from './Layout'

function Login({register}) {


    function submitForm(e) {
        e.preventDefault();
        let url = '/login'
        let body = {}
        body.username=  e.target.username.value;
        body.password = e.target.password.value;
        if (register) {
            url = '/users';
            body.confirmPassword = e.target['cfm-password'].value;
        }

        fetch('http://limitless-escarpment-37900.herokuapp.com/api' + url, {headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body), method: "POST"})
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if (data.success) {
                Cookies.set('Authorization', data.token);
                Cookies.set('User', JSON.stringify(data.user))
                console.log('Authorization Complete', data)
            }
        })
    }
    return (<Layout>
        
        <h1>{register ? "Sign up" : 'Log in'}</h1>
        <form onSubmit={submitForm}>
            <label>Username
                <input type='text' name='username' required></input>
            </label>
            <label>Password
                <input type='password' name='password' required></input>
            </label>
            {register ? (<label>Confirm Password
                <input type='password' name='cfm-password' required></input>
            </label>) :''}
            <button>Submit</button>
        </form>
    </Layout>);
}

export default Login;