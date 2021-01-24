import {useEffect, useState} from 'react';
import firestoreFunctions from '../services/firestoreFunctions';

const Users = (props) =>  {
    const [data, setData] = useState()
    const [room, setRoom] = useState()
    const [value, setValue] = useState()

    useEffect(() => {
        setData("name")
        setRoom("Roomtest")
        getUsers()
    })

    const getUsers = async () => {
        const value = await firestoreFunctions.firebaseRead("testgros","roomdetest");
        console.log(value)
        setValue(value)
    };

    return (
        <div>
            <h1>Ce composant permet d'avoir une donnée</h1>
            <p>Cela affiche la valeur de {data} dans la room {room} : {value}</p>
        </div>
    )
}

export default Users;