import React, { useContext, useEffect} from 'react';
import {useParams} from "react-router-dom"
// import StepContext from "../context/StepContext";
// import RoomDataContext from "../context/RoomDataContext"
// import Cookie from 'js-cookie'
import firebase from '../firebase';
import './assets/css/paperassemble.css';

const PaperAssemble = () => {
    const db = firebase.firestore();
    let { id } = useParams();
    var mousePosition;
    var offset = [0,0];
    var isDown = false;
    var imgToMove;
    var containerImg = document.getElementById('paper-container');
    var containerImgX = ""
    var containerImgY = ""; 
    var imglist = [];
    
    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
    
    function onLoadFunction() {
        // Réupérer toutes les divs
        imglist = document.querySelectorAll(".movingImg");
    
        for (var i = 0; i < imglist.length; i++) {
            var topValue = Math.random() * containerImgY;
            var leftValue = Math.random() * containerImgX;
            console.log(topValue + "x" + leftValue);
    
            imglist[i].style.top = (getRandomInt(containerImgY) / 1.6) + "px";
            imglist[i].style.left = (getRandomInt(containerImgX) / 1.6) + "px";
        }
    };

    function moveImages(event) {
    
        imgToMove = event.currentTarget;    
        isDown = true;
        console.log(isDown)

        event.currentTarget.style.position = "absolute";
        offset = [
            event.currentTarget.offsetLeft - event.clientX,
            event.currentTarget.offsetTop - event.clientY
        ];
    };
    
    // Evenement quand on lache notre clic
    function mouseUpFunction(event) {
        if(isDown == true){
            isDown = false;
        }
        console.log(isDown)
    };
    
    // Evenement quand on bouge la souris en cliquant
    function mouseMoveFunction(event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {
    
                x : event.clientX,
                y : event.clientY
    
            };
            // let thisImg = document.getElementById(imgToMove);
            imgToMove.style.left = (mousePosition.x + offset[0]) + 'px';
            imgToMove.style.top  = (mousePosition.y + offset[1]) + 'px';
        }
    };

    useEffect(() => {
        if(containerImg){
            containerImgX = containerImg.offsetWidth; 
            containerImgY = containerImg.offsetHeight; 
            onLoadFunction();
        }
        let dataToBatch = {};
        dataToBatch['paperDiscovered'] = true;
        dataToBatch[`quests.puzzle.state`] = true;
        updateBatch(db, id, dataToBatch);
    })

    return(
        <div id="paper-container" onMouseUp={(event) => mouseUpFunction(event)} onMouseMove={(event) => mouseMoveFunction(event)} class="paper-container">
            <img id="img-1" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%201.png" alt="img-1"  ></img>
            <img id="img-10" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%2010.png" alt="img-10"></img>
            <img id="img-11" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%2011.png" alt="img-11"></img>
            <img id="img-2" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%202.png" alt="img-2"></img>
            <img id="img-3" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%203.png" alt="img-3"></img>
            <img id="img-4" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%204.png" alt="img-4"></img>
            <img id="img-5" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%205.png" alt="img-5"></img>
            <img id="img-6" onMouseDown={(event) => moveImages(event)} class="movingImg"  src="https://etiennemoureton.fr/digital-event/morceaux/Calque%206.png" alt="img-6"></img>
            <img id="img-7" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%207.png" alt="img-7"></img>
            <img id="img-8" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%208.png" alt="img-8"></img>
            <img id="img-9" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%209.png" alt="img-9"></img>
            <img id="img-12" onMouseDown={(event) => moveImages(event)} class="movingImg" src="https://etiennemoureton.fr/digital-event/morceaux/Calque%2012.png" alt="img-12"></img>
        </div>
    )
}

export default PaperAssemble;