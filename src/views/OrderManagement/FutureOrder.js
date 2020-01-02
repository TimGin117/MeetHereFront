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
//
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Pagination from "components/Pagination/Pagination.js";
import Button from "components/CustomButtons/Button.js";
import { get, post } from "axiosSetting.js";
import { easyFormat } from "utils/timeUtils.js";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

const initialState = {
  open: false,
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
    case "CANCEL_ORDER":
      return {
        ...state,
        list: state.list.filter(data => data.orderId !== payload)
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

  React.useEffect(() => {
    async function fetchData() {
      const res = await get("/api/order/futureOrder");
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
      const nextPage = await get("/api/order/futureOrder", {
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
      const prevPage = await get("/api/order/futureOrder", {
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

  const handleCancelOrder = orderId => async () => {
    const res = await post("/api/order/cancelMyOrder", { orderId: orderId });
    if (res && res.code === 0) {
      alert("取消成功");
      dispatch({ type: "CANCEL_ORDER", payload: orderId });
    }
  };

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
                  <TableCell align="left">用户邮箱</TableCell>
                  <TableCell align="left">预约场馆</TableCell>
                  <TableCell align="left">运动场地</TableCell>
                  <TableCell align="left">开始时间</TableCell>
                  <TableCell align="left">结束时间</TableCell>
                  <TableCell align="left">取消订单</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.list.map(data => (
                  <TableRow key={data.orderId}>
                    <TableCell component="th" scope="row">
                      {data.orderId}
                    </TableCell>
                    <TableCell align="left">{data.userEmail}</TableCell>
                    <TableCell align="left">{data.gym.name}</TableCell>
                    <TableCell align="left">{data.gym.address}</TableCell>
                    <TableCell align="left">
                      {easyFormat(data.startTime)}
                    </TableCell>
                    <TableCell align="left">
                      {easyFormat(data.endTime)}
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        color="danger"
                        onClick={handleCancelOrder(data.orderId)}
                      >
                        取消订单
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </List>
        </GridItem>

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
