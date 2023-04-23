import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import User from './components/User';
import CreatePost from './components/CreatePost';
import Friends from './components/Friends';
import SignIn from './components/SignIn'
import Requests from './components/Requests';
import AllFriends from './components/AllFriends';
function App() {

  return (
    <BrowserRouter basename='odin-book-client'>
      <Routes>
        <Route exact path='/login' element={<SignIn />} />
        <Route exact path='/' element={<Home />}/>
        <Route exact path='/friends' element={<Friends />}/>
        <Route exact path='/friends/requests' element={<Requests />} />
        <Route exact path ='/user/:userId' element={<User />}/>
        <Route exact path='/create' element={<CreatePost />} />
        <Route exact path='/friends/list' element={<AllFriends />}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
