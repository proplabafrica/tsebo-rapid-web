<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link
            v-if="unit"
            :to="`/onboarding/organizations/details?id=${unit.organization.id}`"
            >{{ unit.organization.name }}</nuxt-link
          >
        </li>
        <li
          class="breadcrumb-item"
          v-if="unit ? (unit.parent ? true : false) : false"
        >
          <nuxt-link
            :to="`/location/units/details/hierarchy?id=${unit.parent.id}`"
            >{{ unit.parent.name | ellipse }}
          </nuxt-link>
        </li>
        <li class="breadcrumb-item">
          {{ unit ? unit.name : "Unit Details" | ellipse(40) }}
        </li>
      </ol>
      <h6 class="slim-pagetitle">
        {{ unit ? unit.name : "Unit Details" | ellipse(40) }}
      </h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col-lg-3 order-lg-2">
        <div class="card">
          <div class="media-list">
            <div class="slim-card-title pd-x-25">
              <div class="media mg-t-25">
                <div class="media-body mg-x-25 mg-t-4">
                  <span class="card-profile-position d-block">
                    <b
                      v-if="unit.parent"
                      v-text="`${unit.parent.hierarchy.name}:`"
                    ></b>
                    <nuxt-link
                      :to="`/location/units/details?id=${unit.parent.id}`"
                      class="tx-inverse"
                      v-if="unit.parent"
                      v-text="unit.parent.name + ', '"
                    ></nuxt-link>
                    <nuxt-link
                      :to="
                        linkCheck(
                          'onboarding.organizations.details',
                          `/onboarding/organizations/details?id=${unit.organization.id}`
                        )
                      "
                      class="tx-inverse"
                      v-text="unit.organization.name"
                    ></nuxt-link>
                  </span>
                </div>
                <!-- media-body -->
              </div>
            </div>
            <!-- media -->
            <div class="media pd-25 pd-y-10-force" v-if="unit.address">
              <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Address</h6>
                <span class="d-block" v-text="unit.address.address"></span>
                <span class="d-block"
                  >{{ unit.address.state }}.
                  {{ countryByCode(unit.address.country_code).name }}</span
                >
              </div>
              <!-- media-body -->
            </div>
            <div class="media pd-25 pd-y-10-force" v-if="unit.budget">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.705 9.91505C16.5105 8.3631 16.7331 6.78736 17.35 5.35005C17.44 5.17005 17.61 4.96005 17.44 4.76505C17.27 4.57005 17.035 4.70505 16.835 4.76505C16.3194 4.91505 15.8404 5.17019 15.4282 5.51439C15.016 5.8586 14.6795 6.28442 14.44 6.76505C14.305 7.00005 14.21 7.23505 13.845 7.18505C12.6131 7.02443 11.3671 7.00095 10.13 7.11505C9.20231 7.17126 8.29645 7.41986 7.47001 7.84505C6.19586 8.54641 5.19663 9.65842 4.63501 11.0001C4.60775 10.9341 4.58763 10.8653 4.57501 10.7951C4.43501 10.1451 4.07501 9.79505 3.51001 9.88005H3.50001C3.37109 9.89628 3.24683 9.93865 3.13485 10.0046C3.02287 10.0705 2.92551 10.1586 2.84875 10.2634C2.77199 10.3683 2.71743 10.4877 2.68842 10.6143C2.6594 10.741 2.65654 10.8722 2.68001 11.0001C2.64983 11.5533 2.75415 12.1057 2.98403 12.6099C3.21391 13.114 3.56251 13.555 4.00001 13.8951C4.1593 14.0041 4.27314 14.1678 4.32001 14.3551C4.6139 15.5922 5.29324 16.704 6.26001 17.5301C6.43478 17.6731 6.57176 17.8569 6.65894 18.0652C6.74612 18.2736 6.78082 18.5002 6.76001 18.7251C6.62501 20.0851 7.16501 20.775 8.64501 20.975C8.75875 21.0018 8.87394 21.0218 8.99001 21.035C9.99001 21.24 9.88001 21.2351 10.065 20.3251C10.19 19.7151 10.435 19.535 11.065 19.63C11.5752 19.7001 12.0905 19.7252 12.605 19.7051C13.84 19.7051 13.845 19.7051 14.18 20.8601C14.24 21.0701 14.285 21.3001 14.58 21.2451C15.2644 21.18 15.9371 21.0236 16.58 20.7801C16.824 20.6974 17.0372 20.5429 17.1916 20.3367C17.346 20.1305 17.4344 19.8824 17.445 19.6251C17.34 18.5601 17.685 18.1251 18.325 17.3301C18.415 17.2251 18.605 17.04 18.71 16.89C18.8991 16.5896 19.1578 16.3392 19.4641 16.1599C19.7705 15.9806 20.1155 15.8778 20.47 15.8601C21.075 15.8301 21.345 15.6451 21.345 14.9501V12.8501C21.3675 12.6328 21.3035 12.4155 21.1669 12.2452C21.0302 12.0748 20.8319 11.9652 20.615 11.94C20.2729 11.8718 19.9528 11.7202 19.6833 11.4987C19.4138 11.2771 19.2032 10.9925 19.07 10.6701C18.5386 9.62817 17.7196 8.76055 16.71 8.17005M17.525 13.6001C17.2884 13.5859 17.0671 13.4784 16.9096 13.3013C16.7521 13.1241 16.6713 12.8917 16.685 12.655C16.6979 12.4224 16.8026 12.2044 16.9759 12.0489C17.1493 11.8933 17.3774 11.8128 17.61 11.825C17.7313 11.8258 17.8511 11.8512 17.9623 11.8997C18.0734 11.9482 18.1735 12.0188 18.2566 12.1072C18.3396 12.1956 18.4038 12.2999 18.4453 12.4139C18.4868 12.5278 18.5047 12.649 18.4979 12.7701C18.4911 12.8912 18.4598 13.0096 18.4059 13.1182C18.3519 13.2268 18.2764 13.3233 18.1841 13.4019C18.0917 13.4804 17.9843 13.5394 17.8684 13.5752C17.7525 13.611 17.6306 13.6228 17.51 13.6101L17.525 13.6001Z"
                  stroke="black"
                  stroke-width="0.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.47001 7.41004C8.0667 7.14935 7.75294 6.77136 7.57096 6.32695C7.38898 5.88254 7.34752 5.39305 7.45216 4.92436C7.5568 4.45568 7.80252 4.0303 8.15623 3.7055C8.50995 3.38069 8.95469 3.17204 9.43058 3.10765C9.90646 3.04326 10.3907 3.1262 10.818 3.34533C11.2453 3.56445 11.5952 3.90923 11.8207 4.33325C12.0461 4.75727 12.1362 5.24018 12.0789 5.71697C12.0216 6.19376 11.8195 6.64154 11.5 7.00004"
                  stroke="black"
                  stroke-width="0.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Budget</h6>
                <span class="d-block" v-if="unit.budget">{{
                  { value: unit.budget } | toMoney
                }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
            <!-- <div class="media pd-25 pd-y-10-force">
              <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Start Date</h6>
                <span
                  class="d-block"
                  v-text="formatDate(unit.start_date)"
                ></span>
              </div>
            </div>
            <div class="media pd-25 pd-y-10-force">
              <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">End Date</h6>
                <span
                  class="d-block"
                  v-text="formatDate(unit.end_date)"
                ></span>
              </div>
            </div> -->
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-3 -->

      <div class="col order-lg-1 mg-t-10 mg-lg-t-0">
        <ul class="nav nav-activity-profile bd-t-0">
          <li
            class="nav-item"
            v-if="
              authUser.roles[0].code == 'SYS' ||
              authUser.roles[0].code == 'OA' ||
              authUser.roles[0].code == 'FM'
            "
          >
            <nuxt-link
              :to="`/location/units/details?id=${unit.id}`"
              class="nav-link"
              exact-active-class="active"
              :class="{
                active: currentActiveRoutes.includes('unit-details-index')
              }"
            >
              <i class="icon ion-settings tx-gray-600"></i> Maintenance
            </nuxt-link>
          </li>
          <li class="nav-item" v-if="authUser.roles[0].code == 'PM'">
            <nuxt-link
              :to="`/location/units/details/settings/people?id=${unit.id}`"
              class="nav-link"
              exact-active-class="active"
              :class="{
                active: currentActiveRoutes.includes('unit-details-index')
              }"
            >
              <i class="icon ion-settings tx-gray-600"></i> Manage
            </nuxt-link>
          </li>
          <li
            class="nav-item"
            v-action-show="`equipment.index`"
            v-if="
              authUser.roles[0].code == 'SYS' ||
              authUser.roles[0].code == 'OA' ||
              authUser.roles[0].code == 'FM'
            "
          >
            <nuxt-link
              :to="`/location/units/details/equipment-list?id=${unit.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-aperture tx-gray-600"></i> Equipment List
            </nuxt-link>
          </li>
          <li
            class="nav-item"
            v-action-show="`unit-hierarchies.index`"
            v-if="
              authUser.roles[0].code == 'SYS' ||
              authUser.roles[0].code == 'OA' ||
              authUser.roles[0].code == 'FM'
            "
          >
            <nuxt-link
              :to="`/location/units/details/hierarchy?id=${unit.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-easel tx-warning"></i> Unit Structure
            </nuxt-link>
          </li>
          <li class="nav-item" v-action-show="'units.update'">
            <nuxt-link
              :to="`/location/units/details/settings?id=${unit.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-ios-gear tx-primary"></i> Settings
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child @update="updateUnit()" :unit="unit" />
      </div>
      <!-- col -->
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
import onboardingMixin from "@/mixins/onboarding";

