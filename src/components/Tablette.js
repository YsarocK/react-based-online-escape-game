import './assets/css/tablette.css'
import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';

const Tablette = () => {
    let { id } = useParams()
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);    
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let messageContainer = document.getElementById('message');
    var gladys = document.getElementById('gladys');

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const tabletIsBlocked = () => {
        if(step.houseSettings.glitch.isAchieved == true){
            return
        }
        let dataToBatch = {};
        var data = 'message';
        dataToBatch[`${data}`] = "Oups, la tablette est bloquée : Gladys semble la contrôler.";
        dataToBatch[`gladys`] = "";
        if(Object.values(messageContainer.classList).includes('message-out')){
            messageContainer.classList.add('message-in');
            messageContainer.classList.remove('message-out');
        }
        updateBatch(db, id, dataToBatch);
        setTimeout(() => {
            dataToBatch = {};
            dataToBatch[`gladys`] = "tablet-2";
            updateBatch(db, id, dataToBatch);
        }, 5000);
    }

    useEffect(() => {
        messageContainer = document.getElementById('message');
    })

    return(
        <div id="tablette-container">
            {/* {displayMessage()} */}
            <div id="tablette">
                <div onClick={tabletIsBlocked}></div>
            </div>
        </div>
    )
}

export default Tablette