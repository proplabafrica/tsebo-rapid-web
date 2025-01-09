import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["createdBy", "status", "userBilledTo", "workRequests", "items"],
    detailedAssociations: [
      "files",
      "floatRequests.items",
      
      "items.material.currency",
      "items.service.currency",
      "items.materialCost",
      "items.serviceCost",
      "status",
      "userBilledTo",
      "workRequests"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    invoices: [],
    refresh: true
  }),
  mutations: {
    setInvoice(state, invoice) {
      state.invoices = dataSort.addOjectToList({
        targetArray: state.invoices,
        newObject: invoice,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setInvoices(state, invoices) {
      state.invoices = dataSort.populateList({
        targetArray: state.invoices,
        newArray: invoices,
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
  },
  actions: {
    async getInvoices({ commit, state }, $this) {
      $this.invoicesLoading = true;
      var { associations, invoices, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        invoiceSearch = null,
        invoiceStatusCodes = [],
        invoicesPerPage = perPage,
        invoicesSortBy = "created_at",
        invoicesSortOrder = "desc",
        invoiceWorkRequestIds = [],
        usersBilledTo = []
      } = $this;

      if (refresh == false && !invoiceSearch) {
        $this.invoicesLoading = false;
        return ($this.invoices = invoices);
      }

      try {
        const response = await $axios.get("invoices", {
          params: {
            associations,
            byStatusCodes: invoiceStatusCodes,
            byWorkRequestIds: invoiceWorkRequestIds,
            byUsersBilledTo: usersBilledTo,
            page,
            perPage: invoicesPerPage,
            search: invoiceSearch,
            sortBy: invoicesSortBy,
            sortOrder: invoicesSortOrder
          }
        });

        if (!invoiceSearch) {
          commit("setInvoices", response.data.data);
        } else {
          if (invoiceSearch) commit("toggleRefresh");
        }
        $this.invoices = response.data.data;
        $this.invoicesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
