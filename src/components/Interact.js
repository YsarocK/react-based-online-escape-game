import React, { useContext} from 'react';
import StepContext from "../context/StepContext";
import {useParams} from "react-router-dom"
import './assets/css/enigmes.css'
import Glitch from './Glitch';
import firebase from '../firebase'
import Cookie from 'js-cookie'
import RoomDataContext from "../context/RoomDataContext"
import { data } from 'jquery';
import { createPortal } from 'react-dom';

const Interact = () => {
    const db = firebase.firestore()
    let { id } = useParams()
    let [step, setStep] = useContext(StepContext);    
    let [RoomData, setRoomData] = useContext(RoomDataContext); 
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let oldInventory = [];
    let oldRoomObjects = [];
    let currentRoom = step.player[playerP].zone;
    let selectedObject = step.player[playerP].holding;

    const openEnigme = ({currentTarget}) => {
        let type = currentTarget.id;
        if(type == 'returnObject') {
            let quest = RoomData[selectedObject].interactAction;
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.quest`] = quest;
            updateBatch(db, id, dataToBatch);
            const enigmeContainer = document.getElementById('enigme-container');
            enigmeContainer.classList.add('enigme-active');
        } else if(type == 'returnTablet') {
            let quest = 'Tablette';
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.quest`] = quest;
            dataToBatch[`quests.tablet.state`] = true;
            updateBatch(db, id, dataToBatch);
            const enigmeContainer = document.getElementById('enigme-container');
            enigmeContainer.classList.add('enigme-active');
        } else if(type == "openGarage") {
            var button = document.getElementById('close-garage');
            console.log(button);
            button.classList.remove('close-garage-hide');
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.garage`] = true;
            updateBatch(db, id, dataToBatch);
        } else if(type == 'openPuzzle'){
            let quest = 'PaperAssemble';
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.quest`] = quest;
            updateBatch(db, id, dataToBatch);
            const enigmeContainer = document.getElementById('enigme-container');
            enigmeContainer.classList.add('enigme-active');
        }
    }

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const pickObject = () => {
        if (step.inventory.length < 4) {
            // AJOUT DANS L'INVENTAIRE
            oldInventory = step.inventory;
            oldInventory.push(selectedObject);
            let dataToBatch = {};
            dataToBatch['inventory'] = oldInventory;
            updateBatch(db, id, dataToBatch);

            // RETIRAGE DE LA SALLE
            oldRoomObjects = step.rooms[currentRoom].objects;
            let dataToDelete = oldRoomObjects.indexOf(selectedObject);
            oldRoomObjects.splice(dataToDelete, 1);
            dataToBatch = {};
            dataToBatch[`rooms.${currentRoom}.objects`] = oldRoomObjects;
            dataToBatch[`player.${playerP}.holding`] = "";
            updateBatch(db, id, dataToBatch);
        }
    }

    const takePaper = () => {
        if(step.paperInventory.length < 12){
             // RETIRAGE DE LA SALLE
            oldRoomObjects = step.rooms[currentRoom].objects;
            let dataToDelete = oldRoomObjects.indexOf(selectedObject);
            oldRoomObjects.splice(dataToDelete, 1);
            let dataToBatch = {};
            dataToBatch[`rooms.${currentRoom}.objects`] = oldRoomObjects;
            updateBatch(db, id, dataToBatch);

            // AJOUT DANS L'INVENTAIRE
            oldInventory = step.paperInventory;
            oldInventory.push(selectedObject);
            dataToBatch = {};
            dataToBatch['paperInventory'] = oldInventory;
            dataToBatch[`player.${playerP}.holding`] = "";
            updateBatch(db, id, dataToBatch);
        }
    }

    function state() {
        if(RoomData[selectedObject]) {
            let action = RoomData[selectedObject];
            if(action.type == "taking") {
                return(
                    <button onClick={pickObject}>Ajouter à l'inventaire</button>
                )
            } else if(action.type == "interact"){
                return(
                    <button id="returnObject" onClick={(event) => openEnigme(event)}>{action.interactButton}</button>
                )
            } else if(action.type == "none"){
                return(
                    <p class="interact-message">Vous ne pouvez rien faire avec le {action.name}.</p>
                )
            } else if(action.type == 'paper') {
                if(step.paperInventory.length < 12){
                    return(
                        <button id="take-paper" onClick={takePaper}>Prendre le morceau de papier</button>
                    )
                }
            }
        }
    }

    const isTabletInInventory = () => {
        if(step.inventory.indexOf('tablette') != -1) {
            return(
                <button id="returnTablet" onClick={(event) => openEnigme(event)}>Accéder à la tablette</button>
            )
        };
    }

    const garage = () => {
        if(step.player[playerP].zone == "garage"){
            return(
                <button id="openGarage" onClick={(event) => openEnigme(event)}>Explorer le garage</button>
            )
        }
    }

    const Paper = () => {
        if(step.paperInventory.length == 12){
            return(
                <button id="openPuzzle" onClick={(event) => openEnigme(event)}>Assembler les papiers</button>
            )
        }
    }

    const PaperNumber = () => {
        if(step.paperInventory.length >= 1){
            return(
                <div class="paper-quest-container">
                    <p>Vous avez récoltés <span id="paper-number">{step.paperInventory.length}</span>/12 papiers</p>
                </div>
            )
        }
    }

    return(
        <div id="interact" class="card">
            <div>
                <p class="card-subtitle">Intéractions</p>
                <p class="card-title">Actions</p>
            </div>
            <div>
                {state()}
                {isTabletInInventory()}
                {garage()}
                {Paper()}
            </div>
            <div>
            {PaperNumber()}
            </div>
        </div>
    )
}

export default Interact
