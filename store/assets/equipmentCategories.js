import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [],
    detailedAssociations: [],
    equipmentCategories: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setEquipmentCategory(state, equipmentCategory) {
      state.equipmentCategories = dataSort.addOjectToList({
        targetArray: state.equipmentCategories,
        newObject: equipmentCategory,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setEquipmentCategories(state, equipmentCategories) {
      state.equipmentCategories = dataSort.populateList({
        targetArray: state.equipmentCategories,
        newArray: equipmentCategories,
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
    async getEquipmentCategories({ commit, state }, $this) {
      var { $axios } = $this;
      var {
        associations,
        pagination,
        equipmentCategories: storedEquipmentCategories,
        refresh
      } = state;
      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.equipmentCategoriesLoading = false;
        return ($this.equipmentCategories = storedEquipmentCategories);
      }

      try {
        const response = await $axios.get("equipment-categories", {
          params: { associations, page, perPage }
        });
        commit("setEquipmentCategories", response.data.data);
        commit("setPagination", response.data);
        $this.equipmentCategories = response.data.data;
        $this.equipmentCategoriesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
