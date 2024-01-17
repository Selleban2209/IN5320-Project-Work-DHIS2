import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";
import { IconUserGroup16, IconClockHistory16, IconEditItems16, IconFileDocument16, IconArrowDown16, IconDashboardWindow16 } from "@dhis2/ui-icons";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        icon={<IconDashboardWindow16 />}
        label="Overview"
        active={props.activePage == "Overview"}
        onClick={() => props.activePageHandler("Overview")}
      />
      <MenuItem
        icon={<IconArrowDown16 />}
        label="Recieve Commodities"
        active={props.activePage == "StoreManagement"}
        onClick={() => props.activePageHandler("StoreManagement")}
      />
      <MenuItem
        icon={<IconFileDocument16 />}
        label="Dispense"
        active={props.activePage == "Dispense"}
        onClick={() => props.activePageHandler("Dispense")}
      />
      <MenuItem
        icon={<IconEditItems16 />}
        label="Stock Recount"
        active={props.activePage == "StockRecount"}
        onClick={() => props.activePageHandler("StockRecount")}
      />

      <MenuItem
        icon={<IconClockHistory16 />}
        label="Transaction History"
        active={props.activePage == "TransactionHistory"}
        onClick={() => props.activePageHandler("TransactionHistory")}
      />

      <MenuItem
        icon = {<IconUserGroup16 />}
        label="Staffing"
        active={props.activePage == "Staffing"}
        onClick={() => props.activePageHandler("Staffing")}
      />

    </Menu>
  );
}
