import Home from './components/Home';
import './components/assets/css/app.css';
import {useEffect, useState} from 'react';
import {HashRouter, Switch,Route } from "react-router-dom";
import GamePage from './components/GamePage';
import ManageRoom from './components/ManageRoom';
import StepContext from "./context/StepContext"
import firebase from './firebase';
import RoomDataContext from "./context/RoomDataContext"

const  App = () => {
  const [step, setStep] = useState([]);
  const [RoomData, setRoomData] = useState([]);

  return (
    <RoomDataContext.Provider
    value={
      [
        RoomData,
        setRoomData
      ]
    }>
      <StepContext.Provider
        value={[
          step,
          setStep
        ]}
      >
        <HashRouter>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/room/:id" component={ManageRoom} />
            <Route path="/game/:id" component={GamePage} />
          </Switch>
        </HashRouter>
      </StepContext.Provider>
    </RoomDataContext.Provider>
  );
}

export default App;