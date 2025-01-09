<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Home</a>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/manage">Manage</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Subscription Packages
        </li>
      </ol>
      <h6 class="slim-pagetitle">Subscription Packages</h6>
    </div>
    <!-- slim-pageheader -->

    <nuxt-link class="btn btn-primary btn-block mg-b-10 wd-200" to="/onboarding/subscription-packages/create">CREATE
      PACKAGE</nuxt-link>
    <v-paginate :list="subscriptionPackages" perPage="30" v-if="!loading">
      <template v-slot="paginate">
        <div class="row row-xs">
          <div class="col-sm-6 col-xl-3" v-for="pkg in paginate.list" :key="pkg.id">
            <div class="card card-pricing-three">
              <div class="card-header" v-text="pkg.name"></div>
              <div class="card-pricing">
                <h1>&#8358;{{ pkg.base_price | moneyFormat }}</h1>
                <p>
                  for
                  {{
                  secondsToReadableTime(
                  pkg.duration_in_seconds,
                  ["week", "year"],
                  true
                  )
                  }}
                </p>
              </div>
              <!-- card-pricing -->
              <div class="card-body">
                <ul class="pricing-list">
                  <li v-for="feature in pkg.features" :key="feature.id" v-text="feature.name"></li>
                </ul>
                <!-- pricing-list -->
                <nuxt-link :to="`/onboarding/subscription-packages/details?id=${pkg.id}`"
                  class="btn btn-primary btn-pricing">VIEW</nuxt-link>
              </div>
              <!-- card-body -->
            </div>
            <!-- card -->
          </div>
          <!-- col -->
        </div>
        <!-- row -->
      </template>
      <template v-slot:linksWrapper class="tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import authMixin from "@/mixins/auth";
import timeFunctions from "@/mixins/timeFunctions";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";

export default {
  created() {
    this.getSubscriptionPackages();
  },
  components: {
    loading,
    vPaginate
  },
  data: () => ({
    loading: true,
    subscriptionPackages: []
  }),
  head: () => ({
    title: "Subscription Packages · Tsebo-Rapid"
  }),
  meta: {
    pageName: "subscription-packages.index"
  },
  methods: {
    getSubscriptionPackages() {
      const {
        associations,
        pagination,
        subscriptionPackages
      } = this.$store.state.onboarding.subscriptionPackages;
      const { lastPage, page, perPage } = pagination;
      if (lastPage !== null) {
        this.subscriptionPackages = subscriptionPackages;
        this.loading = false;
      }

      this.$axios
        .get("subscription-packages", {
          params: { associations, page, perPage }
        })
        .then((response) => {
          this.$store.commit(
            "onboarding/subscriptionPackages/setSubscriptionPackages",
            response.data.data
          );
          this.$store.commit(
            "onboarding/subscriptionPackages/setPagination",
            response.data
          );
          this.subscriptionPackages = this.$store.state.onboarding.subscriptionPackages.subscriptionPackages;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, timeFunctions]
};
</script>
