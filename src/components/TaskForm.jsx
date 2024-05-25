import { useState, useRef,useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import data from "@emoji-mart/data"
import { init } from "emoji-mart"
import Picker from "@emoji-mart/react"
init({ data })

// eslint-disable-next-line react/prop-types
export default function TaskForm({ setTasks, tasks }) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [emoji, setEmoji] = useState("")
  const [showPicker, setShowPicker] = useState(false)
  const [dueDate, setDueDate] = useState()
  const pickerRef = useRef()
  const [urgent, setUrgent] = useState(false)
  const [desc, setDesc] = useState("");


  function handleCreate() {
    const input = document.getElementById("titleInput")
    const title = input.value
    var urgentBool = false
    const description = document.getElementById("descInput").value;


    input.value = ""
    const taskId = uuidv4()
    if (showAdvanced) {
      document.getElementById("urgentInput").checked = false
      setUrgent(false)
      urgentBool = urgent
    } else {
      setEmoji("")
    }
    const newTask = {
      id: taskId,
      title,
      finished: false,
      istitle: false,
      urgent: urgentBool,
      emoji: showAdvanced ? emoji : "",
      dueDate: dueDate,
      description
    }
    if (title.trim() !== "") {
      setTasks((prevTasks) => [...prevTasks, newTask])
      localStorage.setItem("tasks", JSON.stringify([...tasks, newTask]))
    }
    setEmoji("")
    setDueDate("")
    setDesc("")
    document.getElementById("descInput").value = ""
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false)
      }
    }

    // Agregar el manejador de eventos al documento
    document.addEventListener("click", handleClickOutside)

    // Limpiar el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showPicker])

  function handleSpacer() {
    const input = document.getElementById("titleInput")
    const totalLenght = 40
    // Calcular la cantidad de caracteres "━" que se deben agregar en cada lado
    const addChars = Math.floor((totalLenght - input.value.length - 6) / 2)
    // Construir el título con los caracteres "━" adicionales
    const title = `┏${"━".repeat(addChars)} ${input.value} ${"━".repeat(
      addChars
    )}┓`
    var subTitle = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
    if (title.split("").length % 2 == 0) {
      subTitle = "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"
    }

    const taskId = uuidv4()
    const taskIdSub = `Sub${taskId}`
    const newTitle = { id: taskId, title, finished: false, istitle: true }
    const newSubTitle = {
      id: taskIdSub,
      title: subTitle,
      finished: false,
      istitle: true,
    }

    if (input.value !== "") {
      setTasks((prevTasks) => [...prevTasks, newTitle])
      setTasks((prevTasks) => [...prevTasks, newSubTitle])
      localStorage.setItem(
        "tasks",
        JSON.stringify([...tasks, newTitle, newSubTitle])
      )
    }
    input.value = ""
  }

  const handleEmojiSelect = (emoji) => {
    setEmoji(emoji.native)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleIconPicker = () => {
    setShowPicker((prev) => !prev)
    console.log(showPicker)
  }
  const handleUrgentChange = (event) => {
    const isChecked = event.target.checked
    setUrgent(isChecked) // Actualiza el estado de la tarea urgente
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="taskInputDiv">
        <input type="text" id="titleInput" />
        {/* Desplegable */}
        <button
          type="button"
          className="advanceArrowBtn"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <p className={`${showAdvanced ? "upSide" : "downSide"}`}>{">"}</p>
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
            <span
              ref={pickerRef}
              onClick={handleIconPicker}
              className={`emojiBox ${emoji ? "" : "empty"}`}
            >
              {emoji}
            </span>
          </label>
          {showPicker && (
            <div className="emojiPicker">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                title="Selecciona un emoji"
              />
            </div>
          )}
          <label htmlFor="desc"> Description: 
          <input type="text" className="descInput" id="descInput" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>
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
  )
}
