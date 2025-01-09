import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["status", "unit.parent"],
    detailedAssociations: [
      "files",
      "items",
      "logs.comment",
      "logs.createdBy",
      "status",
      "unit.hierarchy",
      "unit.parent"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    floatRequests: [],
    refresh: true
  }),
  mutations: {
    setFloatRequest(state, floatRequest) {
      state.floatRequests = dataSort.addOjectToList({
        targetArray: state.floatRequests,
        newObject: floatRequest,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setFloatRequests(state, floatRequests) {
      state.floatRequests = dataSort.populateList({
        targetArray: state.floatRequests,
        newArray: floatRequests,
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
    async getFloatRequests({ commit, state }, $this) {
      $this.floatRequestsLoading = true;
      var { associations, floatRequests, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        floatRequestSearch = null,
        floatRequestStatusCodes = [],
        floatRequestsPerPage = perPage,
        floatRequestsSortBy = "created_at",
        floatRequestsSortOrder = "desc",
        floatRequestsUnitId = null
      } = $this;

      if (refresh == false && !floatRequestSearch) {
        $this.floatRequestsLoading = false;
        return ($this.floatRequests = floatRequests);
      }

      try {
        const response = await $axios.get("float-requests", {
          params: {
            associations,
            byStatusCodes: floatRequestStatusCodes,
            byUnitId: floatRequestsUnitId,
            page,
            perPage: floatRequestsPerPage,
            search: floatRequestSearch,
            sortBy: floatRequestsSortBy,
            sortOrder: floatRequestsSortOrder
          }
        });

        if (!floatRequestSearch) {
          commit("setFloatRequests", response.data.data);
        } else {
          if (floatRequestSearch) commit("toggleRefresh");
        }
        $this.floatRequests = response.data.data;
        $this.floatRequestsLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
