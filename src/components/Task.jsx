/* eslint-disable react/prop-types */

export default function Task({title, finished, setFinished}) {


    function handleChangeFinished(){
        setFinished(!finished)
    }

    return (
        <div className="task" onClick={handleChangeFinished}>
            <input
                className="checkbx"
                type="checkbox"
                checked={finished}
            />
            {finished ? (
                <label className="taskTittle"><del>{title}</del></label>
            ) : (
                <label className="taskTittle">{title}</label>
            )}
        </div>
    )
}
