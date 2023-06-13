import React, { useState, useEffect, useRef } from 'react'
import ProjectServices from './ProjectServices'
import { Link } from 'react-router-dom'

export default function ProjectsList({setProjectID}) {

  const [projects, setProjects] = useState([])
  const [deleteId, setDeleteId] = useState("")
  const newProjectName = useRef()

  useEffect(() =>{
    retrieveProjects()
  }, [])

  function retrieveProjects() {
    ProjectServices.getUserProjects()
      .then(response => {
        setProjects(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }

  // Go to project component
  function GoToProjectID(id) {
    setProjectID(id)
  }

  // Show create new project window
  function DisplayNewProjectWindow() {
    document.getElementById('newProjectWindow').style.display = 'flex'
  }

  // Hide create new project window
  function CancelCreateNewProject() {
    document.getElementById('newProjectNameRequired').style.display = "none"
    document.getElementById('newProjectWindow').style.display = 'none'
  }

  // Create new project
  function CreateNewProject() {

    if(newProjectName.current.value === "") {
      document.getElementById('newProjectNameRequired').style.display = "block"
    }
    else {

      const newProject = {
        "Project_Name": newProjectName.current.value
      }
  
      ProjectServices.createProject(newProject)
        .then(() => {
          retrieveProjects()
        })
      
      newProjectName.current.value = ""
      document.getElementById('newProjectNameRequired').style.display = "none"
      document.getElementById('newProjectWindow').style.display = 'none'

    }
  }

  function DisplayDeleteConfirm(id, projectName) {

    setDeleteId(id)

    document.getElementById('deleteConfirmText').innerText = `Are you sure you would like to delete ${projectName}?`
    document.getElementById('deleteConfirmWindow').style.display = 'flex'

  }

  function CancelDelete() {

    setDeleteId("")

    document.getElementById('deleteConfirmWindow').style.display = 'none'

  }

  // Delete project
  function DeleteProject() {
    ProjectServices.deleteProject(deleteId)
      .then(() => {
        retrieveProjects()
        setDeleteId("")
        document.getElementById('deleteConfirmWindow').style.display = 'none'
      })
    
  }

  const listOfProjects = projects.map(
    (project) => {
      return(
        <div key={project.Project_Name} className='projectCard'>
          <h4 className='projectListTitle'>{project.Project_Name}</h4>
          <div className='projectBtnRow'>
            <Link to="/Project">
              <button onClick={() => GoToProjectID(project._id)} className='confirmBtn'>View Project</button>
            </Link>
            <button onClick={() => DisplayDeleteConfirm(project._id, project.Project_Name)} className='cancelBtn'>Delete Project</button>
          </div>
        </div>
      )
    }
  )

  return (
    <div className='projectsListContainer'>
      <button onClick={DisplayNewProjectWindow} className='newProjectBtn'>NEW PROJECT +</button>
      <div id='newProjectWindow'>
        <h5 className='newProjectTitle'>Project Name:</h5>
        <p id='newProjectNameRequired'>Required</p>
        <input type='text' ref={newProjectName}></input>
        <br></br>
        <button onClick={CreateNewProject} className='confirmBtn'>Create Project</button>
        <div className='spacing'></div>
        <button onClick={CancelCreateNewProject} className='cancelBtn'>Cancel</button>
      </div>
      <div id='deleteConfirmWindow'>
        <h5 id='deleteConfirmText' className='newProjectTitle'></h5>
        <button onClick={DeleteProject} className='confirmBtn'>Delete Project</button>
        <button onClick={CancelDelete} className='cancelBtn'>Cancel</button>
      </div>
      <div className='projectListDiv'>
        {listOfProjects}
      </div>
    </div>
  )
}