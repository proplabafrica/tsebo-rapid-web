import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    deliveryLogs: [],
    refresh: true
  }),
  mutations: {
    setDeliveryLog(state, deliveryLog) {
      state.deliveryLogs = dataSort.addOjectToList({
        targetArray: state.deliveryLogs,
        newObject: deliveryLog,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setDeliveryLogs(state, deliveryLogs) {
      state.deliveryLogs = dataSort.populateList({
        targetArray: state.deliveryLogs,
        newArray: deliveryLogs,
        sortBy: "created_at",
        sortOrder: "desc"
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
