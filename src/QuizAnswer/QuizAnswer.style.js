import styled from 'styled-components'
export const QuizAnswerStyle = styled.div`
  .quiz-section-card {
    padding: 30px;
  }

  .quiz-card {
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: 40%;
    padding: 40px;
    margin: auto;
    height: 400px;
    position: absolute;
    top: 25%;
    left: 30%;
  }

  .quiz-title {
    font-size: 20px;
    margin-bottom: 25px;
  }

  .quiz-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .countdown-content {
    background: #808080b3;
    padding: 10px;
    border-radius: 20px;
    width: 50%;
    color: white;
    position: absolute;
    top: -16px;
    right: 160px;
  }

  .question-section {
    .quiz-ques-title {
      text-align: initial;
      font-size: 18px;
    }

    .title-head {
      margin: 25px 0;
      font-size: 20px;
    }

    .fileupload-section {
      border: 1px solid;
      display: flex;
      width: 100%;
      padding: 10px;
    }

    .btn-primary {
      margin-top: 40px;
      float: right;
    }

    .textarea-section {
      resize: none;
      width: 100%;
      height: 100px;
    }

    .prev-btn {
      margin-top: 40px;
      float: left;
      padding: 5px;
      border-color: #80808054;
      color: #0000008c;
    }

    .radio-btn {
      border: 1px solid;
      padding: 10px;
      text-align: initial;
      margin-bottom: 15px;

      input {
        margin-right: 10px;
      }
    }
  }
`
