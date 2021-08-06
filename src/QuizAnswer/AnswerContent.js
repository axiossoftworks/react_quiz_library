import React, { Component } from 'react'
import produce from 'immer'
import Countdown from 'react-countdown'
import { toast } from 'react-toastify'
// import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import Dropzone from '../Dropzone/Dropzone'
// import { Divider } from '@material-ui/core'

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
      // Without this even after state change option will already be selected so loop through and deselect all the options
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
        (this.props.duration === 0 ||
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
            ).id === answer.answeredOptionId,
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
              <div className='radio-btn'>
                <div className=''>
                  {option.optionImage !== null ? (
                    <img
                      className='quiz-img'
                      src={option.optionImage}
                      width='300'
                    />
                  ) : null}
                  <input
                    id={index + 1}
                    className='radio-custom'
                    type='radio'
                    ref={(ref) => (this[`radioRef${option.id}`] = ref)}
                    defaultChecked={false}
                    name={this.state.currentQuestion.id}
                    value={option.id}
                    onChange={this.onSelectedAnswerChange}
                  />

                  <label
                    htmlFor={index + 1}
                    className={[
                      'radio-custom-label',
                      String(this.state.currentQuestion.answeredOptionId) ===
                      String(option.id)
                        ? 'checked-radio'
                        : ''
                    ].join(' ')}
                  >
                    {option.optionValue}
                  </label>
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      })
    } else if (this.state.currentQuestion.questionType === 'textarea') {
      content = (
        <textarea
          className='textarea-section form-control'
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
      content = (
        // <div className='file-upload-section'>
        //   <CloudDownloadIcon className='file-icon' />
        //   <label>
        //     {' '}
        //     Upload your Files here
        //     <input
        //       type='file'
        //       onChange={this.onFileUpload}
        //       multiple
        //       size='60'
        //     />
        //   </label>
        // </div>
        <div>
          <Dropzone />
        </div>
      )
    }

    return (
      <div>
        {this.props.duration > 0 ? (
          <div className='countdown-content'>
            <Countdown
              key={this.state.currentQuestion.id}
              daysInHours
              date={this.state.beginTime + this.props.duration * 1000}
              onComplete={this.submitAnswers}
            />{' '}
          </div>
        ) : null}
        {this.props.isStrict &&
        (this.props.duration === 0 ||
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
        <h2 className='question-title quiz-ques-title'>
          {this.currentQuestionIndex + 1}. {this.state.currentQuestion.question}
        </h2>
        {this.state.currentQuestion.image !== 'No Image' ? (
          <img
            className='quiz-img'
            src={this.state.currentQuestion.image}
            width='300'
          />
        ) : null}

        {content}
        <div className=''>
          {this.props.isRevision &&
          this.state.currentQuestion?.id !== this.props.questions?.[0].id &&
          this.props.isStrict === false ? (
            <button
              className='quiz-btn secondary-btn'
              onClick={this.showPreviousQuestion}
            >
              Previous
            </button>
          ) : null}
          {this.state.currentQuestion.id !==
          this.props.questions?.[this.props.questions.length - 1].id ? (
            <button
              className='quiz-btn primary-btn'
              onClick={this.showNextQuestionIfAnswered}
            >
              Next
            </button>
          ) : (
            <button
              className='quiz-btn primary-btn '
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
      </div>
    )
  }
}
