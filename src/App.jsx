import { useState, useEffect, useRef } from "react";
import "./App.css";
import Task from "./components/Task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import lightImg from "./assets/day.png";
import nightImg from "./assets/night.png";
import screenSizeImg from "./assets/screenSize.png";
import miniScreenSizeImg from "./assets/min.png";
import changeBckImg from "./assets/bckimgChange.png";
import Pomodoro from "./components/Pomodoro";
import TaskForm from "./components/TaskForm";
import ThrowSound from "./assets/throwSound.wav"

function App() {
  const [tasks, setTasks] = useState([]);
  const [lightMode, setLightMode] = useState([false]);
  const [fullScreen, setFullScreen] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    // Recuperar tareas almacenadas en localStorage al iniciar la aplicación
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const lastBackground = localStorage.getItem("backImg");
    document.getElementById("bckImg").style.backgroundImage = lastBackground;
    setTasks(storedTasks);
    document.getElementById("showPlaylistCheck").checked = true;
  }, []);

  // Función que borra tasks
  function handleDelete() {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => !task.finished);
      // Guardar las tareas actualizadas en localStorage
      localStorage.setItem("tasks", JSON.stringify(newTasks));

      // Efecto de sonido
      const audio = new Audio(ThrowSound)
      audio.play()
      return newTasks;
    });
  }

  // Función que maneja el arrastre
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    setTasks(reorderedTasks);
    localStorage.setItem("tasks", JSON.stringify(reorderedTasks));
  };

  // Función que maneza el modo de pantalla completa
  function handleScreenSize() {
    const element = document.documentElement;
    setFullScreen(!fullScreen);
    if (!fullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  // Función que selecciona imagen de fondo
  const handleSeleccionarImagen = (event) => {
    const archivo = event.target.files[0];
    const lector = new FileReader();

    lector.onload = function () {
      const newBackground = `url(${lector.result})`;
      document.getElementById("bckImg").style.backgroundImage = newBackground;
      localStorage.setItem("backImg", newBackground);
    };

    lector.readAsDataURL(archivo);
  };

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
                provided.innerRef(el);
              }}
            >
              {/* Título y botones */}
              <div className="headerDiv">
                <button
                  onClick={handleScreenSize}
                  className="modeBtn maxScreenBtn"
                >
                  <img
                    src={fullScreen ? miniScreenSizeImg : screenSizeImg}
                  ></img>
                </button>
                <h1 className={`bigTitle ${lightMode ? "" : "light"}`}>
                  Tasks
                </h1>
                <button
                  onClick={() => setLightMode(!lightMode)}
                  className="modeBtn"
                >
                  <img src={lightMode ? lightImg : nightImg}></img>
                </button>
              </div>
              {/* Controles */}
              <div className="controls">
                <p className="auxText">Describe your task</p>
                <TaskForm setTasks={setTasks} tasks={tasks}></TaskForm>
              </div>

              {/* Contenedor tasks */}
              <div className="taskContainer">
                {tasks.length > 0 &&
                  tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="taskDiv"
                        >
                          {/* Cada tarea */}
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
                            urgent={task.urgent}
                            emoji={task.emoji}
                            dueDate={task.dueDate}
                            description={task.description}
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
                {/* Texto si no hay tareas */}
                {tasks.length == 0 && (
                  <p className="waitTxt">
                    <i>Waiting for tasks...</i>
                  </p>
                )}
              </div>
              {/* Borrar tareas y contador */}
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
      {/* Pomodoro selector*/}
      <div className="showPomodoroDiv">
        <p className="auxText">Show pomodoro</p>
        <div className="button r" id="button-1">
          <input
            type="checkbox"
            className="checkbox"
            onChange={() => setShowPomodoro(!showPomodoro)}
          />
          <div className="knobs"></div>
          <div className="layer"></div>
        </div>
      </div>
      {/* Pomodoro */}
      {showPomodoro && <Pomodoro lightMode={lightMode} />}

      {/* Botón para cambiar de fondo */}
      <button
        id="boton"
        className="modeBtn"
        onClick={() => inputRef.current.click()}
      >
        <img src={changeBckImg}></img>
      </button>
      <input
        type="file"
        id="input-imagen"
        ref={inputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleSeleccionarImagen}
      />
      {/* Playlist selector */}
      <div className="playlist">
        <div className="showPomodoroDiv fullwidth">
          <p className="auxText">Show playlist</p>
          {/* <input type="range" max="1" min="0" step="1" onChange={handleShowPomodoro}/> */}
          <div className="button r" id="button-1">
            <input
              type="checkbox"
              className="checkbox"
              id="showPlaylistCheck"
              onChange={() => setShowPlaylist(!showPlaylist)}
            />
            <div className="knobs"></div>
            <div className="layer"></div>
          </div>
        </div>
        {/* Playlist */}
        {showPlaylist && (
          <iframe
            src="https://open.spotify.com/embed/playlist/0kJbt84YUcL53AH59mJ4qk?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay clipboard-write encrypted-media fullscreen picture-in-picture"
            loading="lazy"
          ></iframe>
        )}
        {/* {showPlaylist && <iframe style={{borderRadius:"12px", src:"https://open.spotify.com/embed/playlist/0kJbt84YUcL53AH59mJ4qk?utm_source=generator&theme=0", width:"100%", height:"352", frameBorder:"0", allowFullScreen:"", allow:"autoplay clipboard-write encrypted-media fullscreen picture-in-picture", loading:"lazy"}}></iframe>} */}
      </div>
    </>
  );
}

export default App;

///// Extras
// Cita motivadora random
// Tiempo aprox tarea
