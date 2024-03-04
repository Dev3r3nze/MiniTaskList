import { useState, useEffect } from "react"
import "./App.css"
import Task from "./components/Task"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { v4 as uuidv4 } from "uuid" // importa uuid
import lightImg from "./assets/day.png"
import nightImg from "./assets/night.png"
import screenSizeImg from "./assets/screenSize.png"
import miniScreenSizeImg from "./assets/min.png"
import Pomodoro from "./components/Pomodoro"
// import  { useRef } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [lightMode, setLightMode] = useState([false])
  const [fullScreen, setFullScreen] = useState(false)

  // var mainTask

  useEffect(() => {
    // Recuperar tareas almacenadas en localStorage al iniciar la aplicación
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || []
    setTasks(storedTasks)
  }, [])

  // const taskListRef = useRef(null)
  // // Función para almacenar la referencia original y activar Picture-in-Picture
  // const setTaskListRef = (ref) => {
  //   taskListRef.current = ref
  //   // Puedes hacer algo más con la referencia si es necesario
  // }
  // Función para activar Picture-in-Picture
  // const enterPiPMode = () => {
  //   if (taskListRef.current) {
  //     taskListRef.current.requestPictureInPicture()
  //   }
  // }

  function handleCreate() {
    const input = document.getElementById("titleInput")
    const title = input.value
    input.value = ""
    const taskId = uuidv4()
    const newTask = { id: taskId, title, finished: false, istitle: false }
    if (title.trim() !== "") {
      setTasks((prevTasks) => [...prevTasks, newTask])
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]))
    }
  }

  function handleSpacer() {
    const input = document.getElementById("titleInput")
    const totalLenght = 35
    // Calcular la cantidad de caracteres "━" que se deben agregar en cada lado
    const addChars = Math.floor((totalLenght - input.value.length - 6) / 2)
    // Construir el título con los caracteres "━" adicionales
    const title = `┏${"━".repeat(addChars)} ${input.value} ${"━".repeat(addChars)}┓`
    var subTitle = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
    if (title.split("").length == 32) {
      subTitle = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
    }

    const taskId = uuidv4()
    const taskIdSub = `Sub${taskId}`
    const newTitle = { id: taskId, title, finished: false, istitle: true }
    const newSubTitle = {id: taskIdSub, title: subTitle, finished: false, istitle: true}

    if (input.value !== "") {
      setTasks((prevTasks) => [...prevTasks, newTitle])
      setTasks((prevTasks) => [...prevTasks, newSubTitle])
      localStorage.setItem("tasks",JSON.stringify([...tasks, newTitle, newSubTitle]))
    }
    input.value = ""
  }

  function handleDelete() {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => !task.finished)



      // Guardar las tareas actualizadas en localStorage
      localStorage.setItem("tasks", JSON.stringify(newTasks))
      return newTasks
    })
  }

  function handleMode() {
    setLightMode(!lightMode)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }
  const handleDragEnd = (result) => {
    if (!result.destination) return

    const reorderedTasks = Array.from(tasks)
    const [removed] = reorderedTasks.splice(result.source.index, 1)
    reorderedTasks.splice(result.destination.index, 0, removed)

    setTasks(reorderedTasks)
    localStorage.setItem("tasks", JSON.stringify(reorderedTasks))
  }

  function handleScreenSize() {
    const element = document.documentElement

    setFullScreen(!fullScreen)

    if (!fullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    }
  }

  return (
    <>
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks" direction="vertical">
        {(provided) => (
          <div
            className={`task-list ${lightMode ? "" : "light"}`}
            {...provided.droppableProps}
            id="taskList"
            ref={(el) => {
              // Almacena la referencia original y la proporciona a la biblioteca de arrastre
              // setTaskListRef(el)
              provided.innerRef(el)
            }}
          >
            {/* <button onClick={enterPiPMode}>PiP</button> */}
            <div className="headerDiv">
            <button onClick={handleScreenSize} className="modeBtn maxScreenBtn">
                <img src={fullScreen?miniScreenSizeImg:screenSizeImg}></img>
              </button>
              <h1 className={`bigTitle ${lightMode ? "" : "light"}`}>Tasks</h1>
              <button onClick={handleMode} className="modeBtn">
                <img src={lightMode ? lightImg : nightImg}></img>
              </button>
            </div>
            <div className="controls">
              <p className="auxText">Describe your task</p>
              <form action="" onSubmit={handleSubmit}>
                <input type="text" id="titleInput" />
                <button className="taskBtn" onClick={handleCreate}>
                  Add task
                </button>
                <button className="spacerBtn" onClick={handleSpacer}>
                  Add title
                </button>
              </form>
            </div>

            {/* Pendiente */}
            {/* <div className="miniTaskContainer">
              {!mainTask && (
                <p className="waitTxt">
                  <i>Waiting for the main task...</i>
                </p>
              )}
            </div> */}
            <div className="taskContainer">
              {tasks.length > 0 &&
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        
                        className="taskDiv"
                      >
                        <Task
                          style={
                            snapshot.isDragging &&
                            "position:absolute !important"
                          }
                          key={index}
                          title={task.title}
                          lightMode={lightMode}
                          finished={task.finished}
                          isTitle={task.istitle}
                          id={task.id}
                          setFinished={(value) =>
                            setTasks((prevTasks) =>
                              prevTasks.map((t, i) =>
                                i === index ? { ...t, finished: value } : t
                              )
                            )
                          }
                        />
                        {}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
              {tasks.length == 0 && (
                <p className="waitTxt">
                  <i>Waiting for tasks...</i>
                </p>
              )}
            </div>
            <div className="bottomControls">
              <button className="taskBtn deleteBtn" onClick={handleDelete}>
                Delete completed task
              </button>
              <p className={`txt ${lightMode ? "" : "light"}`}>
                Left:{" "}
                <i className="numberLeft">
                  x
                  {
                    tasks
                      .filter((task) => !task.istitle)
                      .filter((task) => !task.finished).length
                  }
                </i>
              </p>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
    <Pomodoro lightMode={lightMode}/>
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
