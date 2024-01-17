import classes from "../../App.module.css";
import React from "react";
import { useState } from "react";
import { getDataStoreQuery } from "../Dispensing/DispensingQueries";
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

// Component to display a single data set on click
export function DataSetonClick(props) {
  let tableData = props.data;

  // Render a table with details of the selected data set
  return (
    <Table>
      <TableHead>
        <TableRowHead>
          <TableCellHead>Commodity Name</TableCellHead>
          <TableCellHead>Dispensed To</TableCellHead>
          <TableCellHead>Ammount</TableCellHead>
        </TableRowHead>
      </TableHead>
      <TableBody>
        {tableData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>{item.commodityName}</TableCell>
            <TableCell>{item.DispensedTo}</TableCell>
            <TableCell>{item.Amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Component to display the dispensing history with expandable details
export function DispensingHistoryComponent(props) {
  let tableData = props.data;
  // Initialize state for tracking expanded rows
  const [expandedRow, setExpandedRow] = useState(null);
  // Map through the data to format and display in a DataTable
  let RowData = tableData.map((item, index) => {
    return (
      <React.Fragment>
        <DataTableRow
          key={index}
          onExpandToggle={() =>
            setExpandedRow(expandedRow === index ? null : index)
          }
        >
          <DataTableCell>Dispensing</DataTableCell>
          <DataTableCell>{item.DispensedBy}</DataTableCell>
          <DataTableCell>{item.TimeDispensed}</DataTableCell>
          <DataTableCell>{item.Commodities.length}</DataTableCell>
          <DataTableCell
            onClick={() => setExpandedRow(expandedRow === index ? null : index)}
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
              <DataSetonClick data={item.Commodities} />
            </DataTableCell>
          </TableRow>
        )}
        <DataTableRow></DataTableRow>
      </React.Fragment>
    );
  });

  // Render the DataTable with the formatted data
  return (
    <DataTable>
      <DataTableHead>
        <DataTableRow>
          <DataTableColumnHeader>Transaction type</DataTableColumnHeader>
          <DataTableColumnHeader>Dispensed By</DataTableColumnHeader>
          <DataTableColumnHeader>Time of Dispensing</DataTableColumnHeader>
          <DataTableColumnHeader>Items dispensed</DataTableColumnHeader>
          <DataTableColumnHeader>Show Details</DataTableColumnHeader>
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>{tableData && RowData}</DataTableBody>
      <DataTableBody></DataTableBody>
    </DataTable>
  );
}

// Component to fetch and display dispensing history
export function DispensingHistory(props) {
  // Fetch dispensing data using the app-runtime
  const {
    loading,
    error,
    data: dispensingData,
  } = useDataQuery(getDataStoreQuery());

  // Display loading state while data is being fetched
  if (loading) return <div>Loading...</div>;
  // Display error message if there's an error fetching data
  if (error) return <div>Error: {error.message}</div>;

  // If data is available, format and display it
  if (dispensingData) {
    let dispensingHistory =
      dispensingData.DataStoreDispensingHistory.dispensingHistory
        .dispensingHistory;

    return (
      <div className={classes.HistoryTableWrapper}>
        {<DispensingHistoryComponent data={dispensingHistory} />}
      </div>
    );
  }
  // If no data is available, prompt the user to refresh
  return <h1>Refresh to refetch data</h1>;
}
