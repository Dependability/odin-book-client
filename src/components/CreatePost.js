import Cookies from 'js-cookie';
import Layout from './Layout'
function CreatePost() {


    function submitForm(e) {
        e.preventDefault();
        const bearer = `Bearer ${Cookies.get('Authorization')}`
        console.log(bearer)
        fetch('https://limitless-escarpment-37900.herokuapp.com/api/posts', {method: 'POST', headers: {'Content-Type': 'application/json','Authorization': bearer} , body: JSON.stringify({
            text: e.target.text.value
        })}).then(res => res.json)
        .then(data => {
            console.log(data)
        })
    }
    return (<Layout>
        <h1>Create Post</h1>
        <form onSubmit={submitForm}>
            <label>Text:
                <input name='text'></input>
            </label>
            <button>Submit</button>
        </form>
    </Layout>)
}

export default CreatePost;