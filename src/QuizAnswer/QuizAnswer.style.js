import styled from 'styled-components'

var grey = '#a59e9e14'
var borderColor = '#00000042'
var primaryColor = '#7e8ac7'
var darkgrey = '#c7c7c7'
var selectGreen = '#3ab781'
// var secondaryColor = '#7e8ac799'

export const QuizAnswerStyle = styled.div`

body {
  font-family: "Poppins", sans-serif;
  background: rgb(244, 244, 253);
  min-width: unset !important;
  overflow-y: scroll;
  height: unset;

  // overflow-y: auto;
}
  .quiz-section-card {
    position: relative;
    height: 46pc;
    // overflow-y:hidden;
    .bg-blue {
      background-color: ${primaryColor};
      padding: 10px;
      height: 16pc;
    }

    .bg-grey {
      background-color: ${grey};
      padding: 10px;
      height: 31pc;
    }
  }

  .quiz-card {
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: 40%;
    padding: 40px;
    margin: auto;
    min-height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;


    .quiz-img{
      padding:10px;
      margin-bottom:20px;
      width:100%;
    }
    .quiz-btn {
      margin-top: 40px;
      padding: 5px 15px;
      border-radius: 5px;
    }

    .primary-btn{
      float: right;
      background-color:  ${primaryColor};
      border-color:  ${primaryColor};
      color: #fff;

    }
    .primary-btn:hover{
      background-color: #6874af;
      color: #fff;
    }
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
    min-height:327px;
  }

  .countdown-content {
    background: ${darkgrey};
    padding: 10px;
    border-radius: 20px;
    width: 50%;
    color: white;
    position: absolute;
    top: -16px;
    right: 25%;
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

    // .fileupload-section {
    //   border: 3px dotted ${borderColor};
    //   border-radius: 5px;
    //   height:150px;
    //   display: flex;
    //   width: 100%;
    //   padding: 10px;
    // }



    .textarea-section {
      border: 1px solid ${borderColor};
      border-radius: 5px;
      resize: none;
      width: 100%;
      height: 100px;
    }

    .quiz-btn {
      margin-top: 40px;
      padding: 5px 15px;
      border-radius: 5px;
    }


  

    .secondary-btn {
      border-color: ${primaryColor};
      color: ${primaryColor};
      float:left;
      background-color:#fff;
  }

  .secondary-btn:hover{
    background-color: ${grey};
    color:${primaryColor};
  }
    }

    .radio-btn {
    

      .radio-custom {
        opacity: 0;
        position: absolute;   
      }
      .radio-custom, .radio-custom-label {
        display: inline-block;
        vertical-align: middle;
        margin: 5px;
        cursor: pointer;
        border: 2px solid ${borderColor};
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 15px;
            text-align:initial;
            width:100%;



      }

      .radio-custom-label {
        position: relative;
      }

      .radio-custom + .radio-custom-label:before {
        content: '';
        background: #fff;
        border: 2px solid #ddd;
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        padding: 2px;
        margin-right: 10px;
        text-align: center;
      }



      .radio-custom + .radio-custom-label:before {
        border-radius: 50%;
      }

      .radio-custom:checked + .radio-custom-label:before {
        background: #ccc;
        box-shadow: inset 0px 0px 0px 4px #fff;
         background-color:${selectGreen};

         
      }


      .radio-custom:focus + .radio-custom-label {
      }


      .checked-radio{
        border: 2px solid ${selectGreen};

      }

     

      // input {
      //   margin-right: 10px;
      // }
    }
  }
`
