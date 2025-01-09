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
    slaPriorities: [],
    refresh: true
  }),
  mutations: {
    setSlaPriority(state, slaPriority) {
      state.slaPriorities = dataSort.addOjectToList({
        targetArray: state.slaPriorities,
        newObject: slaPriority,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setSlaPriorities(state, slaPriorities) {
      state.slaPriorities = dataSort.populateList({
        targetArray: state.slaPriorities,
        newArray: slaPriorities,
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
    async getSlaPriorities({ commit, state }, $this) {
      $this.slaPrioritiesLoading = true;
      var { associations, slaPriorities, pagination, refresh } = state;
      const { page, perPage, sortBy, sortOrder } = pagination;
      const {
        $axios,
        slaPrioritySearch = null,
        slaPriorityStatusCodes,
        slaPrioritiesPerPage = perPage,
        slaPrioritiesSortBy = sortBy,
        slaPrioritiesSortOrder = sortOrder
      } = $this;

      if (refresh == false && !slaPrioritySearch) {
        $this.slaPrioritiesLoading = false;
        return ($this.slaPriorities = slaPriorities);
      }

      try {
        const response = await $axios.get("sla-priorities", {
          params: {
            associations,
            byStatusCodes: slaPriorityStatusCodes,
            page,
            perPage: slaPrioritiesPerPage,
            search: slaPrioritySearch,
            sortBy: slaPrioritiesSortBy,
            sortOrder: slaPrioritiesSortOrder
          }
        });

        if (!slaPrioritySearch) commit("setSlaPriorities", response.data.data);
        $this.slaPriorities = response.data.data;
        $this.slaPrioritiesLoading = false;
        if (slaPrioritySearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
