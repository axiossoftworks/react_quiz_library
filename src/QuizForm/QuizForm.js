import React from 'react'
import produce from 'immer'
import AppsIcon from '@material-ui/icons/Apps'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import NoteAddIcon from '@material-ui/icons/NoteAdd'
import { Quizstyle } from './quizform.style'
import { ToastContainer, toast } from 'react-toastify'
class QuizForm extends React.Component {
  state = {
    submitDisabled: false,
    title: '',
    isStrict: false,
    isRevision: false,
    duration: 0,
    questions: [
      {
        question: '',
        image: '',
        duration: 0,
        correctAns: '',
        questionType: '',
        scorePoint: '',
        options: []
      }
    ]
  }

  componentDidMount() {
    if (this.props?.quizData.length !== 0) {
      const data = this.props.quizData?.map((quiz) => ({
        title: quiz.quiz_name,
        isStrict: quiz.is_strictduration,
        isRevision: quiz.is_revision,
        duration: parseInt(quiz.duration),
        questions: quiz.questions?.map((question) => ({
          id: question.id,
          question: question.question,
          image: question.question_image,
          correctAns: question.correct_answer,
          duration: parseInt(question.duration),
          questionType: question.question_type,
          scorePoint: question.score_point,
          options: question.options?.map((option) => ({
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
            image: '',
            duration: 0,
            questionType: '',
            scorePoint: '',
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

  validateFields = (quizData) => {
    let valid = true
    if (quizData.title === '') {
      valid = false
      toast.info('Provide a title')
    }
    quizData.questions.forEach((question, index) => {
      const emptyOptions = question.options.some(
        (option) => option.optionValue === ''
      )

      if (question.question === '') {
        valid = false
        toast.info(`Empty question title for Question ${index + 1}`)
      } else if (question.questionType === '') {
        valid = false
        toast.info(`Select Question type for Question ${index + 1}`)
      } else if (question.scorePoint === '') {
        valid = false
        toast.info(`Points not given for Question ${index + 1}`)
      } else if (
        question.questionType === 'mcq' &&
        question.options.length === 0
      ) {
        valid = false
        toast.info(`Options required for MCQ question. Question ${index + 1}`)
      } else if (
        question.questionType === 'mcq' &&
        question.options.length !== 0 &&
        emptyOptions
      ) {
        valid = false
        toast.info(`Options can't be empty. Question ${index + 1}`)
      } else if (
        question.questionType === 'mcq' &&
        question.correctAns === ''
      ) {
        valid = false
        toast.info(
          `You have not selected correct option for Question ${index + 1}`
        )
      } else if (
        quizData.isStrict &&
        (parseInt(quizData.duration) === 0 || quizData.duration === '') &&
        (parseInt(question.duration) === 0 || question.duration === '')
      ) {
        valid = false
        toast.info(`Duration must exist for Question ${index + 1}`)
      }
    })
    return valid
  }

  onSaveClick = async () => {
    const quizData = { ...this.state }
    const newquestions = await this.mapAllImages(quizData)
    quizData.questions = newquestions
    const validated = this.validateFields(quizData)
    if (validated) {
      this.setState({ submitDisabled: true })
      const data = await this.props.onSubmit(quizData)
      if (data.status === 200) {
        toast.success(data.message)
        this.setState({
          title: '',
          isStrict: false,
          submitDisabled: false,
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
      } else {
        toast.error(data.message)
      }
    }
  }

  questionImageToBase64 = async (item) => {
    const question = { ...item }
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
    const newOption = { ...option }
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

  onQuestionKeyChange = (e, qindex, key) => {
    this.setState(
      produce(this.state, (draft) => {
        draft.questions[qindex][key] = e.target.value
      })
    )
  }

  render() {
    return (
      <Quizstyle>
        <ToastContainer />

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
                <React.Fragment key={question.id}>
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
                            disabled={
                              !(
                                parseInt(this.state.duration) === 0 ||
                                this.state.duration === ''
                              )
                            }
                          />
                        </div>
                        <button
                          className='btn_icon bg_none'
                          onClick={() => this.onQuestionDelete(index)}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </div>
                    <div className='question_title_input'>
                      <input
                        className='input_field mg-r'
                        type='text'
                        value={question.question}
                        onChange={(e) => this.onQuestionChange(e, index)}
                      />
                      <select
                        className='input_field mg-r'
                        onChange={(e) =>
                          this.onQuestionKeyChange(e, index, 'questionType')
                        }
                      >
                        <option value=''>Select Type</option>
                        <option value='mcq'>MCQ</option>
                        <option value='file'>File</option>
                        <option value='textarea'>Text Area</option>
                      </select>
                      <label className='mg-r' htmlFor='points'>
                        Points
                      </label>
                      <input
                        id='points'
                        className='input_field mg-r'
                        type='number'
                        step='any'
                        value={question.scorePoint}
                        onChange={(e) =>
                          this.onQuestionKeyChange(e, index, 'scorePoint')
                        }
                      />
                      <div className='choose-btn'>
                        <label className='option_btn'>
                          Choose File <NoteAddIcon className='option_icon' />
                          <input
                            type='file'
                            onChange={(e) => this.onFileUpload(e, index)}
                          />
                        </label>
                      </div>
                    </div>

                    {question.questionType === 'mcq' &&
                      question.options.map((option, optionIndex) => {
                        return (
                          <React.Fragment key={question.id}>
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
                                <div className='question_block_boredr' />

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
                      {question.questionType === 'mcq' ? (
                        <button
                          className='option_btn'
                          onClick={() => this.onAddOption(index)}
                        >
                          Add Option <AddIcon className='option_icon' />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
            <div className='btn_block'>
              <button className='main_btn' onClick={this.onAddQuestionClick}>
                Add Question
              </button>
            </div>

            <div className='btn_block'>
              <button
                className='main_btn bg_save mg-t'
                id='createQuiz'
                disabled={this.state.submitDisabled}
                onClick={this.onSaveClick}
              >
                Save Questions
              </button>
            </div>
          </div>
        </div>
      </Quizstyle>
    )
  }
}

export { QuizForm }
