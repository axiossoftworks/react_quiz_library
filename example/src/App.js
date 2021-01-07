import React from 'react'

import 'quiz_library/dist/index.css'
import { QuizAnswer } from 'quiz_library'
import { QuizForm } from 'quiz_library'


const quizData = [{"id":48,"quiz_name":"Dolor enim aut earum","duration":43,"is_strictduration":true,"is_revision":true,"domain_id":1,"created_at":"2021-01-06T10:54:48.987202","updated_at":"2021-01-06T10:54:48.987202","quiz_group_id":48,"questions":[{"id":66,"question":"Iste dolores sed et ","options":[{"oid":152,"id":null,"question_id":66,"option_value":"Porro eum cupiditate","option_image_token":"No Image","created_at":null,"updated_at":null,"image_token":null,"image_name":null,"option_image":"https://storage.googleapis.com/ku_library"},{"oid":153,"id":null,"question_id":66,"option_value":"Officia ut in dolore","option_image_token":"No Image","created_at":null,"updated_at":null,"image_token":null,"image_name":null,"option_image":"https://storage.googleapis.com/ku_library"}],"correct_answer":"Porro eum cupiditate","duration":80,"quiz_group_id":48,"question_image":"https://storage.googleapis.com/ku_library"}]}]
const App = () => {
  return <QuizAnswer quizData={quizData} submitUrl="http://quiz.com/save_answers/"/>
}

export default App
