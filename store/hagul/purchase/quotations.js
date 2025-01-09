import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "createdBy",
      "currency",
      "files",
      "purchaseOrders",
      "status",
      "vendor"
    ],
    detailedAssociations: ["currency", "files", "items", "status", "vendor"],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    quotations: [],
    refresh: true
  }),
  mutations: {
    setQuotation(state, quotation) {
      state.quotations = dataSort.addOjectToList({
        targetArray: state.quotations,
        newObject: quotation,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setQuotations(state, quotations) {
      state.quotations = dataSort.populateList({
        targetArray: state.quotations,
        newArray: quotations,
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
