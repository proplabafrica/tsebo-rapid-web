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
  paymentTerms: [],
  refresh: true
}),
mutations: {
  setPaymentTerm(state, deliveryLog) {
    state.paymentTerms = dataSort.addOjectToList({
      targetArray: state.paymentTerms,
      newObject: deliveryLog,
      sortBy: "created_at",
      sortOrder: "desc"
    });
  },
  setPaymentTerms(state, paymentTerms) {
    state.paymentTerms = dataSort.populateList({
      targetArray: state.paymentTerms,
      newArray: paymentTerms,
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
  async getPaymentTerms({ commit, state }, $this) {
    $this.paymentTermsLoading = true;
    const { associations } = state;

    try {
      const response = await $this.$axios.get("payment-terms", {
        params: { associations }
      });
      commit("setPaymentTerms", response.data.data);
      $this.paymentTerms = response.data.data;
      $this.paymentTermsLoading = false;
      return;
    } catch (error) {
      console.log(error);
    }
    return;
  }
}
};
