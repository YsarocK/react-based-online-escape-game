import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import CursorLight from './CursorLight'
import firebase from '../firebase';
import './assets/css/scratch.css'
import { createPortal } from 'react-dom';
import RoomDataContext from "../context/RoomDataContext"

const Tiroir = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let currentRoom = step.player[playerP].zone;
    let [RoomData, setRoomData] = useContext(RoomDataContext);

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const pickObject = ({currentTarget}) => {
        if(step.inventory.length < 4){
            let object = currentTarget.id;
            let oldInventory = step.inventory;
            oldInventory.push(object);
            let dataToBatch = {};
            let isInInventory = Object.values(step.inventory).indexOf(object)
            console.log('ajout');
            dataToBatch['inventory'] = oldInventory;
            updateBatch(db, id, dataToBatch);

            // RETIRAGE DE LA SALLE
            let oldRoomObjects = step.tiroirObjects;
            console.log()
            let dataToDelete = oldRoomObjects.indexOf(object);
            oldRoomObjects.splice(dataToDelete, 1);
            dataToBatch = {};
            dataToBatch[`tiroirObjects`] = oldRoomObjects;
            updateBatch(db, id, dataToBatch);
        }
    }

    function isDataReady(value) {
        if(RoomData[value]){
            return(
                <div class="tiroir-object">
                    <img src={RoomData[value].image}></img>
                    <p>{RoomData[value].name}</p>
                    <button onClick={(event) => pickObject(event)}id={value}>Prendre</button>
                </div>
                )
        }
    }

    useEffect(() => {
    })

    return(
        <div id="tiroir">
            <div id="tiroir-couvercle"></div>
            <div id="tiroir-container">
            {
                step.tiroirObjects.map((value, index) => {
                    return(
                        <div class="inventory-object-content">
                            <div class="inventory-object">
                                <div class="inventory-info">
                                <div class="button-container">
                                    <div class="btn close">
                                        {/* <IoCloseCircle /> */}
                                    </div>
                                </div>
                                {isDataReady(value)}
                                {/* <p>{Object.values(RoomData).value.name}</p> */}
                                </div>
                            </div>
                        </div>                    )
                })
            }
            </div>
        </div>
    )
}

export default Tiroir;