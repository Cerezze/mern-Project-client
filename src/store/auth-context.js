import React, {useState, useEffect, useCallback} from 'react';

let logoutTimer;

const AuthContext = React.createContext({
    resetToken: '',
    token: '',
    isLoggedIn: false,
    readyReset: false,
    login: (token) => {},
    tokenReset: (resetToken) =>{},
    logout: () =>{}
    //email: ''
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedResetToken = localStorage.getItem('resetToken');
    //const storedEmail = localStorage.getItem('email');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if(remainingTime <= 3600){
        localStorage.removeItem('token');
        localStorage.removeItem('resetToken');
        //localStorage.removeItem('email');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        //email: storedEmail,
        token: storedToken,
        resetToken: storedResetToken,
        duration: remainingTime
    };
}

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();

    let initialToken;
    let initialResetToken;
    //let initialEmail;
    if(tokenData){
        initialToken = tokenData.token;
        initialResetToken = tokenData.resetToken;
        //initialEmail = tokenData.email;
    }

    const [token, setToken] = useState(initialToken);
    const [resetToken, setResetToken] = useState(initialResetToken)
    //const [email, setEmail] = useState(initialEmail);

    let userIsLoggedIn;
    let userReset;

    if(token){
        userIsLoggedIn = !!token;
    }

    if(resetToken){
        userReset = !!resetToken;
    }

   const logoutHandler =  useCallback( () =>{
        setToken(null);
        //setEmail('');
        localStorage.removeItem('token');
        //localStorage.removeItem('email');
        localStorage.removeItem('expirationTime');

        if(logoutTimer){
            clearTimeout(logoutTimer);
            
        }
    }, []);


    const loginHandler = (token, expirationTime) => {
        setToken(token);
        //setEmail(userName);
        localStorage.setItem('token', token);
        //localStorage.setItem('email', userName);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    const resetTokenHandler = (token, expirationTime) => {
        setResetToken(token);
        localStorage.setItem('resetToken', token);
        //localStorage.setItem('email', userName);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    }

    useEffect(() => {
        if (tokenData){
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        resetToken: resetToken,
        token: token,
        isLoggedIn: userIsLoggedIn,
        readyReset: userReset,
        login: loginHandler,
        tokenReset: resetTokenHandler,
        logout: logoutHandler
        //email: email
    }

    return <AuthContext.Provider value = {contextValue}>
        {props.children}
    </AuthContext.Provider>;
}

export default AuthContext;