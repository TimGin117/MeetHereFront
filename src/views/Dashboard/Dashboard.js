import React from "react";
import PropTypes from "prop-types";
//core
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
//components
import Muted from "components/Typography/Muted.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Pagination from "components/Pagination/Pagination.js";
import BraftEditor from "braft-editor";
import useForm from "react-hook-form";
//icon
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import UpdateIcon from "@material-ui/icons/Update";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import CanCelIcon from "@material-ui/icons/Cancel";
//utils
import { defaultUser } from "utils/defaultUtils.js";
import { timestampFormat } from "utils/timeUtils.js";
import { get, postJSON } from "axiosSetting.js";
//css
import bg1 from "assets/img/bg.jpg";
import bg2 from "assets/img/bg2.jpg";
import bg3 from "assets/img/bg3.jpg";
import bg4 from "assets/img/bg4.jpg";
import bg5 from "assets/img/bg7.jpg";

//取模装作新闻图片
const images = [bg1, bg2, bg3, bg4, bg5];

const styles = {
  form: {
    maxWidth: "850px",
    height: "80%",
    margin: "20px 80px 20px 80px"
  },
  image: {
    margin: "10px",
    width: "100%",
    height: "85%"
  },
  authorName: {
    color: "#999",
    fontSize: "13px"
  },
  stats: {
    color: "#999",
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "6px",
      marginLeft: "6px",
      marginBottom: "8px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  title: {
    fontWeight: "600"
  },
  titleInput: {
    marginLeft: "10px"
  },
  drawerButton: {
    width: "40%",
    marginTop: "20px",
    marginRight: "15px",
    marginBottom: "10px"
  },
  publishNewsButton: {
    marginTop: "-50px",
    marginRight: "6px"
  },
  newsCard: {
    marginBottom: "10px"
  }
};

const useStyles = makeStyles(styles);

const initialState = {
  open: false,
  title: "",
  pageNum: 1,
  isFirstPage: true,
  isLastPage: true,
  list: [],
  editorState: BraftEditor.createEditorState(null),
  newsId: "" //编辑
};

const dashBoardReducer = (state, action) => {
  console.log(action);
  console.log(state);
  const { type, payload } = action;
  switch (type) {
    case "INPUT_CHANGE":
      return {
        ...state,
        [payload.key]: payload.value
      };
    case "EDITOR_CHANGE":
      return {
        ...state,
        editorState: payload
      };
    case "OPEN_POST_DRAWER":
      return {
        ...state,
        title: "",
        newsId: "",
        editorState: BraftEditor.createEditorState(null),
        open: true
      };
    case "OPEN_EDIT_DRAWER":
      return {
        ...state,
        title: payload.title,
        newsId: payload.newsId,
        editorState: BraftEditor.createEditorState(payload.content),
        open: true
      };
    case "CLOSE_DRAWER":
      return {
        ...state,
        open: false
      };
    case "PAGE_CHANGE":
      return {
        ...state,
        list: payload.list,
        isFirstPage: payload.isFirstPage,
        isLastPage: payload.isLastPage,
        pageNum: payload.pageNum
      };
    case "DELETE_NEWS":
      return {
        ...state,
        list: state.list.filter(data => data.newsId !== payload.newsId)
      };
    default:
      return state;
  }
};

