import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';
import Inventory from './Inventory';
import { data } from 'jquery';

const RoomObject = (props) => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);    
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    // let oldInventory = [];
    // let oldRoomObjects = [];
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID
    const playerRoom = step.player[playerP].zone;

    
    const isDataReady = () => {
        if(Object.entries(RoomData).length){
            return(
                <div class="room-object-data card">
                    <img class="object-room-img" src={RoomData[props.name].image}></img>
                    <div class="object-room-infos">
                        <p class="object-room-name">{RoomData[props.name].name}</p>
                        <p class="object-room-description">{RoomData[props.name].description}</p>
                    </div>
                </div>
            )
        }
    }

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }
    
    const selectedObject = ({currentTarget}) => {
        let selectedObjectItem = document.querySelectorAll('.room-object');
        selectedObjectItem.forEach(elem => {
          elem.classList.remove('objectSelected');
        })
        currentTarget.classList.add('objectSelected');
        let dataToBatch
        dataToBatch = {};
        dataToBatch[`player.${playerP}.holding`] = props.name;
        updateBatch(db, id, dataToBatch);
    }

    return(
        <div class="room-object" onClick={(event) => selectedObject(event)}>
            {isDataReady()}
        </div>
    )
}

export default RoomObject