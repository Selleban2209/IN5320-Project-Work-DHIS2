import { useDataQuery } from "@dhis2/app-runtime";
import { getUserQuery } from "../APICalls/getUserQuery";

function mergeUserData(data) {
  let mergedUserData = {};
  mergedUserData.id = data.me.id;
  mergedUserData.name = data.me.name;
  mergedUserData.orgUnit = "a1dP5m3Clw4";
  mergedUserData.userAssignedUnit = data.me.organisationUnits[0].id;

  return mergedUserData;
}

export function useUserInfo() {
  const { loading, error, data } = useDataQuery(getUserQuery());
  let userDataInfo;

  if (data) {
    userDataInfo = mergeUserData(data);
  }
  return { loading, error, userDataInfo };
}
