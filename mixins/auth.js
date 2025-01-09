export default {
  computed: {
    appClass() {
      return this.$store.state.auth.appClass;
    },
    appLogo() {
      if (this.appClass == "hagul") return "/img/tsebo-rapid.png";
      return "/img/tsebo-rapid.png";
    },
    authUser() {
      var user = this.$store.state.auth.user;
      if (!user) user = this.setAuth().user;
      return user;
    },
    checkAuth() {
      return this.$store.state.auth.isAuthenticated;
    }
  },
  directives: {
    "action-show": {
      bind(el, binding, vnode) {
        if (!vnode.context.authorized(binding.value))
          el.classList.add("d-none");
      }
    },
    "action-work": {
      bind(el, binding, vnode) {
        const routeTo = vnode.context.linkCheck(binding.value, binding.arg);
        el.setAttribute("href", routeTo);
        el.addEventListener("click", () => vnode.context.$router.push(routeTo));
      }
    }
  },
  methods: {
    setAuth() {
      var authPayLoad = this.$store.state.auth;
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const token = localStorage.getItem("jwt");
        const isAuthenticated = !!localStorage.getItem("isAuthenticated");
        authPayLoad = { user, token, isAuthenticated };
        this.$store.commit("auth/setAuth", authPayLoad);
      }
      return authPayLoad;
    },
    authorized(pageName) {
      const user = this.$store.state.auth.user;
      const systemFunctions = user.roles.reduce(
        (functions, role) => functions.concat(role.systemFunctions),
        []
      );

      const systemFunction = systemFunctions.find(
        sysFunction => sysFunction.code == pageName
      );

      if (!systemFunction) return false;

      return true;
    },
    linkCheck(pageName, to) {
      const authorized = this.authorized(pageName);
      if (!authorized) return this.$route.fullPath;
      return to;
    }
  },
  created() {
    this.setAuth();
  },
  layout({ store }) {
    const user = store.state.auth.user;
    if (!user) return "";

    const roleCodes = store.state.auth.user.roles.map(role => role.code);

    if (roleCodes.length < 1) return "";

    if (roleCodes.includes("SYS")) return "admin";

    // if (roleCodes.includes("OA")) return "org-admin";

    if (roleCodes.includes("OA")) return "operation-manager";

    if (roleCodes.includes("FM")) return "fm";

    if (roleCodes.includes("OCC")) return "occupant";

    if (roleCodes.includes("PO") || roleCodes.includes("PM")) return "admin";
    //   return "hagul/procurement";

    if (roleCodes.includes("QA")) return "qa";

    if (roleCodes.includes("TCHN")) return "technician";

    return "";
  }
};
