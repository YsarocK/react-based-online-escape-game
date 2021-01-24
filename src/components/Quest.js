import React, { useContext, useEffect} from 'react';
import {useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/quest.css';
import {BsCheckBox} from 'react-icons/bs';
import Timer from './Timer';

const Quest = () => {
    let { id } = useParams()
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);    
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    const quests = Object.values(step.quests);

    const noQuestsAchieved = () => {
        console.log(document.querySelectorAll('.quest'))
        if(document.querySelectorAll('.quest').length == 0){
            return(
                <p>Vous n'avez encore rempli aucune quête.</p>
            )
        }
    }

    function displayTimer() {
        if(step.timeBeforeAlert != ""){
            return(
                <Timer expiryTimestamp={step.timeBeforeAlert}></Timer>
            )
        }
    }

    return(
        <div id="task" class="card">
            <div class="task-header">
                <div class="task-title">
                    <p class="card-subtitle">Objectifs</p>
                    <p class="card-title">Quêtes</p>
                </div>
                    {displayTimer()}
            </div>
            <div id="quest">
            {
                quests.map((value, index) =>{
                    if(value.state == true){
                        return(
                            <div class="quest"><p>{value.name}<BsCheckBox/></p><p class="quest-description">{value.description}</p></div>
                        )
                    }
                })
            }
            {noQuestsAchieved}
            </div>
        </div>
    )
}

export default Quest;