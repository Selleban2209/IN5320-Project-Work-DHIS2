import React from "react";
import { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  DataTable,
  TableHead,
  DataTableCell,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableColumnHeader,
  IconChevronRight24,
  IconChevronDown24,
  TableCellHead,
  TableRowHead,
  TableRow,
  Table,
  TableCell,
  TableBody,
} from "@dhis2/ui";

// Function to get the query for fetching Store Management data
const getStoreManagementDataQuery = () => {
  return {
    StoreManagementHistory: {
      resource: "dataStore/IN5320<31>/StoreManagement-History",
    },
  };
};

// Component to display the details of individual items in the Store Management
function StoreManagementDetails(props) {
  const { newStock, previousStock } = props;

  return (
    <Table>
      <TableHead>
        <TableRowHead>
          <TableCellHead>Name</TableCellHead>
          <TableCellHead>Previous Stock</TableCellHead>
          <TableCellHead>Added Stock</TableCellHead>
          <TableCellHead>Total Stock</TableCellHead>
          <TableCellHead></TableCellHead>
        </TableRowHead>
      </TableHead>
      <TableBody>
        {newStock.map((item, index) => {
          const prevItem = previousStock[index];
          const endBalanceObj = prevItem.values.find(
            (value) => value.name === "End Balance"
          );
          const endBalance = endBalanceObj
            ? endBalanceObj.value
            : "Not available";

          // Removes "Commodities - " from the item name
          const itemName = item.name.replace("Commodities - ", "");
          if (item.newValue != undefined) {
            return (
              <TableRow key={item.id}>
                <TableCell style={{ textAlign: "center" }}>
                  {itemName}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {endBalance}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {item.newValue}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {parseInt(item.newValue) + parseInt(endBalance)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          }
        })}
      </TableBody>
    </Table>
  );
}

// Component to display the Store Management history with expandable details
export function StoreManagementHistory() {
  // Fetch Store Management data using the app-runtime
  const { loading, error, data } = useDataQuery(getStoreManagementDataQuery());
  const [expandedRow, setExpandedRow] = useState(null);

  // Display loading state while data is being fetched
  if (loading) return <div>Loading...</div>;
  // Display error message if there's an error fetching data
  if (error) return <div>Error: {error.message}</div>;

  // If data is available, format and display it
  if (data) {
    console.log(data);
    let tableData = data.StoreManagementHistory.history;
    console.log(tableData);

    let rowData = tableData.map((item, index) => {
      console;
      return (
        <React.Fragment key={index}>
          <DataTableRow
            onExpandToggle={() =>
              setExpandedRow(expandedRow === index ? null : index)
            }
          >
            <DataTableCell>{item.date}</DataTableCell>
            <DataTableCell>{item.managedBy}</DataTableCell>
            <DataTableCell style={{ textAlign: "center" }}>
              {item.previousStock.length}
            </DataTableCell>
            <DataTableCell style={{ textAlign: "center" }}>
              {item.newStock.length}
            </DataTableCell>
            <DataTableCell
              onClick={() =>
                setExpandedRow(expandedRow === index ? null : index)
              }
            >
              {expandedRow === index ? (
                <IconChevronDown24 />
              ) : (
                <IconChevronRight24 />
              )}
            </DataTableCell>
          </DataTableRow>
          {expandedRow === index && (
            <TableRow>
              <DataTableCell colSpan={5}>
                <StoreManagementDetails
                  newStock={item.newStock}
                  previousStock={item.previousStock}
                />
              </DataTableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    });

    // Display the DataTable with the formatted data
    return (
      <DataTable>
        <DataTableHead>
          <DataTableRow>
            <DataTableColumnHeader>Date</DataTableColumnHeader>
            <DataTableColumnHeader>Managed By</DataTableColumnHeader>
            <DataTableColumnHeader>
              Previous Amount of Commodities
            </DataTableColumnHeader>
            <DataTableColumnHeader>
              New Amount of Commodities
            </DataTableColumnHeader>
            <DataTableColumnHeader>Show Details</DataTableColumnHeader>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>{rowData}</DataTableBody>
      </DataTable>
    );
  }
  // If no data is available, return null
  return null;
}
