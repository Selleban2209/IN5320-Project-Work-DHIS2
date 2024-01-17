import React, { useState, useEffect } from "react";
import classes from "../App.module.css";
import { Input } from "@dhis2-ui/input";
import { Button } from "@dhis2-ui/button";

import {
  DataTable,
  TableHead,
  TableBody,
  TableFoot,
  DataTableRow,
  DataTableColumnHeader,
  DataTableCell,
} from "@dhis2-ui/table";

export function StockDataTable({ stockData, handleSubmit, onChangeStock, newStockValues, fieldText }) {
  const [sortedData, setSortedData] = useState(stockData);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const sortData = (data, { key, direction }) => {
    return [...data].sort((a, b) => {
      if (key === "stock_amount") {
        // When sorting by amount, parse the values to numbers.
        // If parsing fails (NaN), default to 0.
        const amountA = parseFloat(a.values[2].value) || 0;
        const amountB = parseFloat(b.values[2].value) || 0;

        // Debug print statements
        console.log(`Comparing amounts - A: ${amountA}, B: ${amountB}`);

        return direction === "asc" ? amountA - amountB : amountB - amountA;
      } else {
        // Default to sorting by name.
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return direction === "asc" ? -1 : 1;
        }
        if (nameA > nameB) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    });
  };
  useEffect(() => {
    if (sortConfig.direction !== "default") {
      const sorted = sortData(stockData, sortConfig);
      setSortedData(sorted);
    } else {
      setSortedData(stockData); // Default to the original order
    }
  }, [stockData, sortConfig]);
  const onSortIconClick = (key) => {
    setSortConfig((currentSortConfig) => {
      if (currentSortConfig.key === key) {
        // If the same column is clicked, toggle the direction
        return {
          key,
          direction: currentSortConfig.direction === "asc" ? "desc" : "asc",
        };
      } else {
        // If a different column is clicked, start with ascending sort
        return { key, direction: "asc" };
      }
    });
  };
  return (
    <DataTable className={classes.table}>
      {/* Table Headers */}
      <TableHead>
        <DataTableRow>
          <DataTableColumnHeader
            name="Name"
            onSortIconClick={() => onSortIconClick("name")}
            sortDirection={
              sortConfig.key === "name" ? sortConfig.direction : "default"
            }
            sortIconTitle="Sort by name"
          >
            Name
          </DataTableColumnHeader>
          <DataTableColumnHeader
            name="stock_amount"
            onSortIconClick={() => onSortIconClick("stock_amount")}
            sortDirection={
              sortConfig.key === "stock_amount"
                ? sortConfig.direction
                : "default"
            }
            sortIconTitle="Sort by stock amount"
          >
            Current Stock
          </DataTableColumnHeader>
          <DataTableColumnHeader></DataTableColumnHeader>
        </DataTableRow>
      </TableHead>

      {/* Table Body */}
      <TableBody>
        {sortedData.map((element) => (
          <DataTableRow key={element.id}>
            <DataTableCell>
              {element.name.split("Commodities - ")[1]}
            </DataTableCell>
            <DataTableCell>{element.values[2].value}</DataTableCell>
            <DataTableCell>
            <Input
                type="number"
                placeholder={fieldText}
                value={newStockValues[element.id] || ""}
                onChange={(event) => onChangeStock(event, element.id)}
            />
            </DataTableCell>
          </DataTableRow>
        ))}
      </TableBody>

      {/* Table Footer */}
      <TableFoot>
        <DataTableRow>
          <DataTableCell staticStyle="True" colSpan="4">
            <Button primary onClick={handleSubmit}>
              Submit
            </Button>
          </DataTableCell>
        </DataTableRow>
      </TableFoot>
    </DataTable>
  );
}
