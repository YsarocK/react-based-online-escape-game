import React, { useContext, useEffect } from 'react';
import firestoreFunctions from '../services/firestoreFunctions';
import {useHistory} from 'react-router-dom'
import StepContext from "../context/StepContext";
import RoomDataContext from '../context/RoomDataContext'
import firebase from '../firebase'
import './assets/css/home.css'
import Cookies from 'js-cookie';

const  Home = () => {
    const history = useHistory();
    const db = firebase.firestore();
    let [RoomData, setRoomData] = useContext(RoomDataContext);
    
    useEffect(() => {
        if(Cookies.get('playerID') != undefined){
            Cookies.remove('playerID');
            console.log('removed cookie')
        };
        disableButton();
    })

    const CreateRoom = () => {
        Cookies.remove('playerID');
        const newRoom = firestoreFunctions.firebaseCreateRoom();
        history.push("/room/" + newRoom);
    }

    const JoinRoom = () => {
        var room = document.getElementById('room-number').value;
        history.push("/room/" + room);
    }

    const disableButton = () => {
        if(document.getElementById('room-number').value == ""){
            document.getElementById('join-room-intro-button').classList.add("join-disabled-home")
        } else {
            document.getElementById('join-room-intro-button').classList.remove("join-disabled-home")
        }
    }

    return (
        <div id="room-form-container">
            <div class="left-column">
                <img class="logo-home" src="https://etiennemoureton.fr/digital-event/logo-home.png"></img>
                <div id="credits">
                    <p>Created by</p>
                    <p>Elodie Bardesson - Melody Barbier - Manon Becuwe - Nassime Bel haj - Elisa Bourg - Quentin Despessailles - Vincent Dulou - Candyce Faoro - Samuel Galinat - Salomé Germain - Marie Laffont - Luc Lafitte - Julie Michel - Etienne Moureton - Maëlle Parlant - Elisa Reyne - Pauline Ruiz - Quentin Palliere - Rémi Fernandez - Stanislas Wiart</p>
                </div>
            </div>
            <div class="right-column">
                <div class="info room-form-container-infos">
                    <div class="logo">Explorez, analysez, collaborez</div>
                    <p>De nos jours la technologie est notre meilleure alliée au quotidien…<br></br>
                    Mais si elle devenait soudainement votre ennemi et se retournait contre vous, comment réagiriez-vous ?</p>
                </div>
                <div class="info form">
                    <form>
                        <div class="join-room">
                            <input type="text" id="room-number" placeholder="Indiquez l'adresse du serveur" onChange={disableButton}></input>
                            <input id="join-room-intro-button"type="submit" value="Rejoindre une partie" onClick={JoinRoom}></input>
                        </div>
                        <hr></hr>
                        <button onClick={CreateRoom}>Créer une room</button>
                    </form>
                </div>
            </div>
        </div>
    )
    
}

export default Home;