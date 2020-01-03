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
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
//
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Pagination from "components/Pagination/Pagination.js";
import { get } from "axiosSetting.js";
import { easyFormat } from "utils/timeUtils.js";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  typeFormControl: {
    marginTop: "10px",
    marginRight: "40px"
  }
}));

const gymTypes = [
  "全部",
  "篮球",
  "台球",
  "排球",
  "棋牌",
  "足球",
  "游泳",
  "瑜伽",
  "棒球",
  "网球",
  "健美操",
  "高尔夫",
  "跆拳道",
  "羽毛球",
  "乒乓球"
];

const initialState = {
  open: false,
  pageNum: 1,
  isFirstPage: true,
  isLastPage: true,
  searchType: gymTypes[0],
  list: [] //订单列表
};

const allOrderReducer = (state, action) => {
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
    case "TYPE_CHANGE":
      return {
        ...state,
        searchType: payload
      };
    default:
      return state;
  }
};

export default function AllOrder() {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(allOrderReducer, initialState);

  const fetchData = async () => {
    const res = await get("/api/order/allOrder");
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
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleNextPage = async () => {
    const url =
      state.searchType !== gymTypes[0]
        ? `/api/order/gymOrder?type=${state.searchType}`
        : "/api/order/allOrder";
    if (state.isLastPage === false) {
      const nextPage = await get(url, {
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
    const url =
      state.searchType !== gymTypes[0]
        ? `/api/order/gymOrder?type=${state.searchType}`
        : "/api/order/allOrder";
    if (state.isFirstPage === false) {
      const prevPage = await get(url, {
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

  const handleTypeChange = async event => {
    const value = event.target.value;
    dispatch({ type: "TYPE_CHANGE", payload: value });
    if (value === gymTypes[0]) fetchData();
    else {
      const res = await get("/api/order/gymOrder", { type: value });
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
  };

  return (
    <React.Fragment>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <List
            subheader={
              <React.Fragment>
                <GridContainer>
                  <GridItem md={6}>
                    <ListSubheader>订单管理</ListSubheader>
                  </GridItem>
                  <GridItem md={6}>
                    <GridContainer justify="flex-end">
                      <FormControl className={classes.typeFormControl}>
                        <Select
                          value={state.searchType}
                          onChange={handleTypeChange}
                        >
                          {gymTypes.map((data, key) => {
                            return (
                              <MenuItem key={key} value={data}>
                                {data}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </React.Fragment>
            }
            className={classes.root}
          >
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>订单号码</TableCell>
                  <TableCell align="left">用户邮箱</TableCell>
                  <TableCell align="left">预约场馆</TableCell>
                  <TableCell align="left">场馆类型</TableCell>
                  <TableCell align="left">开始时间</TableCell>
                  <TableCell align="left">结束时间</TableCell>
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
                    <TableCell align="left">{data.gym.type}</TableCell>
                    <TableCell align="left">
                      {easyFormat(data.startTime)}
                    </TableCell>
                    <TableCell align="left">
                      {easyFormat(data.endTime)}
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
