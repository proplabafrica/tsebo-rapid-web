<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb" v-if="jobSchedule">
        <li class="breadcrumb-item" v-if="jobSchedule.unit">
          <nuxt-link
            :to="`/location/units/details?id=${jobSchedule.unit.id}`"
            >{{ jobSchedule.unit.name }}</nuxt-link
          >
        </li>
        <li class="breadcrumb-item">{{ jobSchedule.plan.name }}</li>
      </ol>
      <ol class="breadcrumb slim-breadcrumb" v-else></ol>
      <h6 class="slim-pagetitle">
        {{
          jobSchedule
            ? `${jobSchedule.plan.name} (${jobSchedule.code})`
            : "Job Schedule Details"
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
                    v-if="jobSchedule"
                    v-text="`${jobSchedule.plan.name} (${jobSchedule.code})`"
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
                  <b v-if="jobSchedule" v-text="`${jobSchedule.name}:`"></b>
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
            <!-- <nuxt-link
              :to="`/maintenance/routines/job-schedules/approval?id=${jobSchedule.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-settings tx-gray-600"></i> Approval
            </nuxt-link> -->
            <nuxt-link
              :to="`/maintenance/routines/job-schedules/details/approval?id=${jobSchedule.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-navigate tx-gray-600"></i> Approval
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :to="`/maintenance/routines/job-schedules/details?id=${jobSchedule.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-settings tx-gray-600"></i> Jobs
            </nuxt-link>
          </li>
          <li v-if="!isFm()" class="nav-item">
            <nuxt-link
              :to="`/maintenance/routines/job-schedules/details/settings?id=${jobSchedule.id}`"
              class="nav-link"
              active-class="active"
            >
              <i class="icon ion-ios-gear tx-primary"></i>
              Edit Plan
            </nuxt-link>
          </li>
        </ul>
        <!-- <nuxt-child/> -->
        <!-- nav -->
        <nuxt-child @update="updateJobSchedule()" :jobSchedule="jobSchedule" />
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
    this.setJobSchedule(this.$route.query.id);
  },
  meta: {
    pageName: "job-schedules.show"
  },
  data: () => ({
    jobSchedule: null,
    shouldRefresh: false,
    loading: true
  }),
  methods: {
    isFm() {
      let roles = this.$store.state.auth.user.roles.map(item => item.code)
      return roles.includes('FM')
    },
    async setJobSchedule(id) {
      const { detailedAssociations } =
        this.$store.state.maintenance.jobSchedules;
      this.loading = true;
      try {
        const response = await this.$axios.get("job-schedules/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit(
          "maintenance/jobSchedules/setJobSchedule",
          response.data.jobSchedule
        );
        this.jobSchedule = response.data.jobSchedule;
        // this.$emit('update')
        this.loading = false;
        this.shouldRefresh = false;
      } catch (error) {
        console.log(error);
      }
    },
    updatejobSchedule() {
      this.shouldRefresh = true;
      this.setJobSchedule(this.$route.query.id);
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, layoutMixin]
};
</script>
