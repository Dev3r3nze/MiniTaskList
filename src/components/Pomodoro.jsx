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

    const [mute, setMute] = useState(false)

    const [currentSound,setCurrentSound] = useState(Sound2)

    const changeTimer = () => {
        setIsTimerActive(!isTimerActive)
    }
    
    function resetTimer(){
        setBrkTimerMin(brkInitialMin)
        setPomTimerMin(pomInitialMin)
        setBrkTimerSec(0)
        setPomTimerSec(0)
    }
    

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
            if (brkTimerSec === 0) {
              setBrkTimerMin((prev) => prev - 1)
              setBrkTimerSec(59)
            } else if (brkTimerMin === 0 && brkTimerSec !== 0) {
              setIsBreak(false)
              setPomTimerMin(pomInitialMin)
              setPomTimerSec(0)
              playSound()
            } else {
              setBrkTimerSec((prev) => prev - 1) // Utiliza el callback para asegurar que tienes el valor más reciente
            }
          }
        }, 1000)
      
        return () => clearInterval(interval)
      }, [isBreak, pomTimerMin, pomTimerSec, brkTimerMin, brkTimerSec, isTimerActive])

        function playSound() {
        // Crea una instancia de la clase Audio y proporciona la URL del archivo de sonido
        const audio = new Audio(currentSound);
        // Reproduce el sonido
        if(!mute){
            audio.play();
        }
    }

    function handleMute(){
        setMute(!mute)
    }
    function changeSound(){
        if(currentSound == Sound2) {
            setCurrentSound(Sound1)
        }
        if(currentSound == Sound1) {
            setCurrentSound(Sound2)
        }
        const audio = new Audio(currentSound);
        audio.play();

    }

    return (
      <div className={`pomodoroContainer ${lightMode ? "" : "light"}`}>
        <div className='timers'>
            <div className='timerContainer'>
                <div className='timerHeader'>
                    <button className='timerOptBtn modeBtn'>
                        <img src={mute? Sound:Mute} onClick={handleMute}></img>
                    </button>
                    <h2 className={`bigTitle ${lightMode ? "" : "light"}`}>{isTimerActive?isBreak? "Break":"Work!":"Timer"}</h2>
                    <button className='timerOptBtn modeBtn' onClick={changeSound}>
                        <img src={Config}></img>
                    </button>
                </div>
                <p className='timerTime'>
                    {isBreak? `${brkTimerMin.toString().padStart(2, '0')}:${brkTimerSec.toString().padStart(2, '0')}`:`${pomTimerMin.toString().padStart(2, '0')}:${pomTimerSec.toString().padStart(2, '0')}`}
                </p>
            </div>
        </div>
        <div className='timerControls'>
            <button className='timerBtn' onClick={changeTimer}>{isTimerActive?'Stop':'Start'}</button>
            <button className='timerBtn' onClick={resetTimer}>Reset</button>
        </div>

      </div>
    )
  }
