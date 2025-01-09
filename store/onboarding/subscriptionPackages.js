import { dataSort } from "@/mixins/store";
export default {
  state: () => ({
    features: [],
    subscriptionPackages: [],
    associations: ["features"],
    detailedAssociations: [],
    pagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    }
  }),
  mutations: {
    setFeatures(state, features) {
      state.features = dataSort.populateList({
        targetArray: state.features,
        newArray: features,
        sortBy: "name"
      });
    },
    setSubscriptionPackage(state, subscriptionPackage) {
      state.subscriptionPackages = dataSort.addOjectToList({
        targetArray: state.subscriptionPackages,
        newObject: subscriptionPackage,
        sortBy: "name"
      });
    },
    setSubscriptionPackages(state, subscriptionPackages) {
      state.subscriptionPackages = dataSort.populateList({
        targetArray: state.subscriptionPackages,
        newArray: subscriptionPackages,
        sortBy: "name"
      });
    },
    setPagination(state, { total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      state.pagination = { total, perPage, page, lastPage };
    }
  }
};
