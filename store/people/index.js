import { dataSort } from "@/mixins/store";
export default {
  state: () => ({
    accountStatuses: [],
    roles: []
  }),
  mutations: {
    setRoles(state, roles) {
      state.roles = dataSort.populateList({
        targetArray: state.roles,
        newArray: roles,
        sortBy: "name"
      });
    },
    setAccountStatuses(state, accountStatuses) {
      state.accountStatuses = dataSort.populateList({
        targetArray: state.accountStatuses,
        newArray: accountStatuses,
        sortBy: "name"
      });
    }
  }
};
