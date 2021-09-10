import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizMarvel } from '../QuizMarvel'
import Levels from '../Levels'
import ProgressBar from '../ProgessBar'
import QuizOver from '../QuizOver'
import { FaChevronRight } from 'react-icons/fa';


toast.configure();

const initialState = {
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    msgWelcome: false,
    gameEnd: false,
    percent: null
}

const levelNames = ["debutant", "confirme", "expert"];

class Quiz extends Component {

    constructor(props) {
        super(props)
        this.state = initialState;
        this.storedDataRef = React.createRef();
    }

    showWelcomMsg = pseudo => {
        if(!this.state.msgWelcome){
            this.setState({
                msgWelcome: true
            })

            toast.dark(`Bienvenu ${pseudo} et bonne chance`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                bodyClassName: "toastify-color"
                });
        }
    }

    loadQuestions = quiz => {
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quiz];
        if(fetchedArrayQuiz.length >= this.state.maxQuestions){

            this.storedDataRef.current = fetchedArrayQuiz;

            const newArray = fetchedArrayQuiz.map( ({answer, ...keepRest}) => keepRest)

            this.setState({ storedQuestions: newArray })

        }
    }

    componentDidMount() {
        this.loadQuestions(levelNames[this.state.quizLevel]);
    }
    componentDidUpdate(prevProps, prevState) {

        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            score,
            gameEnd,
        } = this.state

        if((storedQuestions !== prevState.storedQuestions) && storedQuestions.length){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options
            })
        }

        if((idQuestion !== prevState.idQuestion) && storedQuestions.length){
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options,
                btnDisabled: true,
                userAnswer: null
            })
        }

        if ( gameEnd !== prevState.gameEnd ){
            const gradePercent = this.getPercentage(maxQuestions, score);
            this.quizOver(gradePercent);
        }

        if(this.props.user.pseudo !== prevProps.user.pseudo){
            this.showWelcomMsg(this.props.user.pseudo);
        }
    }

    submitAnswer = selectedAnswer => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

    quizOver = percent => {

        if(percent >= 50){
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent
            })
        }else{
            this.setState({percent})
        }
    }

    nextQuestion = () => {
        if(this.state.idQuestion === this.state.maxQuestions - 1){
            this.setState({ gameEnd: true })
        }else{
            this.setState(prevState => ({ idQuestion: prevState.idQuestion + 1 }))
        }

        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        if(this.state.userAnswer === goodAnswer){
            this.setState(prevState => ({ score: prevState.score +1 }))

            toast.success('Bravo +1', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                bodyClassName: "toastify-color"
                });
        }else{
            toast.error('Raté !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                bodyClassName: "toastify-color"
                });
        }
    }

    loadLevelQuestions = param => {
        this.setState({...initialState, quizLevel: param})

        this.loadQuestions(levelNames[param])
    }
    
    render() {

        const {
            quizLevel,
            maxQuestions,
            storedQuestions,
            question,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            msgWelcome,
            gameEnd,
            percent
        } = this.state

        const displayOptions = options.map((option, index) => {
            return <p key={ index } 
                className={`answerOptions ${userAnswer === option ? "selected" : null}`}
                onClick={ () => this.submitAnswer(option) }
            >
                <FaChevronRight /> { option }
            </p>
        })

        const lblButton = idQuestion < maxQuestions -1 ? "Suivant" : "Terminer"

        return gameEnd ? (
            <QuizOver 
                ref={this.storedDataRef}
                levelNames={levelNames}
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent={percent}
                loadLevelQuestions = {this.loadLevelQuestions}
            />
        )
        :
        (
            <Fragment>
                <Levels 
                    levelNames={ levelNames }
                    quizLevel={ quizLevel }
                />
                <ProgressBar 
                    idQuestion={ idQuestion } 
                    maxQuestions={ maxQuestions}
                />

                <h2>{question}</h2>

                { displayOptions }

                <button disabled={btnDisabled} className="btnSubmit" onClick={this.nextQuestion}>{ lblButton }</button>
            </Fragment>
        )
    }
    
}

export default Quiz
