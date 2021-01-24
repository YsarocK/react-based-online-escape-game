import React, { useContext, useState } from 'react';
import StepContext from "../context/StepContext";

const Loader = (props) => {

    let [step, setStep] = useContext(StepContext)

    return (
        <div id="loader" style={props.style}>
            <p class="loader-text">{props.text}</p>
            <div class="lds-facebook"><div></div><div></div><div></div></div>
        </div>
    )
}

export default Loader;