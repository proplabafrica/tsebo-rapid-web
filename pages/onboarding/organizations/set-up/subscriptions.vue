<template>
  <div class="form-layout pd-t-5 pd-lg-t-0 pd-lg-l-10">
    <v-paginate :list="subscriptionPackages" perPage="30">
      <template v-slot="paginate">
        <div class="row row-xs">
          <div class="col-sm-6 col-xl-4" v-for="pkg in paginate.list" :key="pkg.id">
            <div class="card card-pricing-three" :class="{
              'card-pricing-primary': subscriptionPackageId == pkg.id
            }">
              <div class="card-header" :class="{ 'bg-primary': subscriptionPackageId == pkg.id }" v-text="pkg.name">
              </div>
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
                <a href class="btn btn-primary btn-pricing" @click.prevent="subscriptionPackageId = pkg.id">Select
                  Package</a>
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
    <div class="form-layout-footer mg-t-20">
      <v-button class="btn btn-primary bd-0 float-right" @click="submitSubscription()" :disabled="disabled"
        v-if="subscriptionPackageId">FINISH &rarr;</v-button>
    </div>
    <!-- form-layout-footer -->
  </div>
</template>

<script>
import timeFunctions from "@/mixins/timeFunctions";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";

export default {
  components: { vButton, vPaginate },
  created() {
    this.getSubscriptionPackages();
  },
  data: () => ({
    disabled: false,
    subscriptionPackages: [],
    subscriptionPackageId: ""
  }),
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitSubscription() {
      if (!this.subscriptionPackageId) {
        return false;
      }
      this.disabled = true;
      const subscription_package_id = this.subscriptionPackageId;
      const organization_id = this.organization.id;
      this.$axios
        .post("subscriptions", { subscription_package_id, organization_id })
        .then((response) => {
          this.disabled = false;
          this.$emit("subscriptionAdded", response.data.subscription);
        })
        .catch((error) => {
          this.disabled = false;
          var response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          }
        });
    }
  },
  mixins: [timeFunctions],
  props: ["organization"]
};
</script>
