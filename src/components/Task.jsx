/* eslint-disable react/prop-types */

export default function Task({title, finished, setFinished,lightMode}) {


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
                <label className={`taskTittle ${lightMode? "": "light"}`}><del>{title}</del></label>
            ) : (
                <label className={`taskTittle ${lightMode? "": "light"}`}>{title}</label>
            )}
        </div>
    )
}
