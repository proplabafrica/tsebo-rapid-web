import { concat, orderBy, uniqBy } from "lodash";

export const dataSort = {
  populateList({
    targetArray,
    newArray,
    uniqId = "id",
    sortBy,
    sortOrder = "asc"
  }) {
    newArray = uniqBy(concat(newArray, targetArray), uniqId);
    newArray = orderBy(newArray, [sortBy], [sortOrder]);
    return newArray;
  },
  addOjectToList({
    targetArray,
    newObject,
    uniqId = "id",
    sortBy,
    sortOrder = "asc"
  }) {
    const newArray = targetArray.map((element) => {
      if (newObject && element && newObject[uniqId] == element[uniqId]) {
        element = newObject;
      }
      return element;
    });

    return this.populateList({
      targetArray: newArray,
      newArray: [newObject],
      uniqId,
      sortBy,
      sortOrder
    });
  }
};
