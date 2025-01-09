import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["entity", "measurement", "priority", "trade"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100000,
      page: 1,
      lastPage: null
    },
    slas: [],
    refresh: true
  }),
  mutations: {
    setSla(state, sla) {
      state.slas = dataSort.addOjectToList({
        targetArray: state.slas,
        newObject: sla,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setSlas(state, slas) {
      state.slas = dataSort.populateList({
        targetArray: state.slas,
        newArray: slas,
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
    async getSlas({ commit, state }, $this) {
      const { associations, pagination, slas, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        slaEntityCodes,
        slasByUnitIds = null,
        slaSearch = null
      } = $this;

      if (refresh == false && !slaSearch) {
        $this.slasLoading = false;
        return ($this.slas = slas);
      }

      try {
        const response = await $axios.get("slas", {
          params: {
            associations,
            byEntityCodes: slaEntityCodes,
            byUnitIds: slasByUnitIds,
            page,
            perPage,
            search: slaSearch
          }
        });

        commit("setSlas", response.data.data);
        $this.slas = response.data.data;
        $this.slasLoading = false;
        if (slaSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
