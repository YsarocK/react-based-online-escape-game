import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import './assets/css/glitch.css'
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import firebase from '../firebase';

const Glitch = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext)
    var playerIsMouseOver = false;
    var glitchOver = false;
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;

    // Move button
    var leftPos = 0;
    var topPos = 0;

    const isStepAchieved = () => {

        var players = Object.entries(step.player);
        var playerNumber = 0;
        var achievedNumber = 0;

        // GET NUMBER OF PLAYERS
        for(let i = 0; i<players.length; i++){
            if(players[i][1].active == true){
                playerNumber += 1;
            }
        }

        if(step){
            var glitchs = step.houseSettings.glitch;
            glitchs = Object.entries(glitchs);
            for(var i = 1; i<(glitchs.length)-1; i++){
                if(glitchs[i][0] != 'isActive'){
                    if(glitchs[i][1] == true) {
                        achievedNumber +=1
                    }
                }
            }
        }

        if(achievedNumber == playerNumber){
            const dataToBatch = {};
            dataToBatch[`houseSettings.glitch.isAchieved`] = true;
            dataToBatch[`timeBeforeAlert`] = Date.now();
            dataToBatch[`glitchStatue`] = false;
            updateBatch(db, id, dataToBatch);
        }
    }

    function updateBatch(db, roomID, dataToBatch) {    
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const desactiveGlitch = () => {
        playerIsMouseOver = true;
        const dataToBatch = {};
        dataToBatch[`houseSettings.glitch.${playerP}`] = true;
        updateBatch(db, id, dataToBatch);
        isStepAchieved(); 
    }
    
    const activeGlitch = () => {
        playerIsMouseOver = false;
        const dataToBatch = {};
        dataToBatch[`houseSettings.glitch.${playerP}`] = false;
        updateBatch(db, id, dataToBatch);
        isStepAchieved(); 
    }
    
    // Move button
    const checkPosition = () => {
        let glitchContainer = document.getElementById("glitch-container");
        let glitchButton = document.getElementById("glitch-button");
        let maxLeft = glitchContainer.offsetWidth - glitchButton.offsetWidth;
        let maxTop = glitchContainer.offsetHeight - glitchButton.offsetHeight;
        leftPos = Math.floor(Math.random() * maxLeft);
        topPos = Math.floor(Math.random() * maxTop);
    }
    
    const moveButton = () => {
        let glitchButton = document.getElementById("glitch-button");
        if(glitchButton){
            glitchButton.style.transform = 'translate(' + leftPos + 'px,' + topPos + 'px)';
            checkPosition();
        }
    }

    let glitchButton = document.getElementById("glitch-button");
    let glitchContainer = document.getElementById("glitch-container");

    useEffect(() => {  
        // METTRE EN COMMENTAIRE POUR LES TESTS
        moveButton();
        setInterval(moveButton, 3000)
    })
    return(
        <div id="glitch-container-parent">
            <div id="glitch-container" class="glitchActive glitch-container">
                <img src='https://www.etiennemoureton.fr/digital-event/dg-glitch-video.gif' class="glitch"></img>
                <div id="glitch-button" class="desactive-glitch p1" onMouseOver={desactiveGlitch} onMouseLeave={activeGlitch}></div>
            </div>
        </div>
    )
}

export default Glitch