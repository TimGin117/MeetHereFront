import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg8.jpg";
import { postJSON } from "axiosSetting.js";

const useStyles = makeStyles(styles);

const initialState = {
  email: "",
  password: ""
};

const loginReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [payload.key]: payload.value
      };
    default:
      return state;
  }
};

export default function LoginPage(props) {
  const [state, dispatch] = React.useReducer(loginReducer, initialState);

  //返回登陆页清除sessionStorage
  React.useEffect(() => window.sessionStorage.clear());

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const { ...rest } = props;

  const handleChange = prop => e => {
    dispatch({
      type: "INPUT_CHANGE",
      payload: { key: prop, value: e.target.value }
    });
  };

  const handleLogin = async () => {
    const body = {
      email: state.email,
      password: state.password
    };
    let res = await postJSON("/api/user/login", body);

    if (res && res.code === 0) {
      //保存token
      const { token, ...restData } = res.data;
      window.sessionStorage.setItem("token", token);
      window.sessionStorage.setItem("user", JSON.stringify(restData));
      rest.history.push("/user");
    }
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
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h3>登录</h3>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="电子邮箱"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        onChange: handleChange("email")
                      }}
                    />
                    <CustomInput
                      labelText="密码"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        onChange: handleChange("password")
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      onClick={handleLogin}
                    >
                      开始
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
