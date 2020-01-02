import React from "react";
//
import { makeStyles } from "@material-ui/core/styles";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import AllOrder from "views/OrderManagement/AllOrder.js";
import CurrentOrder from "views/OrderManagement/CurrentOrder.js";
import FutureOrder from "views/OrderManagement/FutureOrder.js";
import PastOrder from "views/OrderManagement/PastOrder.js";

export default function OrderManagement() {
  return (
    <CustomTabs
      headerColor="primary"
      tabs={[
        {
          tabName: "全部订单",
          tabContent: <AllOrder />
        },
        {
          tabName: "进行中",
          tabContent: <CurrentOrder />
        },
        {
          tabName: "已预约",
          tabContent: <FutureOrder />
        },
        {
          tabName: "已完成",
          tabContent: <PastOrder />
        }
      ]}
    />
  );
}
