export function mergeData(data) {
  // Checks if data is defined and contains the properties dataValueSets and dataSets.
  if (!data || !data.dataValueSets || !data.dataSets) {
    // Handle the case where data is not in the expected format or is undefined
    console.error("Data is undefined or does not have the expected structure.");
    return []; // or return whatever is appropriate in this case
  }

  //  Creates an array of unique periods from data.dataValueSets.dataValues
  const periods = [
    ...new Set(
      data.dataValueSets.dataValues.map((dataValue) => dataValue.period)
    ),
  ];

  // Maps over each period to process the data associated with that period
  return periods.map((period) => {
    const commodities = data.dataSets.dataSetElements.map((dataset) => {
      const endBalanceValue = data.dataValueSets.dataValues.find(
        (dataValue) =>
          dataValue.dataElement === dataset.dataElement.id &&
          dataValue.period === period &&
          dataValue.categoryOptionCombo === "rQLFnNXXIL0"
      );
      const consumptionValue = data.dataValueSets.dataValues.find(
        (dataValue) =>
          dataValue.dataElement === dataset.dataElement.id &&
          dataValue.period === period &&
          dataValue.categoryOptionCombo === "J2Qf1jtZuj8"
      );
      const quantityOrderedValue = data.dataValueSets.dataValues.find(
        (dataValue) =>
          dataValue.dataElement === dataset.dataElement.id &&
          dataValue.period === period &&
          dataValue.categoryOptionCombo === "KPP63zJPkOu"
      );

      return {
        id: dataset.dataElement.id,
        name: dataset.dataElement.name,
        //Determines the group of the commodity based on its data element groups
        group:
          dataset.dataElement.dataElementGroups[0].name == "Commodities" &&
          dataset.dataElement.dataElementGroups[1] !== null
            ? dataset.dataElement.dataElementGroups[1]
            : dataset.dataElement.dataElementGroups[0],
        values: [
          {
            name: dataset.dataElement.categoryCombo.categoryOptionCombos[0]
              .name,
            id: consumptionValue ? consumptionValue.categoryOptionCombo : null,
            value: consumptionValue ? consumptionValue.value : null,
          },
          {
            name: dataset.dataElement.categoryCombo.categoryOptionCombos[1]
              .name,
            id: quantityOrderedValue
              ? quantityOrderedValue.categoryOptionCombo
              : null,
            value: quantityOrderedValue ? quantityOrderedValue.value : null,
          },
          {
            name: dataset.dataElement.categoryCombo.categoryOptionCombos[2]
              .name,
            id: endBalanceValue ? endBalanceValue.categoryOptionCombo : null,
            value: endBalanceValue ? endBalanceValue.value : null,
          },
        ],
      };
    });
    //Each period's data is returned as an object containing the period and an array of commodities.
    return {
      period,
      commodities,
    };
  })[0];

  //Merge data function is a continuation on an implementation posted by lecturer Jens(username Jensug) In the IN5320 UIO discource
}
