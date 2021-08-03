import React, { Component } from 'react'
import AnswerContent from './AnswerContent'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QuizAnswerStyle } from './QuizAnswer.style'

export class QuizAnswer extends Component {
  state = {
    title: '',
    isStrict: false,
    isRevision: false,
    duration: 0,
    questions: [],
    startQuiz: false,
    isTitle: true
  }

  componentDidMount() {
    if (this.props.quizData?.length !== 0) {
      const data = this.props.quizData.map((quiz) => ({
        title: quiz.quiz_name,
        isStrict: quiz.is_strictduration,
        isRevision: quiz.is_revision,
        duration: quiz.duration,
        questions: quiz.questions.map((question) => ({
          id: question.id,
          question: question.question,
          image: question.question_image,
          correctAns: question.correct_answer,
          questionType: question.question_type,
          answerText: question?.answer_text,
          duration: question.duration,
          options: question.options?.map((option) => ({
            id: option.oid,
            optionValue: option.option_value,
            optionImage: option.option_image
          }))
        }))
      }))
      this.setState({
        title: data[0].title,
        isRevision: data[0].isRevision,
        isStrict: data[0].isStrict,
        duration: data[0].duration,
        questions: data[0].questions
      })
    }
  }

  render() {
    return (
      <QuizAnswerStyle>
        <div className='quiz-section-card'>
          <div className='quiz-card'>
            <ToastContainer />{' '}
            {this.state.isTitle ? (
              <div className='quiz-content'>
                <h1 className='quiz-title'>Title: {this.state.title}</h1>

                {this.state.isStrict ? (
                  <p>
                    You must complete each question in the specified time limit.
                    If you cannot complete the question will be skipped
                  </p>
                ) : null}
                {this.state.startQuiz ? null : (
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      this.setState({ startQuiz: true })
                      this.setState({ isTitle: false })
                    }}
                  >
                    Start Quiz
                  </button>
                )}
              </div>
            ) : (
              ''
            )}
            <div className='question-section'>
              {this.state.isTitle ? (
                ''
              ) : (
                <h1 className='quiz-title title-head'>
                  Title: {this.state.title}
                </h1>
              )}
              {this.state.questions.length > 0 && this.state.startQuiz && (
                <AnswerContent
                  questions={this.state.questions}
                  isStrict={this.state.isStrict}
                  isRevision={this.state.isRevision}
                  duration={this.state.duration}
                  testerId={this.props.testerId}
                  submitAnswers={this.props.onSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </QuizAnswerStyle>
    )
  }
}
