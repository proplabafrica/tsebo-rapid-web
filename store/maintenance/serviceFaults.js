import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      sortBy: "name",
      sortOrder: "asc",
      lastPage: null
    },
    serviceFaults: [],
    refresh: true
  }),
  mutations: {
    setServiceFault(state, serviceFault) {
      state.serviceFaults = dataSort.addOjectToList({
        targetArray: state.serviceFaults,
        newObject: serviceFault,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setServiceFaults(state, serviceFaults) {
      state.serviceFaults = dataSort.populateList({
        targetArray: state.serviceFaults,
        newArray: serviceFaults,
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
    async getServiceFaults({ commit, state }, $this) {
      $this.serviceFaultsLoading = true;
      var { associations, serviceFaults, pagination, refresh } = state;
      const { page, perPage, sortBy, sortOrder } = pagination;
      const {
        $axios,
        serviceFaultSearch = null,
        serviceFaultStatusCodes,
        serviceFaultsPerPage = perPage,
        serviceFaultsSortBy = sortBy,
        serviceFaultsSortOrder = sortOrder
      } = $this;

      if (refresh == false && !serviceFaultSearch) {
        $this.serviceFaultsLoading = false;
        return ($this.serviceFaults = serviceFaults);
      }

      try {
        const response = await $axios.get("service-faults", {
          params: {
            associations,
            byStatusCodes: serviceFaultStatusCodes,
            page,
            perPage: serviceFaultsPerPage,
            search: serviceFaultSearch,
            sortBy: serviceFaultsSortBy,
            sortOrder: serviceFaultsSortOrder
          }
        });

        if (!serviceFaultSearch) commit("setServiceFaults", response.data.data);
        $this.serviceFaults = response.data.data;
        $this.serviceFaultsLoading = false;
        if (serviceFaultSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
