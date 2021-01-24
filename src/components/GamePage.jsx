import firebase from 'firebase';
import Content from './Content';
import React, {useEffect, useContext } from "react";
import {useParams, useHistory} from "react-router-dom";
import StepContext from "../context/StepContext";
import RoomDataContext from '../context/RoomDataContext'
import Cookie from 'js-cookie';

const GamePage = () => {
    const playerID = Cookie.get('playerID');
    const db = firebase.firestore();
    let { id } = useParams()
    const ID = Cookie.get('playerID');
    const playerP = 'p'+ID;
    let [step, setStep] = useContext(StepContext);
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    const history = useHistory();

    const isReady = () => {
        if(step.isReady){
            if(step.hasBegin != true){
                return history.replace("/room/" + id);
            }
            var loader = document.getElementById('loader');
            return (
                launchRoom()    
            )
        }
    }

    const launchRoom = () => {
        return (
            <Content></Content>
        )
    }

    function requestDBData() {
        const db = firebase.firestore();
        const doc = db.collection('RoomData').doc('objects');
        doc.onSnapshot(snapshot => {
          RoomData = setRoomData(snapshot.data());
        });
    }

    function requestDB() {
        const db = firebase.firestore();
        const doc = db.collection('Room').doc(id)
        doc.onSnapshot(snapshot => {
            step = setStep(snapshot.data());
        });
      }

    useEffect( () => {
        step = [];
        RoomData = {};
        requestDB();
        requestDBData();
    }, [])

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();

        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const closeGarage = ({currentTarget}) => {
        var gladys = document.getElementById('gladys');
        gladys.classList.add('gladys-none');
        var button = currentTarget;
        button.classList.add('close-garage-hide');
        let dataToBatch = {};
        dataToBatch[`player.${playerP}.garage`] = false;
        updateBatch(db, id, dataToBatch);
    }
      
    return (
        <div id="root-container">
            <div id='close-garage' class="close-garage-hide" onClick={(event) => closeGarage(event)}>
                <img src="https://etiennemoureton.fr/digital-event/objects/door.png"></img>
                <p>Revenir au plan</p>
            </div>            
            {isReady()}
        </div>
    )
}

export default GamePage