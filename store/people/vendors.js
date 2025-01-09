import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    associations: [
      "address",
      "materialCategories",
      "logs",
      "purchaseOrders.ratings",
      "status",
      "trades"
    ],
    detailedAssociations: [
      "logs.comment",
      "logs.createdBy",

      "status",
      "address",
      "contacts",
      "bankAccounts",
      "materialCategories",
      "trades"
    ],
    vendors: [],
    pagination: {
      total: 0,
      perPage: 1000,
      page: 1,
      lastPage: null
    },
    refresh: true
  }),
  mutations: {
    setVendor(state, vendor) {
      state.vendors = dataSort.addOjectToList({
        targetArray: state.vendors,
        newObject: vendor,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setVendors(state, vendors) {
      state.vendors = dataSort.populateList({
        targetArray: state.vendors,
        newArray: vendors,
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
    async getVendors({ commit, state }, $this) {
      $this.vendorsLoading = true;
      const { associations, vendors, pagination, refresh } = state;
      const {
        $axios,
        vendorSearch,
        byAccountStatusCodes,
        byVendorMaterialCategoryCodes = [],
        byVendorTradeCodes = [],
        vendorsOrganizationIds = [],
        vendorsRangeBy,
        vendorsRangeFrom,
        vendorsRangeTo
      } = $this;

      const { page, perPage } = pagination;
      if (refresh == false && !vendorSearch) {
        $this.vendorsLoading = false;
        return ($this.vendors = vendors);
      }

      try {
        const response = await $axios.get("vendors", {
          params: {
            associations,
            byAccountStatusCodes,
            byMaterialCategoryCodes: byVendorMaterialCategoryCodes,
            byTradeCodes: byVendorTradeCodes,
            byOrganizationIds: vendorsOrganizationIds,
            page,
            perPage,
            search: vendorSearch,
            rangeBy: vendorsRangeBy,
            rangeFrom: vendorsRangeFrom,
            rangeTo: vendorsRangeTo
          }
        });
        commit("setVendors", response.data.data);
        $this.vendors = response.data.data;
        $this.vendorsLoading = false;
        if (vendorSearch) commit("toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
