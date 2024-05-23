import { useState, useEffect, useRef } from "react";
import "./App.css";
import Task from "./components/Task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid"; // importa uuid
import lightImg from "./assets/day.png";
import nightImg from "./assets/night.png";
import screenSizeImg from "./assets/screenSize.png";
import miniScreenSizeImg from "./assets/min.png";
import changeBckImg from "./assets/bckimgChange.png";
import Pomodoro from "./components/Pomodoro";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import Picker from "@emoji-mart/react";
init({ data });

function App() {
  const [tasks, setTasks] = useState([]);
  const [lightMode, setLightMode] = useState([false]);
  const [fullScreen, setFullScreen] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [dueDate, setDueDate] = useState();
  const pickerRef = useRef();


  const inputRef = useRef(null);

  // var mainTask

  useEffect(() => {
    // Recuperar tareas almacenadas en localStorage al iniciar la aplicación
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const lastBackground = localStorage.getItem("backImg");
    document.getElementById("bckImg").style.backgroundImage = lastBackground;
    setTasks(storedTasks);
    document.getElementById("showPlaylistCheck").checked = true;

    
  }, []);

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

  const handleUrgentChange = (event) => {
    const isChecked = event.target.checked;
    setUrgent(isChecked); // Actualiza el estado de la tarea urgente
  };

  function handleCreate() {
    const input = document.getElementById("titleInput");
    const title = input.value;
    var urgentBool = false;

    input.value = "";
    const taskId = uuidv4();
    if (showAdvanced) {
      document.getElementById("urgentInput").checked = false;
      setUrgent(false);
      urgentBool = urgent;
    } else {
      setEmoji("");
    }
    const newTask = {
      id: taskId,
      title,
      finished: false,
      istitle: false,
      urgent: urgentBool,
      emoji: showAdvanced ? emoji : "",
      dueDate: dueDate,
    };
    if (title.trim() !== "") {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]));
    }
    setEmoji("");
    setDueDate("");
  }

  function handleSpacer() {
    const input = document.getElementById("titleInput");
    const totalLenght = 40;
    // Calcular la cantidad de caracteres "━" que se deben agregar en cada lado
    const addChars = Math.floor((totalLenght - input.value.length - 6) / 2);
    // Construir el título con los caracteres "━" adicionales
    const title = `┏${"━".repeat(addChars)} ${input.value} ${"━".repeat(
      addChars
    )}┓`;
    var subTitle = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛";
    if (title.split("").length % 2 == 0) {
      subTitle = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛";
    }

    const taskId = uuidv4();
    const taskIdSub = `Sub${taskId}`;
    const newTitle = { id: taskId, title, finished: false, istitle: true };
    const newSubTitle = {
      id: taskIdSub,
      title: subTitle,
      finished: false,
      istitle: true,
    };

    if (input.value !== "") {
      setTasks((prevTasks) => [...prevTasks, newTitle]);
      setTasks((prevTasks) => [...prevTasks, newSubTitle]);
      localStorage.setItem(
        "tasks",
        JSON.stringify([...tasks, newTitle, newSubTitle])
      );
    }
    input.value = "";
  }

  const handleEmojiSelect = (emoji) => {
    setEmoji(emoji.native);
  };

  function handleDelete() {
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => !task.finished);

      // Guardar las tareas actualizadas en localStorage
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      return newTasks;
    });
  }

  function handleMode() {
    setLightMode(!lightMode);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    setTasks(reorderedTasks);
    localStorage.setItem("tasks", JSON.stringify(reorderedTasks));
  };

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
  function handleShowPomodoro() {
    setShowPomodoro(!showPomodoro);
  }
  function handleShowPlaylist() {
    setShowPlaylist(!showPlaylist);
  }

  const handleCambiarImagen = () => {
    inputRef.current.click();
  };

  const handleIconPicker = () => {
    setShowPicker((prev) => !prev);
    console.log(showPicker)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    // Agregar el manejador de eventos al documento
    document.addEventListener('click', handleClickOutside);

    // Limpiar el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPicker]);

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
              {/* <button onClick={enterPiPMode}>PiP</button> */}
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
                <button onClick={handleMode} className="modeBtn">
                  <img src={lightMode ? lightImg : nightImg}></img>
                </button>
              </div>
              <div className="controls">
                <p className="auxText">Describe your task</p>
                <form action="" onSubmit={handleSubmit}>
                  <div className="taskInputDiv">
                    <input type="text" id="titleInput" />
                    {/* Desplegable */}
                    <button
                      type="button"
                      className="advanceArrowBtn"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                      <p className={`${showAdvanced ? "upSide" : "downSide"}`}>
                        {">"}
                      </p>
                    </button>
                  </div>
                  {showAdvanced && (
                    <div className="advancedOptions">
                      <label className="urgentLabel" htmlFor="urgent">
                        {" "}
                        Set as urgent:
                        <input
                          type="checkbox"
                          name="urgent"
                          className="urgentInput"
                          id="urgentInput"
                          onChange={handleUrgentChange} // Agrega el manejador onChange
                        />
                      </label>
                      <label htmlFor="dueDate" className="dateLabel">
                        Due date:
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          name="dueDate"
                          className="dateInput"
                        ></input>
                      </label>
                      <label htmlFor="emojiInput" className="iconSelector">
                        Icon:{" "}
                        <span ref={pickerRef}  onClick={handleIconPicker} className={`emojiBox ${emoji ? "" : "empty"}`}>
                          {emoji}
                        </span>
                      </label>
                      {showPicker && (
                        <div className="emojiPicker" >
                          <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            title="Selecciona un emoji"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <br />
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
      <div className="showPomodoroDiv">
        <p className="auxText">Show pomodoro</p>
        {/* <input type="range" max="1" min="0" step="1" onChange={handleShowPomodoro}/> */}
        <div className="button r" id="button-1">
          <input
            type="checkbox"
            className="checkbox"
            onChange={handleShowPomodoro}
          />
          <div className="knobs"></div>
          <div className="layer"></div>
        </div>
      </div>
      {showPomodoro && <Pomodoro lightMode={lightMode} />}
      <button id="boton" className="modeBtn" onClick={handleCambiarImagen}>
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
      <div className="playlist">
        <div className="showPomodoroDiv fullwidth">
          <p className="auxText">Show playlist</p>
          {/* <input type="range" max="1" min="0" step="1" onChange={handleShowPomodoro}/> */}
          <div className="button r" id="button-1">
            <input
              type="checkbox"
              className="checkbox"
              id="showPlaylistCheck"
              onChange={handleShowPlaylist}
            />
            <div className="knobs"></div>
            <div className="layer"></div>
          </div>
        </div>

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
// Ordenar
// Urgencia
// Guardar en localstorage
// Contador tareas pendientes
// Tiempo aprox tarea
