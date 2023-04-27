import './passwordRecreate.css';
import Header from '../../Components/Header/Header';
import {Link, Navigate} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../store/auth-context';

function PasswordRecreate(props) {
    const [newPassword, setNewPassword] = useState('');

    const authCtx = useContext(AuthContext);

    const passwordSetter = (e) => {
        setNewPassword(e.target.value);
    }

    useEffect(() =>{
        fetch('http://localhost:3001/auth/recreatePassword', {
            headers:{
                Authorization: 'Bearer ' + authCtx.resetToken
            }
        })
        .then(res => res.json())
        .then(resData => {
            console.log(resData.message);
        })
        .catch(err => console.log(err));
    }, []);

    const submitCredentials = (e) => {
        /*e.preventDefault();

        fetch(signLog ? 'http://localhost:3001/auth/login' : 'http://localhost:3001/auth/signup',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                email: userEmail,
                password: userPassword,
                username: userName
            })
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Creating a user failed!'); 
            }
            return res.json();
        })
        .then(resData => {
            //console.log(resData.expiresIn);
            const expirationTime = new Date(new Date().getTime() + resData.expiresIn * 1000);
            console.log("TIME::SIGNLOG",expirationTime);
            console.log(resData.token, expirationTime);
            authCtx.login(resData.token, expirationTime);
        })
        .catch(err => console.log("ERROR HERE::", err));*/
    }

    return (
        <div className="signLogPage">   
            <Link to="/">Front Page</Link>
            <br/>
            <h3>New Password: </h3>
            <input type = "password" onChange = {passwordSetter} value = {newPassword} />
            <button onClick = {submitCredentials}>Submit</button>
            {authCtx.isLoggedIn && <Navigate replace to = "/" />}
        </div>
    );
}

export default PasswordRecreate;