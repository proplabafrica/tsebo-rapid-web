import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "createdBy.roles",
      "salesOrders.workRequests",
      "status",
      "workRequests"
    ],
    detailedAssociations: [
      "createdBy",
      "items.deliveryType",
      "items.material.currency",
      "items.service.currency",
      "logs.comment",
      "logs.createdBy",
      "quotations.createdBy.roles",
      "quotations.currency",
      "quotations.files",
      "quotations.purchaseOrders",
      "quotations.status",
      "quotations.vendor",
      "salesOrders.workRequests",
      "salesOrders.workRequests.unit",
      "status",
      "workRequests",
      "workRequests.unit"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    tenderProcesses: [],
    refresh: true
  }),
  mutations: {
    setTenderProcess(state, tenderProcess) {
      state.tenderProcesses = dataSort.addOjectToList({
        targetArray: state.tenderProcesses,
        newObject: tenderProcess,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setTenderProcesses(state, tenderProcesses) {
      state.tenderProcesses = dataSort.populateList({
        targetArray: state.tenderProcesses,
        newArray: tenderProcesses,
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
    async getTenderProcesses({ commit, state }, $this) {
      $this.tenderProcessesLoading = true;
      var { associations, tenderProcesses, pagination, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        bidSearch,
        bidStatusCodes = [],
        bidSortBy = "created_at",
        bidSortOrder = "desc",
        tenderProcessesRangeBy = null,
        tenderProcessesRangeFrom,
        tenderProcessesRangeTo,
        unitId
      } = $this;

      if (refresh == false && !bidSearch && !unitId) {
        $this.tenderProcessesLoading = false;
        return ($this.tenderProcesses = tenderProcesses);
      }

      try {
        const response = await $axios.get("tender-processes", {
          params: {
            associations,
            page,
            perPage,
            search: bidSearch,
            sortBy: bidSortBy,
            sortOrder: bidSortOrder,
            statusCodes: bidStatusCodes,
            rangeBy: tenderProcessesRangeBy,
            rangeFrom: tenderProcessesRangeFrom,
            rangeTo: tenderProcessesRangeTo,
            byUnitId: unitId

          }
        });

        commit("setTenderProcesses", response.data.data);
        $this.tenderProcesses = response.data.data;

        console.log("tender..", response.data.data)
        $this.tenderProcessesLoading = false;
        if (bidSearch) commit("toggleRefresh");
      } catch (error) {
        $this.tenderProcesses = tenderProcesses;
        $this.tenderProcessesLoading = false
        console.log(error);
      }
    },
    async getTenderProcessesCount({ state }, $this) {
      $this.tenderProcessesLoading = true;
      const { $axios, bidSearch, bidStatusCodes = [] } = $this;

      try {
        const response = await $axios.get("tender-processes/get-count", {
          params: { search: bidSearch, statusCodes: bidStatusCodes }
        });
        $this.tenderProcessesCount = response.data.count;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
