<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb" v-if="maintenancePlan">
        <li class="breadcrumb-item">
          <nuxt-link to="/maintenance/routines/maintenance-plans"
            >Maintenance Plans</nuxt-link
          >
        </li>
        <li class="breadcrumb-item">{{ maintenancePlan.name }}</li>
      </ol>
      <ol class="breadcrumb slim-breadcrumb" v-else></ol>
      <h6 class="slim-pagetitle">
        {{
          maintenancePlan
            ? maintenancePlan.name + "(" + maintenancePlan.code + ")"
            : "Maintenance Plan Details"
        }}
      </h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col-lg-3 order-lg-2">
        <div class="card">
          <div class="media-list">
            <div class="media mg-t-25">
              <div class="media-body mg-x-25 mg-t-4">
                <span class="card-profile-position d-block">
                  <b
                    v-if="maintenancePlan"
                    v-text="`${maintenancePlan.name}(${maintenancePlan.code})`"
                  ></b>
                </span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
            <div class="media pd-25">
              <!-- <div>
                <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                  <b v-if="maintenancePlan" v-text="`${maintenancePlan.name}:`"></b>
              </div> -->
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-3 -->

      <div class="col order-lg-1 mg-t-10 mg-lg-t-0">
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link
              :to="`/maintenance/routines/maintenance-plans/details?id=${maintenancePlan.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-settings tx-gray-600"></i> Job Schedules
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :to="`/maintenance/routines/maintenance-plans/details/settings?id=${maintenancePlan.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-ios-gear tx-primary"></i> Settings
            </nuxt-link>
          </li>
        </ul>
        <!-- <nuxt-child/> -->
        <!-- nav -->
        <nuxt-child
          @update="updateMaintenancePlan()"
          :maintenancePlan="maintenancePlan"
        />
      </div>
      <!-- col -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import layoutMixin from "@/mixins/layout";

export default {
  components: { loading },
  created() {
    this.setMaintenancePlan(this.$route.query.id);
  },
  meta: {
    pageName: "maintenance-plans.show"
  },
  data: () => ({
    maintenancePlan: null,
    apiPagination: {
      total: 0,
      perPage: 100,
      page: 1,
      lastPage: null
    },
    unit: null,
    shouldRefresh: false,
    loading: true
  }),
  methods: {
    async setMaintenancePlan(id) {
      const { detailedAssociations } =
        this.$store.state.maintenance.maintenancePlans;
      this.loading = true;
      try {
        const response = await this.$axios.get("maintenance-plans/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit(
          "maintenance/maintenancePlans/setMaintenancePLan",
          response.data.maintenancePlan
        );
        this.maintenancePlan = response.data.maintenancePlan;
        this.loading = false;
        this.shouldRefresh = false;
      } catch (error) {
        console.log(error);
      }
    },
    setApiPagination({ total, perPage, page, lastPage }) {
      page = Math.floor(total / perPage) > page ? page + 1 : page;
      this.apiPagination = { total, perPage, page, lastPage };
    },
    updateMaintenancePlan() {
      this.shouldRefresh = true;
      this.setMaintenancePlan(this.$route.query.id);
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, layoutMixin]
};
</script>
