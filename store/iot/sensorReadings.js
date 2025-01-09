import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["measurement", "sensor"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    sensorReadings: [],
    refresh: true
  }),
  mutations: {
    setSensorReading(state, sensorReading) {
      state.sensorReadings = dataSort.addOjectToList({
        targetArray: state.sensorReadings,
        newObject: sensorReading,
        sortBy: "created_at",
        sortOrder: "desc"
      });
    },
    setSensorReadings(state, sensorReadings) {
      state.sensorReadings = dataSort.populateList({
        targetArray: state.sensorReadings,
        newArray: sensorReadings,
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
    async getSensorReadings({ commit, state }, $this) {
      $this.sensorReadingsLoading = true;
      const {
        associations,
        pagination,
        sensorReadings,
        sensorReadingsMeasurements = [],
        refresh
      } = state;
      const { page, perPage } = pagination;
      const {
        $axios,
        sensorReadingsAssociations = associations,
        sensorReadingsRangeBy = null,
        sensorReadingsRangeFrom = null,
        sensorReadingsRangeTo = null
      } = $this;

      if (refresh == false) {
        $this.sensorReadingsLoading = false;
        return ($this.sensorReadings = sensorReadings);
      }

      try {
        const response = await $axios.get("sensor-readings", {
          params: {
            associations: sensorReadingsAssociations,
            byMeasurements: sensorReadingsMeasurements,
            page,
            perPage,
            rangeBy: sensorReadingsRangeBy,
            rangeFrom: sensorReadingsRangeFrom,
            rangeTo: sensorReadingsRangeTo
          }
        });
        commit("setSensorReadings", response.data.data);
        $this.sensorReadings = response.data.data;
        $this.sensorReadingsLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
      return;
    }
  }
};
