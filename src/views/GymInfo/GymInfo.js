import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
//components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Pagination from "components/Pagination/Pagination.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomDialog from "components/CustomDialog/CustomDialog.js";
//icon
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import CanCelIcon from "@material-ui/icons/Cancel";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import PlaceIcon from "@material-ui/icons/Place";
import DescriptionIcon from "@material-ui/icons/Description";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import LockIcon from "@material-ui/icons/Lock";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import PhotoIcon from "@material-ui/icons/Photo";
//utils
import { dateFormat, timeMap, timeSpanMap } from "utils/timeUtils.js";
import { get, post, postJSON } from "axiosSetting.js";
import useForm from "react-hook-form";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

const useStyles = makeStyles({
  gymCard: {
    marginBottom: "10px"
  },
  gymInfo: {
    marginTop: "10px"
  },
  form: {
    maxWidth: "850px",
    height: "100%",
    margin: "20px 80px 20px 80px"
  },
  image: {
    margin: "10px",
    width: "100%",
    height: "85%"
  },
  chip: {
    marginLeft: "15px",
    marginBottom: "4px"
  },
  svgIcon: {
    marginBottom: "-5px",
    marginRight: "5px"
  },
  drawerButton: {
    width: "40%",
    marginTop: "20px",
    marginRight: "15px",
    marginBottom: "10px"
  },
  addGymButton: {
    marginTop: "-50px",
    marginRight: "6px"
  },
  title: {
    fontWeight: "600"
  },
  typeFormControl: {
    marginTop: "12px",
    width: "50%",
    minWidth: "100px"
  },
  datePicker: {
    minWidth: "100px",
    minHeigit: "100px",
    width: "100%",
    marginTop: "10px",
    marginBottom: "10px"
  }
});

const startTime = [...Array(25)].map((value, index) => index + 16);

const gymTypes = [
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

const datePattern = "yyyy/MM/dd";

const initialGymForm = {
  type: gymTypes[0],
  name: "",
  description: "",
  address: "",
  rent: 0,
  photo: ""
};

const initialOrderForm = {
  gymId: "",
  startTime: 16, //开始时间
  endTime: 1, //时长
  data: dateFormat(new Date(), datePattern)
};

const initialState = {
  open: false, //drawer
  title: "",
  pageNum: 1,
  isFirstPage: true,
  isLastPage: true,
  list: [],
  gymForm: initialGymForm,
  gymId: "", //区分编辑和新增
  orderForm: initialOrderForm,
  openDialog: false
};

const gymInfoReducer = (state, action) => {
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
    case "CLOSE_DRAWER":
      return {
        ...state,
        open: false
      };
    case "OPEN_POST_DRAWER":
      return {
        ...state,
        open: true,
        gymId: "",
        gymForm: initialGymForm
      };
    case "OPEN_EDIT_DRAWER":
      return {
        ...state,
        open: true,
        gymForm: payload.gymForm,
        gymId: payload.gymId
      };
    case "ADD_GYM":
      return {
        ...state,
        list: [payload, ...state.list]
      };
    case "UPDATE_GYM":
      return {
        ...state,
        list: state.list.map(data => {
          if (data.gymId === payload.gymId) return payload;
          else return data;
        })
      };
    case "DELETE_GYM":
      return {
        ...state,
        list: state.list.map(data => {
          if (data.gymId === payload) return { ...data, open: !data.open };
          else return data;
        })
      };
    case "GYMFORM_TYPE_CHANGE":
      return {
        ...state,
        gymForm: { ...state.gymForm, type: payload }
      };
    case "ORDERFORM_CHANGE":
      return {
        ...state,
        orderForm: { ...state.orderForm, [payload.key]: payload.value }
      };
    case "OPEN_DIALOG":
      return {
        ...state,
        orderForm: { ...state.orderForm, gymId: payload },
        openDialog: true
      };
    case "CLOSE_DIALOG":
      return {
        ...state,
        orderForm: initialOrderForm,
        openDialog: false
      };
    default:
      return state;
  }
};

