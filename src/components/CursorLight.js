import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/cursor.css'

const CursorLight = (props) => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let length = Object.keys(step.cursors.values);
    let rotate = parseInt(step.cursors.values[props.identifier]);
    let colorScheme = Object.values(step.cursors.colorScheme);
    let colorAngles = Object.values(step.cursors.colorAngles);
    let color = colorAngles.indexOf(rotate);
    color = colorScheme[color];

    const setColor = () => {
        return(
            {background: color,
            boxShadow: '0 0 30px 4px '+color+',inset 0 0 15px 4px '+color,
            }
        )
    }

    const setShadow = () => {
        
    }

    return(
        <div style={setColor()} class="cursor-reader-light" identifier={props.identifier}>
            <img src="https://etiennemoureton.fr/digital-event/objects/ampoules.png"></img>
        </div>
    )
}

export default CursorLight;