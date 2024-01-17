import { useState, useEffect } from "react";
import classes from "../../App.module.css";

import React from "react";
import {
  DataTable,
  DataTableRow,
  DataTableColumnHeader,
  TableHead,
  TableBody,
  DataTableCell,
  Button,
  NoticeBox,
} from "@dhis2/ui";

export function Overview({ activePageHandler, medicineData }) {

    // Define the state variables
    const [sortedData, setSortedData] = useState(medicineData);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
    // Function to sort data based on key and direction
    const sortData = (data, { key, direction }) => {
        return [...data].sort((a, b) => {
          if (key === 'amount') {
            // Sort by amount: convert string to float, defaulting to 0 if conversion fails
            const amountA = parseFloat(a.values[2].value) || 0;
            const amountB = parseFloat(b.values[2].value) || 0;
      
            // Debug print statements
            console.log(`Comparing amounts - A: ${amountA}, B: ${amountB}`);
      
            return direction === 'asc' ? amountA - amountB : amountB - amountA;
          } else if (key === 'consumed') {
            // Sort by consumed: convert string to float, defaulting to 0 if conversion fails
            const amountA = parseFloat(a.values[0].value) || 0;
            const amountB = parseFloat(b.values[0].value) || 0;
      
            return direction === 'asc' ? amountA - amountB : amountB - amountA;
          }else {
            // Default sort by name: compare strings in a case-insensitive manner
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if (nameA < nameB) {
              return direction === 'asc' ? -1 : 1;
            }
            if (nameA > nameB) {
              return direction === 'asc' ? 1 : -1;
            }
            return 0;
          }
        });
      };
      
  
    // Effect to handle data sorting on changes in medicineData or sortConfig
    useEffect(() => {
      if (sortConfig.direction !== 'default') {
        const sorted = sortData(medicineData, sortConfig);
        setSortedData(sorted);
      } else {
        setSortedData(medicineData); // Default to the original order
      }
    }, [medicineData, sortConfig]);
  
    // Handler for sorting when a column header is clicked
    const onSortIconClick = (key) => {
      setSortConfig((currentSortConfig) => {
        if (currentSortConfig.key === key) {
          // Toggle the direction if the same column is clicked
          return {
            key,
            direction: currentSortConfig.direction === 'asc' ? 'desc' : 'asc'
          };
        } else {
          // Default to ascending sort if a different column is clicked
          return { key, direction: 'asc' };
        }
      });
    };
  
  
    // Render the overview table
    return (
      <div>
        <div >
            <h1>Overview</h1>
            <NoticeBox className={classes.pad} title="Stay Updated on Your Medicine Stock">
                This dashboard provides a real-time overview of our current medicine inventory. Easily manage dispensing, track stock levels, and view inventories of nearby clinics.
            </NoticeBox>
        </div>
        <DataTable>
            <TableHead>
            <DataTableRow>
            <DataTableColumnHeader
                name="Name"
                onSortIconClick={() => onSortIconClick('name')}
                sortDirection={sortConfig.key === 'name' ? sortConfig.direction : 'default'}
                sortIconTitle="Sort by name"
            >
                Name
            </DataTableColumnHeader>
            <DataTableColumnHeader
                name="Amount"
                onSortIconClick={() => onSortIconClick('amount')}
                sortDirection={sortConfig.key === 'amount' ? sortConfig.direction : 'default'}
                sortIconTitle="Sort by amount"
            >
                Amount
            </DataTableColumnHeader>
           
            <DataTableColumnHeader
                name="consumed"
                onSortIconClick={() => onSortIconClick('consumed')}
                sortDirection={sortConfig.key === 'consumed' ? sortConfig.direction : 'default'}
                sortIconTitle="Sort by amount consumed"
            >
                Consumed
            </DataTableColumnHeader>
                <DataTableColumnHeader></DataTableColumnHeader>
                <DataTableColumnHeader></DataTableColumnHeader>
            </DataTableRow>
            </TableHead>
            <TableBody>
            {sortedData.map((commodity) => (
                <DataTableRow key={commodity.id}>
                <DataTableCell>
                    {commodity.name.split("Commodities - ")[1]}
                </DataTableCell>
                <DataTableCell>{commodity.values[2].value}</DataTableCell>
                <DataTableCell>{commodity.values[0].value}</DataTableCell>
                <DataTableCell>
                    <Button
                    name="Primary button"
                    onClick={() => activePageHandler("Dispense", commodity.id)}
                    basic
                    value="Dispense"
                    >
                    Dispense
                    </Button>
                </DataTableCell>
                <DataTableCell>
                    <Button
                    name="Secondary button"
                    onClick={() => activePageHandler("Clinics", commodity.id)}
                    basic
                    value="Near Clinics"
                    >
                    Nearby Clinics
                    </Button>
                </DataTableCell>
                </DataTableRow>
            ))}
            </TableBody>
        </DataTable>
    </div>
    );
  }