export default function GymInfo() {
  const classes = useStyles();

  const userStorage = window.sessionStorage.getItem("user");
  const user = userStorage && JSON.parse(userStorage);
  const { role } = user;
  const isAdmin = role === "admin";

  const [state, dispatch] = React.useReducer(gymInfoReducer, initialState);
  const { register, handleSubmit, errors } = useForm(); //gymForm

  React.useEffect(() => {
    async function fetchData() {
      const res = await get("/api/gym/allGyms");
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
      const nextPage = await get("/api/gym/allGyms", {
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
      const prevPage = await get("/api/gym/allGyms", {
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

  const handleCloseButton = () => {
    dispatch({ type: "CLOSE_DRAWER" });
  };

  const handleAddButton = () => {
    dispatch({ type: "OPEN_POST_DRAWER" });
  };

  const handleTypeChange = event => {
    dispatch({ type: "GYMFORM_TYPE_CHANGE", payload: event.target.value });
  };

  const handleSubmitGym = async data => {
    dispatch({ type: "CLOSE_DRAWER" });
    let res;
    if (state.gymId === undefined || state.gymId === "") {
      const body = {
        ...data,
        type: state.gymForm.type
      };
      res = await postJSON("/api/gym/addGym", body);
      if (res && res.code === 0) {
        dispatch({ type: "ADD_GYM", payload: res.data });
        alert("新增场馆成功");
      }
    } else {
      const body = {
        ...data,
        type: state.gymForm.type,
        gymId: state.gymId
      };
      res = await postJSON("/api/gym/updateGym", body);
      if (res && res.code === 0) {
        dispatch({ type: "UPDATE_GYM", payload: res.data });
        alert("修改场馆成功");
      }
    }
  };

  const handleEditGym = data => async event => {
    //阻止冒泡
    event.stopPropagation();
    // eslint-disable-next-line no-unused-vars
    const { open, gymId, ...gymForm } = data;
    dispatch({ type: "OPEN_EDIT_DRAWER", payload: { gymForm, gymId } });
  };

  const handleDeleteGym = data => async event => {
    //阻止冒泡
    event.stopPropagation();
    let res;
    if (data.open === true) {
      res = await post("/api/gym/deleteGym", { gymId: data.gymId });
    } else {
      res = await postJSON("/api/gym/updateGym", { ...data, open: true });
    }

    if (res && res.code === 0) {
      dispatch({ type: "DELETE_GYM", payload: data.gymId });
    }
  };

  const handleCloseDialog = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };

  const handleOpenDialog = gymId => () => {
    dispatch({ type: "OPEN_DIALOG", payload: gymId });
  };

  const handleAddOrder = async () => {
    dispatch({ type: "CLOSE_DIALOG" });
    const body = {
      gymId: state.orderForm.gymId,
      userEmail: user.email,
      date: state.orderForm.date,
      startTime: state.orderForm.startTime,
      endTime: state.orderForm.startTime + state.orderForm.endTime
    };
    const res = await postJSON("/api/order/addOrder", body);
    if (res && res.code === 0) {
      alert("预约成功");
    } else {
      alert("预约失败");
    }
  };

  const handleDateChange = async date => {
    const newDate = dateFormat(date, datePattern);
    dispatch({
      type: "ORDERFORM_CHANGE",
      payload: { key: "date", value: newDate }
    });

    const body = {
      date: newDate,
      gymId: state.orderForm.gymId
    };
    const res = await postJSON("/api/order/available", body);
    if (res && res.code === 0) {
      console.log(res.data);
    }
  };

  const handleStartTimeChange = event => {
    dispatch({
      type: "ORDERFORM_CHANGE",
      payload: { key: "startTime", value: event.target.value }
    });
  };

  const handleEndTimeChange = event => {
    dispatch({
      type: "ORDERFORM_CHANGE",
      payload: {
        key: "endTime",
        value: event.target.value
      }
    });
  };

  var gymList = (
    <GridContainer>
      {state.list.map(data => {
        return (
          <GridItem key={data.gymId} xs={12} sm={12} md={10}>
            <Card className={classes.gymCard}>
              <CardActionArea onClick={handleOpenDialog(data.gymId)}>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                    <CardMedia className={classes.image} image={data.photo} />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <CardHeader
                      action={
                        isAdmin ? (
                          <React.Fragment>
                            <IconButton onClick={handleEditGym(data)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleDeleteGym(data)}>
                              <DeleteIcon />
                            </IconButton>
                          </React.Fragment>
                        ) : null
                      }
                      title={
                        <React.Fragment>
                          {data.name}
                          <Chip
                            className={classes.chip}
                            size="small"
                            color="green"
                            icon={<LocalOfferIcon />}
                            label={data.type}
                          />
                        </React.Fragment>
                      }
                      subheader={
                        <GridContainer>
                          <GridItem xs={12} sm={12} md={6}>
                            <DescriptionIcon className={classes.svgIcon} />
                            描述：{data.description}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <PlaceIcon className={classes.svgIcon} />
                            地址：{data.address}
                          </GridItem>
                          <GridItem xs={12} sm={12} md={6}>
                            <AttachMoneyIcon className={classes.svgIcon} />
                            租金：{data.rent}
                          </GridItem>
                          <GridItem
                            className={classes.gymState}
                            xs={12}
                            sm={12}
                            md={6}
                          >
                            {data.open ? (
                              <LockOpenIcon className={classes.svgIcon} />
                            ) : (
                              <LockIcon className={classes.svgIcon} />
                            )}
                            状态：{data.open ? "开放" : "关闭"}
                          </GridItem>
                        </GridContainer>
                      }
                    />
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
      {gymList}
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
              className={classes.addGymButton}
              color="primary"
              onClick={handleAddButton}
            >
              新增场馆
            </Button>
          ) : null}
        </GridContainer>
      </GridItem>
      <Drawer anchor="right" open={state.open} onClose={handleCloseButton}>
        <form className={classes.form} onSubmit={handleSubmit(handleSubmitGym)}>
          <GridContainer>
            <GridItem xs={9} sm={9} md={9}>
              <h3 className={classes.title}>新增场馆</h3>
            </GridItem>
            <GridItem xs={3} sm={3} md={3}>
              <Button
                className={classes.drawerButton}
                type="submit"
                color="primary"
              >
                <LibraryBooks />
                创建
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
          <GridContainer>
            <GridItem md={8}>
              <CustomInput
                id="name"
                labelText="Name"
                formControlProps={{
                  fullWidth: true
                }}
                error={!!errors.name}
                inputProps={{
                  type: "text",
                  name: "name",
                  inputRef: register({
                    required: "this is required"
                  }),
                  defaultValue: state.gymForm.name,
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalanceIcon />
                    </InputAdornment>
                  )
                }}
                helperText={errors.name && errors.name.message} //配合inputRe
              />
            </GridItem>
            <GridItem md={8}>
              <CustomInput
                id="description"
                error={!!errors.description}
                labelText="Description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "text",
                  name: "description",
                  defaultValue: state.gymForm.description,
                  inputRef: register({
                    required: "this is required"
                  }),
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon />
                    </InputAdornment>
                  )
                }}
                helperText={errors.photo && errors.photo.message} //配合inputRe
              />
            </GridItem>
            <GridItem md={8}>
              <CustomInput
                id="address"
                labelText="Address"
                formControlProps={{
                  fullWidth: true
                }}
                error={!!errors.address}
                inputProps={{
                  type: "text",
                  name: "address",
                  defaultValue: state.gymForm.address,
                  inputRef: register({
                    required: "this is required"
                  }),
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon />
                    </InputAdornment>
                  )
                }}
                helperText={errors.address && errors.address.message} //配合inputRe
              />
            </GridItem>
            <GridItem md={8}>
              <CustomInput
                id="photo"
                labelText="Photo"
                formControlProps={{
                  fullWidth: true
                }}
                error={!!errors.photo}
                inputProps={{
                  type: "text",
                  name: "photo",
                  defaultValue: state.gymForm.photo,
                  inputRef: register({
                    required: "this is required"
                  }),
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhotoIcon />
                    </InputAdornment>
                  )
                }}
                helperText={errors.photo && errors.photo.message} //配合inputRe
              />
            </GridItem>
            <GridItem md={8}>
              <CustomInput
                id="rent"
                labelText="Rent"
                formControlProps={{
                  fullWidth: true
                }}
                error={!!errors.rent}
                inputProps={{
                  type: "number",
                  name: "rent",
                  defaultValue: state.gymForm.rent,
                  inputRef: register({
                    required: "this is required"
                  }),
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  )
                }}
                helperText={errors.rent && errors.rent.message} //配合inputRe
              />
            </GridItem>
            <GridItem md={8}>
              <FormControl className={classes.typeFormControl}>
                <InputLabel>Type</InputLabel>
                <Select value={state.gymForm.type} onChange={handleTypeChange}>
                  {gymTypes.map((data, key) => {
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
        </form>
      </Drawer>
      <CustomDialog
        open={state.openDialog}
        titleText="预约场馆"
        onClose={handleCloseDialog}
        onConfirm={handleAddOrder}
        content={
          <React.Fragment>
            <GridContainer direction="column" justify="center">
              <GridItem>
                <DayPickerInput
                  inputProps={{ readOnly: true }}
                  format={datePattern}
                  classNames={classes.datePicker}
                  onDayChange={handleDateChange}
                />
              </GridItem>
              <GridItem>
                <FormControl className={classes.typeFormControl}>
                  <InputLabel>开始时间</InputLabel>
                  <Select
                    value={state.orderForm.startTime}
                    onChange={handleStartTimeChange}
                  >
                    {startTime.map((data, key) => {
                      return (
                        <MenuItem key={key} value={data}>
                          {timeMap[data]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl className={classes.typeFormControl}>
                  <InputLabel>预约时长</InputLabel>
                  <Select
                    value={state.orderForm.endTime}
                    onChange={handleEndTimeChange}
                  >
                    {[1, 2, 3, 4].map((data, key) => {
                      return (
                        <MenuItem key={key} value={data}>
                          {timeSpanMap[data]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
          </React.Fragment>
        }
      />
    </React.Fragment>
  );
}
