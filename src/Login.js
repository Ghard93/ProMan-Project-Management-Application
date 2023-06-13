import React, { useRef } from 'react'
import { Link } from 'react-router-dom'

export default function Login({setUser}) {

  const userName = useRef()
  
  function Login(name){
    setUser(name)
    document.getElementById('logoutBtn').style.display = 'block'
    document.getElementById('userName').style.display = 'block'
    document.getElementById('projectsLink').style.display = 'block'
  }

  return (
    <div className='loginDivContainer'>
      <div className='loginDiv'>
        <h4 className='LoginTitle'>Login</h4>
      </div>
      <div className='loginInputDiv'>
        <label>Enter Username</label>
        <input type="text" ref={userName}></input>
      </div>
      <br></br>
      <div className='loginDiv'>
        <Link to="/ProjectsList">
          <button onClick={() => Login(userName.current.value)} className='confirmBtn'>LOGIN</button>
        </Link>
      </div>
    </div>
  )
}
