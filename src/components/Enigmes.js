import React, { useContext} from 'react';
import StepContext from "../context/StepContext";
import {useParams} from "react-router-dom"
import './assets/css/enigmes.css'
import Map from './Map.js'
import Cookie from 'js-cookie'
import CursorChanger from './CursorChanger';
import CursorReader from './CursorReader'
import Inventory from './Inventory'
import RoomObject from './RoomObject'

const Enigmes = () => {
    let { id } = useParams()
    let [step, setStep] = useContext(StepContext);    
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let currentRoom = step.player[playerP].zone;
    let currentEnigme = step.player[playerP].quest;
    let contentRoom = document.getElementById('content-room-container');

    function createComponent() {
        if(currentEnigme != "") {
            var componentName = currentEnigme;
            const importedComponentModule = require("./" + componentName).default;
            return React.createElement(importedComponentModule); 
        }
    }
    
    const closeTab = () => {
        const enigmeContainer = document.getElementById('enigme-container');
        enigmeContainer.classList.remove('enigme-active');
    }

    return(
        <div id="enigme-container">
            <div class="enigme-container-child">
                {createComponent()}
                <button id="backToMap" onClick={closeTab}>Revenir à la map</button>
            </div>
        </div>
    )
}

export default Enigmes