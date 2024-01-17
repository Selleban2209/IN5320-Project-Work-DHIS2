import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";

export function AllNearbyClinics({ medicine, clinicId }) {
  const request = {
    request0: {
      resource: `/dataValues.json?de=${medicine}&pe=202310&ou=${clinicId}&co=J2Qf1jtZuj8`,
    },
  };

  const { loading, error, data } = useDataQuery(request);
  if (error) {
    if (error.message === "Data value does not exist") {
      return <p>0</p>;
    }
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  if (data) {
    console.log("Each Clinic API response:", data);
    //returns the value of a commodity
    return data.request0[0];
  }
}
