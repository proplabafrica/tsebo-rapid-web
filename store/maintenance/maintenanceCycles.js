import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "schedule.equipmentList.unit",
      "schedule.plan",
      "schedule.status",
      "schedule.plan.frequencyMeasurement",
      "schedule.workRequests",
      "schedule.workRequests.status",
      "schedule.unit",
      // "status"
    ],
    detailedAssociations: [
      "status",
      "schedule.equipmentList.unit",
      "schedule.plan",
      "schedule.plan.frequencyMeasurement"
    ],
    pagination: {
      total: 0,
      perPage: 1000,
      page: 1,
      lastPage: null
    },
    maintenanceCycles: [],
    refresh: true
  }),
  mutations: {
    setMaintenanceCycle(state, maintenanceCycle) {
      state.maintenanceCycles = dataSort.addOjectToList({
        targetArray: state.maintenanceCycles,
        newObject: maintenanceCycle,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setMaintenanceCycles(state, maintenanceCycles) {
      state.maintenanceCycles = dataSort.populateList({
        targetArray: state.maintenanceCycles,
        newArray: maintenanceCycles,
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
    async getMaintenanceCycles({ commit, state }, $this) {
      $this.maintenanceCyclesLoading = true;
      const { associations, pagination, maintenanceCycles, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        maintenanceCycleSearch,
        maintenanceCyclesRangeBy,
        maintenanceCyclesRangeFrom,
        maintenanceCyclesRangeTo,
        maintenanceCyclesSortBy,
        maintenanceCyclesSortOrder,
      } = $this;

      if (refresh == false && !maintenanceCycleSearch) {
        $this.maintenanceCyclesLoading = false;
        return ($this.maintenanceCycles = maintenanceCycles);
      }

      try {
        const response = await $axios.get("maintenance-cycles", {
          params: {
            associations,
            page,
            perPage,
            rangeBy: maintenanceCyclesRangeBy,
            rangeFrom: maintenanceCyclesRangeFrom,
            rangeTo: maintenanceCyclesRangeTo,
            search: maintenanceCycleSearch,
            sortBy: maintenanceCyclesSortBy,
            sortOrder: maintenanceCyclesSortOrder,
          }
        });
        $this.maintenanceCycles = response.data.data.filter(
          (cycle) =>
            cycle.schedule &&
            cycle.schedule.status.code !== "rejected"
            // && cycle.status.code === "in-progress"
        );
        commit("setMaintenanceCycles", $this.maintenanceCycles);
        $this.maintenanceCyclesLoading = false;
        if (maintenanceCycleSearch) commit("toggleRefresh");
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