export default function Dashboard(props) {
  const userStorage = window.sessionStorage.getItem("user");
  const user = (userStorage && JSON.parse(userStorage)) || defaultUser;
  const { role } = user;
  const isAdmin = role === "admin";

  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const [state, dispatch] = React.useReducer(dashBoardReducer, initialState);
  const editorInstance = React.useRef(null);

  //只在list改变时触发
  React.useEffect(() => {
    async function fetchData() {
      const res = await get("/api/news/all");
      if (res && res.code === 0) {
        const { pageNum, list, isFirstPage, isLastPage } = res.data;
        dispatch({
          type: "PAGE_CHANGE",
          payload: { pageNum, list, isFirstPage, isLastPage }
        });
      }
    }
    fetchData();
  }, []);

  const handleEditButton = data => event => {
    //阻止冒泡
    event.stopPropagation();
    const { title, content, newsId } = data;
    dispatch({ type: "OPEN_EDIT_DRAWER", payload: { title, content, newsId } });
  };
  const handlePostButton = () => {
    dispatch({ type: "OPEN_POST_DRAWER" });
  };

  const handleDeleteButton = newsId => event => {
    event.stopPropagation();
    dispatch({ type: "DELETE_NEWS", payload: { newsId } });
  };

  const handleChange = key => event => {
    dispatch({
      type: "INPUT_CHANGE",
      payload: { key: key, value: event.target.value }
    });
  };

  const handleEditorChange = editorState =>
    dispatch({
      type: "EDITOR_CHANGE",
      payload: editorState
    });

  const handleCloseButton = () => {
    dispatch({ type: "CLOSE_DRAWER" });
  };

  const handlePublishNews = async () => {
    if (state.editorState.isEmpty()) {
      editorInstance.current.requestFocus();
      return;
    }
    dispatch({ type: "CLOSE_DRAWER" });

    if (state.newsId === "") {
      const body = {
        title: state.title,
        content: state.editorState.toHTML()
      };
      await postJSON("/api/news/addNews", body);
    } else {
      const body = {
        newsId: state.newsId,
        title: state.title,
        content: state.editorState.toHTML()
      };
      await postJSON("/api/news/updateNews", body);
    }
    alert("发布成功");
  };

  const handleNewsDisplay = newsId => () => {
    props.history.push({
      pathname: "/user/display",
      state: { newsId: newsId }
    });
  };

  const handleNextPage = async () => {
    if (state.isLastPage === false) {
      const nextPage = await get("/api/news/all", {
        page: state.pageNum + 1
      });
      if (nextPage && nextPage.code === 0) {
        const { pageNum, list, isFirstPage, isLastPage } = nextPage.data;
        dispatch({
          type: "PAGE_CHANGE",
          payload: { pageNum, list, isFirstPage, isLastPage }
        });
      }
    } else {
      alert("已经是最后一页了");
    }
  };

  const handlePrevPage = async () => {
    if (state.isFirstPage === false) {
      const prevPage = await get("/api/news/all", {
        page: state.pageNum - 1
      });
      if (prevPage && prevPage.code === 0) {
        const { pageNum, list, isFirstPage, isLastPage } = prevPage.data;
        dispatch({
          type: "PAGE_CHANGE",
          payload: { pageNum, list, isFirstPage, isLastPage }
        });
      }
    } else {
      alert("已经是第一页了");
    }
  };

  var newsList = (
    <GridContainer>
      {state.list.map((data, key) => {
        return (
          <GridItem key={data.newsId} xs={12} sm={12} md={10}>
            <Card className={classes.newsCard}>
              <CardActionArea onClick={handleNewsDisplay(data.newsId)}>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                    <CardMedia
                      className={classes.image}
                      image={images[key % 5]}
                    />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <CardHeader
                      action={
                        isAdmin ? (
                          <React.Fragment>
                            <IconButton onClick={handleEditButton(data)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={handleDeleteButton(data.newsId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </React.Fragment>
                        ) : null
                      }
                      title={data.title}
                      subheader={
                        <p className={classes.authorName}>
                          作者：{data.nickname}
                        </p>
                      }
                    />
                    <CardActions className={classes.stats}>
                      <UpdateIcon />
                      更新于 {timestampFormat(data.updateTime)}
                    </CardActions>
                  </GridItem>
                </GridContainer>
              </CardActionArea>
            </Card>
          </GridItem>
        );
      })}
    </GridContainer>
  );

  return (
    <React.Fragment>
      {newsList}
      <Drawer anchor="right" open={state.open} onClose={handleCloseButton}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(handlePublishNews)}
        >
          <GridContainer>
            <GridItem xs={9} sm={9} md={9}>
              <h3 className={classes.title}>发布新闻</h3>
            </GridItem>
            <GridItem xs={3} sm={3} md={3}>
              <Button
                className={classes.drawerButton}
                type="submit"
                color="primary"
              >
                <LibraryBooks />
                发布
              </Button>
              <Button
                className={classes.drawerButton}
                color="danger"
                onClick={handleCloseButton}
              >
                <CanCelIcon />
                关闭
              </Button>
            </GridItem>
          </GridContainer>

          <Divider />
          <CustomInput
            labelText="新闻标题"
            id="title"
            formControlProps={{
              fullWidth: true
            }}
            className={classes.titleInput}
            error={!!errors.title}
            inputProps={{
              type: "text",
              placeholder: "新闻标题",
              name: "title",
              inputRef: register({
                required: "thie is required"
              }),
              value: state.title,
              onChange: handleChange("title")
            }}
            helperText={errors.nickname && errors.nickname.message} //配合inputRef的register
          />
          <BraftEditor
            placeholder="请输入正文"
            value={state.editorState}
            onChange={handleEditorChange}
            ref={editorInstance}
          />
        </form>
      </Drawer>
      <GridContainer>
        <GridItem xs={10} sm={10} md={10}>
          <GridContainer justify="center">
            <Pagination
              pages={[
                { text: "prev", onClick: handlePrevPage },
                {
                  text: state.pageNum,
                  active: true,
                  onClick: e => e.preventDefault()
                },
                { text: "next", onClick: handleNextPage }
              ]}
              color="primary"
            ></Pagination>
          </GridContainer>
        </GridItem>
      </GridContainer>

      <GridItem xs={10} sm={10} md={10}>
        <GridContainer justify="flex-end">
          {isAdmin ? (
            <Button
              className={classes.publishNewsButton}
              color="primary"
              onClick={handlePostButton}
            >
              发布新闻
            </Button>
          ) : null}
        </GridContainer>
      </GridItem>
    </React.Fragment>
  );
}

Dashboard.propTypes = {
  history: PropTypes.object
};
