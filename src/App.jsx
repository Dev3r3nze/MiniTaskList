import { useState } from 'react'
import './App.css'
import Task from './components/Task'

function App() {

  const [tasks, setTasks] = useState([])

  function CreateTask() {
    const title = document.getElementById('titleInput').value;

    if (title.trim() !== '') {
      setTasks((prevTasks) => [...prevTasks, { title, finished: false }]);
    }
  }

  function DeleteTasks(){
    setTasks((prevTasks) => prevTasks.filter((task) => !task.finished));

  }

  return (
    <>
      <div className="task-list" id="taskList">
        <h1 className='bigTitle'>Tasks</h1>

        <div className='controls'>
          <p className='auxText'>Describe your task</p>
          <input type="text" id="titleInput"/>
          <button className='taskBtn' onClick={CreateTask}>Add task</button>

        </div>

        <div className='taskContainer'>
          {tasks.length > 0 &&
            tasks.map((task, index) => (
              <Task
                key={index}
                title={task.title}
                finished={task.finished}
                setFinished={(value) =>
                  setTasks((prevTasks) =>
                    prevTasks.map((t, i) =>
                      i === index ? { ...t, finished: value } : t
                    )
                  )
                }
              />
            ))}
            {tasks.length == 0 && <p className='waitTxt'><i>Waiting for tasks...</i></p>}
        </div>
        <button className='taskBtn deleteBtn' onClick={DeleteTasks}>Delete completed task</button>

      </div>
    </>
  )
}

export default App


/////// FUNCIONALIDADES ///////
// Ver tareas
// Añadir tarea (botón)
// Marcar como terminada
// Quitar tarea (botón)

///// Extras
// Cita motivadora random