import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import './assets/css/glitch.css'
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/garage.css'
import RoomDataContext from '../context/RoomDataContext';

const Garage = () => {
    let { id } = useParams();
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext)
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    let oldInventory = [];
    let oldRoomObjects = [];
    let currentRoom = step.player[playerP].zone;

    // #FLASHLIGHT

    function update(e){
        var x = e.clientX
        var y = e.clientY;
    
        var cursor = document.getElementById("search-container");
        cursor.style.setProperty('--cursorX', x + 'px')
        cursor.style.setProperty('--cursorY', y + 'px')
    }

    // #BACKGROUND 
    const searchContainer = document.getElementById('search-container');
    
    // Variables for current position
    var x = 0;
    var y = 0;
    var containerX = "";
    var w = "";
    var h = "";

    useEffect(() => {
        const searchContainer = document.getElementById('search-container');
        if(searchContainer){
            containerX = searchContainer.offsetWidth;
            w = window.innerWidth;
            h = window.innerHeight;
        }
        hasLamp();
    })

    function hasLamp(){
        console.log(step.inventory.indexOf('lampetorche'));
        if(step.inventory.indexOf('lampetorche') != -1){
            document.getElementById('search-container').classList.add('lampVue');
        }
    }
    
    function handleMouse(e) {
        // Verify that x and y already have some value
        if (x && y) {
            window.scrollBy((e.clientX - x), (e.clientY - y));
        }
    
        var marge = 20;
        // Move X scroll
        // console.log("e client X : ");
        // console.log(e.clientX);
        // console.log("w :");
        // console.log(w);
        if (e.clientX > (w - marge)){
            window.scrollTo({left: containerX, behavior: 'smooth' })
        } else if (e.clientX < (marge)){
            window.scrollTo({left: 0, behavior: 'smooth' })
        }
        // Move Y scroll
        if (e.clientY > (h - marge)){
            window.scrollTo({top: containerX, behavior: 'smooth' })
        } else if (e.clientY < (marge)){
            window.scrollTo({top: 0, behavior: 'smooth' })
        }
    
        x = e.clientX;
        y = e.clientY;
        }
    
    // Assign handleMouse to mouse movement events
    // searchContainer.onmousemove = handleMouse;
    
    // #BACKGROUND 
    const objectToFind = document.getElementsByClassName('object-to-find');
    
    // for (var i = 0 ; i < objectToFind.length; i++) {
    //     objectToFind[i].addEventListener("click", itemIsClicked, false); 
    // }

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const pickObject = ({currentTarget}) => {
        let object = currentTarget.id;
        console.log(step.rooms.garage.discovered[object])
        console.log(step.inventory.indexOf(object));
        console.log(step.inventory)
        currentTarget.classList.add('picked');
        if(Object.values(step.inventory).indexOf(object) == 0 || Object.values(step.inventory).indexOf(object) == 1 || Object.values(step.inventory).indexOf(object) == 2 || Object.values(step.inventory).indexOf(object) == 3 || Object.values(step.inventory).indexOf(object) == 4){
            console.log('still in inventory')
            displayMessage("Vous avez déjà récupéré cet objet...")
            return
        }
        if (step.inventory.length < 4 && object != "compteur") {

            if(step.rooms.garage.discovered[object] == false && object != "compteur") {
                console.log('it passed')
                let dataToBatch = {};
                dataToBatch[`rooms.garage.discovered.${object}`] = true;
                updateBatch(db, id, dataToBatch);
            }

            // AJOUT DANS L'INVENTAIRE
            oldInventory = step.inventory;
            oldInventory.push(object);
            let dataToBatch = {};
            let isInInventory = Object.values(step.inventory).indexOf(object)
            if(isInInventory != -1){
                console.log('ajout');
                dataToBatch['inventory'] = oldInventory;
                updateBatch(db, id, dataToBatch);
    
                // RETIRAGE DE LA SALLE
                oldRoomObjects = step.rooms[currentRoom].objects;
                let dataToDelete = oldRoomObjects.indexOf(object);
                oldRoomObjects.splice(dataToDelete, 1);
                dataToBatch = {};
                dataToBatch[`rooms.${currentRoom}.objects`] = oldRoomObjects;
                updateBatch(db, id, dataToBatch);
            }
        } else {
            displayMessage("Vous n'avez pas assez de place dans l'inventaire pour récuperer cet objet...")
        }
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

    function closeGarage (event) {
        var button = document.getElementById('close-garage');
        button.classList.add('close-garage-hide');
        let dataToBatch = {};
        dataToBatch[`player.${playerP}.garage`] = false;
        updateBatch(db, id, dataToBatch);
    }

    const isDisplayed = () => {
        var objects = document.querySelectorAll('.object-to-find')
        if(step.rooms){
            for(var i = 0; i<objects.length; i++){
                var id = objects[i].id;
                if(step.rooms.garage.discovered[id] == true) {
                    let element = document.getElementById(id);
                    element.classList.add('discovered-object');
                }
            }
        }
    }

    const openCompteur = () => {
        if(step.isHublotDiscovered == true) {
            let quest = 'ProgressBar';
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.quest`] = quest;
            dataToBatch[`player.${playerP}.garage`] = false;
            updateBatch(db, id, dataToBatch);
            const gladys = document.getElementById('gladys');
            gladys.classList.add('gladys-none');
            const enigmeContainer = document.getElementById('enigme-container');
            enigmeContainer.classList.add('enigme-active');
            const garageButton = document.getElementById('close-garage');
            garageButton.classList.add('close-garage-hide');
        }
    }

    return (
        <div id="search-container" onMouseMove={(event) => {update(event); handleMouse(event)}} onTouchMove={(event) => update(event)} onKeyPress={closeGarage}>
            {/* <div id='close-garage' class="close-garage-hide" onClick={(event) => closeGarage(event)}>
                <img src="https://etiennemoureton.fr/digital-event/objects/door.png"></img>
                <p>Revenir au plan</p>
            </div> */}
            {isDisplayed()}
            <div id="search-moving">
                <svg id="garage-game" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" viewBox="0 0 3508 2480">
                    <image onClick={(event) => pickObject(event)} id="tournevis" width="131" height="38" transform="translate(1348.38 1479.82)" href="https://etiennemoureton.fr/digital-event/garage/g-tournevis.png" class="object-to-find"/>
                    <image onClick={(event) => pickObject(event)} id="grattegratte" width="102" height="89" transform="translate(3129.55 2025.67)" href="https://etiennemoureton.fr/digital-event/garage/g-grattegel.png" class="object-to-find"/>
                    <image onClick={(event) => pickObject(event)} id="chalumeau" width="145" height="118" transform="translate(757.52 925.16)" href="https://etiennemoureton.fr/digital-event/garage/g-chalumeau.png" class="object-to-find"/>
                    <image onClick={(event) => openCompteur(event)} id="compteur" width="220" height="268" transform="translate(2363.95 1321.72)" href="https://etiennemoureton.fr/digital-event/garage/g-compteur-electrique.png" class="object-to-find"/>
                </svg>
            </div>
        </div>

    )

}
export default Garage;

