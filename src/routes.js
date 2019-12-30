// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfilePage from "views/UserProfile/UserProfile.js";
import PublishNewsPage from "views/PublishNews/PublishNews.js";
import NewsDisplay from "views/Dashboard/NewsDisplay.js";

const adminRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/user"
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: Person,
    component: UserProfilePage,
    layout: "/user"
  },
  {
    path: "/PublishNews",
    name: "PublishNews",
    icon: LibraryBooks,
    component: PublishNewsPage,
    layout: "/user"
  },
  {
    path: "/NewsDisplay",
    name: "News Display",
    component: NewsDisplay,
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
    path: "/profile",
    name: "User Profile",
    icon: Person,
    component: UserProfilePage,
    layout: "/user"
  },
  {
    path: "/display",
    name: "News Display",
    component: NewsDisplay,
    layout: "/user"
  }
];

export { userRoutes, adminRoutes };
