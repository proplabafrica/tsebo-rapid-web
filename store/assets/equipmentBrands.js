import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: ["categories"],
    detailedAssociations: [],
    equipmentBrands: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setEquipmentBrand(state, equipmentBrand) {
      state.equipmentBrands = dataSort.addOjectToList({
        targetArray: state.equipmentBrands,
        newObject: equipmentBrand,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setEquipmentBrands(state, equipmentBrands) {
      state.equipmentBrands = dataSort.populateList({
        targetArray: state.equipmentBrands,
        newArray: equipmentBrands,
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
    async getEquipmentBrands({ commit, state }, $this) {
      var { $axios, byCategoryIds = [] } = $this;
      var {
        associations,
        pagination,
        equipmentBrands: storedEquipmentBrands,
        refresh
      } = state;

      const { page, perPage } = pagination;

      if (refresh == false) {
        $this.equipmentBrandsLoading = false;
        return ($this.equipmentBrands = storedEquipmentBrands);
      }

      try {
        const response = await $axios.get("equipment-brands", {
          params: { associations, byCategoryIds, page, perPage }
        });
        commit("setEquipmentBrands", response.data.data);
        commit("setPagination", response.data);
        $this.equipmentBrands = response.data.data;
        $this.equipmentBrandsLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
