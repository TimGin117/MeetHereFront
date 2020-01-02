import React from "react";
//
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Rating from "@material-ui/lab/Rating";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "components/CustomButtons/Button.js";
import CustomDialog from "components/CustomDialog/CustomDialog.js";
//
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Pagination from "components/Pagination/Pagination.js";
import { get, postJSON } from "axiosSetting.js";
import { easyFormat } from "utils/timeUtils.js";
import useForm from "react-hook-form";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  scoreFormControl: {
    marginBottom: "30px",
    marginLeft: "10px",
    width: "50%",
    minWidth: "35px"
  },
  myRating: {
    marginTop: "20px"
  }
}));

const initialCommentForm = {
  orderId: "",
  score: 5,
  comment: "默认好评"
};

const initialState = {
  open: false,
  commentForm: initialCommentForm,
  pageNum: 1,
  isFirstPage: true,
  isLastPage: true,
  list: [] //订单列表
};

const userManagementReducer = (state, action) => {
  console.log(action);
  console.log(state);
  const { type, payload } = action;
  switch (type) {
    case "PAGE_CHANGE":
      return {
        ...state,
        list: payload.list,
        isFirstPage: payload.isFirstPage,
        isLastPage: payload.isLastPage,
        pageNum: payload.pageNum
      };
    case "CLOSE_DIALOG":
      return {
        ...state,
        open: false
      };
    case "OPEN_DIALOG":
      return {
        ...state,
        open: true,
        commentForm: Object.assign(
          {},
          { ...state.commentForm, orderId: payload }
        )
      };
    case "RATING_CHANGE":
      return {
        ...state,
        commentForm: Object.assign({}, { ...state.commentForm, score: payload })
      };
    case "COMMENT_ORDER":
      return {
        ...state,
        list: state.list.map(data => {
          if (data.orderId === payload.orderId)
            return {
              ...data,
              valid: true,
              comment: payload.comment,
              score: payload.score
            };
          else return data;
        })
      };
    default:
      return state;
  }
};

export default function AllOrder() {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(
    userManagementReducer,
    initialState
  );

  const { register, handleSubmit, errors } = useForm();

  React.useEffect(() => {
    async function fetchData() {
      const res = await get("/api/order/myPastOrder");
      console.log(res.data);
      if (res && res.code === 0) {
        const { pageable, content, first, last } = res.data;
        dispatch({
          type: "PAGE_CHANGE",
          payload: {
            pageNum: pageable.pageNumber + 1,
            list: content,
            isFirstPage: first,
            isLastPage: last
          }
        });
      }
    }
    fetchData();
  }, []);

  const handleNextPage = async () => {
    if (state.isLastPage === false) {
      const nextPage = await get("/api/order/myPastOrder", {
        page: state.pageNum + 1
      });
      if (nextPage && nextPage.code === 0) {
        const { pageable, content, first, last } = nextPage.data;
        dispatch({
          type: "PAGE_CHANGE",
          payload: {
            pageNum: pageable.pageNumber + 1,
            list: content,
            isFirstPage: first,
            isLastPage: last
          }
        });
      }
    } else {
      alert("已经是最后一页了");
    }
  };

  const handlePrevPage = async () => {
    if (state.isFirstPage === false) {
      const prevPage = await get("/api/order/myPastOrder", {
        page: state.pageNum - 1
      });
      if (prevPage && prevPage.code === 0) {
        const { pageable, content, first, last } = prevPage.data;
        dispatch({
          type: "PAGE_CHANGE",
          payload: {
            pageNum: pageable.pageNumber + 1,
            list: content,
            isFirstPage: first,
            isLastPage: last
          }
        });
      }
    } else {
      alert("已经是第一页了");
    }
  };

  const handleOpenDialog = orderId => () => {
    dispatch({ type: "OPEN_DIALOG", payload: orderId });
  };
  const handleCloseDialog = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };

  const handleRatingChange = event => {
    dispatch({ type: "RATING_CHANGE", payload: event.target.value });
  };

  const handleCommentOrder = async data => {
    dispatch({ type: "CLOSE_DIALOG" });
    const body = {
      comment: data.comment,
      score: state.commentForm.score,
      orderId: state.commentForm.orderId
    };
    const res = await postJSON("/api/order/comment", body);
    if (res && res.code === 0) {
      dispatch({ type: "COMMENT_ORDER", payload: { ...body } });
      alert("评价成功");
    }
  };

  const [value, setValue] = React.useState(2);
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <List
            subheader={<ListSubheader>订单管理</ListSubheader>}
            className={classes.root}
          >
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>订单号码</TableCell>
                  <TableCell align="left">预约场馆</TableCell>
                  <TableCell align="left">运动场地</TableCell>
                  <TableCell align="left">开始时间</TableCell>
                  <TableCell align="left">结束时间</TableCell>
                  <TableCell align="left">订单评价</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.list.map(data => (
                  <TableRow key={data.orderId}>
                    <TableCell component="th" scope="row">
                      {data.orderId}
                    </TableCell>
                    <TableCell align="left">{data.gym.name}</TableCell>
                    <TableCell align="left">{data.gym.address}</TableCell>
                    <TableCell align="left">
                      {easyFormat(data.startTime)}
                    </TableCell>
                    <TableCell align="left">
                      {easyFormat(data.endTime)}
                    </TableCell>
                    <TableCell align="left">
                      {data.valid ? (
                        <React.Fragment>
                          <Rating value={data.score} readOnly />
                          <div>{data.comment}</div>
                        </React.Fragment>
                      ) : (
                        <Button
                          color="warning"
                          onClick={handleOpenDialog(data.orderId)}
                        >
                          评价订单
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </List>
        </GridItem>
        <CustomDialog
          open={state.open}
          titleText="评价订单"
          onClose={handleCloseDialog}
          form
          onSubmit={handleSubmit(handleCommentOrder)}
          content={
            <React.Fragment>
              <GridContainer>
                <GridItem md={6}>
                  <Rating
                    className={classes.myRating}
                    value={state.commentForm.score}
                    readOnly
                  />
                </GridItem>
                <GridItem md={6}>
                  <FormControl className={classes.scoreFormControl}>
                    <InputLabel>评分</InputLabel>
                    <Select
                      className={classes.ratingSelect}
                      value={state.commentForm.score}
                      onChange={handleRatingChange}
                    >
                      {[1, 2, 3, 4, 5].map((data, key) => {
                        return (
                          <MenuItem key={key} value={data}>
                            {data}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </GridItem>
              </GridContainer>

              <TextField
                id="comment"
                label="评论"
                multiline
                fullWidth
                rows="3"
                error={!!errors.comment}
                placeholder="填写订单评价..."
                variant="outlined"
                InputProps={{
                  type: "text",
                  name: "comment"
                }}
                inputRef={register({
                  required: "评论不能为空"
                })}
                helperText={errors.comment && errors.comment.message}
              />
            </React.Fragment>
          }
        />

        <GridItem xs={12} sm={12} md={12}>
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
    </React.Fragment>
  );
}
