import React, { useState, useEffect } from 'react'
import Stepper from 'react-stepper-horizontal';

const Levels = ({levelNames, quizLevel}) => {

    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const quizSteps = levelNames.map(level => ({title: level.toUpperCase()}));

        setLevels(quizSteps);
    }, [levelNames]);

    return (
        <div className="levelsContainer" style={{background: 'transparent'}}>
            <Stepper steps={ levels } 
                    activeStep={ quizLevel }
                    circleTop={ 0 }
                    activeTitleColor={ '#d31017' }
                    activeColor={ '#d31017' }
                    completeTitleColor={ '#2FBE8E' }
                    completeColor={ '#2FBE8E' }
                    barStyle={ 'dashed' }
                    completeBarColor={ '#d31017' }
                    size={ 40 }
                    circleFontSize={ 18 }
            />
        </div>
    )
}

export default React.memo(Levels)
