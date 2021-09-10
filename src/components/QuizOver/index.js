import React, { Fragment, useEffect, useState } from 'react';
import { GiTrophyCup } from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';
import axios from 'axios'


const QuizOver = React.forwardRef((props, ref) => {

    const {
        levelNames, 
        score, 
        maxQuestions, 
        quizLevel, 
        percent, 
        loadLevelQuestions
    } = props

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = 'e5e5fee3c80a5d80d884258671f9b0b9';

    const [asked, setAsked] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [charactersData, setCharactersData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setAsked(ref.current)

        if(localStorage.getItem('marvelStarageDate')){
            const date = localStorage.getItem('marvelStarageDate')
            checkDateAge(date)
        }
    }, [ref])

    const capitolizeFirstLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const checkDateAge = date => {
        const today = Date.now()
        const timeDifference = today - date

        const dateDifference = timeDifference / (1000 * 3600 * 24)

        if(dateDifference >= 5){
            localStorage.clear()
            localStorage.setItem('marvelStarageDate', Date.now())
        }
    }

    const showModal = id => {
        setOpenModal(true)

        if (localStorage.getItem(id)){
            setCharactersData(JSON.parse(localStorage.getItem(id)))
            setLoading(false)
        }

        axios
        .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
        .then( response => {
            setCharactersData(response.data)
            setLoading(false)

            localStorage.setItem(id, JSON.stringify(response.data))

            if (!localStorage.getItem('marvelStarageDate')){
                localStorage.setItem('marvelStarageDate', Date.now())
            }
        })
        .catch( error => console.log(error))
    }

    const hideModal = () => {
        setOpenModal(false)
        setLoading(true)
    }

    const averageGrade = maxQuestions / 2

    if(score < averageGrade){
        //setTimeout( () => loadLevelQuestions(0), 3000);
        setTimeout( () => loadLevelQuestions(quizLevel), 3000);
    }

    const decision = score >= averageGrade ?
    (
        <Fragment>
            <div className="stepsBtnContainer">
            {
                quizLevel < levelNames.length ?
                (
                    <Fragment>
                        <p className="successMsg">
                            Bravo, passez au niveau Supérieur
                        </p>
                        <button className="btnResult success" onClick={() => loadLevelQuestions(quizLevel)}>Niveau Supérieur</button>
                    </Fragment>
                )
                :
                (
                    <Fragment>
                        <p className="successMsg">
                            <GiTrophyCup size='50px' />Bravo, vous etes un expert
                        </p>
                        <button className="btnResult gameOver" onClick={() => loadLevelQuestions(0)}>Accueil</button>
                    </Fragment>
                )
            }
            </div>
            <div className="percentage">
                <div className="progressPercent">Réussite: { percent } %</div>
                <div className="progressPercent">Note: { score } / { maxQuestions }</div>
            </div>
        </Fragment>
    )
    :
    (
        <Fragment>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Désolé, vous avez échoué !</p>
            </div>
            <div className="percentage">
            <div className="progressPercent">Réussite: { percent } %</div>
                <div className="progressPercent">Note: { score } / { maxQuestions }</div>
            </div>
        </Fragment>
    )

    const questionAnswer = score >= averageGrade ?
    (
        asked.map( question => {
            return (
                <tr key={ question.id }>
                    <td>{ question.question }</td>
                    <td>{ question.answer }</td>
                    <td>
                        <button 
                            className="btnInfo"
                            onClick={ () => showModal(question.heroId) }
                        >
                            Info
                        </button>
                    </td>
                </tr>
            )
        })
    )
    :
    (
        <tr>
            <td colSpan="3">
                <Loader 
                    loadingMsg={"Pas de réponses car vous avez échoué !"}
                    styling={{textAlign: 'center', color: 'red'}}
                />
            </td>
        </tr>
    )

    const resultInModal = !loading ?
        (
            <Fragment>
                <div className="modalHeader">
                    <h2>{ charactersData.data.results[0].name }</h2>
                </div>
                <div className="modalBody">
                    <div className="comicImage">
                        <img src={charactersData.data.results[0].thumbnail.path+'.'+charactersData.data.results[0].thumbnail.extension} alt={charactersData.data.results[0].name} />

                        <p>{charactersData.attributionText}</p>
                    </div>
                    <div className="comicDetails">
                        <h3>Déscription</h3>
                        {
                            charactersData.data.results[0].description ?
                                <p>{charactersData.data.results[0].description}</p>
                                :
                                <p>Déscription indisponible.</p>
                        }

                        <h3>Plus d'info</h3>
                        {
                            charactersData.data.results[0].urls &&
                                charactersData.data.results[0].urls.map((url, index) => {
                                    return <a
                                        key={index}
                                        href={url.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {capitolizeFirstLetter(url.type)}
                                    </a>
                                })
                        }
                    </div>
                </div>
                <div className="modalFooter">
                    <button className="modalBtn" onClick={hideModal}>Fermer</button>
                </div>
            </Fragment>
        )
        :
        (
            <Fragment>
                <div className="modalHeader">
                    <h2>En cours de chargement ...</h2>
                </div>
                <div className="modalBody">
                    <Loader />
                </div>
            </Fragment>
        )

    return (
        <Fragment>
            
            { decision }

            <hr />
            <p>Les réponses aux questions posées:</p>

            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Questions</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        { questionAnswer }
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModal} hideModal={hideModal}>
                { resultInModal }
            </Modal>

        </Fragment>
    )
})

export default React.memo(QuizOver)
