import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../Firebase'

function SignUp(props) {

    const firebase = useContext(FirebaseContext);

    const data = {
        pseudo: '',
        email: '',
        password: '',
        confirPassword: ''
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError]  = useState('');

    const { pseudo, email, password, confirPassword } = loginData;

    const handleChange = e => {
        setLoginData({...loginData, [e.target.id]: e.target.value});
    }

    const handleSabmit = e => {
        e.preventDefault();
        const { email, password, pseudo } = loginData;
        firebase.signupUser(email, password)
        .then( authUser => {
            return firebase.user(authUser.user.uid).set({
                pseudo,
                email
            })
        })
        .then( () => {
            setLoginData({...data});
            props.history.push('/welcome');
        })
        .catch(error => {
            setError(error);
            setLoginData({...data});
        })
    }

    const btn = pseudo === '' || email === '' || password === '' || password !== confirPassword ? <button disabled>Inscription</button> : <button>Inscription</button>

    //Error Message
    const errormsg = error !== '' && <span>{ error.message }</span>

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">

                        { errormsg }

                    <h2>Inscription</h2>
                        <form onSubmit={ handleSabmit }>
                            <div className="inputBox">
                                <input type="text" onChange={ handleChange } id="pseudo" value={ pseudo }  autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className="inputBox">
                                <input type="email" onChange={ handleChange } id="email" value={ email }  autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input type="password" onChange={ handleChange } id="password" value={ password }  autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            <div className="inputBox">
                                <input type="password" onChange={ handleChange } id="confirPassword" value={ confirPassword }  autoComplete="off" required />
                                <label htmlFor="confirPassword">Confirmer le mot de passe</label>
                            </div>

                            { btn }

                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez-vous.</Link>
                        </div>

                    </div>
                </div> 
            </div>
        </div>
    )
}

export default SignUp
