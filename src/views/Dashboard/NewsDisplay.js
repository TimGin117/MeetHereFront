import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import InputAdornment from "@material-ui/core/InputAdornment";
import Avatar from "@material-ui/core/Avatar";

import "braft-editor/dist/index.css";
import { get, postJSON } from "axiosSetting.js";
//utils
import { timestampFormat } from "utils/timeUtils.js";
import useForm from "react-hook-form";
import { post } from "axiosSetting";

const styles = {
  news: {
    fontFamily:
      "PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Arial,sans-serif "
  },
  header: {
    fontWeight: "700"
  },
  subHeader: {
    color: "#777",
    fontSize: "13px",
    marginTop: "-25px"
  },
  content: {
    fontWeight: "450"
  },
  replyTextButton: {
    cursor: "pointer",
    color: "#406599",
    fontSize: "14px",
    fontWeight: "500"
  },
  deleteTextButton: {
    cursor: "pointer",
    color: "red",
    fontSize: "14px",
    fontWeight: "500"
  },
  nickname: {
    color: "#406599",
    fontSize: "13px"
  },
  nameText: {
    color: "#222",
    fontSize: "14px"
  },
  reply: {
    color: "#222",
    fontSize: "16px"
  }
};

const useStyles = makeStyles(styles);

const initialState = {
  commentSet: [],
  replyName: "",
  commentId: "",
  showReply: false
};

function search(key, value, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][key] === value) return i;
  }
}

const displayReducer = (state, action) => {
  const { type, payload } = action;
  console.log(type);
  console.log(payload);
  switch (type) {
    case "GET_COMMENT":
      return {
        ...state,
        commentSet: payload
      };
    case "FOCUS_COMMENT":
      return {
        ...state,
        showReply: false
      };
    case "CLICK_REPLY":
      return {
        ...state,
        showReply: true,
        replyName: payload.replyName,
        commentId: payload.commentId
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        commentSet: state.commentSet.filter(data => data.commentId !== payload)
      };
    case "SUBMIT_COMMENT":
      return {
        ...state,
        commentSet: [...state.commentSet, payload]
      };
    case "SUBMIT_REPLY":
      var index = search("commentId", payload.parentId, state.commentSet);
      var newCommentSet = [...state.commentSet];
      newCommentSet.splice(index + 1, 0, payload);
      return {
        ...state,
        showReply: false,
        commentSet: newCommentSet
      };
    default:
      return state;
  }
};

