import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["requester.roles", "status", "unit.parent"],
    detailedAssociations: [
      "files",
      "logs.comment",
      "logs.createdBy.roles",
      "requester.roles",
      "unit.hierarchy",
      "unit.parent",
      "status",
      "workRequest"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      sortBy: "updated_at",
      sortOrder: "desc",
      lastPage: null
    },
    clientRequests: [],
    refresh: true
  }),
  mutations: {
    setClientRequest(state, clientRequest) {
      state.clientRequests = dataSort.addOjectToList({
        targetArray: state.clientRequests,
        newObject: clientRequest,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setClientRequests(state, clientRequests) {
      state.clientRequests = dataSort.populateList({
        targetArray: state.clientRequests,
        newArray: clientRequests,
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
    async getClientRequests({ commit, state }, $this) {
      $this.clientRequestsLoading = true;
      var { associations, clientRequests, pagination, refresh } = state;
      const { page, perPage, sortBy, sortOrder } = pagination;
      const {
        $axios,
        clientRequestSearch = null,
        clientRequestStatusCodes,
        clientRequestsPerPage = perPage,
        clientRequestsSortBy = sortBy,
        clientRequestsSortOrder = sortOrder
      } = $this;

      if (refresh == false && !clientRequestSearch) {
        $this.clientRequestsLoading = false;
        return ($this.clientRequests = clientRequests);
      }

      try {
        const response = await $axios.get("client-requests", {
          params: {
            associations,
            byStatusCodes: clientRequestStatusCodes,
            page,
            perPage: clientRequestsPerPage,
            search: clientRequestSearch,
            sortBy: clientRequestsSortBy,
            sortOrder: clientRequestsSortOrder
          }
        });

        if (!clientRequestSearch)
          commit("setClientRequests", response.data.data);
        $this.clientRequests = response.data.data;
        $this.clientRequestsLoading = false;
        if (clientRequestSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
