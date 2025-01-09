export default {
  computed: {
    currentActiveRoutes() {
      const route = this.$route;
      const currentActiveRoutes = [];
      const activeRoutes = this.$store.state.activeRoutes;
      Object.keys(activeRoutes).forEach(key => {
        for (const activeRoute of activeRoutes[key]) {
          const currentActiveRoute = route.fullPath.includes(activeRoute)
            ? key
            : currentActiveRoute;
          currentActiveRoutes.push(currentActiveRoute);
        }
      });
      return currentActiveRoutes;
    }
  },
  data: () => ({
    floatRequestScopeStatuses: {
      pending: ["pending"],
      approved: ["approved"]
    },
    workRequestScopeStatuses: {
      scoping: ["01", "05", "20"],
      costed: ["35", "100", "105"],
      started: ["60"],
      "awaiting review": ["65"],
      reviewed: ["80"]
    }
  })
};
