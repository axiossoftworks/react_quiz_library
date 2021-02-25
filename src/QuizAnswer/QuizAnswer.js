import React, { Component } from "react";
import AnswerContent from "./AnswerContent";
import { ToastContainer } from "react-toastr";

export class QuizAnswer extends Component {
  state = {
    title: "",
    isStrict: false,
    isRevision: false,
    duration: 0,
    questions: [],
    startQuiz: false
  };

  componentDidMount() {
    if (this.props.quizData?.length !== 0) {
      const data = this.props.quizData.map((quiz) => ({
          title: quiz.quiz_name,
          isStrict: quiz.is_strictduration,
          isRevision: quiz.is_revision,
          duration: quiz.duration,
          questions: quiz.questions.map((question) => (
            {
              id: question.id,
              question: question.question,
              image: question.question_image,
              correctAns: question.correct_answer,
              duration: question.duration,
              options: question.options.map((option) => ({
                  id: option.oid,
                  optionValue: option.option_value,
                  optionImage: option.option_image
                })
              )
            }
          ))
        })
      );
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
    return <div>
     <ToastContainer
    ref={ref => this.toastr = ref}
    className="toast-top-right"
  />
    <h1>Title: {this.state.title}
    </h1>
   
    {this.state.isStrict ? <p>You must complete each question in the specified time limit. If you cannot complete the question will be skipped</p> : null}
    {this.state.startQuiz ? null :<button onClick={() => {
      this.setState({startQuiz: true})
    }}>Start Quiz</button>}
    {(this.state.questions.length > 0 && this.state.startQuiz)  &&  <AnswerContent questions={this.state.questions} isStrict={this.state.isStrict} isRevision={this.state.isRevision} duration={this.state.duration} onSaveSubmitSuccess={this.props.onSaveSubmitSuccess} testerId={this.props.testerId} token={this.props.token} submitUrl={this.props.submitUrl} toastr={this.toastr}/>}
    
    </div>;
  }
}
