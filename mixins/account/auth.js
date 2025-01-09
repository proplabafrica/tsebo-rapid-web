import authMixin from "@/mixins/auth";

export default {
  layout({ store }) {
    const user = store.state.auth.user;
    if (!user) return "account";

    return "account";
  },
  mixins: [authMixin]
};
