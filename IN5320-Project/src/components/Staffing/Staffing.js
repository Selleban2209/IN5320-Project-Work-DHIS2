import React, { useState } from "react";
import {
  ReactFinalForm,
  InputFieldFF,
  Button,
  hasValue,
  composeValidators,
  NoticeBox,
  DataTable,
  DataTableRow,
  TableBody,
  DataTableCell,
  AlertBar,
} from "@dhis2/ui";

import { useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import classes from "../../App.module.css";
import { useStaffing } from "../../hooks/useStaffing";

// Function to construct the mutation query for the datastore
function getDataStoreMutationQuery() {
  return {
    resource: "dataStore/IN5320<31>/Staff",
    type: "update",
    data: (staffing) => ({
      staffing,
    }),
  };
}


export function Staffing() {
  const { Form, Field } = ReactFinalForm;
  let dataStoreMutationData = [];
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "default",
  });

  // Using a custom hook to fetch staffing info
  const { loading, error, staffingInfo } = useStaffing();

  // Hook to handle data mutation in DHIS2
  const [mutateDataStore, { mutateLoadingDS, mutateErrorDS }] = useDataMutation(
    getDataStoreMutationQuery()
  );

  // Function to handle form submission
  const onSubmit = (formInput, form) => {
    if (staffingInfo) {
      // Check if either of the fields is empty
      if (!formInput["Staff Name"] || !formInput["Department"]) {
        setAlertInfo({
          show: true,
          message: "Please fill in all fields!",
          type: "critical",
        });

        // Set timeout to hide the alert after 3 seconds
        setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
        return; // Stop the function if fields are empty
      }

      // Preparing data for mutation
      dataStoreMutationData = [...staffingInfo.staffing.staffing.staffing];
      dataStoreMutationData.push({
        Name: formInput["Staff Name"],
        Department: formInput["Department"],
      });

      mutateDataStore({
        staffing: dataStoreMutationData,
      })
        .then((response) => {

          // Handling response based on API return
          if (response && response.status === "OK") {
            form.reset(); // Reset form fields
            setAlertInfo({
              show: true,
              message: "Staff member added successfully!",
              type: "success",
            });
          } else {
            setAlertInfo({
              show: true,
              message: "Failed to add staff member!",
              type: "critical",
            });
          }
          setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
        })
        .catch((error) => {
          // Handle any errors during mutation
          setAlertInfo({
            show: true,
            message: "Failed to add staff member!",
            type: "critical",
          });
          setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
        });
    }
  };

  // Handling loading and error states
  if (loading) return <p>Loading...' </p>;
  if (error) return <p>Error! ${error.message}</p>;

  return (
    <div>
      <h1>Staffing</h1>
      <NoticeBox className={classes.pad} title="Add New Staff Members">
        To add new staff members, please fill in the form below. Make sure to
        validate the information before submitting.
      </NoticeBox>

      <Form onSubmit={onSubmit}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} autoComplete="on">
            <DataTable>
              <TableBody>
                <DataTableRow>
                  <DataTableCell staticStyle="True">
                    <Field
                      name="Staff Name"
                      label="Staff Name"
                      placeholder="Enter Staff Name"
                      component={InputFieldFF}
                      validate={
                        submitAttempted
                          ? composeValidators(hasValue)
                          : undefined
                      }
                    />
                  </DataTableCell>
                </DataTableRow>
                <DataTableRow>
                  <DataTableCell staticStyle="True">
                    <Field
                      name="Department"
                      label="Department"
                      placeholder="Enter Department"
                      component={InputFieldFF}
                      validate={
                        submitAttempted
                          ? composeValidators(hasValue)
                          : undefined
                      }
                    />
                  </DataTableCell>
                </DataTableRow>
              </TableBody>
              <tfoot>
                <DataTableRow>
                  <DataTableCell staticStyle="True">
                    <Button type="submit" primary>
                      Add Staff
                    </Button>
                  </DataTableCell>
                </DataTableRow>
              </tfoot>
            </DataTable>
          </form>
        )}
      </Form>
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
              <AlertBar critical>{alertInfo.message}</AlertBar>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
