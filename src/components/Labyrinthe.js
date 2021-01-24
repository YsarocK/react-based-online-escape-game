import React, { useContext, useState } from 'react';
import StepContext from "../context/StepContext";

const  Labyrinthe = () => {

    let [step, setStep] = useContext(StepContext)

    return (
        <p>{step.canette}</p>
    )
}

export default Labyrinthe;