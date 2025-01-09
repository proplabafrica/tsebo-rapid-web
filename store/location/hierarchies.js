import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    detailedAssociations: [],
    unitHierarchies: [],
    baseHierarchies: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setHierarchy(state, hierarchy) {
      state.unitHierarchies = dataSort.addOjectToList({
        targetArray: state.unitHierarchies,
        newObject: hierarchy,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setUnitHierarchies(state, unitHierarchies) {
      state.unitHierarchies = dataSort.populateList({
        targetArray: state.unitHierarchies,
        newArray: unitHierarchies,
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
    },
    setData(state, { key, data}) {
      state[key] = data;
    }
  },
  actions: {
    async getBaseHierarchies({ commit, state }, $this) {
      const { baseHierarchies } = state;
      if (baseHierarchies.length > 0) {
        $this.baseHierarchies = baseHierarchies;
        return ($this.baseHierarchiesLoading = false);
      }
      try {
        const response = await $this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent", "units"], baseUnitHierarchies: true }
        });
        $this.baseHierarchies = response.data.data;
        $this.baseHierarchiesLoading = false;
        commit("setData", { key: "baseHierarchies", ...response.data });
      } catch (error) {
        console.log(error);
      }
    },
    async getUnitHierarchies({ commit, state }, $this) {
      $this.unitHierarchiesLoading = true;
      var { associations, unitHierarchies, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        baseUnitHierarchies = false,
        unitHierarchiesAssociations = associations,
        unitHierarchiesPerPage = perPage,
        unitHierarchiesSearch = null,
        unitHierarchiesSortBy,
        unitHierarchiesSortOrder
      } = $this;

      if (refresh == false && !unitHierarchiesSearch) {
        $this.unitHierarchiesLoading = false;
        return ($this.unitHierarchies = unitHierarchies);
      }

      try {
        const response = await $axios.get("unit-hierarchies", {
          params: {
            associations: unitHierarchiesAssociations,
            baseUnitHierarchies,
            page,
            perPage: unitHierarchiesPerPage,
            search: unitHierarchiesSearch,
            sortBy: unitHierarchiesSortBy,
            sortOrder: unitHierarchiesSortOrder
          }
        });
        $this.unitHierarchies = response.data.data;
        $this.unitHierarchiesLoading = false;
        commit("setUnitHierarchies", response.data.data);
        if (unitHierarchiesSearch) commit("toggleRefresh");
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
