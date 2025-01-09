import { dataSort } from "@/mixins/store";

export default {
  state: () => ({
    deliveryStatuses: [],
    deliveryTypes: []
  }),
  mutations: {
    setDeliveryStatuses(state, deliveryStatuses) {
      state.deliveryStatuses = dataSort.populateList({
        targetArray: state.deliveryStatuses,
        newArray: deliveryStatuses,
        sortBy: "name"
      });
      state.refresh = false;
    },
    setDeliveryTypes(state, deliveryTypes) {
      state.deliveryTypes = dataSort.populateList({
        targetArray: state.deliveryTypes,
        newArray: deliveryTypes,
        sortBy: "name"
      });
      state.refresh = false;
    }
  },
  actions: {
    async getDeliveryStatuses({ commit, state }, $this) {
      var { $axios } = $this;
      const { deliveryStatuses } = state;

      if (deliveryStatuses.length > 0) {
        $this.deliveryStatusesLoading = false;
        $this.deliveryStatuses = deliveryStatuses;
        return;
      }

      try {
        const response = await $axios.get("delivery-statuses");
        commit("setDeliveryStatuses", response.data.data);
        $this.deliveryStatuses = response.data.data;
        $this.deliveryStatusesLoading = false;
        return;
      } catch (error) {
        console.log(error);
      }
    },
    async getDeliveryTypes({ commit, state }, $this) {
      var { $axios } = $this;
      const { deliveryTypes } = state;

      if (deliveryTypes.length > 0) {
        return ($this.deliveryTypes = deliveryTypes);
      }

      try {
        const response = await $axios.get("delivery-types");
        commit("setDeliveryTypes", response.data.data);
        $this.deliveryTypes = response.data.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
