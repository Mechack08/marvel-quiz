import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../Firebase';
import ReactTooltip from 'react-tooltip';

const Logout = () => {

    const [checked, setChecked] = useState(false)

    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        if(checked){
            firebase.logoutUser();
        }
    }, [checked, firebase])

    const handleChange = e => {
        setChecked(e.target.checked);
    }

    return (
        <div>
            <div className="logoutContainer">
                <label className="switch">
                    <input 
                        type="checkbox"
                        checked={ checked }
                        onChange={ handleChange }
                    />
                <span className="slider round" data-tip="Déconexion"></span>
                </label>
                <ReactTooltip place="left" type="error" effect="solid" />
            </div>
        </div>
    )
}

export default Logout
