import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    failureTypes: []
  }),
  mutations: {
    setFailureTypes(state, failureTypes) {
      state.failureTypes = dataSort.populateList({
        targetArray: state.failureTypes,
        newArray: failureTypes,
        sortBy: "name"
      });
    }
  }
};
