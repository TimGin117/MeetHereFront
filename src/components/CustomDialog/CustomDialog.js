import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/modalStyle.js";
//过渡动画
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function CustomDialog(props) {
  const classes = useStyles();

  const {
    onConfirm,
    onClose,
    form = false,
    onSubmit,
    open,
    content = "content",
    titleText = "Dialog",
    confirmText = "Confirm",
    closeText = "Close",
    ...rest
  } = props;

  console.log(props);

  const element = (
    <div>
      <DialogContent
        id="classic-modal-slide-description"
        className={classes.modalBody}
      >
        {content}
      </DialogContent>
      <DialogActions className={classes.modalFooter}>
        <Button
          className={classes.modalFooterLabel}
          color="primary"
          type={form ? "submit" : "button"}
          onClick={onConfirm}
          simple
        >
          {confirmText}
        </Button>
        <Button
          className={classes.modalFooterLabel}
          onClick={onClose}
          color="danger"
          simple
        >
          {closeText}
        </Button>
      </DialogActions>
    </div>
  );

  return (
    <Dialog
      classes={{
        root: classes.center,
        paper: classes.modal
      }}
      keepMounted
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
      {...rest}
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <IconButton
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <Close className={classes.modalClose} />
        </IconButton>
        <h4 className={classes.modalTitle}>{titleText}</h4>
      </DialogTitle>
      {form ? <form onSubmit={onSubmit}>{element}</form> : element}
    </Dialog>
  );
}

CustomDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  onSubmit: PropTypes.func,
  form: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  titleText: PropTypes.string,
  confirmText: PropTypes.string,
  closeText: PropTypes.string,
  content: PropTypes.node
};
