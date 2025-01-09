import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["categories", "brands"],
    detailedAssociations: [],
    equipmentCapacities: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setEquipmentCapacity(state, equipmentCapacity) {
      state.equipmentCapacities = dataSort.addOjectToList({
        targetArray: state.equipmentCapacities,
        newObject: equipmentCapacity,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setEquipmentCapacities(state, equipmentCapacities) {
      state.equipmentCapacities = dataSort.populateList({
        targetArray: state.equipmentCapacities,
        newArray: equipmentCapacities,
        sortBy: "name"
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
    async getEquipmentCapacities({ commit, state }, $this) {
      var { $axios, byCategoryIds = [] } = $this;
      var {
        associations,
        pagination,
        equipmentCapacities: storedEquipmentCapacities,
        refresh
      } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.equipmentCapacitiesLoading = false;
        return ($this.equipmentCapacities = storedEquipmentCapacities);
      }

      try {
        const response = await $axios.get("equipment-capacities", {
          params: { associations, byCategoryIds, page, perPage }
        });
        commit("setEquipmentCapacities", response.data.data);
        commit("setPagination", response.data);
        $this.equipmentCapacities = response.data.data;
        $this.equipmentCapacitiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
