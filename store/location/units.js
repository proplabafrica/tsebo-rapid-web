import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "hierarchy",
      "hierarchies",
      "parent",
    ],
    detailedAssociations: [
      "address",
      "hierarchy",
      "hierarchies.children",
      "hierarchies.organization",
      "hierarchies.units",
      "jobSchedules.cycles",
      "jobSchedules.plan",
      "jobSchedules.equipmentList",
      "jobSchedules.plan.trades",
      "jobSchedules.plan.equipmentSpecs",
      "jobSchedules.plan.units",
      "jobSchedules.plan.scope",
      "jobSchedules.plan",
      "jobSchedules.plan.trades",
      "jobSchedules.plan.equipmentSpecs",
      "jobSchedules.workRequests",
      "organization",
      "parent.hierarchy"
    ],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    units: []
  }),
  mutations: {
    setUnit(state, unit) {
      state.units = dataSort.addOjectToList({
        targetArray: state.units,
        newObject: unit,
        sortBy: "name"
      });
    },
    setUnits(state, units) {
      state.units = dataSort.populateList({
        targetArray: state.units,
        newArray: units,
        sortBy: "created_at",
        sortOrder: "desc"
      });
      state.refresh = false;
    },
    toggleRefresh(state, refresh = true) {
      state.refresh = refresh;
    }
  },
  actions: {
    async getUnits({ commit, state }, $this) {
      $this.unitsLoading = true;
      var { associations, units, pagination, refresh } = state;
      const { page, perPage } = pagination;

      const {
        $axios,
        unitsAssociations = associations,
        unitsPerPage = perPage,
        unitsSearch = null,
        unitsStatusCodes = [],
        unitsSortBy = "created_at",
        unitsSortOrder = "desc",
        unitsHierarchyIds = []
      } = $this;

      if (refresh == false && !unitsSearch) {
        $this.unitsLoading = false;
        return ($this.units = units);
      }

      try {
        const response = await $axios.get("units", {
          params: {
            associations: unitsAssociations,
            byStatusCodes: unitsStatusCodes,
            byUnitHierarchyIds: unitsHierarchyIds,
            page,
            perPage: unitsPerPage,
            search: unitsSearch,
            sortBy: unitsSortBy,
            sortOrder: unitsSortOrder
          }
        });
        $this.units = response.data.data;
        $this.unitsLoading = false;
        commit("setUnits", response.data.data);
        if (unitsSearch) commit("toggleRefresh");
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
