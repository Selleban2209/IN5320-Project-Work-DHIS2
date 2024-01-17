import React from "react";
import {useState} from "react";
import {useDataQuery} from "@dhis2/app-runtime";
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

// Function to define the query for fetching stock recount data
const getStockRecountDataQuery = () => {
    return {
        stockRecountHistory: {
            resource: "dataStore/IN5320<31>/StockRecount-History",
        },
    };
};

// Component to display details of selected stock recount
export function StockRecountDetails(props) {
    const {newStock, previousStock} = props;

    // Rendering a table with stock recount details
    return (
        <Table>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>Name</TableCellHead>
                    <TableCellHead>Previous Stock</TableCellHead>
                    <TableCellHead>New Stock</TableCellHead>
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

                    return (
                        <TableRow key={item.id}>
                            <TableCell style={{textAlign: "center"}}>{itemName}</TableCell>
                            <TableCell style={{textAlign: "center"}}>
                                {endBalance}
                            </TableCell>
                            <TableCell style={{textAlign: "center"}}>
                                {item.newValue}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

// Main component to display stock recount history
export function StockRecountHistory() {
    // Using useDataQuery hook to fetch data
    const {loading, error, data: stockRecountData,} = useDataQuery(getStockRecountDataQuery());
    // State to manage which row is expanded
    const [expandedRow, setExpandedRow] = useState(null);

    // Handling loading and error states
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Rendering the table when data is available
    if (stockRecountData) {
        let tableData = stockRecountData.stockRecountHistory.quarters;

        // Mapping over tableData to create rows for the table
        let rowData = tableData.map((item, index) => {
            return (
                <React.Fragment key={index}>
                    <DataTableRow
                        onExpandToggle={() =>
                            setExpandedRow(expandedRow === index ? null : index)
                        }
                    >
                        <DataTableCell>{item.date}</DataTableCell>
                        <DataTableCell>{item.managedBy}</DataTableCell>
                        <DataTableCell>{item.quarter}</DataTableCell>
                        <DataTableCell style={{textAlign: "center"}}>{item.previousStock.length}</DataTableCell>
                        <DataTableCell style={{textAlign: "center"}}>{item.newStock.length}</DataTableCell>
                        <DataTableCell
                            onClick={() =>
                                setExpandedRow(expandedRow === index ? null : index)
                            }
                        >
                            {
                                expandedRow === index ? (
                                    <IconChevronDown24/>
                                ) : (
                                    <IconChevronRight24/>
                                )
                            }
                        </DataTableCell>
                    </DataTableRow>
                    {expandedRow === index && (
                        <TableRow>
                            <DataTableCell colSpan={6}>
                                <StockRecountDetails
                                    newStock={item.newStock}
                                    previousStock={item.previousStock}
                                />
                            </DataTableCell>
                        </TableRow>
                    )}
                </React.Fragment>
            );
        });
        // Main table structure
        return (
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader>Date</DataTableColumnHeader>
                        <DataTableColumnHeader>Managed By</DataTableColumnHeader>
                        <DataTableColumnHeader>Quarter</DataTableColumnHeader>
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
    // Returning null if no data is available
    return null;
}
