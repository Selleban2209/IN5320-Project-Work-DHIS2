import React, { useState } from "react";
import classes from "../../App.module.css";
import { Tab, TabBar, NoticeBox } from "@dhis2/ui";
import { DispensingHistory } from "./DispensingHistory";
import { StockRecountHistory } from "./RecountHistory";
import { StoreManagementHistory } from "./ManagementHistory";

export function TransactionHistory({ history }) {
  // State to control whether the items table is shown
  const [itemsTable, setShowItems] = useState(false);

  // State to manage which tab is currently active
  const [activeTab, setActiveTab] = useState(
    history ? history : "DispensingHistory"
  );

  return (
    <div>
      <h1>Transaction History</h1>
      <NoticeBox className={classes.pad} title="See Previous Transactions">
        On this page you have full view of different transactions, click  <b>show
        details</b> to get more information about the transaction.
      </NoticeBox>
      <div className={classes.HistoryPageWrapper}>
        {/* Tab bar for switching between different history views */}
        <TabBar fixed>
        <Tab
            selected={activeTab === "StoreManagementHistory"}
            onClick={() => setActiveTab("StoreManagementHistory")}
          >
            Recieving History
          </Tab>
          <Tab
            selected={activeTab === "StockRecountHistory"}
            onClick={() => setActiveTab("StockRecountHistory")}
          >
            Stock Recount History
          </Tab>
          <Tab
            selected={activeTab === "DispensingHistory"}
            onClick={() => {
              setActiveTab("DispensingHistory");
              setShowItems(false);
            }}
          >
            Dispensing
          </Tab>
        </TabBar>

        <div className={classes.HistoryTableWrapper}>
          {activeTab === "DispensingHistory" && (
            <DispensingHistory
              setShowItems={setShowItems}
              itemsTable={itemsTable}
            />
          )}
          {activeTab === "StockRecountHistory" && <StockRecountHistory />}
          {activeTab === "StoreManagementHistory" && (
            <StoreManagementHistory />
          )}{" "}
        </div>
      </div>
    </div>
  );
}
