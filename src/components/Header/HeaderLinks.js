/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

// @material-ui/icons
import { Fingerprint, PersonAdd } from "@material-ui/icons";

// core components
import Button from "components/CustomButtons/Button.js";
import Tooltip from "@material-ui/core/Tooltip";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button color="transparent" className={classes.navLink}>
          <Link to="/login" className={classes.dropdownLink}>
            <Fingerprint className={classes.socialIcons} />
            登陆
          </Link>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button color="transparent" className={classes.navLink}>
          <Link to="/register" className={classes.dropdownLink}>
            <PersonAdd className={classes.socialIcons} />
            注册
          </Link>
        </Button>
      </ListItem>
    </List>
  );
}
