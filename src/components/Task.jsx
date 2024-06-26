import { useState } from "react"

/* eslint-disable react/prop-types */
export default function Task({
  title,
  finished,
  setFinished,
  lightMode,
  isTitle,
  urgent,
  emoji,
  dueDate,
  description,
}) {
  let timer
  const [showTooltip, setShowTooltip] = useState(false)

  function handleMouseOver() {
    if (description != "") {
      timer = setTimeout(() => {
        setShowTooltip(true)
      }, 2000) // 2 segundos
    }
  }

  function handleMouseOut() {
    clearTimeout(timer)
    setShowTooltip(false)
  }

  function handleChangeFinished() {
    setFinished(!finished)
  }

  const isDatePast = (dueDate) => {
    const currentDate = new Date()
    const taskDate = new Date(dueDate)
    return taskDate < currentDate
  }
  const isDateAlmostPast = (dueDate) => {
    const currentDate = new Date()
    const taskDate = new Date(dueDate)
    const timeDifference = taskDate - currentDate
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24) // Convertir milisegundos a días
    return daysDifference <= 2 && daysDifference > 0
  }

  return (
    <div
      className={`task ${isTitle ? "taskTitle" : ""} ${
        urgent ? "urgent" : ""
      } dFlex`}
      onClick={handleChangeFinished}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {isTitle == false && (
        <input
          className="checkbx"
          type="checkbox"
          checked={finished}
          onChange={handleChangeFinished}
        />
      )}
      {finished ? (
        <label className={`taskTittle ${lightMode ? "" : "light"}`}>
          <del>
            {emoji} {title}
            {dueDate && (
              <div
                className={`${isDatePast(dueDate) ? "pastDue" : ""} ${
                  isDateAlmostPast(dueDate) ? "almostPastDue" : ""
                } taskDueDate`}
              >
                {new Date(dueDate).toLocaleDateString()}
              </div>
            )}
          </del>
        </label>
      ) : (
        <label className={`taskTittle ${lightMode ? "" : "light"}`}>
          {emoji} {title}
          {dueDate && (
            <div
              className={`${isDatePast(dueDate) ? "pastDue" : ""} ${
                isDateAlmostPast(dueDate) ? "almostPastDue" : ""
              } taskDueDate`}
            >
              {new Date(dueDate).toLocaleDateString()}
            </div>
          )}
        </label>
      )}
      {showTooltip && <div className="tooltip">{description}</div>}
    </div>
  )
}
