import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["tenderProcess.status"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    rfqs: [],
    refresh: true
  }),
  mutations: {
    setRfq(state, rfq) {
      state.rfqs = dataSort.addOjectToList({
        targetArray: state.rfqs,
        newObject: rfq,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setRfqs(state, rfqs) {
      state.rfqs = dataSort.populateList({
        targetArray: state.rfqs,
        newArray: rfqs,
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
