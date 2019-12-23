import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import People from "@material-ui/icons/People";
import Favorite from "@material-ui/icons/Favorite";
import Email from "@material-ui/icons/Email";
import CheckCircle from "@material-ui/icons/CheckCircle";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
//jss
import styles from "assets/jss/material-kit-react/views/loginPage.js";
import image from "assets/img/bg8.jpg";

import { get, postJSON } from "axiosSetting.js";
import useForm from "react-hook-form";

const useStyles = makeStyles(styles);

// eslint-disable-next-line no-useless-escape
const emailREG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const codeREG = /^[0-9]{6}$/;

const defalutCodeText = "SEND CODE";

const initialState = {
  nickname: "",
  email: "",
  code: "",
  password: "",
  repeatPassword: "",
  codeText: defalutCodeText,
  codeButtonDisabled: false,
  showPassword: false,
  showRepeatPassword: false
};

const registerReducer = (state, action) => {
  console.log(JSON.stringify(state));
  console.log(JSON.stringify(action));

  const { type, payload } = action;

  switch (type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [payload.key]: payload.value
      };
    case "TOGGLE_BUTTON":
      return {
        ...state,
        [payload.key]: !state[payload.key]
      };
    case "CODE_TEXT_CHANGE":
      return {
        ...state,
        codeButtonDisabled: payload === defalutCodeText ? false : true,
        codeText: payload
      };
    default:
      return state;
  }
};

export default function RegisterPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  const [state, dispatch] = React.useReducer(registerReducer, initialState);

  const { register, handleSubmit, errors } = useForm({ mode: "onBlur" });

  //处理input框onChange事件
  const handleChange = key => e => {
    dispatch({
      type: "INPUT_CHANGE",
      payload: { key: key, value: e.target.value }
    });
  };

  //处理toggle类型的button的onClick事件
  const handleToggle = key => () => {
    dispatch({ type: "TOGGLE_BUTTON", payload: { key: key } });
  };

  //注册
  const handleRegister = async () => {
    const { nickname, password, email, code } = state;

    const body = {
      nickname: nickname,
      email: email,
      code: code,
      password: password
    };

    let res = await postJSON("/api/user/register", body);
    if (res && res.code === 0) rest.history.push("/login");
  };

  //发送验证码请求,倒计时2分钟
  const handleSendCode = () => {
    if (errors.email) return;
    get("/api/user/sendCode", { email: state.email });

    let countdown = 120;
    const text = "s 重新发送";

    const timer = setInterval(() => {
      if (countdown > 0) {
        dispatch({ type: "CODE_TEXT_CHANGE", payload: countdown + text });
        countdown--;
      } else {
        clearInterval(timer);
        dispatch({ type: "CODE_TEXT_CHANGE", payload: defalutCodeText });
      }
    }, 1000);
  };

  //检查email是否被注册,为什么发送了3次，可能react-hook-form问题,onBlur重复检测有点问题
  const handleCheckEmail = async value => {
    let isRegistered = true;
    let res = await get("/api/user/check", { email: value });
    console.log(res);
    if (res && res.code === 0) isRegistered = false;
    return !isRegistered || "email has been registerd";
  };

  const handleCheckRepeatPassword = value => {
    let password = state.password || "";
    return value === password || "two passwords are not the same";
  };

  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="MeetHere"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(handleRegister)}
                >
                  <CardBody>
                    <h2 className={classes.cardTitle}>Register</h2>
                    <CustomInput
                      labelText="Nickname"
                      id="nickname"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={!!errors.nickname}
                      inputProps={{
                        type: "text",
                        placeholder: "用户昵称(不超过20位)",
                        name: "nickname",
                        inputRef: register({
                          required: "thie is required",
                          maxLength: {
                            value: 20,
                            message: "your nickname is too long"
                          }
                        }),
                        startAdornment: (
                          <InputAdornment position="start">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleChange("nickname")
                      }}
                      helperText={errors.nickname && errors.nickname.message} //配合inputRef的register
                    />
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={!!errors.email}
                      inputProps={{
                        type: "text",
                        placeholder: "电子邮箱",
                        name: "email",
                        inputRef: register({
                          required: "this is required",
                          pattern: {
                            value: emailREG,
                            message: "email is invalid"
                          },
                          validate: handleCheckEmail
                        }),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleChange("email")
                      }}
                      helperText={errors.email && errors.email.message}
                    />
                    <CustomInput
                      labelText="Code"
                      id="code"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={!!errors.code}
                      inputProps={{
                        type: "text",
                        placeholder: "6位数字验证码",
                        name: "code",
                        inputRef: register({
                          required: "this is required",
                          pattern: {
                            value: codeREG,
                            message: "code is invalid"
                          }
                        }),
                        startAdornment: (
                          <InputAdornment position="start">
                            <CheckCircle className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              className={classes.sendCode}
                              type="submit"
                              color="primary"
                              onClick={handleSendCode}
                              disabled={state.codeButtonDisabled}
                            >
                              {state.codeText}
                            </Button>
                          </InputAdornment>
                        ),
                        onChange: handleChange("code")
                      }}
                      helperText={errors.code && errors.code.message} //配合inputRef的register
                    />
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={!!errors.password}
                      inputProps={{
                        type: state.showPassword ? "text" : "password",
                        placeholder: "密码（6-16位数字、字母）",
                        name: "password",
                        inputRef: register({
                          required: "this is required",
                          minLength: {
                            value: 6,
                            message: "your password is too short"
                          },
                          maxLength: {
                            value: 16,
                            message: "your password is too long"
                          }
                        }),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleToggle("showPassword")}
                            >
                              {state.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: handleChange("password")
                      }}
                      helperText={errors.password && errors.password.message} //配合inputRef的register
                    />
                    <CustomInput
                      labelText="Repeat Password"
                      id="repeat-pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={!!errors.repeatPassword}
                      inputProps={{
                        type: state.showRepeatPassword ? "text" : "password",
                        placeholder: "重复密码",
                        name: "repeatPassword",
                        inputRef: register({
                          required: "this is required",
                          validate: handleCheckRepeatPassword
                        }),
                        startAdornment: (
                          <InputAdornment position="start">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleToggle("showRepeatPassword")}
                            >
                              {state.showRepeatPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: handleChange("repeatPassword")
                      }}
                      helperText={
                        errors.repeatPassword && errors.repeatPassword.message
                      } //配合inputRef的register
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button type="submit" color="primary" round>
                      <Favorite />
                      REGISTER
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
