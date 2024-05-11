/* eslint-disable react/prop-types */
export default function Task({ title, finished, setFinished, lightMode, isTitle, urgent }) {
    
    function handleChangeFinished(){
        setFinished(!finished)
    }
    return (
        <div className={`task ${isTitle ? "taskTitle" : ""} ${urgent ? "urgent" : ""}`} onClick={handleChangeFinished}>
            {isTitle == false && <input
                className="checkbx"
                type="checkbox"
                checked={finished}
                onChange={handleChangeFinished}
            />}
            {finished ? (
                <label className={`taskTittle ${lightMode? "": "light"}`}><del>{title}</del></label>
            ) : (
                <label className={`taskTittle ${lightMode? "": "light"}`}>{title}</label>
            )}
        </div>
    )
}
