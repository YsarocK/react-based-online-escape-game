import React, { useContext, useEffect } from 'react';
import StepContext from "../context/StepContext";
import {useParams} from "react-router-dom"
import './assets/css/content.css'
import Map from './Map.js'
import Cookie from 'js-cookie'
import firebase from '../firebase'
import Inventory from './Inventory'
import RoomObject from './RoomObject'
import Enigmes from './Enigmes'
import Interact from './Interact'
import Message from './Message'
import Gladys from './Gladys'
import Quest from './Quest';

const Content = () => {
    let { id } = useParams()
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);    
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let currentRoom = step.player[playerP].zone;
    var messageContainer = document.getElementById('message');
    let glitchStatue = step.glitchStatue;
    var gladys = document.getElementById('gladys');



    function displayGlitch() {
        if(glitchStatue == true) {
            const importedComponentModule = require("./" + 'Glitch').default;
            return React.createElement(importedComponentModule); 
        }
    }

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

    function moveRobot() {
        if(step.robotMove == true && step.rooms.salon.objects.indexOf('robot') == -1) {
            let room_objects = step.rooms.bureau.objects;
            room_objects.splice('robot', 1);
            let dataToBatch = {};
            var room = 'bureau';
            dataToBatch[`rooms.${room}.objects`] = room_objects;
            updateBatch(db, id, dataToBatch);

            let new_room_objects = step.rooms.salon.objects;
            new_room_objects.push('robot');
            dataToBatch = {};
            room = 'salon';
            dataToBatch[`rooms.${room}.objects`] = new_room_objects;
            updateBatch(db, id, dataToBatch);
        }
    }

    const displayGarage = () => {
        var tasks = document.getElementById('content-objects-task');
        var contentMain = document.getElementById('content-main');
        var content = document.getElementById('content');

        if(tasks&&content&&contentMain){
            if(step.player[playerP].garage == true){
                tasks.style.display = "none";
                contentMain.style.display = "none";
                document.getElementById('gladys').classList.add('gladys-none');
                if(content){
                    content.classList.remove('content-overflow');
                }        
                const importedComponentModule = require("./" + 'Garage').default;
                return React.createElement(importedComponentModule); 
            } else {
                tasks.style.display = "flex";
                contentMain.style.display = "flex";
                if(content){
                    content.classList.add('content-overflow');
                }        
            }
        }
    }

    function isIntro() {
        if(step.intro == true){
            const importedComponentModule = require("./" + 'Intro').default;
            return React.createElement(importedComponentModule); 
        }
    }

    function isEnd() {
        if(step.end != ""){
            const importedComponentModule = require("./" + 'End').default;
            return React.createElement(importedComponentModule); 
        }
    }

    useEffect(() => { 
        messageContainer = document.getElementById('message');
        if (step.robotMove == true && step.bureauLocked == true){
            displayMessage("Un joueur est bloqué ! Il faut l'aider");
        }
        if(step.houseSettings.glitch.isAchieved == true){
            let dataToBatch = {};
            dataToBatch['glitchStatue'] = false;
            updateBatch(db, id, dataToBatch);
        }
    } )

    return (
        <div id="content" class="content-overflow">
            {isIntro()}
            {isEnd()}
            <Gladys></Gladys>
            {moveRobot()}
            {displayGlitch()}
            {displayGarage()}
            <div id="content-objects-task">
                <Inventory></Inventory>
                <Quest></Quest>
            </div>
            <div id="content-main">
                <Message></Message>
                <Enigmes></Enigmes>
                <div class="game-container">
                    <div class="game-content">
                        <Interact ms={ 10000 }></Interact>
                        <div class="game-room">
                            <div class="map-container">
                                <Map></Map>
                            </div>
                            <div class="content-room-container" id="content-room-container">
                                <div class="content-room-content">
                                    <div class="content-room-block">
                                        <div id="content-room-object" class="card">
                                            <p class="card-subtitle">Pièce : {step.player[playerP].zone}</p>
                                            <p class="card-title">Objets à proximité</p>
                                            <div id="room-object-container">
                                                <div class="room-object-scroll">
                                                {
                                                    step.rooms[currentRoom].objects.map((value, index) => {
                                                            if(value.search('papier') == -1 && value != "hublot" && value != "ampoules" && value != "tableau" && value != "porte"){
                                                            return(
                                                                <RoomObject key={index} name={value}></RoomObject>
                                                            )
                                                            } else if(value.search('papier') == 0 && step.robotMove == true){
                                                                return(
                                                                    <RoomObject key={index} name={value}></RoomObject>
                                                                )
                                                            } else if(value == "hublot" && step.paperDiscovered == true){
                                                                return(
                                                                    <RoomObject key={index} name={value}></RoomObject>
                                                                )
                                                            } else if(value == "ampoules" || value =="tableau") {
                                                                if(step.robotMove == true){
                                                                    return(
                                                                        <RoomObject key={index} name={value}></RoomObject>
                                                                    )
                                                                }
                                                            } else if(value == "porte" && step.bureauLocked == true) {
                                                                return(
                                                                    <RoomObject key={index} name={value}></RoomObject>
                                                                )
                                                            }
                                                    })
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Content;