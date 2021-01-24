import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext"
import Cookie from 'js-cookie'
import firebase from '../firebase';
import InventoryObject from './Inventory-object'
import './assets/css/inventory.css'

const Inventory = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    var itemActive = step.inventory;
    var oldItemActive = 0;
    let missingInventory = '';
    let missingInventoryItems = [];

    function emptyContainer() {
        var InventoryLength = itemActive.length;

        if(InventoryLength < 4) {
            missingInventory = 4 - InventoryLength;
        };
        for(var i = 1; i<=missingInventory; i++){
            missingInventoryItems.push("empty")
        };
    }

    useEffect(() => {
        emptyContainer();
    })

    return(
        <div id="inventory" class="card">
            <p class='card-subtitle'>Inventaire du joueur</p>
            <p class="card-title">Objets disponibles {step.inventory.length}/4</p>
            <div id="inventory-object-container">
            {
                step.inventory.map((value) => {
                    return(
                        <InventoryObject name={value}></InventoryObject>
                    )
                })
            }
            {
                emptyContainer(),
                missingInventoryItems.map((value, index) => {
                    return(
                        <div class="inventory-object-content empty active" key={index}><div class="inventory-object"><div class="inventory-info"><p class="empty-text">(vide)</p></div></div></div>
                    )
                })
            }
            </div>
        </div>
    )
}

export default Inventory;
