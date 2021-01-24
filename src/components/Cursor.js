import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/cursor.css'

const Cursor= (props) => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let rotate = parseInt(step.cursors.values[props.identifier]);

    // ASYNC FUNCTION TO UPDATE DATABASE
    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const cursorChangeAngle = ({currentTarget}) => {
        let target  =  currentTarget;
        if (rotate < 360) {
            rotate = rotate + 36;
          } else {
            rotate = 0;
            rotate = rotate + 36;
          }
        let dataToBatch = {};
        dataToBatch[`cursors.values.${props.identifier}`] = rotate;
        target.style.webkitTransform = 'rotate('+rotate+'deg)';
        updateBatch(db, id, dataToBatch)
    }  

    const initialValue = () => {
        return(
            'rotate('+rotate+'deg)'
        )
    }

    useEffect(()=>{
    }, [])

    return(
        <div class="cursor-container">
            <div style={{webkitTransform: initialValue()}} identifier={props.identifier} class="cursor" onClick={(event) => cursorChangeAngle(event)}></div>
        </div>
    )
}

export default Cursor;