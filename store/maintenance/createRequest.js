export default {
  state: () => ({
    baseHierarchies: [],
    hierarchies: [],
    units: [],
    users: []
  }),
  mutations: {
    setData(state, { key, data }) {
      state[key] = data;
    }
  },
  actions: {
    async getBaseHierarchies({ commit, state }, $this) {
      const { baseHierarchies } = state;
      if (baseHierarchies.length > 0) {
        $this.baseHierarchies = baseHierarchies;
        return ($this.baseHierarchiesLoading = false);
      }
      try {
        const response = await $this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent"], baseUnitHierarchies: true }
        });
        $this.baseHierarchies = response.data.data;
        $this.baseHierarchiesLoading = false;
        commit("setData", { key: "baseHierarchies", ...response.data });
      } catch (error) {
        console.log(error);
      }
    },
    async getHierarchies({ commit, state }, $this) {
      const { hierarchies } = state;
      if (hierarchies.length > 0) {
        $this.hierarchies = hierarchies;
        return ($this.hierarchiesLoading = false);
      }

      try {
        const response = await $this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent"] }
        });
        $this.hierarchies = response.data.data;
        $this.hierarchiesLoading = false;
        commit("setData", { key: "hierarchies", ...response.data });
      } catch (error) {
        console.log(error);
      }
    },
    async getUnits({ commit, state }, $this) {
      $this.unitsLoading = true;

      const { units } = state;
      if (units.length > 0) {
        $this.units = units.map(unit => Object.assign({}, unit));
        return ($this.unitsLoading = false);
      }

      try {
        const response = await $this.$axios.get("units", {
          params: {
            associations: ["children", "equipment.specification", "hierarchies"]
          }
        });
        $this.units = response.data.data;
        $this.unitsLoading = false;
        commit("setData", { key: "units", ...response.data });
      } catch (error) {
        console.log(error);
      }
    },
    async getUsers({ commit, state }, $this) {
      $this.usersLoading = true;

      const { users } = state;
      if (users.length > 0) {
        $this.users = users;
        return ($this.usersLoading = false);
      }

      try {
        const response = await $this.$axios.get("users");
        $this.users = response.data.data;
        $this.usersLoading = false;
        commit("setData", { key: "users", ...response.data });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
