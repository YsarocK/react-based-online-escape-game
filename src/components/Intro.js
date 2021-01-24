import React, { useContext, useEffect } from 'react';
import StepContext from "../context/StepContext";
import {useParams} from "react-router-dom"
import Cookie from 'js-cookie'
import firebase from 'firebase'

const Intro = () => {
    let { id } = useParams()
    let [step, setStep] = useContext(StepContext);    
    const ID = Cookie.get('playerID');
    const db = firebase.firestore();

    function updateBatch(db, roomID, dataToBatch) {  
        const batch = db.batch();
        const sfRef = db.collection('Room').doc(roomID);
        sfRef.update(dataToBatch);

        batch.commit();
    }

    const displayButton = () => {
        if(ID == 2){
            return(
                <button onClick={launchGame}>Lancer la partie</button>
            )
        }
    } 

    const launchGame = () => {
        let dataToBatch = {};
        dataToBatch[`intro`] = false;
        dataToBatch[`gladys`] = "intro";
        document.getElementById('gladys').classList.remove('gladys-none')
        updateBatch(db, id, dataToBatch);
    }
    return(
        <div id="intro-container">
            <div class="text-content">
                <h1>Notre liberté dérobée
                </h1>
                <p>Vous êtes 4 colocataires, vous vivez dans une maison entièrement connectée et contrôlée par <span>une intelligence artificielle nommée Gladys</span>. Vous venez de passer 4 mois confinés tous ensemble à cause de la crise sanitaire de la covid-19.</p>
                <p>L’heure du déconfinement a sonné, et chacun souhaite reprendre sa vie sociale, mais Gladys ne le voit pas du même oeil et ne veut pas se retrouver de nouveau seule et abandonnée...</p>
                <p>Alors que vous vous préparez à aller à une soirée, Gladys décide de vous enfermer et vous met au défi de sortir de la maison à travers différentes énigmes.</p>
            </div>
            {displayButton()}
        </div>
    )
}

export default Intro