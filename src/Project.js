import React, {useState, useEffect, useRef} from 'react'
import ProjectServices from './ProjectServices'

export default function Project({projectID}) {

  const [project, setProject] = useState([])
  const [taskBucket, setTaskBucket] = useState("")
  const [taskEditName, setTaskEditName] = useState("")
  // Edit project name reference
  const projectName = useRef()
  // Create task input references
  const taskName = useRef()
  const dueDate = useRef()
  const assignedTo = useRef()
  const taskNotes = useRef()
  // Edit task input references
  const taskNameEdit = useRef()
  const dueDateEdit = useRef()
  const assignedToEdit = useRef()
  const taskNotesEdit = useRef()

  // Call retrieveProjectData on page load to get data from database
  useEffect(() => {
    retrieveProjectData();
  }, [])

  // retrieveProjectData calls get request on ProjectServices class
  function retrieveProjectData() {
    ProjectServices.getProjectData(projectID)
      .then(response => {
        setProject([response.data])
      })
      .catch(e => {
        console.log(e)
      })
  }

  // updateProjectData calls update/put request on ProjectServices class
  function updateProjectData() {
    ProjectServices.updateProject(projectID, project[0])
    .catch(e => {
      console.log(e)
    })
  }

  // Show the add task window
  function DisplayAddTask(bucket) {
    setTaskBucket(bucket)
    document.getElementById('AddTaskWindow').style.display = 'flex'
  }

  // Gets input from 'add task' window and adds it to project state then calls update function to save to database
  function AddNewTask() {

    if(taskName.current.value === "") {
      document.getElementById('taskNameRequired').style.display = 'block'
    }
    else {

      const newProjectData = [...project]
  
      const newTask = {
        "Task_Name": taskName.current.value,
        "Due_Date": dueDate.current.value,
        "Assigned_To": assignedTo.current.value,
        "Status": taskBucket,
        "Notes": taskNotes.current.value
      }
  
      for(let i = 0; i < newProjectData[0].Task_Buckets.length; i++) {
        if(newProjectData[0].Task_Buckets[i].Bucket_Name === taskBucket) {
          newProjectData[0].Task_Buckets[i].Tasks.push(newTask)
        }
      }
  
      setProject(newProjectData)
      updateProjectData()
      
      document.getElementById('addTaskName').value = ""
      document.getElementById('addTaskDate').value = ""
      document.getElementById('addTaskAssigned').value = ""
      document.getElementById('addTaskNotes').value = ""
      document.getElementById('taskNameRequired').style.display = 'none'
      document.getElementById('AddTaskWindow').style.display = 'none'

    }
  }

  // Clears taskBucket state then closes 'add task' window
  function CancelAddTask() {
    setTaskBucket("")
    document.getElementById('taskNameRequired').style.display = 'none'
    document.getElementById('AddTaskWindow').style.display = 'none'
  }

  // Delete task
  function DeleteTask(taskName, bucketName) {

    const newProjectData = [...project]

    const bucketIndex = newProjectData[0].Task_Buckets.findIndex(bucket => {
      return bucket.Bucket_Name === bucketName
    })

    const taskIndex = newProjectData[0].Task_Buckets[bucketIndex].Tasks.findIndex(task => {
      return task.Task_Name === taskName
    })

    newProjectData[0].Task_Buckets[bucketIndex].Tasks.splice(taskIndex, 1)

    setProject(newProjectData)
    updateProjectData()
  }

  // Display the edit task window
  function DisplayEditTask(bucket, taskName, dueDate, assignedTo, notes) {
    setTaskBucket(bucket)
    setTaskEditName(taskName)

    document.getElementById('editTaskName').value = taskName
    document.getElementById('editDueDate').value = dueDate
    document.getElementById('editAssignedTo').value = assignedTo
    document.getElementById('editTaskNotes').value = notes

    document.getElementById('UpdateTaskWindow').style.display = 'flex'
  }

  // Update task
  function UpdateTask() {

    if(taskNameEdit.current.value === "") {

      document.getElementById('updateTaskNameRequired').style.display = 'block'

    }
    else {

      const newProjectData = [...project]
  
      const updatedTask = {
        "Task_Name": taskNameEdit.current.value,
        "Due_Date": dueDateEdit.current.value,
        "Assigned_To": assignedToEdit.current.value,
        "Status": taskBucket,
        "Notes": taskNotesEdit.current.value
      }
  
      for(let i = 0; i < newProjectData[0].Task_Buckets.length; i++) {
        if(newProjectData[0].Task_Buckets[i].Bucket_Name === taskBucket) {
          for(let j = 0; j < newProjectData[0].Task_Buckets[i].Tasks.length; j++) {
            if(newProjectData[0].Task_Buckets[i].Tasks[j].Task_Name === taskEditName) {
              newProjectData[0].Task_Buckets[i].Tasks[j] = updatedTask
            }
          }
        }
      }
  
      setProject(newProjectData)
      updateProjectData()
  
      document.getElementById('updateTaskNameRequired').style.display = 'none'
      document.getElementById('UpdateTaskWindow').style.display = 'none'

    }

  }

  // Cancel editing task
  function CancelEditTask() {
    setTaskBucket("")
    setTaskEditName("")
    document.getElementById('updateTaskNameRequired').style.display = 'none'
    document.getElementById('UpdateTaskWindow').style.display = 'none'
  }

  // Show project name edit
  function DisplayProjectNameEdit() {
    document.getElementById('updateProjectName').style.display = 'flex'
  }

  // Update project name
  function UpdateProjectName() {

    if(projectName.current.value !== "") {

      const newProjectData = [...project]
  
      newProjectData[0].Project_Name = projectName.current.value
  
      setProject(newProjectData)
      updateProjectData()

    }

    document.getElementById('updateProjectName').style.display = 'none'

  }

  // Cancel updating project name
  function CancelUpdateProjectName() {
    document.getElementById('updateProjectName').style.display = 'none'
  }

  // Display change task status section
  function DisplayChangeTaskStatus(taskName) {
    document.getElementById(`changeStatus${taskName}`).style.display = 'flex'
    document.getElementById(`openChangeStatus${taskName}`).style.display = 'none'
    document.getElementById(`closeChangeStatus${taskName}`).style.display = 'block'
  }

  // Close change task status section
  function CloseChangeTaskStatus(taskName) {
    document.getElementById(`changeStatus${taskName}`).style.display = 'none'
    document.getElementById(`openChangeStatus${taskName}`).style.display = 'block'
    document.getElementById(`closeChangeStatus${taskName}`).style.display = 'none'
  }

  // Change task status
  function ChangeTaskStatus(status, taskName, bucketName) {

    const newProjectData = [...project]

    const bucketIndex = newProjectData[0].Task_Buckets.findIndex(bucket => {
      return bucket.Bucket_Name === bucketName
    })

    const taskIndex = newProjectData[0].Task_Buckets[bucketIndex].Tasks.findIndex(task => {
      return task.Task_Name === taskName
    })

    const updatedTask = newProjectData[0].Task_Buckets[bucketIndex].Tasks[taskIndex]
    updatedTask.Status = status

    newProjectData[0].Task_Buckets[bucketIndex].Tasks.splice(taskIndex, 1)

    for(let i = 0; i < newProjectData[0].Task_Buckets.length; i++) {
      if(newProjectData[0].Task_Buckets[i].Bucket_Name === status) {
        newProjectData[0].Task_Buckets[i].Tasks.push(updatedTask)
      }
    }

    setProject(newProjectData)
    updateProjectData()
  }

  // Show task notes
  function ShowNotes(taskName) {

    document.getElementById(`${taskName}Notes`).style.display = 'block'
    document.getElementById(`${taskName}ShowNotesBtn`).style.display = 'none'
    document.getElementById(`${taskName}HideNotesBtn`).style.display = 'block'

  }

  // Hide task notes
  function HideNotes(taskName) {

    document.getElementById(`${taskName}Notes`).style.display = 'none'
    document.getElementById(`${taskName}HideNotesBtn`).style.display = 'none'
    document.getElementById(`${taskName}ShowNotesBtn`).style.display = 'block'

  }

  // Gets project name from the project state
  const projectData = project.map(
    (projectInfo) => {
      return(
        <div key={projectInfo.Project_Name} className='projectNameDiv'>
          <button onClick={DisplayProjectNameEdit} id='projectNameBtn'>{projectInfo.Project_Name}</button>
          <div id='updateProjectName'>
            <label>New Project Name:</label>
            <input type='text' ref={projectName}></input>
            <button onClick={UpdateProjectName} className='confirmBtn'>Update</button>
            <button onClick={CancelUpdateProjectName} className='cancelBtn'>Cancel</button>
          </div>
        </div>
      )
    }
  )

  // Maps through project state to get task buckets and task data
  const taskBuckets = project.map(
    (bucket) => {

      const buckets = bucket.Task_Buckets.map(
        (taskBucket) => {

          const tasks = taskBucket.Tasks.map(
            (task) => {
              return(
                <div key={task.Task_Name} className='taskCard'>
                  <h4 className='taskTitle'>{task.Task_Name}</h4>
                  <div className='taskDetailsBackground'>
                    <h5 className='taskDueDate'>Due Date: {task.Due_Date}</h5>
                    <h5 className='taskDueDate'>Assigned To: {task.Assigned_To}</h5>
                  </div>
                  <div className='statusDiv'>
                    <h5 className='taskStatus'>Status: {task.Status}</h5>
                    <button onClick={() => DisplayChangeTaskStatus(task.Task_Name)} className='changeStatusBtn' id={`openChangeStatus${task.Task_Name}`}>Change Status</button>
                    <button onClick={() => CloseChangeTaskStatus(task.Task_Name)} className='closeChangeStatusBtn' id={`closeChangeStatus${task.Task_Name}`}>Change Status</button>
                  </div>
                  <div id={`changeStatus${task.Task_Name}`} className='changeStatusWindow'>
                    <button onClick={() => ChangeTaskStatus('To Do', task.Task_Name, taskBucket.Bucket_Name)} className='statusBtn'>To Do</button>
                    <button onClick={() => ChangeTaskStatus('In Progress', task.Task_Name, taskBucket.Bucket_Name)} className='statusBtn'>In Progress</button>
                    <button onClick={() => ChangeTaskStatus('Completed', task.Task_Name, taskBucket.Bucket_Name)} className='statusBtn'>Completed</button>
                  </div>
                  <hr></hr>
                  <div className='notesHeadingContainer'>
                    <h5 className='taskNotesHeading'>Notes</h5>
                    <p id={`${task.Task_Name}ShowNotesBtn`} onClick={() => ShowNotes(task.Task_Name)} className='taskNotesShowBtn'>▼</p>
                    <p id={`${task.Task_Name}HideNotesBtn`} onClick={() => HideNotes(task.Task_Name)} className='taskNotesHideBtn'>▲</p>
                  </div>
                  <div id={`${task.Task_Name}Notes`} className='taskNotesContainer'>
                    <p className='taskNotes'>{task.Notes}</p>
                  </div>
                  <div className='taskBtnRow'>
                    <button onClick={() => DisplayEditTask(taskBucket.Bucket_Name, task.Task_Name, task.Due_Date, task.Assigned_To, task.Notes)} className='confirmBtn'>Edit Task</button>
                    <button onClick={() => DeleteTask(task.Task_Name, taskBucket.Bucket_Name)} className='cancelBtn'>Delete Task</button>
                  </div>
                </div>
              )
            }
          )

          return(
            <div key={taskBucket.Bucket_Name} className='bucketDiv'>
              <h3 className='bucketTitle'>{taskBucket.Bucket_Name}</h3>
              <button onClick={() => DisplayAddTask(taskBucket.Bucket_Name)} className='addTaskBtn'>ADD TASK</button>
              {tasks}
            </div>
          )
        }
      )

      return(
        <div key='projectInfo' className='taskBucketDiv'>
          {buckets}
        </div>
      )
    }
  )

  // Main component return
  return (
    <div>
      {projectData}
      <div id='AddTaskWindow' key='addTask'>
        <label>Task Name:</label>
        <p id='taskNameRequired'>Required</p>
        <input type='text' ref={taskName} id='addTaskName'></input>
        <label>Due Date</label>
        <input type='text' ref={dueDate} id='addTaskDate'></input>
        <label>Assigned To:</label>
        <input type='text' ref={assignedTo} id='addTaskAssigned'></input>
        <label>Notes:</label>
        <textarea type='text' ref={taskNotes} className='notesInput' id='addTaskNotes'></textarea>
        <br></br>
        <button onClick={AddNewTask} className='confirmBtn'>Create Task</button>
        <div className='spacing'></div>
        <button onClick={CancelAddTask} className='cancelBtn'>Cancel</button>
      </div>
      <div id='UpdateTaskWindow' key='updateTask'>
        <label>Task Name:</label>
        <p id='updateTaskNameRequired'>Required</p>
        <input type='text' ref={taskNameEdit} id='editTaskName'></input>
        <label>Due Date</label>
        <input type='text' ref={dueDateEdit} id='editDueDate'></input>
        <label>Assigned To:</label>
        <input type='text' ref={assignedToEdit} id='editAssignedTo'></input>
        <label>Notes:</label>
        <textarea type='text' ref={taskNotesEdit} id='editTaskNotes' className='notesInput'></textarea>
        <br></br>
        <button onClick={UpdateTask} className='taskConfirmBtn'>Update Task</button>
        <div className='spacing'></div>
        <button onClick={CancelEditTask} className='taskCancelBtn'>Cancel</button>
      </div>
      <div className='bucketsContainer'>
        {taskBuckets}
      </div>
    </div>
  )
}