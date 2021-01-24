import StepContext from '../context/StepContext'
import React, {useContext, useEffect} from 'react';
import {useHistory, useParams} from "react-router-dom"
import './assets/css/manageroom.css'
import Cookies from 'js-cookie'
import firebase from '../firebase';
import firestoreFunctions from '../services/firestoreFunctions';
import Loader from './Loader';

const ManageRoomContent = () => {
  let { id } = useParams()
  let [step, setStep] = useContext(StepContext)
  const history = useHistory();
  const db = firebase.firestore();
  const ID =  Cookies.get('playerID');
  const playerP = 'p'+ID;
  var buttonToJoin = document.getElementById('joinGame');

  useEffect(() => {
    if(Cookies.get('playerID')){
      var query = `player.${playerP}.isActive`;
      if(step.player[playerP].pseudo != ""){
        history.replace('/game/' + id);
      }
    };
    if(buttonToJoin){
      disableButtonLaunch();
    }
  })

  function disableButtonLaunch() {
    buttonToJoin = document.getElementById('joinGame');
    console.log(step.player.p1.pseudo)
    if(step.player.p1.pseudo == ""){
      console.log("must be disable")
      buttonToJoin.classList.add("join-disabled");
    } else {
      buttonToJoin.classList.remove("join-disabled");
    }
  }

  // FUNCTION TO JOIN A GAME (THAT CALL ASYNC)
  const JoinGame = () => {
    const pseudo = document.getElementById('player-pseudo').value;
    const playerID = 'p' + Cookies.get('playerID'); 
    const dataToBatch = {};
    dataToBatch[`player.${playerID}.pseudo`] = pseudo;
    if (document.getElementById('team-name')){
      const teamName = document.getElementById('team-name').value;
      dataToBatch[`team.name`] = teamName;
      dataToBatch[`hasBegin`] = true;
    }
    firestoreFunctions.updateBatch(db, id, dataToBatch);
  }

  const isCreator = () => {
    if (ID == 1){
      return (
        <input type="text" id="team-name" placeholder="Nom de l'équipe" required></input>
      )
    }
  }

  const canLaunch = () => {
    if (ID == 1){
      return(
        <button onClick={JoinGame}>Lancer la partie</button>
      )
    } else {
      return(
        <p class="waiting-message">En attente de joueurs...</p>,
        <button id='joinGame' onClick={JoinGame}>Rejoindre la partie</button>
      )
    }
  }

  // FUNCTION THAT VERIFY AND UPDATE CHARACTER
  function verifyCharacter(characterId) {
    const playerID = 'p' + Cookies.get('playerID'); 
    const data =  {};
    data[`player.${playerID}.characterId`] = characterId;
    firestoreFunctions.updateBatch(db, id, data);
  }

  const selectCharacter = ({currentTarget}) => {
    let characterSelector = document.querySelectorAll('.character');
    characterSelector.forEach(elem => {
      elem.classList.remove('selected');
    })
    currentTarget.classList.add('selected');
    verifyCharacter(currentTarget.id);
  }

  return (
    <div class="room-manager">
    <div class="left-column">
      <img class="logo-home" src="https://etiennemoureton.fr/digital-event/logo-home.png"></img>
    </div>
    <div class="right-column">
      <p class="welcome"><span>Bienvenue vous êtes le</span> Joueur {Cookies.get('playerID')}</p> 
      <input type="text" id="player-pseudo" placeholder="Pseudo"></input>
      {isCreator()}
      <div class="select-characters">
        <div id="c1" class="character" onClick={(event) => selectCharacter(event)}>
          <img src="https://etiennemoureton.fr/digital-event/avatar-1.jpg" class="character-icon"></img>
          <span class="character-name"></span>
        </div>
        <div id="c2" class="character" onClick={(event) => selectCharacter(event)}>
        <img src="https://etiennemoureton.fr/digital-event/avatar-2.jpg" class="character-icon"></img>
          <span class="character-name"></span>
        </div>
        <div id="c3" class="character" onClick={(event) => selectCharacter(event)}>
        <img src="https://etiennemoureton.fr/digital-event/avatar-3.jpg" class="character-icon"></img>
          <span class="character-name"></span>
        </div>
        <div id="c4" class="character" onClick={(event) => selectCharacter(event)}>
        <img src="https://etiennemoureton.fr/digital-event/avatar-4.jpg" class="character-icon"></img>
          <span class="character-name"></span>
        </div>
      </div>
      {canLaunch()}
      <p class="room-id">Code à partager : <span>{id}</span></p>
      </div>
    </div>
  )
  }

export default ManageRoomContent