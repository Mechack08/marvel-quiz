import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../Firebase' 

const Login = (props) => {

    const firebase = useContext(FirebaseContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);
    const [error, setError] = useState('')

    useEffect(() => {
        if(password.length > 5 && email !== ''){
            setBtn(true)
        }else if(btn){
            setBtn(false);
        }
    }, [email, password, btn])

    const handleSubmit = e => {
        e.preventDefault();

        firebase.loginUser(email, password)
        .then(user => {
            setEmail('');
            setPassword('');
            props.history.push('/welcome');
        })
        .catch(error => {
            setError(error);
            setEmail('');
            setPassword('');
        })
    }

    //Error Message
    const errormsg = error !== '' && <span>{ error.message }</span>

    const btnEnable = btn ? <button>Connexion</button> : <button disabled>Connexion</button>

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftLogin">

                </div>
                <div className="formBoxRight">
                    <div className="formContent">

                        { errormsg }

                    <h2>Inscription</h2>
                        <form onSubmit={ handleSubmit }>

                            <div className="inputBox">
                                <input type="email" onChange={ e => setEmail(e.target.value) } value={ email }  autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input type="password" onChange={ e => setPassword(e.target.value) } value={ password }  autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            { btnEnable }

                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/signup">Nouveau sur Marvel-Quiz ? Enregistrer vous maintenant.</Link>
                            <br />
                            <Link className="simpleLink" to="/forgettenpwd">Mot de passe oublié ? Récupérez-le ici.</Link>
                    </div>

                    </div>
                </div> 
            </div>
        </div>
    )
}

export default Login
