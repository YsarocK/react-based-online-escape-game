import React, { useContext} from 'react';
import {useParams} from "react-router-dom"
import './assets/css/glitch.css'
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/garage.css'
import RoomDataContext from '../context/RoomDataContext';

const Gladys = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext)
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    var gladys = document.getElementById('gladys');
    
    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const displayGladys = () => {
        if(gladys){
            let msgToLoad = step.gladys;
            if(msgToLoad == ""){
                gladys.classList.add('hide-gladys');
                return
            } else {
                gladys.classList.remove('hide-gladys');
                gladys.classList.remove('gladys-none');
                return "https://etiennemoureton.fr/digital-event/"+ msgToLoad +"-gladys.png"
            }
        }
    }

    const closeGladys = () => {
        let msgLoaded = step.gladys;
        console.log(msgLoaded);
        if(gladys){
            console.log('gladys se reset');
            let dataToBatch = {};
            dataToBatch[`gladys`] = "";
            updateBatch(db, id, dataToBatch);
            gladys.classList.add('hide-gladys');
        }
        if(msgLoaded == "tablet-2"){
            let dataToBatch = {};
            dataToBatch[`glitchStatue`] = true;
            updateBatch(db, id, dataToBatch);
        }
        if(msgLoaded == "intro-2"){
            let dataToBatch = {};
            dataToBatch[`quests.begin.state`] = true;
            updateBatch(db, id, dataToBatch);
        }
    }

    return(
        <div id="gladys"><div id="closeGladys"><button onClick={closeGladys}>Suivant</button></div><img src={displayGladys()}></img></div>
    )
}

export default Gladys