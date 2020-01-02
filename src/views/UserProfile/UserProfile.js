import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomInput from "components/CustomInput/CustomInput.js";
// @material-ui/icons
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccessibleForwardIcon from "@material-ui/icons/AccessibleForward";
import LockIcon from "@material-ui/icons/Lock";
import EmailIcon from "@material-ui/icons/Email";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CustomDialog from "components/CustomDialog/CustomDialog.js";
import Button from "components/CustomButtons/Button.js";

import useForm from "react-hook-form";
//utils
import { createObjectURL, revokeObjectURL } from "utils/fileURL.js";
import { defaultUser } from "utils/defaultUtils.js";

import { get, post, upload } from "axiosSetting.js";

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
  },
  primaryText: {
    color: "#009688"
  },
  inputIconsColor: {
    color: "#495057"
  },
  sendCode: {
    marginBottom: ".925rem",
    marginRight: ".125rem"
  }
};

const codeREG = /^[0-9]{6}$/;

const defalutCodeText = "SEND CODE";

const useStyles = makeStyles(styles);

//接收父组件basicLayout的user和setUser，保持状态同步
export default function UserProfile() {
  //放在组件函数外面时可能读不到user项，原因未知
  const userStorage = window.sessionStorage.getItem("user");
  console.log(userStorage);
  const user = (userStorage && JSON.parse(userStorage)) || defaultUser;
  //修改nickname表单验证
  const {
    register: nicknameRegister,
    handleSubmit: handleNicknameSubmit,
    errors: nicknameErrors
  } = useForm({ mode: "onBlur" });
  //修改password表单验证
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    errors: passwordErrors
  } = useForm({ mode: "onBlur" });

  const initialState = {
    nickname: user.nickname,
    profile: user.profile,
    email: user.email,
    nicknameInput: "",
    codeInput: "",
    passwordInput: "",
    codeText: defalutCodeText,
    openNicknameDialog: false,
    openPasswordDialog: false,
    codeButtonDisabled: false,
    showPassword: false
  };

  const userProfileReducer = (state, action) => {
    const { type, payload } = action;
    console.log(state);
    console.log(action);
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
      case "OPEN_DIALOG":
        return {
          ...state,
          ["open" + payload + "Dialog"]: true
        };
      case "CLOSE_DIALOG":
        return {
          ...state,
          ["open" + payload + "Dialog"]: false
        };
      case "COMFIRM_NICKNAME_DIALOG":
        return {
          ...state,
          openNicknameDialog: false,
          nickname: state.nicknameInput
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = React.useReducer(userProfileReducer, initialState);

  //input file
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

  //处理input框onChange
  const handleChange = key => event =>
    dispatch({
      type: "INPUT_CHANGE",
      payload: { key: key, value: event.target.value }
    });

  const handleOpenDialog = dialog => () =>
    dispatch({ type: "OPEN_DIALOG", payload: dialog });

  const handleCloseDialog = dialog => () =>
    dispatch({ type: "CLOSE_DIALOG", payload: dialog });

  const handleModifyNickname = async data => {
    alert(data);
    dispatch({ type: "COMFIRM_NICKNAME_DIALOG" });
    const res = await post("/api/user/modifyNickname", {
      nickname: state.nicknameInput
    });
    //持久化
    if (res && res.code === 0) {
      window.sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          nickname: state.nicknameInput
        })
      );
    }

    //不重要，不反馈
  };

  const handleModifyPassword = async data => {
    alert(data);
    dispatch({ type: "CLOSE_DIALOG", payload: "Password" });
    const body = {
      code: state.codeInput,
      password: state.passwordInput
    };
    const res = await post("/api/user/modifyPassword", body);

    if (res && res.code === 0) {
      alert("修改密码成功");
    }
  };

  //处理toggle类型的button的onClick事件
  const handleToggle = key => () =>
    dispatch({ type: "TOGGLE_BUTTON", payload: { key: key } });

  //发送验证码请求,倒计时1分钟
  const handleSendCode = () => {
    get("/api/user/sendCode", { email: state.email });

    let countdown = 60;
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

  return (
    <div>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={10}>
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
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>我的信息</h4>
                </CardHeader>
                <CardBody>
                  <List component="div" role="list">
                    <ListItem button divider disabled role="listitem">
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary={state.email} />
                    </ListItem>
                    <ListItem
                      button
                      divider
                      role="listitem"
                      onClick={handleOpenDialog("Nickname")}
                    >
                      <ListItemIcon>
                        <AccessibleForwardIcon />
                      </ListItemIcon>
                      <ListItemText primary={state.nickname} />
                    </ListItem>
                    <ListItem
                      button
                      divider
                      role="listitem"
                      onClick={handleOpenDialog("Password")}
                    >
                      <ListItemIcon>
                        <LockIcon />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primaryText}
                        primary={"修改密码"}
                      />
                    </ListItem>
                  </List>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <CustomDialog
        open={state.openNicknameDialog}
        titleText="Edit"
        onClose={handleCloseDialog("Nickname")}
        form
        onSubmit={handleNicknameSubmit(handleModifyNickname)}
        content={
          <CustomInput
            labelText="Nickname"
            id="nickname"
            formControlProps={{
              fullWidth: true
            }}
            error={!!nicknameErrors.nickname}
            inputProps={{
              type: "text",
              placeholder: "新昵称(不超过20位)",
              name: "nickname",
              inputRef: nicknameRegister({
                required: "thie is required",
                maxLength: {
                  value: 20,
                  message: "your nickname is too long"
                }
              }),
              onChange: handleChange("nicknameInput")
            }}
            helperText={
              nicknameErrors.nickname && nicknameErrors.nickname.message
            } //配合inputRef的register
          />
        }
      />
      <CustomDialog
        onClose={handleCloseDialog("Password")}
        open={state.openPasswordDialog}
        titleText="Edit"
        form
        onSubmit={handlePasswordSubmit(handleModifyPassword)}
        content={
          <div>
            <CustomInput
              labelText="Code"
              id="code"
              formControlProps={{
                fullWidth: true
              }}
              error={!!passwordErrors.code}
              inputProps={{
                type: "text",
                placeholder: "6位数字验证码",
                name: "code",
                inputRef: passwordRegister({
                  required: "this is required",
                  pattern: {
                    value: codeREG,
                    message: "code is invalid"
                  }
                }),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      className={classes.sendCode}
                      color="primary"
                      onClick={handleSendCode}
                      disabled={state.codeButtonDisabled}
                    >
                      {state.codeText}
                    </Button>
                  </InputAdornment>
                ),
                onChange: handleChange("codeInput")
              }}
              helperText={passwordErrors.code && passwordErrors.code.message} //配合inputRef的register
            />
            <CustomInput
              labelText="Password"
              id="pass"
              formControlProps={{
                fullWidth: true
              }}
              error={!!passwordErrors.password}
              inputProps={{
                type: state.showPassword ? "text" : "password",
                placeholder: "密码（6-16位数字、字母）",
                name: "password",
                inputRef: passwordRegister({
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
                      {state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
                autoComplete: "off",
                onChange: handleChange("passwordInput")
              }}
              helperText={
                passwordErrors.password && passwordErrors.password.message
              } //配合inputRef的register
            />
          </div>
        }
      />
    </div>
  );
}
