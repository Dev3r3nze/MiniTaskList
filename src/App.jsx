import { useState } from 'react'
import './App.css'
import Task from './components/Task'
//import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import lightImg from "./assets/day.png"
import nightImg from "./assets/night.png"

function App() {


  const [tasks, setTasks] = useState([])

  const [lightMode, setLightMode] = useState([false])

  function handleCreate() {
    const title = document.getElementById('titleInput').value;

    if (title.trim() !== '') {
      setTasks((prevTasks) => [...prevTasks, { title, finished: false }]);
    }
  }

  function handleDelete(){
    setTasks((prevTasks) => prevTasks.filter((task) => !task.finished));
  }

  function handleMode(){
    setLightMode(!lightMode);
  }

  return (
    <>
      <div className={`task-list ${lightMode? "": "light"}`} id="taskList">
        <h1 className={`bigTitle ${lightMode? "": "light"}`}>Tasks</h1>
        <button onClick={handleMode} className='modeBtn'><img src={lightMode? lightImg:nightImg}></img></button>
        <div className='controls'>
          <p className='auxText'>Describe your task</p>
          <input type="text" id="titleInput"/>
          <button className='taskBtn' onClick={handleCreate}>Add task</button>

        </div>

        <div className='taskContainer'>
          {tasks.length > 0 &&
            tasks.map((task, index) => (
              <Task
                key={index}
                title={task.title}
                lightMode={lightMode}
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
        <div className='bottomControls'>
          <button className='taskBtn deleteBtn' onClick={handleDelete}>Delete completed task</button>
          <p className={`txt ${lightMode? "": "light"}`}>Left: <i className='numberLeft'>x{tasks.filter((task) => !task.finished).length}</i></p>
                
        </div>
      </div>
    </>
  )
}

export default App



///// Extras
// Cita motivadora random
// Ordenar 
// Urgencia
// Guardar en localstorage
// Contador tareas pendientes
// Tiempo aprox tarea