import { dataSort } from "@/mixins/store";
export default {
  state: () => ({
    associations: ["organizations", "roles"],
    detailedAssociations: [
      "addresses",
      "facilityManagers",
      "organizations",
      "roles",
      "technician.trades"
    ],
    pagination: {
      total: 0,
      perPage: 500,
      page: 1,
      lastPage: null
    },
    refresh: true,
    users: []
  }),
  mutations: {
    setUser(state, user) {
      state.users = dataSort.addOjectToList({
        targetArray: state.users,
        newObject: user,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setUsers(state, users) {
      state.users = dataSort.populateList({
        targetArray: state.users,
        newArray: users,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setPagination(state, { total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      state.pagination = { total, perPage, page, lastPage };
    },
    toggleRefresh(state, refresh = true) {
      state.refresh = refresh;
    }
  }
};
