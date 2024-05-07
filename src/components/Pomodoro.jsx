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
    const [showControls, setShowControls] = useState(false)

    const [currentSound,setCurrentSound] = useState(Sound1)
    const [vol, setVol] = useState(1)
    var audio = new Audio(currentSound)

    const changeTimer = () => {
        setIsTimerActive(!isTimerActive)
    }
    
    function resetTimer(){
        setBrkTimerMin(brkInitialMin)
        setPomTimerMin(pomInitialMin)
        setBrkTimerSec(0)
        setPomTimerSec(0)
    }
    

    const handleModeChange = () => {
      if (!isTimerActive) {
        setIsBreak(!isBreak);
        // Reiniciar el temporizador según el modo actual
        if (!isBreak) {
          setPomTimerMin(pomInitialMin);
          setPomTimerSec(0);
        } else {
          setBrkTimerMin(brkInitialMin);
          setBrkTimerSec(0);
        }
      }
    };
    
    useEffect(() => {
      const interval = setInterval(() => {
        if (isTimerActive) {
          if (!isBreak && pomTimerSec === 0 && pomTimerMin !== 0) {
            setPomTimerMin((prev) => prev - 1);
            setPomTimerSec(59);
          } else if (!isBreak && pomTimerMin === 0 && pomTimerSec === 0) {
            handleModeChange();
            playSound();
          } else if (isBreak && brkTimerSec === 0 && brkTimerMin !== 0) {
            setBrkTimerMin((prev) => prev - 1);
            setBrkTimerSec(59);
          } else if (isBreak && brkTimerMin === 0 && brkTimerSec === 0) {
            handleModeChange();
            playSound();
          } else if (!isBreak) {
            setPomTimerSec((prev) => prev - 1);
          } else {
            setBrkTimerSec((prev) => prev - 1);
          }
        }
      }, 1000);
    
      return () => clearInterval(interval);
    }, [isBreak, pomTimerMin, pomTimerSec, brkTimerMin, brkTimerSec, isTimerActive]);
    

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
                    {!isTimerActive && <h3 className={`bigTitle pomodoroModeTitle ${lightMode ? "" : "light"}`} onClick={handleModeChange}>{"Change Pomodoro mode"}</h3>}
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
