import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    equipmentCriticalities: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setEquipmentCticality(state, equipmentCriticality) {
      state.equipmentCriticalities = dataSort.addOjectToList({
        targetArray: state.equipmentCriticalities,
        newObject: equipmentCriticality,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setEquipmentCriticalities(state, equipmentCriticalities) {
      state.equipmentCriticalities = dataSort.populateList({
        targetArray: state.equipmentCriticalities,
        newArray: equipmentCriticalities,
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
    async getEquipmentCriticalities({ commit, state }, $this) {
      var { $axios } = $this;
      var {
        associations,
        pagination,
        equipmentCriticalities: storedEquipmentCriticalities,
        refresh
      } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.equipmentCriticalitiesLoading = false;
        return ($this.equipmentCriticalities = storedEquipmentCriticalities);
      }

      try {
        const response = await $axios.get("equipment-criticalities", {
          params: { associations, page, perPage }
        });
        commit("setEquipmentCriticalities", response.data.data);
        commit("setPagination", response.data);
        $this.equipmentCriticalities = response.data.data;
        $this.equipmentCriticalitiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
