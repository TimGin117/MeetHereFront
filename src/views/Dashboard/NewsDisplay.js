import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import BraftEditor from "braft-editor";
import Paper from "@material-ui/core/Paper";
import "braft-editor/dist/index.css";
import { get } from "http";
import { type } from "os";
//test
const styles = {};

const useStyles = makeStyles(styles);

const initialState = {
  commentSet: []
};

const displayReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "GET_COMMENT":
      return {
        ...state,
        commentSet: payload
      };
    default:
      return state;
  }
};

export default function NewsDisplay(props) {
  const classes = useStyles();

  const { newsId } = props.location.state;

  const [state, dispatch] = React.useReducer(displayReducer, initialState);

  var content, title, nickname, updateTime;

  React.useEffect(() => {
    if (props.location.state === undefined)
      return <Redirect to="/user/profile" />;
    async function fetchData() {
      const res = await get("/api/news/one", { newsId: newsId });
      if (res && res.code === 0) {
        ({ content, title, nickname, updateTime } = res.data);
        dispatch({ type: "GET_COMMENT", payload: res.data.commentSet });
      }
    }
    fetchData();
  }, []);

  return (
    <Paper>
      <h2>{title}</h2>
      {content}
    </Paper>
  );
}
NewsDisplay.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};
