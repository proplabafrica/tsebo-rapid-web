import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "equipmentSpecs",
      "frequencyMeasurement",
      "trades",
      "units",
      "reminderMeasurement"
    ],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    maintenancePlans: [],
    refresh: true
  }),
  mutations: {
    setMaintenancePlan(state, maintenancePlan) {
      state.maintenancePlans = dataSort.addOjectToList({
        targetArray: state.maintenancePlans,
        newObject: maintenancePlan,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setMaintenancePlans(state, maintenancePlans) {
      state.maintenancePlans = dataSort.populateList({
        targetArray: state.maintenancePlans,
        newArray: maintenancePlans,
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
    async getMaintenancePlans({ commit, state }, $this) {
      $this.maintenancePlansLoading = true;
      const { associations, pagination, maintenancePlans, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        maintenancePlanSearch,
        maintenancePlanTradeCodes = []
      } = $this;

      if (refresh == false && !maintenancePlanSearch) {
        $this.maintenancePlansLoading = false;
        return ($this.maintenancePlans = maintenancePlans);
      }

      try {
        const response = await $axios.get("maintenance-plans", {
          params: {
            associations,
            page,
            perPage,
            search: maintenancePlanSearch,
            byTradeCodes: maintenancePlanTradeCodes
          }
        });
        commit("setMaintenancePlans", response.data.data);
        $this.maintenancePlans = response.data.data;
        $this.maintenancePlansLoading = false;
        if (maintenancePlanSearch) commit("toggleRefresh");
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
