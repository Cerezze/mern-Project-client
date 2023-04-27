import './forgotPasswordPage.css';
import Header from '../../Components/Header/Header';
import {Link, Navigate} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../store/auth-context';

function ForgotPasswordPage(props) {
    const [userEmail, setUserEmail] = useState('');

    const authCtx = useContext(AuthContext);

    const emailSetter = (e) => {
        setUserEmail(e.target.value);
    }

    const submitCredentials = (e) => {
        e.preventDefault();

        fetch('http://localhost:3001/auth/resetPassword',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                email: userEmail
            })
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201){
                throw new Error('User does not exist or some other error!'); 
            }
            return res.json();
        })
        .then(resData => {
            //console.log(resData.expiresIn);
            const expirationTime = new Date(new Date().getTime() + resData.expiresIn * 1000);
            console.log("TIME::SIGNLOG",expirationTime);
            console.log(resData.token, expirationTime);
            authCtx.tokenReset(resData.token, expirationTime);
        })
        .catch(err => console.log("ERROR HERE::", err));
    }

    return (
        <div className="signLogPage">   
            <Link to="/">Front Page</Link>
            <br/>
            <h3>Email: </h3>
            <input onChange = {emailSetter} value = {userEmail}/>
            <button onClick = {submitCredentials}>Submit</button>
            {authCtx.isLoggedIn && <Navigate replace to = "/" />}
        </div>
    );
}

export default ForgotPasswordPage;