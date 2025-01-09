<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/onboarding/organizations">Organizations</nuxt-link>
        </li>
        <li class="breadcrumb-item">Set Up Organization</li>
      </ol>
      <h6 class="slim-pagetitle">Set Up Organization</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="card pd-20 pd-x-30" v-if="!organizationLoading">
      <div class="row wizard">
        <div class="col-md-12 col-lg-3 steps">
          <ul class="nav nav-pills flex-column" role="tablist">
            <nuxt-link tag="li" :to="`/onboarding/organizations/set-up${
              organization ? `?id=${organization.id}` : '?'
            }`" class="nav-item" exact-active-class="active">
              <a class="nav-link">
                <span class="number mg-r-5">1</span>
                <span>Organization Details</span>
              </a>
            </nuxt-link>
            <nuxt-link tag="li" :to="`/onboarding/organizations/set-up${
              organization ? `/subscriptions?id=${organization.id}` : '?'
            }`" class="nav-item" :exact-active-class="organization ? `active` : ''">
              <a class="nav-link">
                <span class="number mg-r-5">2</span>
                <span>Select Subscription</span>
              </a>
            </nuxt-link>
          </ul>
        </div>
        <div class="col-lg-9 wizard-content">
          <nuxt-child @detailsDone="addSubscriptions" @subscriptionAdded="finish" :organization="organization" />
        </div>
      </div>
      <!-- row -->
    </div>
    <!-- section-wrapper -->
    <loading v-else />
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
import tabWizard from "@/components/ui/tabs/wizard";
import loading from "@/components/ui/loading";
export default {
  components: { loading },
  created() {
    this.setValues(this.$route.query);
  },
  data: () => ({
    organization: null,
    organizationLoading: true,
    subscription: null
  }),
  head: () => ({
    title: "Set Up Organization · Tsebo-Rapid"
  }),
  meta: {
    pageName: "organizations.store"
  },
  methods: {
    addSubscriptions({ hierarchy, organization }) {
      this.organization = organization;
      this.$router.push(
        `/onboarding/organizations/set-up/subscriptions?id=${this.organization.id}`
      );
    },
    finish(subscription) {
      this.$router.push(
        `/onboarding/organizations/details?id=${this.organization.id}`
      );
    },
    async setOrg(id) {
      this.organizationLoading = true;
      const {
        detailedAssociations,
        organizations
      } = this.$store.state.onboarding.organizations;
      this.org = organizations.find((org) => org.id == id);
      if (this.org && !this.shouldRefresh) {
        if (
          Array.isArray(this.org.types) &&
          Array.isArray(this.org.subscriptions) &&
          Array.isArray(this.org.addresses)
        ) {
          return (this.organizationLoading = false);
        }
      }

      try {
        const response = await this.$axios.get("organizations/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit(
          "onboarding/organizations/setOrganization",
          response.data.organization
        );
        this.organization = this.organization
          ? Object.assign({}, response.data.organization)
          : response.data.organization;
        this.organizationLoading = false;
        this.shouldRefresh = false;
      } catch (error) {
        console.log(error);
      }
    },
    setValues(query) {
      if (query.id) this.setOrg(query.id);
      else this.organizationLoading = false;
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      this.setValues(to.query);
    }
  }
};
</script>
