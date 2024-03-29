import styled from 'styled-components'
var titleColor = '#444343'
var contentColor = '#4a4a4a'
var backgroundColor = '#f1f1f1b5'
var iconColor = '#6f6f6f'
var borderColor = '#c7c7c78c'
var white = '#fff'
var primaryColor = ' #2092A5'
var blockShadow = ' 0 2px 40px 0 #48474712'
var sectionShodow = '#ababab33 0px 4px 30px -1px, #0000000f 0px 2px 4px -1px'
var deleteColor = '#f53335'
// var secondaryBtnColor = '#d0d0d0'
export const Quizstyle = styled.div`
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  label {
    margin: 0 !important;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .main_btn {
    border: none;
    border-radius: 25px;
    background: ${primaryColor};
    color: ${white};
    padding: 7px 20px;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      cursor: pointer;
    }
  }

  .bg_delete {
    background: ${deleteColor};
  }

  .delete {
    color: ${deleteColor};
  }

  .gray_bg {
    background: #e2e2e2;
    color: ${titleColor};
  }

  .secondary_btn {
    background: ${backgroundColor};
    color: ${titleColor};
  }

  .btn_icon {
    height: 40px;
    width: 40px;
    border: none;
    border-radius: 50%;
    background: ${backgroundColor};
    color: ${titleColor};
  }

  .choose-btn {
    width: 40%;
    background-color: white;
    border-radius: 10px;
    padding: 5px 10px;
    border: 2px solid ${primaryColor};
  }
  .option_btn {
    border: none;
    background: transparent;
    color: ${primaryColor};
    font-weight: 500;
    display: flex;
    align-items: center;
    font-size: 14px;

    .option_icon {
      font-size: 18px;
      margin-left: 5px;
    }

    &:hover {
      cursor: pointer;
    }
  }

  .bg_none {
    background: transparent;
  }

  .bg_save {
    background: #00a025;
  }

  .mg-t {
    margin-top: 20px;
  }

  .btn_block {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
      margin-left: 10px;
    }
  }

  .content {
    font-size: 14px;
    color: ${contentColor};
    font-weight: 600;
  }

  .affix {
    top: 0;
    width: 100%;
    z-index: 9999 !important;
  }

  .affix {
    padding-top: 70px;
  }

  .quiz {
    padding: 40px 0;
    .input_field {
      width: 100%;
      border-radius: 5px;
      border: 1px solid ${borderColor};
      padding: 7px 15px;
      color: ${contentColor};
      font-size: 14px;

      &:focus {
        outline: unset;
      }
    }
    .quiz_content {
      background: ${white};
      padding: 10px 0;
      .quiz_content_input_block {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 10px;

        .quiz_content_input {
          width: 40%;
        }
        .btn_block {
          button {
            margin: 0;
          }
        }
      }

      .quiz_content_check_block {
        display: flex;

        .quiz_content_check {
          margin-right: 20px;

          .content {
            padding-right: 5px;
          }
        }
      }
    }

    .question_section {
      background: ${backgroundColor};
      padding: 40px;
      box-shadow: ${sectionShodow};
      margin: 40px 0;
      border-radius: 5px;

      .question_icon {
        color: ${iconColor};
        margin-right: 10px;
        font-size: 22px;
      }

      .qustion_title_block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        .question_title {
          font-size: 18px;
          font-weight: 700;
          color: ${titleColor};
        }

        .question_duration {
          display: flex;
          align-items: center;
        }

        .question_title_right {
          display: flex;

          .input_field {
            max-width: 65px;
            padding: 3px 10px;
            margin: 0 20px 0 10px;
          }
          .btn_icon {
            height: unset;
            width: unset;
          }
        }
      }

      .question_title_input {
        margin: 10px 0 15px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .input_field {
          width: 85%;
        }

        .mg-r {
          margin-right: 20px !important;
        }
      }

      .question_block {
        margin: 12px 0;
        display: flex;
        align-items: center;

        .input_field {
          width: 70%;
        }

        .quuiz_number {
          padding: 0 20px;
        }

        .question_block_content {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: ${white};
          padding: 15px 15px 15px 23px;
          border-radius: 5px;
          box-shadow: ${blockShadow};
          position: relative;

          .question_block_boredr {
            position: absolute;
            height: 80%;
            top: 0;
            left: 0;
            margin: 8px;
            border-left: 3px solid ${primaryColor};
          }
        }

        input[type='radio'] {
          border: 1px solid ${primaryColor};
          padding: 10px;
        }
      }

      input[type='file'] {
        display: none;
      }
    }
  }
`
