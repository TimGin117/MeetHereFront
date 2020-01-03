import React from "react";
//
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import AllOrder from "views/OrderInfo/AllOrder.js";
import CurrentOrder from "views/OrderInfo/CurrentOrder.js";
import FutureOrder from "views/OrderInfo/FutureOrder.js";
import PastOrder from "views/OrderInfo/PastOrder.js";

export default function OrderInfo() {
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
