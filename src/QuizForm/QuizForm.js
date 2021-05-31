import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import axios from 'axios'
import AppsIcon from '@material-ui/icons/Apps'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import { Quizstyle } from './quizform.style'
class QuizForm extends React.Component {
  state = {
    title: '',
    isStrict: false,
    isRevision: false,
    duration: 0,
    questions: [
      {
        question: '',
        image: '',
        duration: '',
        correctAns: '',
        options: []
      }
    ]
  }

  componentDidMount() {
    if (this.props.quizData.length !== 0) {
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
          duration: question.duration,
          options: question.options.map((option) => ({
            id: option.oid,
            optionValue: option.option_value,
            optionImage: option.option_image
          }))
        }))
      }))
      this.setState(data[0])
    }
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onCheckboxChange = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    })
  }

  onQuestionChange = (e, index) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].question = e.target.value
      })
    )
  }

  onOptionChange = (e, qindex, index) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[qindex].options[index].optionValue = e.target.value
      })
    )
  }

  onFileUpload = (e, index) => {
    e.preventDefault()
    const { files } = e.target
    const localImageUrl = window.URL.createObjectURL(files[0])

    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].image = localImageUrl
      })
    )
  }

  onAddQuestionClick = () => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions = [
          ...draft.questions,
          {
            question: '',
            correctAns: '',
            options: []
          }
        ]
      })
    )
  }

  onAddOption = (index) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].options.push({
          optionValue: '',
          optionImage: ''
        })
      })
    )
  }

  onCorrectAnsChange = (e, index, oindex) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].correctAns = e.target.value
      })
    )
  }

  onDurationChange = (e, index) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].duration = e.target.value
      })
    )
  }

  onSaveClick = async () => {
    const quizData = { ...this.state }
    const newquestions = await this.mapAllImages(quizData)
    quizData.questions = newquestions
    const { data } = await axios.post(this.props.submitUrl, quizData)
    if (data.status === 200) {
      this.props.onSaveSubmitSuccess()
      this.setState({
        title: '',
        isStrict: false,
        isRevision: false,
        duration: 0,
        questions: [
          {
            question: '',
            image: '',
            duration: '',
            correctAns: '',
            options: []
          }
        ]
      })
    }
  }

  questionImageToBase64 = async (item) => {
    let question = { ...item }
    if (question.image !== '') {
      await fetch(item.image)
        .then((r) => r.blob())
        .then((blob) => this.convertBlobToBase64(blob))
        .then((base64) => {
          question.image = question.image === '' ? null : base64
        })
      const newOptions = await Promise.all(
        question.options.map((option) => {
          return this.optionsImageConversion(option)
        })
      )
      question.options = newOptions
    }
    return question
  }

  optionsImageConversion = async (option) => {
    let newOption = { ...option }
    if (newOption.optionImage !== '') {
      await fetch(newOption.optionImage)
        .then((r) => r.blob())
        .then((blob) => this.convertBlobToBase64(blob))
        .then((base64) => {
          newOption.optionImage = base64
        })
    }
    return newOption
  }

  mapAllImages = async (quizData) => {
    const newQuestions = await Promise.all(
      quizData.questions.map((item) => {
        return this.questionImageToBase64(item)
      })
    )
    return newQuestions
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

  onOptionDelete = (index, optionIndex) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].options.splice(optionIndex, 1)
      })
    )
  }

  onQuestionDelete = (index) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions.splice(index, 1)
      })
    )
  }

  onOptionImageUpload = (e, index, optionIndex) => {
    e.preventDefault()
    const { files } = e.target
    const localImageUrl = window.URL.createObjectURL(files[0])

    this.setState(
      produce(this.state, (draft) => {
        draft.questions[index].options[optionIndex].optionImage = localImageUrl
      })
    )
  }

  render() {
    return (
      <Quizstyle>
        <div className='quiz'>
          <div className={'quiz_content' + ` sticky-top`}>
            <div className='container'>
              <div className='quiz_content_input_block'>
                <div className='quiz_content_input'>
                  <label className='content'>Quiz Title</label>
                  <input
                    className='input_field'
                    type='text'
                    value={this.state.title}
                    name='title'
                    onChange={this.onInputChange}
                  />
                </div>
                <div className='quiz_content_input'>
                  <label className='content'>Quiz Duration</label>
                  <input
                    className='input_field'
                    type='number'
                    value={this.state.duration}
                    name='duration'
                    onChange={this.onInputChange}
                  />
                </div>
                <div className='btn_block'>
                  <button
                    className={'main_btn bg_save'}
                    id='createQuiz'
                    onClick={this.onSaveClick}
                  >
                    Save Questions
                  </button>
                </div>
              </div>
              <div className='quiz_content_check_block'>
                <div className='quiz_content_check'>
                  <label className='content'>Strict</label>
                  <input
                    type='checkbox'
                    checked={this.state.isStrict || false}
                    name='isStrict'
                    onChange={this.onCheckboxChange}
                  />
                </div>
                <div className='quiz_content_check'>
                  <label className='content'>Revision</label>
                  <input
                    type='checkbox'
                    checked={this.state.isRevision || false}
                    name='isRevision'
                    onChange={this.onCheckboxChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='container'>
            {this.state.questions.map((question, index) => {
              return (
                <React.Fragment>
                  <div className='question_section'>
                    <div className='qustion_title_block'>
                      <div className='question_title_content'>
                        <AppsIcon className='question_icon' />
                        <label className='question_title'>
                          Question {index + 1}{' '}
                        </label>
                      </div>
                      <div className='question_title_right'>
                        <div className='question_duration'>
                          <label className='content'>Duration(s) </label>
                          <input
                            className='input_field'
                            type='number'
                            value={question.duration}
                            onChange={(e) => this.onDurationChange(e, index)}
                            disabled={!(this.state.duration == 0)}
                          />
                        </div>
                        <button
                          className={'btn_icon bg_none'}
                          onClick={() => this.onQuestionDelete(index)}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </div>
                    <div className='question_title_input'>
                      <input
                        type='text'
                        value={question.question}
                        onChange={(e) => this.onQuestionChange(e, index)}
                        className='input_field'
                      />
                      <label className='option_btn'>
                        Choose File <NoteAddIcon className='option_icon' />
                        <input
                          type='file'
                          onChange={(e) => this.onFileUpload(e, index)}
                        />
                      </label>
                    </div>

                    {question.options.map((option, optionIndex) => {
                      return (
                        <React.Fragment>
                          <div className='question_block'>
                            <input
                              type='radio'
                              name={'option' + index}
                              ref={(ref) =>
                                (this['option' + optionIndex] = ref)
                              }
                              value={option.optionValue}
                              onChange={(e) =>
                                this.onCorrectAnsChange(e, index, optionIndex)
                              }
                            />
                            <label className='content quuiz_number'>
                              {optionIndex + 1}{' '}
                            </label>
                            <div className='question_block_content'>
                              <div className='question_block_boredr'></div>

                              <input
                                className='input_field'
                                type='text'
                                value={option.optionValue}
                                onChange={(e) =>
                                  this.onOptionChange(e, index, optionIndex)
                                }
                              />
                              <div className='btn_block'>
                                <label className='main_btn secondary_btn'>
                                  Choose File
                                  <input
                                    className='main_btn'
                                    type='file'
                                    onChange={(e) =>
                                      this.onOptionImageUpload(
                                        e,
                                        index,
                                        optionIndex
                                      )
                                    }
                                  />
                                </label>
                                <button
                                  className='btn_icon'
                                  onClick={() =>
                                    this.onOptionDelete(index, optionIndex)
                                  }
                                >
                                  <CloseIcon />
                                </button>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    })}
                    <div className='btn_block'>
                      <button
                        className='option_btn'
                        onClick={() => this.onAddOption(index)}
                      >
                        Add Option <AddIcon className='option_icon' />
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
            <div class='btn_block'>
              <button className='main_btn' onClick={this.onAddQuestionClick}>
                Add Question
              </button>
            </div>
          </div>
        </div>
      </Quizstyle>
    )
  }
}

export { QuizForm }
