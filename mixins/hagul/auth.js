import authMixin from "@/mixins/auth";

export default {
  layout({ store }) {
    const user =
      store.state.auth.user || JSON.parse(localStorage.getItem("user"));

    if (!user) {
      return "";
    }
    return "hagul/procurement";
  },
  mixins: [authMixin]
};
