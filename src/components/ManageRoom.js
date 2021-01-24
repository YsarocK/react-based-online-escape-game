import React, { useContext, useEffect } from 'react';
import {useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import firebase from 'firebase'
import firestoreFunctions from '../services/firestoreFunctions'
import './assets/css/manageroom.css'
import Loader from './Loader';
import ManageRoomContent from './ManageRoomContent';
import ManageRoomPitch from './ManageRoomPitch';
import Cookies from 'js-cookie'

const ManageRoom = () => {
  // INIT VARIABLE
  let { id } = useParams();
  let [step, setStep] = useContext(StepContext);
  let pitch = "";

  // INIT PLAYER IDENTITY IN BROWSER + DB
  const setPlayerIdentity = () => {
      let players = step.player;
      var length = Object.values(players).length;
      if(Cookies.get('playerID')){
        return
      }
      for(let i = 1; i<=length; i++) {
          var p = 'p'+i;
          const active = players[p].active;
          if(active != true && i<=4) {
              let setActive = 'player.p'+ i + '.active';
              let getID = players[p].id;
              Cookies.set('playerID', i);
              firestoreFunctions.firebaseWrite(setActive, true, id);
              break
          }
      }
  }

  // VERIFICATION THAT WE'RE CONNECTED TO DB
  const isReady = () => {
    var loader = document.getElementById('loader');
    if(step.isReady && loader){
      pitch = step.pitch;
        setPlayerIdentity();
        return (              
            loader.style.display = "none",
            <ManageRoomContent></ManageRoomContent>
        )
    }
  }

  
  function requestDB() {
    const db = firebase.firestore();
    const doc = db.collection('Room').doc(id)
    doc.onSnapshot(snapshot => {
        step = setStep(snapshot.data());
    });
  }

  // CONNECTION TO DB ON COMPONENT INIT + SET CONTEXT WITH DATA
  useEffect( () => {
    requestDB();
  }, [])

  return (
    <div id="root-container">
        <Loader></Loader>
        <ManageRoomPitch pitch={pitch}></ManageRoomPitch>
        {isReady()};
    </div>

  )
}

export default ManageRoom