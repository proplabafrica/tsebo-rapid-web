export default {
  namespaced: true,
  state: () => ({
    appClass: null,
    isAuthenticated: false,
    jwt: null,
    routeAfterLogin: "/",
    user: null
  }),
  mutations: {
    resetAuth(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      localStorage.removeItem("isAuthenticated");
      state.isAuthenticated = false;
      state.user = null;
      state.jwt = null;
    },
    setAppClass(state, appClass = "Tsebo-Rapid") {
      state.appClass = appClass;
    },
    setAuth(state, { user, token }) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("jwt", token);
      localStorage.setItem("isAuthenticated", "true");
      state.isAuthenticated = true;
      state.user = user;
      state.jwt = token;
    },
    setRouteAfterLogin(state, routeAfterLogin) {
      state.routeAfterLogin = routeAfterLogin;
    }
  },
  actions: {
    async getCurrentUser({ commit, state }, { $axios }) {
      const { user, jwt } = state;
      try {
        const response = await $axios.get(`users/${user.id}`, {
          params: { associations: ["roles.systemFunctions", "organizations"] }
        });
        commit("setAuth", {
          user: response.data.user,
          token: jwt
        });
      } catch (error) {
        console.log(error);
      }
    },
    async logout({ commit }, $this) {
      $this.$router.replace("/auth/login");
      try {
        const response = await $this.$axios.post("oauth/logout");
        commit("resetAuth");
      } catch (error) {
        console.log(error);
        commit("resetAuth");
      }
    }
  }
};
