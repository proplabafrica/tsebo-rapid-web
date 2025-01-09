export default {
  methods: {
    async getAccountStatuses() {
      this.accountStatusesLoading = true;
      this.accountStatuses = this.$store.state.people.accountStatuses;
      if (this.accountStatuses.length > 0) {
        this.accountStatusesLoading = false;
        return true;
      }
      try {
        const accountStatuses = (await this.$axios.get("account-statuses")).data
          .data;
        this.$store.commit("people/setAccountStatuses", accountStatuses);
        this.accountStatuses = this.$store.state.people.accountStatuses;
        this.accountStatusesLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getRoles(callBack = () => { }) {
      this.rolesLoading = true;
      this.roles = this.$store.state.onboarding.roles;
      if (this.roles.length > 0) {
        this.rolesLoading = false;
        callBack();
        return true;
      }
      try {
        const roles = (await this.$axios.get("roles")).data.data;
        this.$store.commit("people/setRoles", roles);
        this.roles = this.$store.state.people.roles;
        this.rolesLoading = false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
