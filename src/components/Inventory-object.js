import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/inventory.css'
import { IoCloseCircle } from 'react-icons/io5';

const InventoryObject = (props) => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let oldInventory = [];
    let oldRoomObjects = [];
    const playerRoom = step.player[playerP].zone;

    const isDataReady = () => {
        if(Object.entries(RoomData).length){
            return(
                <img src={RoomData[props.name].image}></img>
            )
        }
    }

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const pickObject = () => {
            // RETIRAGE DE LA SALLE
            oldInventory = step.inventory;
            let dataToDelete = oldInventory.indexOf(props.name);
            oldInventory.splice(dataToDelete, 1);
            let dataToBatch = {};
            dataToBatch = {};
            dataToBatch['inventory'] = oldInventory;
            updateBatch(db, id, dataToBatch);

                        // AJOUT DANS L'INVENTAIRE
            oldRoomObjects = step.rooms[playerRoom].objects;
            oldRoomObjects.push(props.name);
            dataToBatch[`rooms.${playerRoom}.objects`] = oldRoomObjects;
            updateBatch(db, id, dataToBatch);
    }

    return(
        <div class="inventory-object-content">
            <div class="inventory-object">
                <div class="inventory-info">
                <div class="button-container">
                    <div class="btn close" onClick={pickObject}>
                        <IoCloseCircle />
                    </div>
                </div>
                {isDataReady()}
                <p>{props.name}</p>
                </div>
            </div>
        </div>
    )
}

export default InventoryObject;
