import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login';
import ProjectsList from './ProjectsList';
import Project from './Project';

function App() {

  const [user, setUser] = useState("")
  const [projectID, setProjectID] = useState();

  function Logout() {
    setUser("")
    document.getElementById('logoutBtn').style.display = 'none'
    document.getElementById('userName').style.display = 'none'
    document.getElementById('projectsLink').style.display = 'none'
  }

  return (
    <div >
      <BrowserRouter>
        <div className='navBar'>
          <nav className='navBarContainer'>
            <ul className='navBarList'>
              <li className='appTitle'>ProMan</li>
              <Link to='/ProjectsList' className='logoutBtn'>
                  <li id='projectsLink'>Projects</li>
                </Link>
              <div className='userNavContainer'>
                <li id='userName'>{user}</li>
                <Link to='/' className='logoutBtn'>
                  <li onClick={Logout} id='logoutBtn'>LOGOUT</li>
                </Link>
              </div>
            </ul>
          </nav>
        </div>

        <Routes>
          <Route path='/' element={<Login setUser={setUser} />} />
          <Route path='/ProjectsList' element={<ProjectsList setProjectID={setProjectID} />} />
          <Route path='/Project' element={<Project projectID={projectID} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;