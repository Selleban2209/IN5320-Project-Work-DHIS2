export function getCommodityQuery(orgUnit, period) {
  return {
    dataSets: {
      resource: "dataSets/ULowA8V3ucd",
      params: {
        fields: [
          "name",
          "id",
          "dataSetElements[dataElement[name,id,categoryCombo[name,id,categoryOptionCombos[name,id]], dataElementGroups[name,id]]]",
        ],
      },
    },

    dataValueSets: {
      resource: "dataValueSets",
      params: {
        orgUnit: orgUnit,
        dataSet: "ULowA8V3ucd",
        period: period,
      },
    },

    DataStoreDispensingHistory: {
        resource:  "dataStore/IN5320<31>/Dispensing-History"
    }  
  }

}

export function getDataMutationQuery() {
  return {
    resource: "dataValueSets",
    type: "create",
    dataSet: "aLpVgfXiz0f",
    data: ({ lifeCommodityMutate }) => ({
      dataValues: lifeCommodityMutate,
    }),
  };
}

export function getDataStoreQuery(){
    return {
      DataStoreDispensingHistory: {
        resource:  "dataStore/IN5320<31>/Dispensing-History"
      }         
    }
}

export function getDataStoreMutationQuery(){
    return {
        resource:  "dataStore/IN5320<31>/Dispensing-History",
        type: 'update',
        data:  (dispensingHistory ) => ({
            dispensingHistory
        }),
    }

}

