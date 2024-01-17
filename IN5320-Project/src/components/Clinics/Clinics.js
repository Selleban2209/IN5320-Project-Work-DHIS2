import React from "react";
import { useState, useEffect } from "react";
import classes from "../../App.module.css";
import { useDataQuery } from "@dhis2/app-runtime";
import { Button, NoticeBox } from "@dhis2/ui";
import {
  DataTable,
  TableHead,
  TableBody,
  DataTableRow,
  DataTableColumnHeader,
  DataTableCell,
  TableFoot,
} from "@dhis2-ui/table";
import { AllNearbyClinics } from "./AllNearbyClinics";

export function Clinics(props) {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "displayName",
    direction: "asc",
  });

  // Get the parent organisation unit of the user's organization and get their children
  const request = {
    request0: {
      resource: `organisationUnits/a1dP5m3Clw4?fields=parent[children[id,displayName]]`,
    },
  };

  const { loading, error, data } = useDataQuery(request);

  const sortData = (data, { key, direction }) => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      if (key === "displayName") {
        const nameA = a.displayName.toUpperCase();
        const nameB = b.displayName.toUpperCase();
        if (nameA < nameB) {
          return direction === "asc" ? -1 : 1;
        }
        if (nameA > nameB) {
          return direction === "asc" ? 1 : -1;
        }
      }
      return 0;
    });
  };

  useEffect(() => {
    if (data && data.request0 && data.request0.parent.children) {
      const sorted = sortData(data.request0.parent.children, sortConfig);
      setSortedData(sorted);
    }
  }, [data, sortConfig]);

  const onSortIconClick = () => {
    setSortConfig({
      key: "displayName",
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }
  // Returns a list of nearby clinics with their stock inventory
  return (
    <>
      <div>
        <h1>Nearby Clinics</h1>
        <NoticeBox
          className={classes.pad}
          title="Stock Inventory of Nearby Clinics"
        >
          This dashboard provides a real-time overview of current medicine
          inventory of nearby clinics.
        </NoticeBox>
      </div>
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader
              onSortIconClick={onSortIconClick}
              sortDirection={sortConfig.direction}
            >
              Name
            </DataTableColumnHeader>
            <DataTableColumnHeader>Stock Amount</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((clinic) => (
            <DataTableRow key={clinic.id}>
              <DataTableCell>{clinic.displayName}</DataTableCell>
              <DataTableCell>
                <AllNearbyClinics
                  medicine={props.medicine}
                  clinicId={clinic.id}
                />
              </DataTableCell>
            </DataTableRow>
          ))}
        </TableBody>
        {/* Table Footer */}
        <TableFoot>
          <DataTableRow>
            <DataTableCell staticStyle="True" colSpan="2">
              <Button onClick={() => props.activePageHandler("Overview")}>
                Back
              </Button>
            </DataTableCell>
          </DataTableRow>
        </TableFoot>
      </DataTable>
    </>
  );
}
