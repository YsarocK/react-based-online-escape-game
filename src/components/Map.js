import React, { useContext, useEffect} from 'react';
import {useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import RoomDataContext from "../context/RoomDataContext";
import './assets/css/map.css'
import Cookie from 'js-cookie'
import firebase from '../firebase';

const Map = () => {
    const pos = ""
    const db = firebase.firestore();
    let [step, setStep] = useContext(StepContext);
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let { id } = useParams();

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

    // ASYNC FUNCTION TO UPDATE DATABASE
    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    // function displayMessage(message) {
    //     var messageContainer = document.getElementById('message');
    //     let dataToBatch = {};
    //     var data = 'message';
    //     dataToBatch[`${data}`] = ;
    //     console.log(dataToBatch)
    //     if(Object.values(messageContainer.classList).includes('message-out')){
    //         messageContainer.classList.add('message-in');
    //         messageContainer.classList.remove('message-out');
    //     }
    //     updateBatch(db, id, dataToBatch);
    // }

    function blockMap() {
        if(step.bureauLocked == true){
            var bureauLocked = document.getElementById('bureau');
            bureauLocked.classList.add('bureauLocked');
        } else {
            var bureauLocked = document.getElementById('bureau');
            bureauLocked.classList.remove('bureauLocked');
        }
    }

    function playerMove (event) {
        event.preventDefault();
        const newZone = event.currentTarget.id;
        if(step.printerNoise == true){
            console.log('ca passe ici')
            if(step.bureauLocked == true) {
                console.log('ca pass là')
                if(newZone == "bureau"){
                    return
                }

                if(step.player[playerP].zone == "bureau"){
                    return
                }
                var players = Object.entries(step.player);
                var playerNumber = 0;
        
                // GET NUMBER OF PLAYERS
                for(let i = 0; i<players.length; i++){
                    if(players[i][1].active == true){
                        playerNumber += 1;
                    }
                }

                for(var i = 1; i<=playerNumber; i++){
                    var playerConcerned = 'p' + i;
                    var playerRoom = step.player[playerConcerned].zone;
                }

                let dataToBatch = {};
                dataToBatch[`player.${playerP}.zone`] = newZone;
                updateBatch(db, id, dataToBatch);
                let characterSelector = document.querySelectorAll('.room');
                characterSelector.forEach(elem => {
                    elem.classList.remove('current-pos');
                })
                event.currentTarget.classList.add('current-pos');
                dataToBatch = {};
                dataToBatch[`player.${playerP}.holding`] = "";
                dataToBatch[`player.${playerP}.quest`] = "";
                updateBatch(db, id, dataToBatch);

            } else {
                if (newZone == "bureau" && step.quests.cursors.state == false){
                    let dataToBatch = {};
                    dataToBatch['bureauLocked'] = true;
                    dataToBatch['robotMove'] = true;
                    updateBatch(db, id, dataToBatch);
                    displayMessage("Le robot a eu le temps de s'enfuir !");
                    // for(i=0; i<)
                }
                let dataToBatch = {};
                dataToBatch[`player.${playerP}.zone`] = newZone;
                updateBatch(db, id, dataToBatch);
                let characterSelector = document.querySelectorAll('.room');
                characterSelector.forEach(elem => {
                    elem.classList.remove('current-pos');
                })
                event.currentTarget.classList.add('current-pos');
                dataToBatch = {};
                dataToBatch[`player.${playerP}.holding`] = "";
                dataToBatch[`player.${playerP}.quest`] = "";
                updateBatch(db, id, dataToBatch);
            }
        } else {
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.zone`] = newZone;
            updateBatch(db, id, dataToBatch);
            let characterSelector = document.querySelectorAll('.room');
            characterSelector.forEach(elem => {
                elem.classList.remove('current-pos');
            })
            event.currentTarget.classList.add('current-pos');
            dataToBatch = {};
            dataToBatch[`player.${playerP}.holding`] = "";
            dataToBatch[`player.${playerP}.quest`] = "";
            updateBatch(db, id, dataToBatch);
        }
    }

    let playersTab = [];
    let pinActive = document.querySelectorAll(".active");
    let players = step.player;
    let newPlayersTab = Object.entries(players);
    const checkIfChanged = () => {
            // MISE A JOUR DES AUTRES JOUEURS
            for(var i = 0; i<pinActive.length; i++) {
                pinActive[i].classList.remove('active');
                pinActive[i].classList.remove('p1');
                pinActive[i].classList.remove('p2');
                pinActive[i].classList.remove('p3');
                pinActive[i].classList.remove('p4');
                pinActive[i].classList.add('unactive');
            }
            updatePosition();
    }

    function updatePosition() {
        for(var i = 0; i<newPlayersTab.length; i++) {
            const playerPos = newPlayersTab[i][1].zone;
            const player = newPlayersTab[i][0];

            let pinContainer = document.querySelector("." + playerPos);
            let pinAllUnactive = pinContainer.querySelectorAll(".unactive");
            let pinToChange = pinAllUnactive[0];

            if(pinToChange){
                pinToChange.classList.remove('unactive');
                pinToChange.classList.add('active');
                pinToChange.classList.add(player);                 
            }
        }
    }
    
    var stage1 = document.getElementById('rez-de-chaussee')
    var stage2 = document.getElementById('etage')
    var nextStageActive = 2;
    const mapStage = () => {
        if(nextStageActive == 1) {
            stage2.classList.add('unstage-active');
            stage2.classList.remove('stage-active');
            stage1.classList.remove('unstage-active');
            stage1.classList.add('stage-active');    
            nextStageActive = 2;
            var button = document.getElementById('changeStageButton');
            button.innerHTML = "Aller à l'étage";
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.holding`] = "";
            dataToBatch[`player.${playerP}.quest`] = "";
            updateBatch(db, id, dataToBatch);
        } else {
            stage1.classList.remove('stage-active');
            stage1.classList.add('unstage-active');
            stage2.classList.add('stage-active');
            stage2.classList.remove('unstage-active');
            var button = document.getElementById('changeStageButton');
            button.innerHTML = "Aller au rez de chaussée";
            nextStageActive = 1;
            let dataToBatch = {};
            dataToBatch[`player.${playerP}.holding`] = "";
            dataToBatch[`player.${playerP}.quest`] = "";
            updateBatch(db, id, dataToBatch);
        }
    }


    useEffect(()=>{
        checkIfChanged();
        blockMap();
    })

    return(
        <div id="map">
            <div class="header-map">
                <ul id="player-position">
                {
                    Object.entries(step.player).map((value, index) => {
                        const playerPseudo = value[1].pseudo;
                        const id = "player-color-pin" + value[1].id + " " + "player-color-pin";
                        if(playerPseudo != ""){
                            return(
                                <li><div class={id}></div>{playerPseudo}</li>
                            )
                        }
                    })
                }
                </ul>
                <button id="changeStageButton" value="Etage" onClick={mapStage}>Aller à l'étage</button>
            </div>
            <div id="map-container">
                <svg id="rez-de-chaussee" class="svg-container stage-active" data-name="Rez de chaussée" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278.48 239.1"><defs></defs>
                    <g onClick={(event) => playerMove(event)} id="garage">
                        <rect class="cls-1" x="157.36" y="6.98" width="114.91" height="87.56"/><path class="cls-2" d="M172.87,89.05h-.5a12,12,0,0,0-12-12v-.5A12.52,12.52,0,0,1,172.87,89.05Z"/><rect class="cls-2" x="160.37" y="89.04" width="12.48" height="1.29"/><path class="cls-2" d="M272.28,87.75A64.31,64.31,0,0,1,208,23.51h.5a63.81,63.81,0,0,0,63.74,63.74Z"/><rect class="cls-2" x="208.06" y="22.21" width="64.5" height="1.3"/><rect class="cls-2" x="154.35" y="90.33" width="6.02" height="4.22"/><path class="cls-2" d="M154.39,77h6V10.17H272.27V22.71h.21V87.29h-.21v7.25H160.39v-.65h-6v6.65H278.48V4H154.39V77M272.78,87.29V22.71H278V87.29Z"/><path class="cls-2" d="M277.46,23.21V86.79h-4.18V23.21h4.18m1-1h-6.18V87.79h6.18Z"/><rect class="cls-2" x="274.98" y="22.46" width="1" height="65.33"/>
                        <text x="202" y="54" font-size="7" font-weight="bold">Garage</text></g>
                        <svg x="157.36" y="6.98" class="garage p-room-container p-d-x">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="chambre1">
                        <rect class="cls-1" x="10.01" y="9.98" width="63.26" height="109.72"/><rect class="cls-2" x="37.13" width="6.02" height="3.97"/><path class="cls-2" d="M9,26.51v29H5v-29H9m1-1H4v31h6Z"/><rect class="cls-2" x="6.51" y="25.55" width="1" height="31"/><polygon class="cls-2" points="4 26.01 10.01 26.01 10.01 9.98 70.27 9.98 70.27 3.98 4 3.98 4 26.01"/><rect class="cls-2" x="3.98" y="55.86" width="6" height="65.46"/><rect class="cls-2" y="73.39" width="3.97" height="6.02"/><rect class="cls-2" x="70.26" y="117" width="6.02" height="3.97"/><path class="cls-2" d="M58.15,115.72h-.3a12.43,12.43,0,0,1,12.41-12.41v.3A12.12,12.12,0,0,0,58.15,115.72Z"/><rect class="cls-2" x="57.78" y="115.72" width="12.48" height="1.29"/>         
                        <text x="22" y="54" font-size="7" font-weight="bold">Chambre 1</text></g>  
                        <svg x="10.01" y="9.98" class="chambre1 p-room-container p-d-x">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="cuisine">
                        <rect class="cls-1" x="102.6" y="10" width="54.76" height="90.29"/><rect class="cls-2" x="130.88" y="94.61" width="23.47" height="6"/><rect class="cls-2" x="141.07" y="3.98" width="13.32" height="6"/><rect class="cls-2" x="102.61" y="3.98" width="11.6" height="6"/><path class="cls-2" d="M143.14,6.48h-1.57V4H113.71V6.48h-1.57v1h1.57V10h27.86V7.48h1.57ZM114.71,5h25.86V6.48H114.71Zm25.86,4H114.71V7.48h25.86Z"/>
                        <text x="117" y="54" font-size="7" font-weight="bold">Cuisine</text></g>
                        <svg x="102.6" y="10" class="cuisine p-room-container p-d-x">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="wc1">
                        <rect class="cls-1" x="76.28" y="56.75" width="20.33" height="43.86"/><polygon class="cls-2" points="70.27 50.73 70.27 103.67 80.94 103.67 80.94 97.67 76.27 97.67 76.27 56.73 96.6 56.73 96.6 97.41 96.61 97.41 96.61 103.67 102.6 103.67 102.6 50.73 70.27 50.73"/>
                        <text x="-84" y="89" font-size="7" font-weight="bold" transform="rotate(-90)">WC</text></g>
                        <svg x="70.28" y="56.75" class="wc1 p-room-container p-d-y">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="celier">
                        <rect class="cls-1" x="76.27" y="10" width="20.34" height="40.75"/><path class="cls-2" d="M70.27,4V56.75h32.34V4ZM96.61,50.75H76.27V10H96.61ZM102.11,25h-5V9.44h5Z"/><path class="cls-2" d="M101.61,9.94V24.53h-4V9.94h4m1-1h-6V25.53h6Z"/><rect class="cls-2" x="99.11" y="9.71" width="1" height="15.82"/>
                        <text x="-42" y="89" font-size="7" font-weight="bold" transform="rotate(-90)">Celier</text></g>
                        <svg x="70.27" y="10" class="celier p-room-container p-d-y">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="sdb1">
                        <rect class="cls-1" x="10.54" y="125.7" width="62.73" height="31.97"/><polygon class="cls-2" points="70.24 157.67 70.24 157.67 10.54 157.67 10.54 125.7 70.24 125.7 70.24 140.81 76.24 140.81 76.24 119.7 4.54 119.7 4.54 163.67 76.24 163.67 76.24 157.67 70.24 157.67"/><path class="cls-2" d="M58.15,152.82h-.3a12.42,12.42,0,0,1,12.41-12.4v.3A12.12,12.12,0,0,0,58.15,152.82Z"/><rect class="cls-2" x="57.78" y="152.82" width="12.48" height="1.29"/><rect class="cls-2" x="70.26" y="154.11" width="6.02" height="4.22"/>
                        <text x="16" y="144" font-size="7" font-weight="bold">Salle de bain</text></g>
                        <svg x="10.54" y="120" class="sdb1 p-room-container p-d-x">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="bureau">
                        <rect class="cls-1" x="10.81" y="164" width="62.46" height="47.77"/><rect class="cls-2" y="172.6" width="3.97" height="6.02"/><polygon class="cls-2" points="70.24 212.08 54.75 212.08 54.75 218.08 76.24 218.08 76.24 181.5 70.24 181.5 70.24 212.08"/><polygon class="cls-2" points="4.81 158 4.81 218.08 27.89 218.08 27.89 212.08 10.81 212.08 10.81 164 70.24 164 70.24 164.64 76.24 164.64 76.24 158 4.81 158"/><path class="cls-2" d="M70.26,181.89a12.42,12.42,0,0,1-12.41-12.4h.3a12.12,12.12,0,0,0,12.11,12.1Z"/><rect class="cls-2" x="57.78" y="168.2" width="12.48" height="1.29"/><rect class="cls-2" x="70.26" y="163.98" width="6.02" height="4.22"/><path class="cls-2" d="M54.25,213v4.27H28.4V213H54.25m1-1H27.4v6.27H55.25Z"/><line class="cls-3" x1="27.42" y1="215.15" x2="55.25" y2="215.15"/><polygon class="cls-2" points="27.89 212.3 10.01 212.3 10.01 157.98 4 157.98 4 218.22 27.89 218.3 27.89 212.3"/><rect class="cls-2" x="54.75" y="212.3" width="26.49" height="6"/>
                        <text x="27" y="190" font-size="7" font-weight="bold">Bureau</text></g>
                        <svg x="10.81" y="164" class="bureau p-room-container p-d-x">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    <g onClick={(event) => playerMove(event)} id="salon">
                        <rect class="cls-1" x="73.27" y="100.29" width="198.01" height="112.71"/><rect class="cls-2" x="106.41" y="212.29" width="6.99" height="5.99"/><path class="cls-2" d="M81.26,212.29H81a23.08,23.08,0,0,1,23-23v.3A22.77,22.77,0,0,0,81.26,212.29Z"/><rect class="cls-2" x="104.01" y="189.11" width="2.4" height="23.18"/><rect class="cls-2" x="80.07" y="218" width="27.26" height="0.3"/><path class="cls-2" d="M106.56,225.23H81V218h25.6Zm-25.3-.3h25v-6.64h-25Z"/><path class="cls-2" d="M106.56,232.17H81v-7.24h25.6Zm-25.3-.3h25v-6.64h-25Z"/><path class="cls-2" d="M106.56,239.1H81v-7.23h25.6Zm-25.3-.3h25v-6.63h-25Z"/><rect class="cls-2" x="112.45" y="152.62" width="6" height="63.35"/><path class="cls-2" d="M118.08,212.67v-.15l.12-28.64,16.27.11v12.3H205.6v16.27h-.15Zm.41-28.49-.11,28.19,86.92-.11V196.59H134.17v-12.3Z"/><rect class="cls-2" x="118.39" y="190.11" width="15.85" height="0.3"/><rect class="cls-2" x="118.23" y="196.28" width="16.12" height="0.3"/><rect class="cls-2" x="132.64" y="204.29" width="16.17" height="0.3" transform="translate(-64.18 344.49) rotate(-89.81)"/><rect class="cls-2" x="139.2" y="204.44" width="16.17" height="0.3" transform="translate(-57.79 351.2) rotate(-89.81)"/><rect class="cls-2" x="145.58" y="204.35" width="16.17" height="0.3" transform="translate(-51.34 357.49) rotate(-89.81)"/><rect class="cls-2" x="152.14" y="204.39" width="16.17" height="0.3" transform="translate(-44.85 364.09) rotate(-89.81)"/><rect class="cls-2" x="158.61" y="204.39" width="16.17" height="0.3" transform="translate(-38.4 370.56) rotate(-89.81)"/><rect class="cls-2" x="165.03" y="204.3" width="16.17" height="0.3" transform="translate(-31.91 376.89) rotate(-89.81)"/><rect class="cls-2" x="171.5" y="204.34" width="16.17" height="0.3" transform="translate(-25.5 383.4) rotate(-89.81)"/><rect class="cls-2" x="178.01" y="204.3" width="16.17" height="0.3" transform="translate(-18.97 389.87) rotate(-89.81)"/><rect class="cls-2" x="184.43" y="204.35" width="16.17" height="0.3" transform="translate(-12.62 396.34) rotate(-89.81)"/><rect class="cls-2" x="190.94" y="204.34" width="16.17" height="0.3" transform="translate(-6.12 402.84) rotate(-89.81)"/><polygon class="cls-2" points="134.42 212.61 134.12 212.61 134.17 196.61 118.39 204.49 118.25 204.22 134.47 196.13 134.42 212.61"/><rect class="cls-2" x="121.31" y="204.29" width="17.95" height="0.3" transform="translate(-110.91 228.84) rotate(-63.27)"/><rect class="cls-2" x="150.62" y="218.31" width="6.02" height="3.97"/><path class="cls-2" d="M272.48,211.77v.53H113.06v6H278.48v-6.53Zm-.7,6H206.49V212.5h65.29Z"/><path class="cls-2" d="M277.46,101.22V211.27h-4.18v-110h4.18M272.28,121v91.29h6.18v-112h-6.18V121"/><polyline class="cls-3" points="134.24 97.61 274.98 97.61 275.48 100.64 275.48 212.27"/><path class="cls-2" d="M271.28,213v4.27H207V213h64.29m1-1H206v6.27h66.29Z"/><line class="cls-3" x1="206.05" y1="215.15" x2="272.28" y2="215.15"/>
                        <text x="185" y="160" font-size="7" font-weight="bold">Salon</text></g>
                        <svg x="73.27" y="100.29" class="salon p-room-container p-d-x">
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                            <rect class="p-pin unactive"></rect>
                        </svg>
                    </svg>
                <svg id="etage" class="svg-container" xmlns="http://www.w3.org/2000/svg" data-name="Etage" viewBox="0 0 278.5 239.1"><defs></defs>
                <g id="sdb2" onClick={(event) => playerMove(event)}>
                    <rect x="9.9" y="143.7" class="st0" width="64.7" height="73.2"/>
                    <rect x="4" y="143.7" class="st1" width="6" height="79.2"/>
                    <rect x="4" y="217" class="st1" width="15" height="6"/>
                    <rect x="0" y="174.3" class="st1" width="3.9" height="6"/>
                    <rect x="18.1" y="219.5" class="st1" width="25.7" height="1"/>
                    <rect x="42.8" y="217" class="st1" width="28.7" height="6"/>
                    <rect x="5.9" y="217.4" class="st2" width="63.8" height="5.1"/>
                    <rect x="59.1" y="147.8" class="st1" width="12.5" height="1.3"/>
                    <path class="st1" d="M71.6,161.2v0.3c-6.8,0-12.4-5.6-12.4-12.4h0.3C59.5,155.8,64.9,161.2,71.6,161.2z"/>
                    <rect x="71.5" y="161.2" class="st1" width="3.1" height="56.2"/>
                    <text x="15" y="182" font-size="7" font-weight="bold">Salle de bain</text>
                </g>
                <svg x="9.9" y="143.7" class="sdb2 p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
                <g id="chambre3" onClick={(event) => playerMove(event)}>
                    <rect x="9.9" y="24.1" class="st0" width="58.7" height="75.4"/>
                    <rect x="9.9" y="14.9" class="st0" width="122.1" height="63.5"/>
                    <rect x="4" y="8.9" class="st1" width="45.2" height="6"/>
                    <rect x="3.9" y="64.8" class="st1" width="6" height="40.6"/>
                    <rect x="68.6" y="75.3" class="st1" width="6" height="29.8"/>
                    <rect x="35.7" y="4.9" class="st1" width="6" height="3.9"/>
                    <rect x="0" y="73" class="st1" width="3.9" height="6"/>
                    <rect x="112.8" y="8.9" class="st1" width="19.3" height="6"/>
                    <rect x="49" y="9.3" class="st2" width="63.8" height="5.1"/>
                    <rect x="48.9" y="11.3" class="st1" width="63.6" height="1"/>
                    <rect x="3.9" y="9.3" class="st1" width="6" height="13.8"/>
                    <rect x="6.4" y="23.1" class="st1" width="1" height="42.2"/>
                    <rect x="4.4" y="13.6" class="st2" width="5.1" height="63.8"/>
                    <rect x="68.6" y="75.3" class="st1" width="15.1" height="3.1"/>
                    <path class="st1" d="M85,63.3V63c6.8,0,12.4,5.6,12.4,12.4h-0.3C97.1,68.7,91.7,63.3,85,63.3z"/>
                    <rect x="83.7" y="62.9" class="st1" width="1.3" height="12.5"/>
                    <rect x="97.1" y="75.3" class="st1" width="12.5" height="3.1"/>
                    <text x="46" y="50" font-size="7" font-weight="bold">Chambre 3</text>
                </g>
                <svg x="9.9" y="14.9" class="chambre3 p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
                <g id="wc2" onClick={(event) => playerMove(event)}>
                        <rect x="4" y="130.7" class="st1" width="6" height="13.3"/>
                        <rect x="9.9" y="105.2" class="st0" width="64.7" height="32.6"/>
                        <rect x="4" y="99.5" class="st1" width="70.6" height="6"/>
                        <rect x="4" y="137.7" class="st1" width="67.5" height="6"/>
                        <rect x="3.9" y="101.5" class="st1" width="6" height="13.3"/>
                        <rect x="6.4" y="113.8" class="st1" width="1" height="17.7"/>
                        <rect x="4.4" y="88.1" class="st2" width="5.1" height="63.8"/>
                        <path class="st1" d="M59.5,132.4h-0.3c0-6.8,5.6-12.4,12.4-12.4v0.3C64.9,120.3,59.5,125.7,59.5,132.4z"/>
                        <rect x="59.1" y="132.4" class="st1" width="12.5" height="1.3"/>
                        <rect x="71.5" y="133.7" class="st1" width="3.1" height="14.1"/>
                        <rect x="71.5" y="105.2" class="st1" width="3.1" height="15.1"/>
                        <text x="36" y="124" font-size="7" font-weight="bold">WC</text>
                </g>
                <svg x="9.9" y="105.2" class="wc2 p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
                <g id="terrasse" onClick={(event) => playerMove(event)}>
                    <rect x="138" y="14.9" class="st0" width="134.5" height="63.5"/>
                    <rect x="132.1" y="8.9" class="st1" width="146.4" height="6"/>
                    <rect x="132" y="12.1" class="st1" width="6" height="66.3"/>
                    <rect x="272.5" y="12.1" class="st1" width="6" height="68.7"/>
                    <rect x="132" y="75.3" class="st1" width="16.6" height="3.1"/>
                    <rect x="162" y="75.3" class="st1" width="110.4" height="3.1"/>
                    <path class="st1" d="M150,63.2v-0.3c6.8,0,12.4,5.6,12.4,12.4h-0.3C162.1,68.6,156.6,63.2,150,63.2z"/>
                    <rect x="148.7" y="62.9" class="st1" width="1.3" height="12.5"/>
                    <text x="188" y="50" font-size="7" font-weight="bold">Terrasse</text>
                </g>
                <svg x="138" y="14.9" class="terrasse p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
                <g id="balcon" onClick={(event) => playerMove(event)}>
                    <rect x="229.5" y="78.4" class="st0" width="43" height="139"/>
                    <rect x="272.5" y="80.3" class="st1" width="6" height="142.1"/>
                    <rect x="229.8" y="78.4" class="st1" width="48.7" height="6"/>
                    <text x="237" y="160" font-size="7" font-weight="bold">Balcon</text>
                </g>
                <svg x="229.5" y="105.2" class="balcon p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
                <g id="couloir" onClick={(event) => playerMove(event)}>
                    <rect x="74.6" y="78.4" class="st0" width="34.9" height="76.4"/>
                    <rect x="74.6" y="154.1" class="st0" width="149.5" height="62.9"/>
                    <path class="st1" d="M88.4,203.7v-0.1l0.1-28.6l16.2,0.1v12.3h71v16.2h-0.1L88.4,203.7z M88.8,175.3l-0.1,28.1l86.8-0.1v-15.6h-71
                    v-12.3L88.8,175.3z"/>
                    <rect x="88.7" y="181.2" class="st1" width="15.8" height="0.3"/>
                    <rect x="88.5" y="187.3" class="st1" width="16.1" height="0.3"/>
                    <rect x="102.9" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -84.9317 305.8239)" class="st1" width="16.1" height="0.3"/>
                    <rect x="109.5" y="195.5" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -78.4541 312.5221)" class="st1" width="16.1" height="0.3"/>
                    <rect x="115.9" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -72.0951 318.8596)" class="st1" width="16.1" height="0.3"/>
                    <rect x="122.4" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -65.5965 325.3378)" class="st1" width="16.1" height="0.3"/>
                    <rect x="128.8" y="195.5" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -59.2181 331.8552)" class="st1" width="16.1" height="0.3"/>
                    <rect x="135.2" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -52.7591 338.1731)" class="st1" width="16.1" height="0.3"/>
                    <rect x="141.7" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -46.2609 344.6914)" class="st1" width="16.1" height="0.3"/>
                    <rect x="148.2" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -39.8021 351.0892)" class="st1" width="16.1" height="0.3"/>
                    <rect x="154.6" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -33.4238 357.6069)" class="st1" width="16.1" height="0.3"/>
                    <rect x="161.1" y="195.4" transform="matrix(3.316144e-03 -1 1 3.316144e-03 -26.9254 364.1049)" class="st1" width="16.1" height="0.3"/>
                    <polygon class="st1" points="104.7,203.6 104.4,203.6 104.4,187.7 88.7,195.5 88.6,195.3 104.7,187.2 		"/>
                    <rect x="91.6" y="195.3" transform="matrix(0.4498 -0.8931 0.8931 0.4498 -119.2766 197.3393)" class="st1" width="17.9" height="0.3"/>
                    <rect x="213.1" y="217" class="st1" width="16.8" height="6"/>
                    <rect x="150.3" y="223" class="st1" width="6" height="3.9"/>
                    <rect x="172" y="219.4" class="st1" width="42.2" height="1"/>
                    <rect x="132.1" y="217" class="st1" width="41.2" height="6"/>
                    <rect x="90.7" y="219.4" class="st1" width="42.2" height="1"/>
                    <rect x="71.5" y="217" class="st1" width="20.6" height="6"/>
                    <rect x="77.7" y="217.4" class="st2" width="63.8" height="5.1"/>
                    <rect x="161.8" y="217.4" class="st2" width="63.8" height="5.1"/>
                    <rect x="223.9" y="154.1" class="st1" width="6" height="63.9"/>
                    <text x="135" y="182" font-size="7" font-weight="bold">Couloir</text>
                </g>
                <svg x="74.6" y="154.1" class="couloir p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
                <g id="chambre2" onClick={(event) => playerMove(event)}>
                        <rect x="115.2" y="78.4" class="st0" width="109.2" height="76.4"/>
                        <rect x="109.5" y="78.4" class="st1" width="6" height="76.4"/>
                        <rect x="226.5" y="94.5" class="st1" width="1" height="42.2"/>
                        <rect x="224" y="135.9" class="st1" width="6" height="18.9"/>
                        <rect x="224.4" y="84.1" class="st2" width="5.1" height="63.8"/>
                        <rect x="109.5" y="75.4" class="st1" width="22.6" height="3.1"/>
                        <rect x="109.5" y="151.7" class="st1" width="85.1" height="3.1"/>
                        <rect x="207.9" y="151.7" class="st1" width="16.1" height="3.1"/>
                        <rect x="206.7" y="139.2" class="st1" width="1.3" height="12.5"/>
                        <path class="st1" d="M194.6,151.7h-0.3c0-6.8,5.6-12.4,12.4-12.4v0.3C200,139.6,194.6,145,194.6,151.7z"/>
                        <rect x="223.9" y="78.4" class="st1" width="6" height="16.1"/>
                        <text x="148" y="117" font-size="7" font-weight="bold">Chambre 2</text>
                </g>
                <svg x="115.2" y="78.4" class="chambre2 p-room-container p-d-x">
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                        <rect class="p-pin unactive"></rect>
                </svg>
            </svg>
            </div>
            <div class="footer-map"></div>
        </div>
    )
}

export default Map;