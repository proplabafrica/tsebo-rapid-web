<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/maintenance/routines/">Pending Routines</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page" v-text="
          jobSchedule ? `#${jobSchedule.plan.code}` : `Request Approval`
        "></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        clientRequest
          ? `Request Approval For #${jobSchedule.plan.code}`
          : 'Request Approval'
      "></h6>
    </div>

    <div class="row row-sm" v-if="!loading">
      <div class="col">
        <div class="card card-profile">
          <div class="card-body">
            <div class="media">
              <div class="media-body row">
                <div class="col-sm-6">
                  <p class="card-profile-position">
                    <b>Short Description:</b>
                    <span v-text="jobSchedule.plan.name"></span>
                  </p>
                  <p class="card-profile-position">
                    <b>Code:</b>
                    <span v-text="`#${jobSchedule.plan.code}`"></span>
                  </p>
                  <p class="card-profile-position">
                    <b>Created at:</b>
                    <span class="tx-inverse">{{ jobSchedule.plan.created_at | dateFormat }}
                      {{ jobSchedule.plan.created_at | timeFormat }}</span>
                  </p>
                  <p class="card-profile-position">
                    <b>{{ jobSchedule.unit.hierarchy.name }}:</b>
                    <nuxt-link :to="`/location/units/details?id=${jobSchedule.unit.id}`" class="tx-inverse"
                      v-text="`${jobSchedule.unit.name}`"></nuxt-link>
                    <nuxt-link v-if="jobSchedule.unit.parent" :to="`/location/units/details?id=${jobSchedule.unit.id}`"
                      class="tx-inverse" v-text="`(${jobSchedule.unit.parent.name})`"></nuxt-link>
                  </p>
                </div>
                <div class="col-sm-5">
                  <p class="card-profile-position">
                    <b>Problem Description:</b>
                    <span v-text="jobSchedule.plan.description"></span>
                  </p>
                  <p v-if="authUser.roles.find((role) => role.code != 'OCC')">
                    <approve class="d-inline" v-if="
                      (!jobSchedule.workRequests[0] ||
                        jobSchedule.workRequests[
                          jobSchedule.workRequests.length - 1
                        ].job_status_id == 17 ||
                        jobSchedule.workRequests[
                          jobSchedule.workRequests.length - 1
                        ].job_status_id == 19) &&
                      (jobSchedule.status.code == 'started' ||
                        jobSchedule.status.code == null ||
                        jobSchedule.status.code == 'reminder-sent')
                    " :jobSchedule="jobSchedule" @update="updateJobSchedule()" />

                    <send class="d-inline-flex" v-if="
                      jobSchedule.status.code == 'started' ||
                      jobSchedule.status.code == null ||
                      jobSchedule.status.code == 'reminder-sent'
                    " :jobSchedule="jobSchedule" @update="updateJobSchedule" />
                    <edit class="d-inline-flex" v-if="
                      jobSchedule.status.code == 'started' ||
                      jobSchedule.status.code == null ||
                      jobSchedule.status.code == 'reminder-sent'
                    " :jobSchedule="jobSchedule" @update="updateJobSchedule" />
                    <reject class="d-inline-flex" v-if="
                      (!jobSchedule.workRequests[0] ||
                        jobSchedule.workRequests[
                          jobSchedule.workRequests.length - 1
                        ].job_status_id == 17 ||
                        jobSchedule.workRequests[
                          jobSchedule.workRequests.length - 1
                        ].job_status_id == 19) &&
                      (jobSchedule.status.code == 'started' ||
                        jobSchedule.status.code == null ||
                        jobSchedule.status.code == 'reminder-sent')
                    " :jobSchedule="jobSchedule" @update="updateJobSchedule" />
                  </p>
                  <p v-if="authUser.roles.find((role) => role.code != 'OCC')">
                    <nuxt-link class="btn btn-primary btn-sm d-inline" v-if="jobSchedule.workRequests[0]" :to="`/maintenance/requests/details?id=${
                      jobSchedule.workRequests[
                        jobSchedule.workRequests.length - 1
                      ].id
                    }`">View Work Request</nuxt-link>
                  </p>
                </div>
                <!-- col-sm-6 -->
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- card-body -->
        </div>
        <!-- card -->
        <ul class="nav nav-activity-profile">
          <li class="nav-item">
            <nuxt-link :to="`/maintenance/routines/job-schedules/approval?id=${jobSchedule.id}`" class="nav-link"
              exact-active-class="active">
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :jobSchedule="jobSchedule" @update="updateJobSchedule()" />
      </div>
      <!-- col -->
      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="jobSchedule.logs" />
        </div>
        <!-- card -->
      </div>
      <!-- col-3 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>


<script>
import approve from "@/components/maintenance/requests/job-schedule/approve";
import edit from "@/components/maintenance/requests/job-schedule/edit";
import send from "@/components/maintenance/requests/job-schedule/send";
import loading from "@/components/ui/loading";
import peopleTrail from "@/components/ui/people-trail";
import reject from "@/components/maintenance/requests/job-schedule/reject";
import seekClarification from "@/components/maintenance/requests/approval/seek-clarification";
import submitClarification from "@/components/maintenance/requests/approval/submit-clarification";
import authMixin from "@/mixins/auth";

export default {
  components: {
    approve,
    loading,
    peopleTrail,
    reject,
    edit,
    send,
    seekClarification,
    submitClarification
  },
  created() {
    this.setJobSchedule(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    shouldRefresh: true,
    clientRequest: null,
    jobSchedule: null
  }),
  head: () => ({
    title: "Approve Request · Tsebo-Rapid"
  }),
  meta: {
    pageName: "client-requests.show"
  },
  methods: {
    setJobSchedule(id) {
      const { detailedAssociations, jobSchedules } =
        this.$store.state.maintenance.jobSchedules;

      this.jobSchedule = jobSchedules.find(
        (jobSchedule) => jobSchedule.id === id
      );
      if (this.jobSchedule && !this.shouldRefresh)
        return (this.loading = false);

      this.loading = true;

      this.$axios
        .get("job-schedules/" + id, {
          params: { associations: detailedAssociations }
        })
        .then((response) => {
          this.$store.commit(
            "maintenance/jobSchedules/setJobSchedule",
            response.data.jobSchedule
          );
          this.jobSchedule = this.jobSchedule
            ? Object.assign({}, response.data.jobSchedule)
            : response.data.jobSchedule;

          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("maintenance/jobSchedules/toggleRefresh");
        });
    },
    updateJobSchedule() {
      this.shouldRefresh = true;
      this.setJobSchedule(this.jobSchedule.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      this.setJobSchedule(to.query.id);
    }
  }
};
</script>
