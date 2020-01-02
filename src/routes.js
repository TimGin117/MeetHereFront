// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import BusinessIcon from "@material-ui/icons/Business";
import FaceIcon from "@material-ui/icons/Face";
import ListAltIcon from "@material-ui/icons/ListAlt";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfilePage from "views/UserProfile/UserProfile.js";
import NewsDisplay from "views/Dashboard/NewsDisplay.js";
import GymInfo from "views/GymInfo/GymInfo.js";
import UserManagement from "views/UserManagement/UserManagement.js";
import OrderInfo from "views/OrderInfo/OrderInfo.js";
import OrderManagement from "views/OrderManagement/OrderManagement.js";

const adminRoutes = [
  {
    path: "/dashboard",
    name: "首页",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user"
  },
  {
    path: "/display",
    name: "新闻",
    component: NewsDisplay,
    layout: "/user"
  },
  {
    path: "/gymInfo",
    name: "场馆资讯",
    icon: BusinessIcon,
    component: GymInfo,
    layout: "/user"
  },
  {
    path: "/orderInfo",
    name: "我的订单",
    icon: ListAltIcon,
    component: OrderInfo,
    layout: "/user"
  },
  {
    path: "/orderManagement",
    name: "订单管理",
    icon: FormatListBulletedIcon,
    component: OrderManagement,
    layout: "/user"
  },
  {
    path: "/userManagement",
    name: "用户管理",
    icon: FaceIcon,
    component: UserManagement,
    layout: "/user"
  },
  {
    path: "/profile",
    name: "我的信息",
    icon: Person,
    component: UserProfilePage,
    layout: "/user"
  }
];

const userRoutes = [
  {
    path: "/dashboard",
    name: "首页",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user"
  },
  {
    path: "/display",
    name: "新闻",
    component: NewsDisplay,
    layout: "/user"
  },
  {
    path: "/gyminfo",
    name: "场馆资讯",
    icon: BusinessIcon,
    component: GymInfo,
    layout: "/user"
  },
  {
    path: "/orderInfo",
    name: "我的订单",
    icon: ListAltIcon,
    component: OrderInfo,
    layout: "/user"
  },
  {
    path: "/profile",
    name: "我的信息",
    icon: Person,
    component: UserProfilePage,
    layout: "/user"
  }
];

export { userRoutes, adminRoutes };
