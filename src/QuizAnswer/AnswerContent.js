import React, { Component } from 'react'
import produce from 'immer'
import Countdown from 'react-countdown'
import { toast } from 'react-toastify'

export default class AnswerContent extends Component {
  state = { currentQuestion: '', countDown: 20000, beginTime: Date.now() }

  answeredQuestions = []
  currentQuestionIndex = 0
  componentDidMount() {
    this.setState({
      currentQuestion: this.props.questions?.[0],
      countDown: this.props.questions?.[0].duration
    })
  }

  componentDidUpdate(nextProps, nextState) {
    if (
      this.state.currentQuestion.id !== nextState.currentQuestion.id &&
      Object.keys(this.state.currentQuestion).length > 0
    ) {
      //Without this even after state change option will already be selected so loop through and deselect all the options
      if (this.state.currentQuestion.questionType === 'mcq')
        this.state.currentQuestion.options.forEach((option, index) => {
          this[`radioRef${option.id}`].checked = false
        })
      // Preselect if the question has already been answered
      if (this.state.currentQuestion.answeredOptionId) {
        this[
          `radioRef${this.state.currentQuestion.answeredOptionId}`
        ].checked = true
      }
    }
  }

  onSelectedAnswerChange = (e) => {
    if (this.props.isRevision) {
      this.setState(
        produce(this.state, (draft) => {
          draft.currentQuestion.answeredOptionId = e.target.value
        })
      )
    } else {
      this.setState(
        produce(this.state, (draft) => {
          draft.currentQuestion.answeredOptionId = e.target.value
        }),
        this.showNextQuestion
      )
    }
  }

  showNextQuestion = () => {
    this.currentQuestionIndex += 1
    // If next question already answered then get currentQIndex from this.answeredQues else get it from this.prop.question
    //If it is already answered componentDidUpdate will preselect the previously selected option
    let nextQuestion = this.answeredQuestions[this.currentQuestionIndex]
    this.replaceCurrentQuestionOrPushCurrent()
    if (nextQuestion === undefined) {
      nextQuestion = this.props.questions[this.currentQuestionIndex]
    }
    if (
      this.state.currentQuestion.id !==
      this.props.questions?.[this.props.questions.length - 1].id
    ) {
      this.setState({
        currentQuestion: nextQuestion,
        countDown: nextQuestion.duration
      })
      if (
        this.props.isStrict &&
        (this.props.duration == 0 ||
          this.props.duration === undefined ||
          this.props.duration === null)
      ) {
        this.setState({
          beginTime: Date.now()
        })
      }
    } else {
      this.submitAnswers()
    }
  }

  showNextQuestionIfAnswered = () => {
    if (
      this.state.currentQuestion.answeredOptionId !== undefined ||
      this.state.currentQuestion.questionType !== 'mcq'
    ) {
      this.showNextQuestion()
    } else {
      toast.error('Please Select your answer first!!')
    }
  }

  replaceCurrentQuestionOrPushCurrent = () => {
    const questionIndex = this.answeredQuestions.findIndex(
      (element) => element.id === this.state.currentQuestion.id
    )
    if (questionIndex !== -1) {
      this.answeredQuestions[questionIndex] = this.state.currentQuestion
    } else {
      this.answeredQuestions.push(this.state.currentQuestion)
    }
  }

  showPreviousQuestion = () => {
    this.currentQuestionIndex -= 1
    console.log(this.currentQuestionIndex)
    const prevQuestion = this.answeredQuestions[this.currentQuestionIndex]
    this.replaceCurrentQuestionOrPushCurrent()
    this.setState({
      currentQuestion: prevQuestion
    })
  }

  convertBlobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    })

  imageConversion = async (answerFile) => {
    let newAnswerFile

    if (answerFile && answerFile !== '') {
      await fetch(answerFile)
        .then((r) => r.blob())
        .then((blob) => this.convertBlobToBase64(blob))
        .then((base64) => {
          newAnswerFile = answerFile === '' ? null : base64
        })
    }
    return newAnswerFile
  }

  submitAnswers = async () => {
    // Filter if question is not answered and map through only answered question

    const answers = this.answeredQuestions.filter((ans) => {
      if (ans.questionType === 'mcq') return ans.answeredOptionId !== undefined
      else if (ans.questionType === 'textarea') return ans.answerText != null
      else return ans.answerFile != null
    })

    const answersToBeSubmitted = await Promise.all(
      answers.map(async (answer) => {
        let answerFiles
        if (answer.questionType === 'file')
          answerFiles = await Promise.all(
            answer.answerFile.map((file) => this.imageConversion(file))
          )
        return {
          option_id: answer.answeredOptionId,
          question_id: answer.id,
          tester_id: this.props.testerId,
          question_type: answer.questionType,
          is_correct:
            answer.options?.find(
              (item) => item.optionValue === answer.correctAns
            ).id == answer.answeredOptionId,
          answer_file: answerFiles ?? null,
          answer_text: answer.answerText
        }
      })
    )

    const result = await this.props.submitAnswers({
      answers: answersToBeSubmitted
    })
    if (result.status === 200) {
      window.location.reload()
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  onFileUpload = (e) => {
    e.preventDefault()
    const { files } = e.target
    const localImageUrl = Object.values(files).map((file) =>
      window.URL.createObjectURL(file)
    )

    this.setState(
      produce(this.state, (draft) => {
        draft.currentQuestion.answerFile = localImageUrl
      })
    )
  }

  render() {
    let content
    if (this.state.currentQuestion.questionType === 'mcq') {
      content = this.state.currentQuestion?.options?.map((option, index) => {
        return (
          <React.Fragment key={option.id}>
            <div className='col-md-12'>
              {index + 1}.
              <input
                type='radio'
                ref={(ref) => (this[`radioRef${option.id}`] = ref)}
                defaultChecked={false}
                name={this.state.currentQuestion.id}
                value={option.id}
                onChange={this.onSelectedAnswerChange}
              />
              {option.optionValue}
              {option.optionImage !== null ? (
                <img src={option.optionImage} width='300' />
              ) : null}
            </div>
          </React.Fragment>
        )
      })
    } else if (this.state.currentQuestion.questionType === 'textarea') {
      content = (
        <textarea
          value={this.state.currentQuestion.answerText}
          onChange={(e) => {
            const value = e.target.value
            this.setState((prevState) => ({
              ...prevState,
              currentQuestion: {
                ...prevState.currentQuestion,
                answerText: value
              }
            }))
          }}
        />
      )
    } else {
      content = <input type='file' onChange={this.onFileUpload} multiple />
    }

    return (
      <div>
        {this.props.duration > 0 ? (
          <p>
            Quiz Duration:{' '}
            <Countdown
              key={this.state.currentQuestion.id}
              daysInHours={true}
              date={this.state.beginTime + this.props.duration * 1000}
              onComplete={this.submitAnswers}
            />{' '}
          </p>
        ) : null}
        {this.props.isStrict &&
        (this.props.duration == 0 ||
          this.props.duration === undefined ||
          this.props.duration === null) ? (
          <div>
            Question Time:{' '}
            <Countdown
              key={this.state.currentQuestion.id}
              daysInHours={true}
              date={this.state.beginTime + this.state.countDown * 1000}
              onComplete={this.showNextQuestion}
            />{' '}
          </div>
        ) : null}
        <h2 className='question-title'>
          {this.currentQuestionIndex + 1}. {this.state.currentQuestion.question}
        </h2>
        {this.state.currentQuestion.image !== 'No Image' ? (
          <img src={this.state.currentQuestion.image} width='300' />
        ) : null}

        {content}

        {this.props.isRevision &&
        this.state.currentQuestion?.id !== this.props.questions?.[0].id &&
        this.props.isStrict === false ? (
          <button onClick={this.showPreviousQuestion}>Previous</button>
        ) : null}
        {this.state.currentQuestion.id !==
        this.props.questions?.[this.props.questions.length - 1].id ? (
          <button onClick={this.showNextQuestionIfAnswered}>Next</button>
        ) : (
          <button
            onClick={
              this.props.isStrict
                ? this.showNextQuestion
                : this.showNextQuestionIfAnswered
            }
          >
            Submit
          </button>
        )}
      </div>
    )
  }
}
