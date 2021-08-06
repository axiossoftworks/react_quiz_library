import React, { useEffect, useState } from 'react'

import 'quiz_library/dist/index.css'
import { QuizAnswer } from 'quiz_library'
// import { QuizForm } from 'quiz_library'
import axios from 'axios'

const quizData1 = [
  {
    id: 108,
    quiz_name: 'Officiis nostrum qui',
    duration: 51,
    is_strictduration: false,
    is_revision: true,
    created_at: '2021-07-01T08:53:20.501562',
    updated_at: '2021-07-01T08:53:20.501562',
    user_id: 2,
    quiz_group_id: 108,
    questions: [
      {
        id: 195,
        question: 'In vero nesciunt at',
        question_type: 'file',
        score_point: 35.0,
        options: null,
        correct_answer: null,
        duration: null,
        quiz_group_id: 108,
        question_image:
          'https://i0.wp.com/dotnepal.com/wp-content/uploads/2020/01/CMA-question-nepal-police.jpg?resize=662%2C331&ssl=1'
      },
      {
        id: 194,
        question: 'Aut pariatur Omnis ',
        question_type: 'textarea',
        score_point: 47.0,
        options: null,
        correct_answer: null,
        duration: null,
        quiz_group_id: 108,
        question_image:
          'https://i0.wp.com/dotnepal.com/wp-content/uploads/2020/01/CMA-question-nepal-police.jpg?resize=662%2C331&ssl=1'
      },
      {
        id: 193,
        question: 'Cumque molestiae mag',
        question_type: 'mcq',
        score_point: 4.0,
        options: [
          {
            oid: 393,
            id: null,
            question_id: 193,
            option_value: 'Quis quisquam nihil ',
            option_image_token: 'No Image',
            created_at: null,
            updated_at: null,
            image_token: null,
            image_name: null,
            option_image:
              'https://i0.wp.com/dotnepal.com/wp-content/uploads/2020/01/CMA-question-nepal-police.jpg?resize=662%2C331&ssl=1'
          },
          {
            oid: 392,
            id: null,
            question_id: 193,
            option_value: 'Expedita ea unde quo',
            option_image_token: 'No Image',
            created_at: null,
            updated_at: null,
            image_token: null,
            image_name: null,
            option_image: 'null'
          }
        ],
        correct_answer: 'Quis quisquam nihil ',
        duration: 80,
        quiz_group_id: 108,
        question_image: null
      }
    ]
  }
]
const App = () => {
  const [quizData, setQuizData] = useState([])

  useEffect(() => {
    const fetchQuiz = async () => {
      // const { data } = await axios.get(
      //   'http://localhost:3001' + `/api/quiz_data/108`,
      //   {
      //     params: {
      //       token:
      //         'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjJ9.65eP3iKS7hwix-kBBOdiwwl5teLVfZi9FujYGidv__U'
      //     }
      //   }
      // )
      // if (data) {
      setQuizData(quizData1)
      // }
    }
    fetchQuiz()
  }, [])
  // const onSubmit = async (quizData) => {
  //   // submitUrl='https://quiz.axiossoftwork.com//quiz/quiz_create?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjF9.aMzhSfrd5OwiaDvkdnKDmaXl5npNRrxMj8cfUDbPHVk'
  //   const { data } = await axios.post(
  //     'http://localhost:3001/quiz/quiz_create?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjJ9.65eP3iKS7hwix-kBBOdiwwl5teLVfZi9FujYGidv__U',
  //     quizData
  //   )
  //   if (data.status === 200) {
  //     return { status: 200, message: data.message }
  //   } else {
  //     return { status: 500, message: data.message }
  //   }
  // }

  const onAnsSubmit = async (postData) => {
    const { data } = await axios.post(
      'http://localhost:3001/quiz/answers/submit?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjJ9.65eP3iKS7hwix-kBBOdiwwl5teLVfZi9FujYGidv__U',
      postData
    )
    if (data.status === 200) {
      return { status: 200, message: data.message }
    } else {
      return { status: 500, message: data.message }
    }
  }

  return (
    // <QuizForm  quizData={quizData} onSubmit={onSubmit} />
    quizData.length > 0 && (
      <QuizAnswer testerId={1} quizData={quizData} onSubmit={onAnsSubmit} />
    )
  )
}

export default App
