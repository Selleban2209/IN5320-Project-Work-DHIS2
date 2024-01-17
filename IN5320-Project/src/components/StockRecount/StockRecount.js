import React, { useState } from "react";
import classes from "../../App.module.css";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { NoticeBox, AlertBar, Button } from "@dhis2/ui";
import { StockDataTable } from "../../Tools/StockDataTable";
import { FetchDatePeriod } from "../../Tools/FetchDateTime";
import { getDataMutationQuery } from "../Dispensing/DispensingQueries";

import { IconClockHistory16 } from "@dhis2/ui-icons";

//defines the mutation for receiving data to be used in a data send
const getDataStoreQuery = {
  quarters: {
    resource: "dataStore/IN5320<31>/StockRecount-History",
  },
};

// Defines the mutation for sending data to the datastore
const sendDataToDataStore = {
  resource: "dataStore/IN5320<31>/StockRecount-History",
  type: "update",
  data: ({ quarters }) => ({
    quarters,
  }),
};

export function StockRecount({
  stockData,
  user,
  refetching,
  activePageHandler,
}) {
  const [newStock, setNewStock] = useState({});
  const periods = FetchDatePeriod();
  let newDataToBeSendt = [];
  const { loading, error, data, refetch } = useDataQuery(getDataStoreQuery);
  const [sendDataMutation] = useDataMutation(sendDataToDataStore);
  const [mutate, { loading: mutationLoading, error: mutationError }] =
    useDataMutation(getDataMutationQuery());
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "default",
  });

  if (loading) return <p>Loading...' </p>;
  if (error) return <p>Error! ${error.message}</p>;
  if (data) {
    const handleSubmit = async () => {
      const currentDate = new Date();
      const currentQuarter = `Q${Math.floor((currentDate.getMonth() + 3) / 3)}`;
      const day = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      // Prepare the data to log
      const newData = stockData.map((element) => ({
        ...element,
        newValue: newStock[element.id] || element.value,
      }));

      const mutationDataList = newData.map((data) => ({
        dataElement: data.id,
        categoryOptionCombo: "rQLFnNXXIL0",
        period: periods,
        orgUnit: "a1dP5m3Clw4",
        value: newStock[data.id] || data.value,
      }));

      //Prepare the data for the datastore
      const dataForStore = {
        quarter: currentQuarter,
        date: formattedDate,
        previousStock: stockData,
        newStock: newData,
        managedBy: user.name,
      };

      if (mutationDataList.some((item) => item.value === undefined)) {
        setAlertInfo({
          show: true,
          message: "Please fill in all fields!",
          type: "critical",
        });
      }

      try {
        // Call the mutate function with the correct data structure
        await mutate({
          lifeCommodityMutate: mutationDataList,
        });
        await refetching();
        // Handle the successful mutation response
      } catch (error) {
        console.error(error);
      }
      try {
        newDataToBeSendt =
          data.quarters.quarters !== undefined
            ? [dataForStore, ...data.quarters.quarters]
            : [dataForStore];
        await sendDataMutation({ quarters: newDataToBeSendt });
        setAlertInfo({
          show: true,
          message: "Stock updated successfully!",
          type: "success",
        });
        setNewStock({});
        refetch();
      } catch (error) {
        setAlertInfo({
          show: true,
          message: "Failed to update stock!",
          type: "critical",
        });
      }
      setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
    };

    const onChangeStock = (event, dataElementId) => {
      const inputValue =
        event.value !== undefined ? event.value : event.target.value;
      const numericValue = inputValue ? parseInt(inputValue, 10) : 0;
      setNewStock({
        ...newStock,
        [dataElementId]: numericValue,
      });
    };

    return (
      <div>
            <div className={classes.header}>
                <h1>Stock Recount</h1>
                <Button
                icon={<IconClockHistory16 />}
                name="Secondary button"
                onClick={() =>
                    activePageHandler("TransactionHistory", null, "StockRecountHistory")
                }
                basic
                value="Near Clinics"
                >
                History
                </Button>
            </div>
        <NoticeBox className={classes.pad} title="Quarterly Stock Recount">
          Add the stock amount for each medicine below. Make sure to validate
          the information before submitting. You should do this quarterly.
        </NoticeBox>
        <StockDataTable
          stockData={stockData}
          onChangeStock={onChangeStock}
          handleSubmit={handleSubmit}
          newStockValues={newStock}
          fieldText={"Enter total stock amount"}
        />
        {alertInfo.show && (
          <div style={{ height: "260px" }}>
            <div
              className="alert-bars"
              style={{
                bottom: 0,
                left: 0,
                paddingLeft: 16,
                position: "fixed",
                width: "100%",
              }}
            >
              {alertInfo.type === "success" && (
                <AlertBar success>{alertInfo.message}</AlertBar>
              )}
              {alertInfo.type === "critical" && (
                <AlertBar warning>{alertInfo.message}</AlertBar>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
