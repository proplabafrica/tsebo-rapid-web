<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-text="organization ? organization.name : 'Organization Details'"></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="organization ? organization.name : 'Organization Details'"></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col">
        <ul class="nav nav-activity-profile">
          <li class="nav-item">
            <nuxt-link :to="`/onboarding/organizations/details?id=${organization.id}`" class="nav-link"
              exact-active-class="active" :class="{
                active: currentActiveRoutes.includes(
                  'organization-details-index'
                )
              }">
              <i class="icon ion-easel tx-warning"></i> Structure
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link :to="`/onboarding/organizations/details/settings?id=${organization.id}`" class="nav-link"
              active-class="active">
              <i class="icon ion-ios-gear tx-primary"></i> Settings
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :hierarchies="organization.baseHierarchies" :organization="organization" :parentHierarchy="{}"
          :parentUnit="{}" @hierarchiesAdded="updateOrganization()" @update="updateOrganization()" />
      </div>
      <!-- col -->

      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card">
          <img class="ht-60 mg-20 mg-b-0" :src="
            organization.image_path
              ? organization.image_path
              : 'https://via.placeholder.com/500'
          " :alt="organization.name" @error="
            (e) => (e.target.src = 'https://via.placeholder.com/500')
          " />
          <div class="slim-card-title pd-x-25">
            <span v-for="type in organization.types" :key="type.id" v-text="type.name + ' '"></span>
          </div>
          <div class="media-list">
            <div v-for="contact in organization.contacts" :key="contact.id">
              <div class="media pd-x-25 pd-y-10" v-if="contact.name">
                <div>
                  <i class="icon ion-ios-person-outline tx-20 mg-r-5"></i>
                </div>
                <div class="media-body mg-l-15 mg-t-4">
                  <h6 class="tx-14 tx-gray-700">Contact Name</h6>
                  <span class="mg-r-5" v-text="contact.name"></span>
                </div>
                <!-- media-body -->
              </div>
              <!-- media -->
              <div class="media pd-x-25 pd-y-10" v-if="contact.email">
                <div>
                  <i class="icon ion-ios-email-outline tx-20 mg-r-5"></i>
                </div>
                <div class="media-body mg-l-15">
                  <h6 class="tx-14 tx-gray-700">Contact Email</h6>
                  <span class="mg-r-5" v-text="contact.email"></span>
                </div>
                <!-- media-body -->
              </div>
              <!-- media -->
              <div class="media pd-x-25 pd-y-10" v-if="contact.phone">
                <div>
                  <i class="icon ion-ios-telephone-outline tx-20 mg-r-5"></i>
                </div>
                <div class="media-body mg-l-15 mg-t-4">
                  <h6 class="tx-14 tx-gray-700">Contact Phone</h6>
                  <span class="mg-r-5" v-text="contact.phone"></span>
                </div>
                <!-- media-body -->
              </div>
              <!-- media -->
            </div>
            <div class="media pd-x-25 pd-y-10" v-for="(address, index) in organization.addresses" :key="address.id">
              <div>
                <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15">
                <h6 class="tx-14 tx-gray-700">
                  Address
                  <span v-if="organization.addresses.length > 1" v-text="index + 1"></span>
                </h6>
                <span class="mg-r-5" v-text="address.address"></span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->

        <div class="card card-sales mg-t-10" v-if="organization.subscriptions.length > 0">
          <h6 class="slim-card-title tx-primary">Subscription</h6>
          <div v-for="subscription in organization.subscriptions" :key="subscription.id">
            <div class="row">
              <div class="col">
                <label class="tx-12">Package</label>
                <p>{{ subscription.package.name }}</p>
              </div>
              <!-- col -->
              <div class="col">
                <label class="tx-12">Cost</label>
                <p>&#8358;{{ subscription.base_price | moneyFormat }}</p>
                <span>{{
                secondsToReadableTime(
                subscription.duration_in_seconds,
                ["day", "year"],
                "long"
                )
                }}</span>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
            <div class="progress mg-b-5" v-if="subscription.start_date != null">
              <div class="progress-bar bg-primary wd-50p" role="progressbar" aria-valuenow="50" aria-valuemin="0"
                aria-valuemax="100">
                50%
              </div>
            </div>
          </div>
        </div>
        <!-- card -->
      </div>
      <!-- col-3 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import layoutMixin from "@/mixins/layout";
import timeFunctions from "@/mixins/timeFunctions";

export default {
  created() {
    this.setOrganization(this.$route.query.id);
  },
  components: { loading },
  data: () => ({
    loading: true,
    organization: null,
    shouldRefresh: false
  }),
  head: () => ({
    title: "Organization Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "organizations.show"
  },
  methods: {
    async setOrganization(id) {
      const {
        detailedAssociations,
        organizations
      } = this.$store.state.onboarding.organizations;
      this.organization = organizations.find(
        (organization) => organization.id == id
      );
      if (this.organization && !this.shouldRefresh) {
        if (
          Array.isArray(this.organization.types) &&
          Array.isArray(this.organization.subscriptions) &&
          Array.isArray(this.organization.addresses)
        ) {
          return (this.loading = false);
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
        this.loading = false;
        this.shouldRefresh = false;
      } catch (error) {
        console.log(error);
      }
    },
    updateOrganization() {
      this.shouldRefresh = true;
      this.loading = true;
      this.setOrganization(this.$route.query.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, layoutMixin, timeFunctions],
  watch: {
    $route(to, from) {
      this.setOrganization(to.query.id);
    }
  }
};
</script>
