<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/vendors">Vendors</nuxt-link>
        </li>
        <li
          class="breadcrumb-item active"
          aria-current="page"
          v-text="`${!vendorLoading ? vendor.business_name : 'Vendor Details'}`"
        ></li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="`${!vendorLoading ? vendor.business_name : 'Vendor Details'}`"
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!vendorLoading">
      <div class="col-md-9">
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link
              :to="`/hagul/vendors/details?id=${vendor.id}`"
              class="nav-link"
              exact-active-class="active"
              >Quotations</nuxt-link
            >
          </li>
          <li class="nav-item">
            <nuxt-link
              class="nav-link"
              active-class="active"
              :to="`/hagul/vendors/details/settings?id=${vendor.id}`"
              >Settings</nuxt-link
            >
          </li>
        </ul>
        <nuxt-child :vendor="vendor" @update="updateVendor()" />
      </div>

      <div class="col-lg-3 mg-t-20 mg-lg-t-0">
        <div class="card pd-25">
          <div class="media-list">
            <div class="media">
              <div>
                <i class="icon ion-ios-telephone-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Phone Number</h6>
                <span class="d-block">{{ vendor.business_phone }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25">
              <div>
                <i class="icon ion-ios-email-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Email Address</h6>
                <span class="d-block">{{ vendor.business_email }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25" v-if="vendor.address">
              <div>
                <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Address</h6>
                <span class="d-block" v-text="vendor.address.address"></span>
              </div>

              <!-- media-body -->
            </div>
            <!-- media -->
            <div class="media mg-t-25" v-if="vendor.address">
              <div>
                <i class="icon ion-ios-star tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Average Rating</h6>
                <starRating
                  v-if="getAvgRating(vendor.ratings)"
                  :rangeArray="[1, 2, 3, 4, 5]"
                  :rating="getAvgRating(vendor.ratings)"
                />

                <span
                  v-else
                  class="d-block tx-warning"
                  v-text="'No rating'"
                ></span>
              </div>

              <!-- media-body -->
            </div>
            <!-- media -->

            <div
              class="media mg-t-25"
              v-if="!accountStatusesLoading"
              v-action-show="'vendors.update'"
            >
              <div class="media-body">
                <v-button
                  :disabled="disabled"
                  @click="switchStatus()"
                  class="d-block wd-100p btn"
                  :class="[`btn-${statusDisplay.class}`]"
                >
                  <i class="icon ion-power mg-r-5"></i>
                  {{ statusDisplay.text }}
                </v-button>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/hagul/auth";
import peopleMixin from "@/mixins/people";
import starRating from "@/components/ui/star-rating";

export default {
  components: { loading, vButton, starRating },
  computed: {
    statusDisplay() {
      if (this.vendorLoading || !this.vendor) return {};
      if (!this.vendor.status) return { class: "success", text: "ACTIVATE" };
      if (this.vendor.status.code == "XX")
        return { class: "success", text: "ACTIVATE" };
      if (this.vendor.status.code == "ACTIVE")
        return { class: "warning", text: "DEACTIVATE" };
    }
  },
  created() {
    this.getAccountStatuses();
    this.setVendor(this.$route.query.id);
  },
  data: () => ({
    accountStatuses: [],
    accountStatusesLoading: true,
    disabled: false,
    vendor: null,
    vendorLoading: true,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Vendor Details · Hagul"
  }),
  meta: {
    pageName: "vendors.show"
  },
  methods: {
    async setVendor(id) {
      const { detailedAssociations, vendors } =
        this.$store.state.people.vendors;
      this.vendor = vendors.find((vendor) => vendor.id == id);
      if (this.vendor && !this.shouldRefresh)
        return (this.vendorLoading = false);

      try {
        const vendor = (
          await this.$axios.get("vendors/" + id, {
            params: { associations: detailedAssociations }
          })
        ).data.vendor;

        this.$store.commit("people/vendors/setVendor", vendor);
        this.vendor = this.vendor ? Object.assign({}, vendor) : vendor;
        this.vendorLoading = false;
        this.shouldRefresh = false;
        this.$store.commit("people/vendors/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async switchStatus() {
      var account_status_id = null;
      if (!this.vendor.status)
        account_status_id = this.accountStatuses.find(
          (status) => status.name == "Active"
        ).id;
      else if (this.vendor.status.code == "XX")
        account_status_id = this.accountStatuses.find(
          (status) => status.name == "Active"
        ).id;
      else if (this.vendor.status.code == "ACTIVE")
        account_status_id = this.accountStatuses.find(
          (status) => status.name == "Deactivated"
        ).id;

      this.disabled = true;

      try {
        await this.$axios.put(`vendors/${this.vendor.id}`, {
          account_status_id
        });
        this.disabled = false;
        this.updateVendor();
      } catch (error) {
        console.log(error);
        this.disabled = false;
      }
    },
    getAvgRating(ratings) {
      let total_rating = 0;

      if (ratings.length > 0) {
        for (let i = 0; i < ratings.length; i++) {
          total_rating = total_rating + parseInt(ratings[i].rating);
        }
        return parseInt(total_rating / ratings.length);
      } else {
        return null;
      }
    },
    updateVendor() {
      this.shouldRefresh = true;
      this.vendorLoading = true;
      this.setVendor(this.vendor.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, peopleMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setVendor(to.query.id);
    }
  }
};
</script>