export default {
  components: { loading },
  created() {
    const id = this.$route.query.id;
    this.setUnit(id);
    this.getCountries();
  },
  data: () => ({
    countries: [],
    loading: true,
    shouldRefresh: false,
    unit: null
  }),
  head: () => ({
    title: "Unit Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "units.show"
  },
  methods: {
    setUnit(id) {
      const { detailedAssociations, units } = this.$store.state.location.units;

      if (this.unit && !this.shouldRefresh) {
        if (
          Array.isArray(this.unit.hierarchy.children) &&
          this.unit.address &&
          this.unit.organization &&
          this.unit.parent
        ) {
          return (this.loading = false);
        }
      }

      this.loading = true;
      this.$axios
        .get("units/" + id, {
          params: { associations: detailedAssociations }
        })
        .then((response) => {
          this.$store.commit("location/units/setUnit", response.data.unit);
          this.unit = this.unit
            ? Object.assign({}, response.data.unit)
            : response.data.unit;
          this.loading = false;
          this.shouldRefresh = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    updateUnit() {
      this.shouldRefresh = true;
      this.setUnit(this.unit.id);
    },
    formatDate(date) {
      if (date) return date.substring(0, 10);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, layoutMixin, onboardingMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) this.setUnit(to.query.id);
    }
  }
};
</script>
