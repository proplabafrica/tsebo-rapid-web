<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/manage">Manage</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/onboarding/subscription-packages">Subscription Packages</nuxt-link>
        </li>
        <li class="breadcrumb-item">Create</li>
      </ol>
      <h6 class="slim-pagetitle">Create Subscription Package</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="card pd-20 pd-x-30">
      <tab-wizard :tabs="tabs" :parentCurrentTab="currentTab">
        <template v-slot="tabWizard">
          <keep-alive>
            <component :is="tabWizard.currentTab" @detailsDone="setSubscriptionPackage" @featuresAdded="finish"
              :subscriptionPackage="subscriptionPackage" />
          </keep-alive>
        </template>
      </tab-wizard>
    </div>
    <!-- section-wrapper -->
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
import tabWizard from "@/components/ui/tabs/wizard";
import loading from "@/components/ui/loading";

export default {
  components: {
    "add-features": () => ({
      component: import(
        "@/components/set-ups/subscription-package/add-features.vue"
      ),
      loading,
      delay: 0
    }),
    "subscription-package-details": () => ({
      component: import(
        "@/components/set-ups/subscription-package/details.vue"
      ),
      loading,
      delay: 0
    }),
    tabWizard
  },
  data: () => ({
    currentTab: "subscription-package-details",
    subscriptionPackage: null,
    tabs: [
      {
        name: "subscription-package-details",
        title: "Details"
      },
      {
        name: "add-features",
        title: "Features"
      }
    ]
  }),
  head: () => ({
    title: "Create Subscription Package · Tsebo-Rapid"
  }),
  meta: {
    pageName: "subscription-packages.store"
  },
  methods: {
    setSubscriptionPackage(subscriptionPackage) {
      this.subscriptionPackage = subscriptionPackage;
      this.currentTab = "add-features";
    },
    finish(subscriptionPackage) {
      this.$router.push(
        `/onboarding/subscription-packages/details?id=${this.subscriptionPackage.id}`
      );
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
