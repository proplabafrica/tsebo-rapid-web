import { dataSort } from "@/mixins/store";
export default {
  state: () => ({
    countries: [],
    industries: [],
    organizationTypes: [],
    roles: [],
    banks: []
  }),
  mutations: {
    setCountries(state, countries) {
      state.countries = countries;
    },
    setIndustries(state, industries) {
      state.industries = dataSort.populateList({
        targetArray: state.industries,
        newArray: industries,
        sortBy: "name"
      });
    },
    setBanks(state, banks) {
      state.banks = dataSort.populateList({
        targetArray: state.banks,
        newArray: banks,
        sortBy: "name"
      });
    },
    setOrganizationTypes(state, organizationTypes) {
      state.organizationTypes = dataSort.populateList({
        targetArray: state.organizationTypes,
        newArray: organizationTypes,
        sortBy: "name"
      });
    },
    setRoles(state, roles) {
      state.roles = dataSort.populateList({
        targetArray: state.roles,
        newArray: roles,
        sortBy: "name"
      });
    }
  }
};
