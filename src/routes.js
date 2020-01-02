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
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user"
  },
  {
    path: "/display",
    name: "News Display",
    component: NewsDisplay,
    layout: "/user"
  },
  {
    path: "/gymInfo",
    name: "Gym Info",
    icon: BusinessIcon,
    component: GymInfo,
    layout: "/user"
  },
  {
    path: "/orderInfo",
    name: "Order Info",
    icon: ListAltIcon,
    component: OrderInfo,
    layout: "/user"
  },
  {
    path: "/orderManagement",
    name: "Order Management",
    icon: FormatListBulletedIcon,
    component: OrderManagement,
    layout: "/user"
  },
  {
    path: "/userManagement",
    name: "User Management",
    icon: FaceIcon,
    component: UserManagement,
    layout: "/user"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: Person,
    component: UserProfilePage,
    layout: "/user"
  }
];

const userRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user"
  },
  {
    path: "/display",
    name: "News Display",
    component: NewsDisplay,
    layout: "/user"
  },
  {
    path: "/gyminfo",
    name: "Gym Info",
    icon: BusinessIcon,
    component: GymInfo,
    layout: "/user"
  },
  {
    path: "/orderInfo",
    name: "Order Info",
    icon: ListAltIcon,
    component: OrderInfo,
    layout: "/user"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: Person,
    component: UserProfilePage,
    layout: "/user"
  }
];

export { userRoutes, adminRoutes };
