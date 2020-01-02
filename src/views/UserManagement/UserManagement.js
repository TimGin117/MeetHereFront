import React from "react";
//
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
//
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Pagination from "components/Pagination/Pagination.js";
import { get, post } from "axiosSetting.js";

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
  list: [] //用户列表
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
    case "DISABLE_USER":
      return {
        ...state,
        list: state.list.map(data => {
          if (data.email === payload) {
            data.disabled = true;
          }
          return data;
        })
      };
    case "ENABLE_USER":
      return {
        ...state,
        list: state.list.map(data => {
          if (data.email === payload) {
            data.disabled = false;
          }
          return data;
        })
      };
    default:
      return state;
  }
};

export default function UserManagement() {
  const classes = useStyles();

  const [state, dispatch] = React.useReducer(
    userManagementReducer,
    initialState
  );

  React.useEffect(() => {
    async function fetchData() {
      const res = await get("/api/user/findAllUsers");
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

  const handleNextPage = async () => {
    if (state.isLastPage === false) {
      const nextPage = await get("/api/user/findAllUsers", {
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
      const prevPage = await get("/api/user/findAllUsers", {
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

  //前端先行反馈
  const handleToggle = (email, disabled) => async () => {
    if (disabled) {
      dispatch({ type: "ENABLE_USER", payload: email });
      await post("/api/user/enableAccount", { userId: email });
    } else {
      dispatch({ type: "DISABLE_USER", payload: email });
      await post("/api/user/disableAccount", { userId: email });
    }
  };

  var userList = (
    <React.Fragment>
      {state.list.map(data => {
        return (
          <ListItem divider key={data.email} button>
            <ListItemAvatar>
              <Avatar src={data.profile} />
            </ListItemAvatar>
            <ListItemText primary={data.nickname} secondary={data.email} />
            <ListItemSecondaryAction>
              {data.disabled ? (
                <Chip size="small" label="封禁中" color="secondary" />
              ) : null}
              <Switch
                edge="end"
                checked={data.disabled}
                onChange={handleToggle(data.email, data.disabled)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <GridContainer>
        <GridItem xs={10} sm={10} md={10}>
          <List
            subheader={<ListSubheader>用户管理</ListSubheader>}
            className={classes.root}
          >
            {userList}
          </List>
        </GridItem>

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
    </React.Fragment>
  );
}
