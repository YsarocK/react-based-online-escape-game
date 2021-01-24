import React, { useEffect, useContext, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import firebase from 'firebase'
import {useParams} from "react-router-dom";
import StepContext from "../context/StepContext";

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

  function displayMessage(message) {
      var neWmessage = message;
      var messageContainer = document.getElementById('message');
      let dataToBatch = {};
      var data = 'message';
      dataToBatch[`${data}`] = neWmessage;
      if(Object.values(messageContainer.classList).includes('message-out')){
          messageContainer.classList.add('message-in');
          messageContainer.classList.remove('message-out');
      }
      updateBatch(db, id, dataToBatch);
  }

  const db = firebase.firestore();
  let { id } = useParams();
  let [step, setStep] = useContext(StepContext);    
  let isMounted = false;
  let [isReady, setIsReady] = useState(false);
  let messageContainer = document.getElementById('message');
  var timerDisplay = document.getElementById('timer-display');

  function updateBatch(db, roomID, dataToBatch) {  
    const batch = db.batch();
    const sfRef = db.collection('Room').doc(roomID);
    sfRef.update(dataToBatch);

    batch.commit();
    }

  function moveRobot() {
    console.log(minutes)
    if(minutes != 0 && minutes < 19 && step.printerNoise == false && step.gladysMessagePassed == false) {
        timerDisplay.classList.add('isActive')
        displayMessage("La vengeance est un plat qui se mange froid, attention la clim est activée.");
        let dataToBatch = {};
        setTimeout(() => {
          dataToBatch = {};
          dataToBatch[`gladys`] = "freeze-2";
          dataToBatch["gladysMessagePassed"] = true
          updateBatch(db, id, dataToBatch);
      }, 2000);
    }
    if(minutes != 0 && minutes < 18 && step.robotMove == false){
        displayMessage("Vous avez entendu ce bruit ? On aurait dit une imprimante.");
        let dataToBatch = {};
        dataToBatch['printerNoise'] = true;
        updateBatch(db, id, dataToBatch);
        if(Object.values(messageContainer.classList).includes('message-out')){
            messageContainer.classList.add('message-in');
            messageContainer.classList.remove('message-out');
        }
    }
    if(minutes == 0 && seconds == 0 && step.paperDiscovered == true){
      let dataToBatch = {};
      dataToBatch['end'] = "bad";
      updateBatch(db, id, dataToBatch);
    }
  }

  let time = new Date();
  useEffect(() => {
      let launchedTime = new Date(expiryTimestamp);
      let difference = time - launchedTime;
      restart(time.setMilliseconds(time.getMilliseconds() + (1200 * 1000)) - difference);
      setIsReady(true);
  }, []);

  return (
    <div id="timer-display" class="task-timer">
      <p>Congélation dans</p>
      <div style={{textAlign: 'center'}}>
          {moveRobot(isMounted)}
          <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

export default MyTimer;