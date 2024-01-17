import { useDataQuery } from "@dhis2/app-runtime";

function getDataStoreQuery() {
  return {
    staffing: {
      resource: "dataStore/IN5320<31>/Staff",
    },
  };
}

export function useStaffing() {
  let staffingInfo;
  const { loading, error, data } = useDataQuery(getDataStoreQuery());
  if (data) {
    staffingInfo = data;
  }
  return { loading, error, staffingInfo };
}
