import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import CursorLight from './CursorLight'
import firebase from '../firebase';
import './assets/css/cursor.css'
import { createPortal } from 'react-dom';

const CursorReader = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let length = Object.keys(step.cursors.values);

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();
        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);
        batch.commit();
    }

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

    const validate = () => {
        let actualColorSuiteDegrees = Object.values(step.cursors.values);
        let colorScheme = Object.values(step.cursors.colorScheme);
        let colorAngles = Object.values(step.cursors.colorAngles);
        var actualColorSuiteColors = [];
        for(let i = 0; i<actualColorSuiteDegrees.length; i++){
            let degrees = actualColorSuiteDegrees[i];
            let color = colorAngles.indexOf(degrees);
            color = colorScheme[color];
            actualColorSuiteColors.push(color);
        };
        if(JSON.stringify(actualColorSuiteColors) == JSON.stringify(step.cursors.validationArray)){
            const dataToBatch = {};
            dataToBatch[`cursors.isAchieved`] = true;
            dataToBatch[`bureauLocked`] = false;
            dataToBatch[`quests.cursors.state`] = true;
            displayMessage("La porte se débloque, vous pouvez sortir");
            const enigmeContainer = document.getElementById('enigme-container');
            enigmeContainer.classList.remove('enigme-active');
            updateBatch(db, id, dataToBatch);  
        }
    }

    useEffect(() => {
        validate();
    })

    return(
        <div class="cursor-reader">
            <ul>
                {length.map((value, index) => {
                    return(
                        <CursorLight key={index} identifier={value}></CursorLight>
                    )
                })}
            </ul>
        </div>
    )
}

export default CursorReader;