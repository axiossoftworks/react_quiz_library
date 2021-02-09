import React from 'react'
import PropTypes from 'prop-types'
import produce from 'immer'
import axios from 'axios'
import styles from './quizform.scss'
import AppsIcon from '@material-ui/icons/Apps'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import NoteAddIcon from '@material-ui/icons/NoteAdd'

class QuizForm extends React.Component {
  initialState = {
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
  state = this.initialState

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
      toastr.success('Successfully saved')
      this.props.onSaveSubmitSuccess()
      this.setState(this.initialState)
    } else {
      toastr.error(data.message)
    }
  }

  questionImageToBase64 = async (item) => {
    let question = { ...item }
    if (question.image === '') {
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
      <div className={styles.quiz}>
        <div className={styles.quiz_content + ` sticky-top`}>
          <div className='container'>
            <div className={styles.quiz_content_input_block}>
              <div className={styles.quiz_content_input}>
                <label className={styles.content}>Quiz Title</label>
                <input
                  className={styles.input_field}
                  type='text'
                  value={this.state.title}
                  name='title'
                  onChange={this.onInputChange}
                />
              </div>
              <div className={styles.quiz_content_input}>
                <label className={styles.content}>Quiz Duration</label>
                <input
                  className={styles.input_field}
                  type='number'
                  value={this.state.duration}
                  name='duration'
                  onChange={this.onInputChange}
                />
              </div>
              <div className={styles.btn_block}>
                <button
                  className={styles.main_btn + ' ' + styles.bg_save}
                  id='createQuiz'
                  onClick={this.onSaveClick}
                >
                  Save Questions
                </button>
              </div>
            </div>
            <div className={styles.quiz_content_check_block}>
              <div className={styles.quiz_content_check}>
                <label className={styles.content}>Strict</label>
                <input
                  type='checkbox'
                  checked={this.state.isStrict || false}
                  name='isStrict'
                  onChange={this.onCheckboxChange}
                />
              </div>
              <div className={styles.quiz_content_check}>
                <label className={styles.content}>Revision</label>
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
                <div className={styles.question_section}>
                  <div className={styles.qustion_title_block}>
                    <div className={styles.question_title_content}>
                      <AppsIcon className={styles.question_icon} />
                      <label className={styles.question_title}>
                        Question {index + 1}{' '}
                      </label>
                    </div>
                    <div className={styles.question_title_right}>
                      <div className={styles.question_duration}>
                        <label className={styles.content}>Duration(s) </label>
                        <input
                          className={styles.input_field}
                          type='number'
                          value={question.duration}
                          onChange={(e) => this.onDurationChange(e, index)}
                        />
                      </div>
                      <button
                        className={styles.btn_icon + ' ' + styles.bg_none}
                        onClick={() => this.onQuestionDelete(index)}
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </div>
                  <div className={styles.question_title_input}>
                    <input
                      type='text'
                      value={question.question}
                      onChange={(e) => this.onQuestionChange(e, index)}
                      className={styles.input_field}
                    />
                    <label className={styles.option_btn}>
                      Choose File <NoteAddIcon className={styles.option_icon} />
                      <input
                        type='file'
                        onChange={(e) => this.onFileUpload(e, index)}
                      />
                    </label>
                  </div>

                  {question.options.map((option, optionIndex) => {
                    return (
                      <React.Fragment>
                        <div className={styles.question_block}>
                          <input
                            type='radio'
                            name={'option' + index}
                            ref={(ref) => (this['option' + optionIndex] = ref)}
                            value={option.optionValue}
                            onChange={(e) =>
                              this.onCorrectAnsChange(e, index, optionIndex)
                            }
                          />
                          <label
                            className={
                              styles.content + ' ' + styles.quuiz_number
                            }
                          >
                            {optionIndex + 1}{' '}
                          </label>
                          <div className={styles.question_block_content}>
                            <div className={styles.question_block_boredr}></div>

                            <input
                              className={styles.input_field}
                              type='text'
                              value={option.optionValue}
                              onChange={(e) =>
                                this.onOptionChange(e, index, optionIndex)
                              }
                            />
                            <div className={styles.btn_block}>
                              <label
                                className={
                                  styles.main_btn + ' ' + styles.secondary_btn
                                }
                              >
                                Choose File
                                <input
                                  className={styles.main_btn}
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
                                className={styles.btn_icon}
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
                  <div className={styles.btn_block}>
                    <button
                      className={styles.option_btn}
                      onClick={() => this.onAddOption(index)}
                    >
                      Add Option <AddIcon className={styles.option_icon} />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
          <div class={styles.btn_block}>
            <button
              className={styles.main_btn}
              onClick={this.onAddQuestionClick}
            >
              Add Question
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export { QuizForm }
