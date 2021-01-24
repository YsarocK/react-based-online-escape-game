import React, { useContext, useEffect } from 'react';
import StepContext from "../context/StepContext";
import {useParams} from "react-router-dom"
import Cookie from 'js-cookie'
import firebase from 'firebase'

const End = () => {
    let { id } = useParams()
    let [step, setStep] = useContext(StepContext);    
    const ID = Cookie.get('playerID');
    const db = firebase.firestore();

    const getEnd = () => {
        var imgUrl = "https://etiennemoureton.fr/digital-event/"+step.end+"-end-gladys.png";
        console.log(imgUrl)
        return(
            <img src={imgUrl}></img>
        )
    }

    return(
        <div id="end-container">
            {getEnd()}
        </div>
    )
}

export default End