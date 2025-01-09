import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    sensors: [],
    refresh: true
  }),
  mutations: {
    setSensor(state, sensor) {
      state.sensors = dataSort.addOjectToList({
        targetArray: state.sensors,
        newObject: sensor,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setSensors(state, sensors) {
      state.sensors = dataSort.populateList({
        targetArray: state.sensors,
        newArray: sensors,
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
    async getSensors({ commit, state }, $this) {
      $this.sensorsLoading = true;
      const { associations, pagination, sensors, refresh } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        sensorsAssociations = associations,
        sensorSearch,
        sensorsTypes = []
      } = $this;

      if (refresh == false && !sensorSearch) {
        $this.sensorsLoading = false;
        return ($this.sensors = sensors);
      }

      try {
        const response = await $axios.get("sensors", {
          params: {
            associations: sensorsAssociations,
            bySensorTypes: sensorsTypes,
            page,
            perPage,
            search: sensorSearch
          }
        });
        commit("setSensors", response.data.data);
        $this.sensors = response.data.data;
        $this.sensorsLoading = false;
        if (sensorSearch) commit("toggleRefresh");
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
