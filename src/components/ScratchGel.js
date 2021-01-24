import React, { useContext, useEffect, useState } from 'react';
import {useHistory, useParams} from "react-router-dom"
import StepContext from "../context/StepContext";
import Cookie from 'js-cookie'
import CursorLight from './CursorLight'
import firebase from '../firebase';
import './assets/css/scratch.css'
import { createPortal } from 'react-dom';

const ScratchGel = () => {

    const db = firebase.firestore();
    let { id } = useParams();
    let [step, setStep] = useContext(StepContext)
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let bridge = "";
    let bridgeCanvas = "";
    let brushRadius = "";
    let img = "";
    var nameParts = "";
    var container = document.getElementById('bridgeContainer');

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    useEffect(() => {
        container = document.getElementById('bridgeContainer');
        bridge = document.getElementById("bridge");
        bridgeCanvas = bridge.getContext('2d');
        brushRadius = (bridge.width / 100) * 5;
        console.log(brushRadius)
        img = new Image();
        if (brushRadius < 50) { brushRadius = 30 }
        setImg();
        let dataToBatch = {};
        dataToBatch[`isHublotDiscovered`] = true;
        dataToBatch[`quests.scratch.state`] = true;
        updateBatch(db, id, dataToBatch);
        {hasGratte()}
    })

    const setImg = () => {
        console.log("On est passe")
        img.onload = function(){  
            bridgeCanvas.drawImage(img, 0, 0, bridge.width, bridge.height);
        }
        img.src = 'https://etiennemoureton.fr/digital-event/hublot-gel.jpg';
    }

    function detectLeftButton(event) {
        if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return event.button === 1;
        }
    }

    function getBrushPos(xRef, yRef) {
        var bridgeRect = bridge.getBoundingClientRect();
        return {
        x: Math.floor((xRef-bridgeRect.left)/(bridgeRect.right-bridgeRect.left)*bridge.width),
        y: Math.floor((yRef-bridgeRect.top)/(bridgeRect.bottom-bridgeRect.top)*bridge.height)
        };
    }
        
    function drawDot(mouseX,mouseY){
        bridgeCanvas.beginPath();
        bridgeCanvas.arc(mouseX, mouseY, brushRadius, 0, 2*Math.PI, true);
        bridgeCanvas.fillStyle = '#000';
        bridgeCanvas.globalCompositeOperation = "destination-out";
        bridgeCanvas.fill();
    }

    function DisplayCoupon(e) {
        var brushPos = getBrushPos(e.clientX, e.clientY);
    var leftBut = detectLeftButton(e);
    if (leftBut == 1) {
            drawDot(brushPos.x, brushPos.y);
    }
    };

    function touchemove(e) {
        e.preventDefault();
        var touch = e.targetTouches[0];
        if (touch) {
        var brushPos = getBrushPos(touch.pageX, touch.pageY);
            drawDot(brushPos.x, brushPos.y);
        }
    };

    
    function hasGratte(){
        if(container){
            if(step.inventory.indexOf('grattegratte') == -1){
                console.log('nogratte');
                container.classList.add('noscratch');
            } else {
                container.classList.remove('noscratch');
            }
        }
    }

    return (
        <figure id="bridgeContainer">
            <canvas id="bridge" width="700" height="700" onMouseMove={(event) => DisplayCoupon(event)} onTouchMove={(event) => touchemove(event)}></canvas>
        </figure>
    )
}

export default ScratchGel