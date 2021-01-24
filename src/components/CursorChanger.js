import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import firebase from '../firebase';
import Cursor from '../components/Cursor'
import './assets/css/cursor.css'

const CursorChanger = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let length = Object.keys(step.cursors.values);

    const displayElement = () => {
        var cursors = document.querySelectorAll('.cursor-container')
        if(step.inventory.indexOf('tournevis') == -1) {
            cursors[3].classList.add('cursor-disabled');
            cursors[4].classList.add('cursor-disabled');
        } else {
            cursors[3].classList.remove('cursor-disabled');
            cursors[4].classList.remove('cursor-disabled');
        }
    }

    useEffect(()=>{
        displayElement();
    })

    return(
        <div class="cursor-changer" id="cursor-changer">
            <div id='boitier-elec'>
                <div id="boitier-elec-couvercle"></div>
                <ul>
                    {length.map((value, index) => {
                        return <Cursor key={index} identifier={value}></Cursor>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default CursorChanger;