import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { TransactionHistory } from "./components/History/TransactionHistory";
import { Navigation } from "./Navigation";
import { DispensingCommodities } from "./components/Dispensing/DispensingCommodities";
import { StoreManagement } from "./components/StoreManagement/StoreManagement";
import { StockRecount } from "./components/StockRecount/StockRecount";
import { Clinics } from "./components/Clinics/Clinics";
import { Overview } from "./components/Overview/Overview";
import { useDataQuery } from "@dhis2/app-runtime";

import { Staffing } from "./components/Staffing/Staffing";
import { mergeData } from "./Tools/MergeData";
import { useUserInfo } from "./hooks/useUserInfo";
import { FetchDatePeriod } from "./Tools/FetchDateTime";
import { getCommodityQuery } from "./components/Dispensing/DispensingQueries";

function MyApp() {
  // Fetching user information
  const {
    loading: loadingUser,
    error: errorUser,
    userDataInfo,
  } = useUserInfo();

  // State for managing the active page and selected medicine
  const [activePage, setActivePage] = useState("Overview");
  const [medicine, setMedicine] = useState();
  const [history, setHistory] = useState();

  // Handler for changing the active page
  function activePageHandler(page, medicine, history) {
    setActivePage(page);
    setMedicine(medicine);
    setHistory(history);
  }
  const commodityQueryResult = useDataQuery(
    getCommodityQuery("a1dP5m3Clw4", FetchDatePeriod())
  );

  // Handling loading and error states for user data
  if (loadingUser) {
    return <span>Loading...</span>;
  }
  if (errorUser) {
    return <span>ERROR: {errorUser.message}</span>;
  }

  if (userDataInfo) {
    const { loading, error, data, refetch } = commodityQueryResult;
    const mergedData = mergeData(data);

    if (loading) {
      return <span>Loading...</span>;
    }
    if (error) {
      return <span>ERROR: {error.message}</span>;
    }

    // Rendering the application UI when data is available
    if (data) {
      return (
        <div>
          <div className={classes.container}>
            <div className={classes.left}>
              <Navigation
                activePage={activePage}
                activePageHandler={activePageHandler}
              />
            </div>
            <div className={classes.right}>
              {activePage === "Overview" && (
                <Overview
                  activePageHandler={activePageHandler}
                  medicineData={mergedData.commodities}
                />
              )}
              {activePage === "Clinics" && (
                <Clinics
                  medicine={medicine}
                  activePageHandler={activePageHandler}
                />
              )}
              {activePage === "StoreManagement" && (
                <StoreManagement
                  stockData={mergedData.commodities}
                  user={userDataInfo}
                  refetching={refetch}
                  activePageHandler={activePageHandler}
                />
              )}
              {activePage === "Dispense" && (
                <DispensingCommodities
                  userData={userDataInfo}
                  refetching={refetch}
                  data={data}
                  mergedData={mergedData}
                  activePageHandler={activePageHandler}
                />
              )}
              {activePage === "StockRecount" && (
                <StockRecount
                  stockData={mergedData.commodities}
                  user={userDataInfo}
                  refetching={refetch}
                  activePageHandler={activePageHandler}
                />
              )}
              {activePage === "TransactionHistory" && (
                <TransactionHistory history={history} />
              )}
              {activePage === "Staffing" && <Staffing />}
            </div>
          </div>
        </div>
      );
    }
  }
  return <span>Loading...</span>;
}
export default MyApp;
