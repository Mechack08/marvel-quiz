import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../Firebase'


const ForgettenPwd = props => {

    const firebase = useContext(FirebaseContext)

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = e => {
        e.preventDefault();

        firebase.resetPassword(email)
        .then(() => {
            setError(null);
            setSuccess(`Consultez votre email ${ email } pour changer le mot de passe`);
            setEmail("");

            setTimeout(() => {
                props.history.push('/login');
            }, 5000);
        })
        .catch(error => {
            setError(error);
            setEmail("");
        })
    }

    const disabled = email === "";

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftForget">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">

                        { 
                            success && <span 
                                style={{
                                    border: 'green',
                                    background: 'green',
                                    color: '#fff'
                                }}
                            >{ 
                            success }</span>
                        }

                        { error && <span>{ error.message }</span> }

                    <h2>Mot de passe oublié ?</h2>
                        <form onSubmit={ handleSubmit }>

                            <div className="inputBox">
                                <input type="email" onChange={ e => setEmail(e.target.value) } value={ email }  autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <button disabled={ disabled } >Récupérer</button>

                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/signup">Déjà inscrit ? Connectez-vous.</Link>
                    </div>

                    </div>
                </div> 
            </div>
        </div>
    )
}

export default ForgettenPwd
