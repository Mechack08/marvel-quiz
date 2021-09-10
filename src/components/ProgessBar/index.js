import React, { Fragment } from 'react'

const ProgressBar = ({idQuestion, maxQuestions}) => {

    const getWidth = (totalQuestions, idQuests) => {
        return (100 / totalQuestions) * idQuests;
    }
    
    const currentQuestion = idQuestion +1;

    const progressPercent = getWidth(maxQuestions, currentQuestion);

    return (
        <Fragment>

            <div className="percentage">
                <div className="progressPercent">{`Question: ${currentQuestion}/${maxQuestions}`}</div>
                <div className="progressPercent">{`Progression: ${progressPercent}%`}</div>
            </div>
            <div className="progressBar">
                <div className="progressBarChange" style={{width: `${progressPercent}%`}}></div>
            </div>
            
        </Fragment>
    )
}

export default React.memo(ProgressBar)
