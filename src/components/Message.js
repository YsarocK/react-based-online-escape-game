import React, { useContext, useEffect} from 'react';
import {useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/message.css';

const Message = () => {
    let { id } = useParams()
    const pos = ""
    const db = firebase.firestore();
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let [step, setStep] = useContext(StepContext);
    let [RoomData, setRoomData] = useContext(RoomDataContext);

    const closeMessage = () => {
        const message = document.getElementById('message');
        message.classList.remove('message-in');
        message.classList.add('message-out');
    }

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const displayMessage = () => {
        if(RoomData.length != 0){
            return(
                <p class="message-content">{step.message}</p>
            )
        }
    }

    return(
        <div class="message message-in" id="message">
            <div class="message-header">
            <p class="message-close" onClick={closeMessage}>Fermer</p>
            <p class="message-title">Message</p>
            </div>
            {displayMessage()}
        </div>
    )
}

export default Message