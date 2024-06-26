/* eslint-disable react/prop-types */

import  { useState,useEffect } from 'react'
import Mute from "./../assets/mute.png"
import Sound from "./../assets/sonido.png"
import Config from "./../assets/config.png"
import Sound1 from "./../assets/sound1.wav"
import Sound2 from "./../assets/Sound2.flac"

export default function Pomodoro ({lightMode}){

    var brkInitialMin = 5
    var pomInitialMin = 25

    const [pomTimerMin, setPomTimerMin] = useState(pomInitialMin)
    const [pomTimerSec, setPomTimerSec] = useState(0)
    const [brkTimerMin, setBrkTimerMin] = useState(brkInitialMin)
    const [brkTimerSec, setBrkTimerSec] = useState(0)
    const [isBreak, setIsBreak] = useState(false)
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [isEditingPomTime, setIsEditingPomTime] = useState(false);
    const [isEditingBrkTime, setIsEditingBrkTime] = useState(false);
    const [editedPomTimerMin, setEditedPomTimerMin] = useState(pomInitialMin);
    const [editedBrkTimerMin, setEditedBrkTimerMin] = useState(brkInitialMin);

    const [mute, setMute] = useState(false)
    const [showControls, setShowControls] = useState(false)

    const [currentSound,setCurrentSound] = useState(Sound1)
    const [vol, setVol] = useState(1)
    var audio = new Audio(currentSound)

    const changeTimer = () => {
        setIsTimerActive(!isTimerActive)
        setIsEditingPomTime(false);
        setIsEditingBrkTime(false);

    }
    
    function resetTimer(){
        setBrkTimerMin(brkInitialMin)
        setPomTimerMin(pomInitialMin)
        setBrkTimerSec(0)
        setPomTimerSec(0)
    }

    const handlePomTimeClick = () => {
      if (!isTimerActive) {
        setIsEditingPomTime(true);
      }
    };
    
    const handleBrkTimeClick = () => {
      if (!isTimerActive) {
        setIsEditingBrkTime(true);
      }
    };
    
    const handlePomTimeChange = (e) => {
      setEditedPomTimerMin(e.target.value);
    };
    
    const handleBrkTimeChange = (e) => {
      setEditedBrkTimerMin(e.target.value);
    };
    
    const handlePomTimeBlur = () => {
      setPomTimerMin(editedPomTimerMin);
      setIsEditingPomTime(false);
    };
    
    const handleBrkTimeBlur = () => {
      setBrkTimerMin(editedBrkTimerMin);
      setIsEditingBrkTime(false);
    };
    

    useEffect(() => {
      const interval = setInterval(() => {
        if (!isBreak && isTimerActive) {
          if (pomTimerSec === 0 && pomTimerMin !== 0) {
            setPomTimerMin((prev) => prev - 1)
            setPomTimerSec(59)
          } else if (pomTimerMin === 0 && pomTimerSec === 0) {
            setIsBreak(true)
            setBrkTimerMin(brkInitialMin)
            setBrkTimerSec(0)
            playSound()
          } else {
            setPomTimerSec((prev) => prev - 1) // Utiliza el callback para asegurar que tienes el valor más reciente
          }
        } else if (isBreak && isTimerActive) {
          if (brkTimerSec === 0 && brkTimerMin !== 0) {
            setBrkTimerMin((prev) => prev - 1)
            setBrkTimerSec(59)
          } else if (brkTimerMin === 0 && brkTimerSec == 0) {
            setIsBreak(false)
            setPomTimerMin(pomInitialMin)
            setPomTimerSec(0)
            playSound()
          } else {
            setBrkTimerSec((prev) => prev - 1) // Utiliza el callback para asegurar que tienes el valor más reciente
          }
        }
        if(isBreak && isTimerActive) document.title = `${brkTimerMin.toString().padStart(2, '0')}:${(brkTimerSec-1).toString().padStart(2, '0')} - BREAK`;
        else if(isTimerActive) document.title = `${pomTimerMin.toString().padStart(2, '0')}:${(pomTimerSec-1).toString().padStart(2, '0')} - WORK`
        else document.title = "Mini Task List"
      }, 1000)

      return () => clearInterval(interval)
    }, [isBreak, pomTimerMin, pomTimerSec, brkTimerMin, brkTimerSec, isTimerActive]) 
    
    function changeMode(){
      if(isBreak) {
        setIsBreak(false)
        setPomTimerMin(pomInitialMin)
        setPomTimerSec(0)
      }else{
        setIsBreak(true)
        setBrkTimerMin(brkInitialMin)
        setBrkTimerSec(0)

      }
    }

    function handleMute(){
        setMute(!mute)
    }
    function showControlsFct(){
      setShowControls(!showControls)
    }
    function changeSound(){
        if(currentSound == Sound2) {
            setCurrentSound(Sound1)
        }
        if(currentSound == Sound1) {
            setCurrentSound(Sound2)
        }
    }
    function handleVolume(){
      setVol(document.getElementById("vol").value*0.01)
    }
    function playSound(){
      if(!mute){
        audio = new Audio(currentSound)
        audio.volume = vol
        audio.play()
      }
    }


    return (
      <div className={`pomodoroContainer ${lightMode ? "" : "light"}`}>
        <div className='timers'>
            <div className='timerContainer'>
                <div className='timerHeader'>
                    <button className='timerOptBtn modeBtn'>
                        <img src={mute? Sound:Mute} onClick={handleMute}></img>
                    </button>
                    {!isTimerActive && <p className={`bigTitle pomodoroModeTitle ${lightMode ? "" : "light"}`} onClick={changeMode}>{"Click to change Pomodoro mode"}</p>}
                    <h2 className={`bigTitle ${lightMode ? "" : "light"}`}>{isBreak? "Break":"Work!"}</h2>
                    <button className='timerOptBtn modeBtn' onClick={showControlsFct}>
                        <img src={Config}></img>
                    </button>
                    {showControls && <div className='controlsDiv'>
                      <input type="range" id="vol" min="0" max="100" onMouseUp={playSound}  onChange={handleVolume}/>
                      <button onClick={changeSound} className='modeBtn changeSoundBtn'>
                        <p>{currentSound == Sound1?1:2}</p>
                      </button>
                      </div>}
                </div>
                <div className='timerTime'>
                  {/* {isBreak? `${brkTimerMin.toString().padStart(2, '0')}:${brkTimerSec.toString().padStart(2, '0')}`:`${pomTimerMin.toString().padStart(2, '0')}:${pomTimerSec.toString().padStart(2, '0')}`} */}
                  {isEditingPomTime? (
                    !isBreak && <input
                      type="number"
                      value={editedPomTimerMin}
                      onChange={handlePomTimeChange}
                      onBlur={handlePomTimeBlur}
                      min="1"
                    />
                    
                    ) 
                    : 
                    (
                      !isBreak && <p onClick={handlePomTimeClick}>
                        {`${pomTimerMin.toString().padStart(2, '0')}:${pomTimerSec.toString().padStart(2, '0')}`}
                      </p>
                    )
                  }
                  {isEditingBrkTime ? (
                    isBreak && <input
                      type="number"
                      value={editedBrkTimerMin}
                      onChange={handleBrkTimeChange}
                      onBlur={handleBrkTimeBlur}
                      min="1"
                    />
                    ) 
                    : 
                    (
                      isBreak && <p onClick={handleBrkTimeClick}>
                        {`${brkTimerMin.toString().padStart(2, '0')}:${brkTimerSec.toString().padStart(2, '0')}`}
                      </p>
                    )
                    }
                </ div>
                {!isTimerActive && <p className='editText'>click numbers to edit</p>}

            </div>
        </div>
        <div className='timerControls'>
            <button className='timerBtn' onClick={changeTimer}>{isTimerActive?'Stop':'Start'}</button>
            <button className='timerBtn' onClick={resetTimer}>Reset</button>
        </div>

      </div>
    )
  }
