import React from "react";

import { useState, useEffect } from "react";
import { useDataMutation } from "@dhis2/app-runtime";
import { useStaffing } from "../../hooks/useStaffing";
import classes from "../../App.module.css";

import {
  getDataMutationQuery,
  getDataStoreMutationQuery,
} from "./DispensingQueries";
import { FetchDatePeriod, FetchDateTimeISO } from "../../Tools/FetchDateTime";
import {
  DispensingTable,
  HistoryTable,
  DataSetonClick,
} from "./DispensingTableComponents";

import { IconClockHistory16 } from "@dhis2/ui-icons";

import {
  ReactFinalForm,
  InputFieldFF,
  InputField,
  Button,
  SingleSelectField,
  SingleSelectOption,
  hasValue,
  number,
  composeValidators,
  AlertBar,
  NoticeBox,
  CircularLoader,
} from "@dhis2/ui";

export function DispensingCommodities(props) {
  const { Form, Field } = ReactFinalForm;
  const { loading, error, staffingInfo } = useStaffing();

  const [mutate, { mutateLoading, mutateError }] = useDataMutation(
    getDataMutationQuery()
  );
  const [mutateDataStore, { mutateLoadingDS, mutateErrorDS }] = useDataMutation(
    getDataStoreMutationQuery()
  );

  const [dispenseList, setToBeDispensedList] = useState([]);
  const [balance, setCurrentBalance] = useState(undefined);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);

  const [showFailureAlertFilled, setShowFailureAlertFilled] = useState(false);
  const [department, setDepartment] = useState("");

  let currentPeriod = FetchDatePeriod();
  let staff;

  const handleNameChange = (name) => {
    const selectedStaff = staff.find((member) => member.Name === name);
    if (selectedStaff) {
      setDepartment(selectedStaff.Department);
    } else {
      setDepartment(""); // Reset or handle the case where the name is not found
    }
  };

  // console.log("API response 1:",data);
  async function onSubmit(formInput, form) {
    if (formInput.CommodityDispensed == null || formInput.DispensedTo == null) {
      setShowFailureAlertFilled(true); // Step 2: Set the state to true when submission is successful
      setTimeout(() => setShowFailureAlertFilled(false), 5000); // Autohide after 5 seconds
      return;
    } else {
      formInput.dispensedBy = props.userData.name;
      formInput.timeDispensed = FetchDateTimeISO();
      formInput.commodityName = props.data.dataSets.dataSetElements
        .find(
          (dataSet) => dataSet.dataElement.id == formInput.CommodityDispensed
        )
        .dataElement.name.split("Commodities - ")[1];

      setToBeDispensedList((dispenseList) => [...dispenseList, formInput]);
      form.reset();
      setCurrentBalance(0);
    }
  }

  function submitDispensingList() {
    let dataStoreMutationData = [];
    let succesfullMutation = true;

    if (dispenseList.length > 0) {
      dispenseList.forEach(async (item, index) => {
        let mutationData = [];
        let refetchData;
        try {
          refetchData = await props.refetching();
        } catch (error) {
          console.log("Failed to refetch data", error);
        }
        let dataValues = refetchData.dataValueSets.dataValues;

        const endBalanceValue = dataValues.find((object) => {
          if (
            object.dataElement == item.CommodityDispensed &&
            object.categoryOptionCombo == "rQLFnNXXIL0"
          ) {
            return object;
          }
        }).value;

        const consumptionValue = dataValues.find((object) => {
          if (
            object.dataElement == item.CommodityDispensed &&
            object.categoryOptionCombo == "J2Qf1jtZuj8"
          ) {
            return object;
          }
        }).value;

        mutationData.push({
          dataElement: item.CommodityDispensed,
          categoryOptionCombo: "rQLFnNXXIL0",
          period: currentPeriod,
          orgUnit: "a1dP5m3Clw4",
          value: parseInt(endBalanceValue) - parseInt(item.Amount),
        });

        mutationData.push({
          dataElement: item.CommodityDispensed,
          categoryOptionCombo: "J2Qf1jtZuj8",
          period: currentPeriod,
          orgUnit: "a1dP5m3Clw4",
          value: parseInt(consumptionValue) + parseInt(item.Amount),
        });

        try {
          mutate({
            lifeCommodityMutate: mutationData,
          }).then((status) => {
            console.log("mutation status: ", status);
            //if(status.httpStatusCode ==200 ) succesfullMutation = false;
            props.refetching();
          });
        } catch (error) {
          succesfullMutation = false;
          console.log("Mutate error", mutateError);
          console.log("Failed to mutate data", error);
        }
      });
    } else {
      setShowFailureAlert(true); // Step 2: Set the state to true when submission is successful
      setTimeout(() => setShowFailureAlert(false), 5000); // Autohide after 5 seconds
      return;
    }

    dataStoreMutationData =
      props.data.DataStoreDispensingHistory.dispensingHistory.dispensingHistory;
    if (succesfullMutation) {
      dataStoreMutationData.unshift({
        TimeDispensed: FetchDateTimeISO(),
        Commodities: dispenseList,
        DispensedBy: props.userData.name,
      });

      mutateDataStore({
        dispensingHistory: dataStoreMutationData,
      }).then((status) => {
        console.log("mutation status datastore: ", status);
        if (status.httpStatusCode == 200) {
          setToBeDispensedList([]);
          succesfullMutation = true;
        }
      });
      if (dispenseList.length > 0) {
        setShowSuccessAlert(true); // Step 2: Set the state to true when submission is successful
        setTimeout(() => setShowSuccessAlert(false), 5000); // Autohide after 5 seconds
      } else {
        setShowFailureAlert(true); // Step 2: Set the state to true when submission is successful
        setTimeout(() => setShowFailureAlert(false), 5000); // Autohide after 5 seconds
      }
    }
  }

  if (staffingInfo) {
    staff = [...staffingInfo.staffing.staffing.staffing];
    let dataStoreData =
      props.data.DataStoreDispensingHistory.dispensingHistory.dispensingHistory;

    // console.log("API response 2, merged data:", props.mergedData);
    const commoditiesOptions = props.mergedData.commodities.map((commodity) => {
      let commodityName = commodity.name.split("Commodities - ")[1];
      return <SingleSelectOption label={commodityName} value={commodity.id} />;
    });
    const nameOptions = staff.map((staff) => {
      return <SingleSelectOption label={staff.Name} value={staff.Name} />;
    });

    function showInStock(idt) {
      props.mergedData.commodities.find((d) => {
        if (d.id == idt) {
          setCurrentBalance(d.values[2].value);
          if (d.values[2].value === undefined || d.values[2].value === null) {
            setCurrentBalance(0);
          }
        }
      });
    }

    return (
      <div>
        <h1>Dispensing</h1>
        <NoticeBox className={classes.pad} title="Dispense Commodeties">
          Please fill in the form below to dispense commodeties. Make sure to
          add all the commodeties you want to dispense before submitting. At the
          bottom of the page you can see the history of the dispensing.
        </NoticeBox>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} autoComplete="on">
              <Field required name="CommodityDispensed">
                {(field) => (
                  <SingleSelectField
                    placeholder="Choose commodity"
                    label="Commodity"
                    name={field.input.name}
                    selected={field.input.value}
                    onChange={(commodity) => {
                      field.input.onChange(
                        commodity.selected,
                        showInStock(commodity.selected)
                      );
                    }}
                  >
                    {commoditiesOptions}
                  </SingleSelectField>
                )}
              </Field>
              ‎
              <div className={classes.dispenseByTo}>
                <Field required name="DispensedTo">
                  {(field) => (
                    <SingleSelectField
                      placeholder="Dispensed To"
                      label="Dispense To"
                      name={field.input.name}
                      selected={field.input.value}
                      onChange={(name) => {
                        field.input.onChange(name.selected);
                        handleNameChange(name.selected);
                      }}
                    >
                      {nameOptions}
                    </SingleSelectField>
                  )}
                </Field>
                <InputField
                  className={classes.test}
                  name="Department"
                  label="Department"
                  component={InputFieldFF}
                  type="text"
                  readOnly
                  value={department}
                />
              </div>
              <div className={classes.amountDiv}>
                <Field
                  className={classes.amountField}
                  name="Amount"
                  label="Amount"
                  type="number"
                  max={balance}
                  min="1"
                  component={InputFieldFF}
                  validate={composeValidators(hasValue, number)}
                />
                {balance << 1 ? "In stock: " + balance : "Not in stock"}
              </div>
              <div className={classes.addItem}>
                <Button type="submit" small basic>
                  Add item
                </Button>
              </div>
            </form>
          )}
        </Form>
        <div className={classes.dispensingTable}>
          <h2>Commodities to be dispensed</h2>
          <DispensingTable
            list={dispenseList}
            mergedData={props.mergedData.commodities}
            setToBeDispensedList={setToBeDispensedList}
          />
        </div>
        <div className={classes.submitButton}>
          <Button type="submit" primary onClick={() => submitDispensingList()}>
            Dispense commodities{" "}
          </Button>
        </div>
        <div>
            <div className={classes.header}>
                <h2>Recent Dispensing history</h2>
                <Button
                    icon={<IconClockHistory16 />}
                    name="Secondary button"
                    onClick={() => props.activePageHandler("TransactionHistory")}
                    basic
                    value="Near Clinics"
                >
                    See full history
                </Button>
            </div>
          <div className={classes.historyTable}>
            <HistoryTable data={dataStoreData} />
          </div>
        </div>
        {showSuccessAlert && (
          <div
            className="alert-bars"
            style={{
              position: "fixed",
              bottom: "0",
              width: "100%",
              paddingLeft: "16px",
            }}
          >
            <AlertBar
              success
              onHidden={() => setShowSuccessAlert(false)}
              duration={5000}
            >
              Submission successful!
            </AlertBar>
          </div>
        )}
        {showFailureAlert && (
          <div
            className="alert-bars"
            style={{
              position: "fixed",
              bottom: "0",
              width: "100%",
              paddingLeft: "16px",
            }}
          >
            <AlertBar
              warning
              onHidden={() => setShowFailureAlert(false)}
              duration={5000}
            >
              No commodities to dispense!
            </AlertBar>
          </div>
        )}
        {showFailureAlertFilled && (
          <div
            className="alert-bars"
            style={{
              position: "fixed",
              bottom: "0",
              width: "100%",
              paddingLeft: "16px",
            }}
          >
            <AlertBar
              warning
              onHidden={() => setShowFailureAlertFilled(false)}
              duration={5000}
            >
              Make sure to fill Commodity and Recepient!
            </AlertBar>
          </div>
        )}
      </div>
    );
    //To-do: return a component using the data response
  }
  return (
    <div>
      <h1>Dispensing</h1>
      <CircularLoader />
    </div>
  );
}
