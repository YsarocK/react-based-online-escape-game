import React, { useEffect,useContext } from 'react';
import {useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/progressbar.css'
import { data } from 'jquery';

const ProgressBar = () => {
    const bar = document.getElementById('progress-bar');
    let { id } = useParams();
    const db = firebase.firestore();
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let [step, setStep] = useContext(StepContext);   

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();
        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);
        batch.commit();
    }

    // EXTENSION DE LA BARRE
    const extendBar = () => {
        if(bar && step.pressurebar[ID] < 100){
            var value = step.pressurebar[ID] + 5;
            let dataToBatch = {};
            dataToBatch[`pressurebar.${ID}`] = value;
            updateBatch(db, id, dataToBatch)
            bar.style.height = value + "%";
        }
    };

    const decreaseBar = () => {
        if(bar && step.pressurebar[ID] > 0){
            var value = step.pressurebar[ID] - 2;
            let dataToBatch = {};
            dataToBatch[`pressurebar.${ID}`] = value;
            updateBatch(db, id, dataToBatch)
            bar.style.height = value + "%";
        }
    };

    function setColor() {
        if(bar){
            var barsize = step.pressurebar[ID];
            if(barsize < 33){
                bar.style.backgroundColor = "#" + "80FF9C"; 
            } else if (33 <= barsize){
                bar.style.backgroundColor = "#" + "FFBC58";
                if (67 < barsize) {
                    bar.style.backgroundColor = "#" + "FF5A5A"; 
                } 
            }
        }
    }

    useEffect(()=>{
        var players = Object.entries(step.player);
        var playerNumber = 0;
        var achievedNumber = 0;
        for(let i = 0; i<players.length; i++){
            if(players[i][1].active == true){
                playerNumber += 1;
            }
        }
        var questValue = Object.values(step.pressurebar);
        for(let i = 0; i<questValue.length; i++){
            if(questValue[i] >= 95){
                achievedNumber += 1;
            }
        }
        // console.log(playerNumber)
        if(achievedNumber == playerNumber){
            let dataToBatch = {};
            dataToBatch['pressurebarIsAchieved'] = true;
            updateBatch(db, id, dataToBatch)
        }

        if(step.pressurebarIsAchieved == true){
            let dataToBatch = {};
            dataToBatch['end'] = "good";
            dataToBatch[`quests.compteur.state`] = true;
            updateBatch(db, id, dataToBatch);
            var gladys = document.getElementById('gladys');
            gladys.classList.remove('gladys-none');
        }

        setColor();
        const interval = setInterval(decreaseBar, 100);
        return () => clearInterval(interval);
    })

    return(
        <div class="progress-bar-container">
            <div class="progress-bar-child">
                <div id="progress-bar-glass">
                    <div id="progress-bar"></div>
                    <div id="glass"></div>
                </div>
            </div>
            <div id="progress-bar-button-container">
                <div class="cable">
                    <div class="cable-child"></div>
                    <div class="cable-child"></div>
                </div>
                <div class="progress-bar-button" onClick={extendBar}></div>
            </div>
        </div>
    )
}
export default ProgressBar