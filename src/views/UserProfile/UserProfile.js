import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import avatar from "assets/img/faces/marc.jpg";

import { post, upload } from "axiosSetting.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  cardAvatarFileInput: {
    opacity: "0"
  }
};

const defaultUser = {
  role: "user",
  nickname: "游客",
  profile: avatar,
  email: "xxxxxx@xxx"
};

const useStyles = makeStyles(styles);

const createObjectURL = file => {
  if (window.URL) {
    return window.URL.createObjectURL(file);
  } else {
    return window.webkitURL.createObjectURL(file);
  }
};

//回收内存中的对象url
const revokeObjectURL = file => {
  if (window.URL) {
    return window.URL.revokeObjectURL(file);
  } else {
    return window.webkitURL.revokeObjectURL(file);
  }
};
//接收父组件basicLayout的user和setUser，保持状态同步
export default function UserProfile(props) {
  console.log(props);

  console.log(window.sessionStorage.getItem("token"));

  const userStorage = window.sessionStorage.getItem("user");

  const user = (userStorage && JSON.parse(userStorage)) || defaultUser;

  const initialState = {
    nickname: user.nickname,
    profile: user.profile,
    email: user.email
  };

  const userProfileReducer = (state, action) => {
    const { type, payload } = action;
    console.log(state);
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
  const [state, dispatch] = React.useReducer(userProfileReducer, initialState);

  const fileInputEL = React.useRef(null);

  const classes = useStyles();
  //通过a标签打开文件input
  const openProfileChooser = event => {
    event.preventDefault();
    fileInputEL.current.click();
  };

  //异步上传头像
  const handleUploadProfile = async event => {
    const file = event.target.files[0];
    if (file === undefined) return;

    let form = new FormData();
    form.append("file", file);
    const url = createObjectURL(file);
    console.log(url);
    dispatch({
      type: "INPUT_CHANGE",
      payload: { key: "profile", value: url || state.profile }
    });
    revokeObjectURL(file);

    let res = await upload("/api/user/uploadProfile", form);
    if (res && res.code === 0) {
      window.sessionStorage.setItem(
        "user",
        JSON.stringify({ ...user, profile: res.data })
      );
    }
  };

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#avatar" onClick={openProfileChooser}>
                <img src={state.profile} alt="..." />
              </a>
              <input
                ref={fileInputEL}
                className={classes.cardAvatarFileInput}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={handleUploadProfile}
              />
            </CardAvatar>
            <CardBody profile>
              <h3 className={classes.cardCategory}>WELCOME TO MEETHERE</h3>
              <h4 className={classes.cardTitle}>{state.nickname}</h4>
              <p className={classes.description}>{state.email}</p>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Email"
                    id="email"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      readOnly: true,
                      defaultValue: state.email
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Password"
                    id="password"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      readOnly: true,
                      defaultValue: "******"
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Nickname"
                    id="nickname"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      value: state.nickname
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
