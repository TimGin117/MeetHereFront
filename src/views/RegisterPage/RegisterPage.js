import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import People from "@material-ui/icons/People";
import Favorite from "@material-ui/icons/Favorite";
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

import axios from "axios";
import useForm from "react-hook-form";

const useStyles = makeStyles(styles);

const baseURL = "http://localhost:3000/auth/user/register";

const initialState = {
  username: "",
  password: "",
  repeatPassword: "",
  showPassword: false,
  showRepeatPassword: false
};

const registerReducer = (state, action) => {
  console.log(JSON.stringify(state));
  console.log(JSON.stringify(action));

  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [action.prop]: action.payload
      };
    case "TOGGLE_BUTTON":
      return {
        ...state,
        [action.prop]: !state[action.prop]
      };
    default:
      return state;
  }
};

//TODO:增加helperText
export default function RegisterPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  const [state, dispatch] = React.useReducer(registerReducer, initialState);

  const { register, handleSubmit, errors } = useForm();

  //处理input框onChange事件
  const handleChange = prop => e => {
    dispatch({ type: "INPUT_CHANGE", payload: e.target.value, prop: prop });
  };

  //处理toggle类型的button的onClick事件
  const handleToggle = prop => () => {
    dispatch({ type: "TOGGLE_BUTTON", prop: prop });
  };

  const handleRegister = () => {
    const { username, password } = state;

    const body = {
      username: username,
      password: password
    };

    axios.post(baseURL, body).then(res => {
      console.log(JSON.stringify(res));
      rest.history.push("/login");
    });
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
                      labelText="Username"
                      id="username"
                      formControlProps={{
                        fullWidth: true
                      }}
                      error={!!errors.username}
                      inputProps={{
                        type: "text",
                        name: "username",
                        inputRef: register({
                          required: true,
                          minLength: 1,
                          maxLength: 16
                        }),
                        startAdornment: (
                          <InputAdornment position="start">
                            <People className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleChange("username")
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: state.showPassword ? "text" : "password",
                        name: "password",
                        inputRef: register({
                          required: true,
                          minLength: 8,
                          maxLength: 16
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
                    />
                    <CustomInput
                      labelText="Repeat Password"
                      id="repeat-pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: state.showRepeatPassword ? "text" : "password",
                        name: "repeatPassword",
                        inputRef: register({
                          required: true,
                          minLength: 8,
                          maxLength: 16
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
