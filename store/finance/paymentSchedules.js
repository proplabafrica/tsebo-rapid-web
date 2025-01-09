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
    paymentSchedules: [],
    refresh: true
  }),
  mutations: {
    setPaymentSchedule(state, paymentSchedule) {
      state.paymentSchedules = dataSort.addOjectToList({
        targetArray: state.paymentSchedules,
        newObject: paymentSchedule,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setPaymentSchedules(state, paymentSchedules) {
      state.paymentSchedules = dataSort.populateList({
        targetArray: state.paymentSchedules,
        newArray: paymentSchedules,
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
