import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Button from "components/CustomButtons/Button.js";
import useForm from "react-hook-form";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import { postJSON } from "axiosSetting.js";

const styles = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
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
  publishButton: {
    margin: "20px 0 0 100px"
  }
};

const useStyles = makeStyles(styles);

const initialState = {
  title: "",
  editorState: BraftEditor.createEditorState(null)
};

const publishNewsReducer = (state, action) => {
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
    default:
      return state;
  }
};

export default function PublishNews() {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const [state, dispatch] = React.useReducer(publishNewsReducer, initialState);
  const editorInstance = React.useRef(null);

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

  const handlePublishNews = async () => {
    if (state.editorState.isEmpty()) {
      editorInstance.current.requestFocus();
      return;
    }

    const body = {
      title: state.title,
      content: state.editorState.toHTML()
    };
    alert(JSON.stringify(body));
    await postJSON("/api/news/addNews", body);
  };

  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>PublishNews</h4>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(handlePublishNews)}>
          <GridContainer>
            <GridItem xs={8} sm={8} md={8}>
              <CustomInput
                labelText="Title"
                id="title"
                formControlProps={{
                  fullWidth: true
                }}
                error={!!errors.title}
                inputProps={{
                  type: "text",
                  placeholder: "新闻标题",
                  name: "title",
                  inputRef: register({
                    required: "thie is required"
                  }),
                  onChange: handleChange("title")
                }}
                helperText={errors.nickname && errors.nickname.message} //配合inputRef的register
              />
            </GridItem>
            <GridItem xs={4} sm={4} md={4}>
              <Button
                className={classes.publishButton}
                type="submit"
                color="primary"
              >
                <LibraryBooks />
                Publish
              </Button>
            </GridItem>
          </GridContainer>
          <BraftEditor
            placeholder="请输入正文"
            onChange={handleEditorChange}
            ref={editorInstance}
          />
        </form>
      </CardBody>
    </Card>
  );
}