export default function NewsDisplay({ history, location }) {
  const userStorage = window.sessionStorage.getItem("user");
  const user = userStorage && JSON.parse(userStorage);

  const classes = useStyles();

  const {
    register: replyRegister,
    handleSubmit: handleReplySubmit,
    errors: replyErrors
  } = useForm();
  const {
    register: commentRegister,
    handleSubmit: handleCommentSubmit,
    errors: commentErrors
  } = useForm();

  const [state, dispatch] = React.useReducer(displayReducer, initialState);

  const { newsId, content, title, nickname, updateTime } = location.state;

  const nicknameAndTime = `${nickname}${"   "}${timestampFormat(updateTime)}`;

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await get("/api/news/one", { newsId: newsId });
      if (res && res.code === 0) {
        dispatch({ type: "GET_COMMENT", payload: res.data.comment });
      }
    };
    fetchData();
  }, [newsId]);

  const handleClickReply = (nickname, commentId) => () => {
    dispatch({
      type: "CLICK_REPLY",
      payload: { replyName: nickname, commentId: commentId }
    });
  };

  const handleClickDelete = commentId => async () => {
    const res = await post("/api/news/deleteComment", { commentId: commentId });

    if (res && res.code === 0) {
      dispatch({
        type: "DELETE_COMMENT",
        payload: commentId
      });
    }
  };

  const handleComment = async data => {
    const body = {
      newsId: newsId,
      parentId: "",
      parentName: "",
      content: data.comment,
      profile: user.profile
    };
    const res = await postJSON("/api/news/addComment", body);
    if (res && res.code === 0) {
      dispatch({ type: "SUBMIT_COMMENT", payload: res.data });
    }
  };

  const handleReply = async data => {
    const body = {
      newsId: newsId,
      parentId: state.commentId,
      parentName: state.replyName,
      profile: user.profile,
      content: data.reply
    };
    const res = await postJSON("/api/news/addComment", body);
    if (res && res.code === 0) {
      dispatch({ type: "SUBMIT_REPLY", payload: res.data });
    }
  };

  var commentList = (
    <React.Fragment>
      {state.commentSet.map(data => {
        const isReply = data.parentId !== null && data.parentId !== "";
        return (
          <ListItem key={data.commentId} divider>
            <ListItemAvatar>
              <Avatar src={data.profile} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <div>
                  <span className={classes.nickname}>{data.nickname}</span>
                  {isReply ? (
                    <span>
                      <span className={classes.nameText}>
                        &nbsp;&nbsp;回复&nbsp;&nbsp;
                      </span>
                      <span className={classes.nickname}>
                        {data.parentName}
                      </span>
                    </span>
                  ) : null}
                </div>
              }
              secondary={<span className={classes.reply}>{data.content}</span>}
            />
            <ListItemSecondaryAction>
              {user.email === data.email ? (
                <span
                  className={classes.deleteTextButton}
                  onClick={handleClickDelete(data.commentId)}
                >
                  删除
                </span>
              ) : (
                <span
                  className={classes.replyTextButton}
                  onClick={handleClickReply(data.nickname, data.commentId)}
                >
                  回复
                </span>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </React.Fragment>
  );

  var replyPlaceholder = `回复${state.replyName}:`;

  if (location.state === undefined) return <Redirect to="/user/dashboard" />;

  return (
    <React.Fragment>
      <GridContainer className={classes.news}>
        <GridItem xs={12} sm={12} md={10}>
          <h2 className={classes.header}>{title}</h2>
          <div className={classes.subHeader}>{nicknameAndTime}</div>
          <div
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <List>
            <form onSubmit={handleCommentSubmit(handleComment)}>
              <ListItem divider>
                <ListItemAvatar>
                  <Avatar src={user.profile} />
                </ListItemAvatar>

                <TextField
                  id="comment"
                  label="评论"
                  multiline
                  fullWidth
                  rows="3"
                  error={!!commentErrors.comment}
                  placeholder="写下您的评论..."
                  variant="outlined"
                  InputProps={{
                    type: "text",
                    name: "comment",
                    onFocus: () => dispatch({ type: "FOCUS_COMMENT" }),
                    endAdornment: (
                      <InputAdornment position="start">
                        <Button type="submit" color="primary">
                          评论
                        </Button>
                      </InputAdornment>
                    )
                  }}
                  inputRef={commentRegister({
                    required: "评论不能为空"
                  })}
                  helperText={
                    commentErrors.comment && commentErrors.comment.message
                  }
                />
              </ListItem>
            </form>
            {commentList}
            {state.showReply ? (
              <form onSubmit={handleReplySubmit(handleReply)}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={user.profile} />
                  </ListItemAvatar>
                  <TextField
                    id="reply"
                    label="回复"
                    autoFocus
                    multiline
                    fullWidth
                    rows="3"
                    error={!!replyErrors.reply}
                    placeholder={replyPlaceholder}
                    variant="outlined"
                    InputProps={{
                      name: "reply",
                      type: "text",
                      endAdornment: (
                        <InputAdornment position="start">
                          <Button type="submit" color="primary">
                            回复
                          </Button>
                        </InputAdornment>
                      )
                    }}
                    inputRef={replyRegister({
                      required: "回复不能为空"
                    })}
                    helperText={replyErrors.reply && replyErrors.reply.message}
                  />
                </ListItem>
              </form>
            ) : null}
          </List>
        </GridItem>
      </GridContainer>
    </React.Fragment>
  );
}

NewsDisplay.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
};
