<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/maintenance/requests">Jobs In Planning</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page"
          v-text="workRequest ? `#${workRequest.code}` : 'Work Request Details'"></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        workRequest
          ? `Work Request #${workRequest.code}`
          : 'Work Request Details'
      "></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col">
        <div class="card card-profile">
          <div class="card-body">
            <div class="media">
              <div class="media-body row">
                <div class="col-sm-6">
                  <div v-if="workRequest.clientRequest">
                    <p class="card-profile-position mg-b-10">
                      <b>Client Short Description:</b>
                      <span v-text="workRequest.clientRequest.name"></span>
                    </p>
                    <p class="card-profile-position mg-b-10">
                      <b>Client Description:</b>
                      <span v-text="workRequest.clientRequest.description"></span>
                    </p>
                    <p class="card-profile-position">
                      <nuxt-link :to="`/utilities/files/details?id=${file.id}`" class="btn btn-sm btn-primary"
                        v-for="file in workRequest.clientRequest.files" :key="file.id">
                        <i class="icon ion-android-attach">&nbsp;</i> View
                        Attachment
                      </nuxt-link>
                    </p>
                  </div>

                  <div v-if="workRequest.type">
                    <!-- <div>
                      Danger in the mood
                      {{ workRequest.status.code }}
                    </div> -->
                    <p class="card-profile-position mg-b-10">
                      <b>Type:</b>
                      <span>{{ workRequest.type.name }}</span>
                    </p>
                  </div>
                  <div v-for="schedule in workRequest.jobSchedules" :key="schedule.id">
                    <p class="card-profile-position mg-b-10">
                      <b>PPM Name:</b>
                      <span>{{ schedule.plan.name }} (Cycle #{{
                        schedule.current_cycle_count
                      }})</span>
                    </p>
                    <p class="card-profile-position mg-b-10">
                      <b>PPM Description:</b>
                      <span v-text="schedule.plan.description"></span>
                    </p>
                  </div>
                  <p class="card-profile-position">
                    <span class="d-block" v-if="
                      workRequest.slaInfo && workRequest.type != 'project'
                    ">
                      <div class="d-block">
                        <b>SLA:</b>
                        <span>{{ workRequest.sla.name }} -
                          {{
                            workRequest.slaInfo.expectedDuration | readableTime
                          }}</span>
                      </div>
                      <div class="block" v-if="workRequest.procurementSlaInfo">
                        <b>Procurement:</b>
                        <span :class="[
                          `tx-${workRequest.procurementSlaInfo.timeExpended <
                            workRequest.procurementSlaInfo.expectedDuration
                            ? 'success'
                            : 'danger'
                          }`
                        ]">{{
                            workRequest.procurementSlaInfo.timeExpended
                            | readableTime
                          }}</span>/
                        <span>{{
                          workRequest.procurementSlaInfo.expectedDuration
                          | readableTime
                        }}</span>
                      </div>
                      <div class="block" v-if="workRequest.approvalSlaInfo">
                        <b>Client:</b>
                        <span :class="[
                          `tx-${workRequest.approvalSlaInfo.timeExpended <
                            workRequest.approvalSlaInfo.expectedDuration
                            ? 'success'
                            : 'danger'
                          }`
                        ]">{{
                          workRequest.approvalSlaInfo.timeExpended
                          | readableTime
                          }}</span>/
                        <span>{{
                          workRequest.approvalSlaInfo.expectedDuration
                          | readableTime
                        }}</span>
                      </div>
                      <div class="block" v-if="workRequest.operationsSlaInfo">
                        <b>Operations:</b>
                        <span :class="[
                          `tx-${workRequest.operationsSlaInfo.timeExpended <
                            workRequest.operationsSlaInfo.expectedDuration
                            ? 'success'
                            : 'danger'
                          }`
                        ]">{{
                            workRequest.operationsSlaInfo.timeExpended
                            | readableTime
                          }}</span>/
                        <span>{{
                          workRequest.operationsSlaInfo.expectedDuration
                          | readableTime
                        }}</span>
                      </div>

                      <div class="block">
                        <b>Conversion time:</b>

                        <span>{{
                          timeDiffCalc(
                            workRequest.created_at,
                            workRequest.cr_created_at
                          )
                        }}</span>
                      </div>
                    </span>
                  </p>
                  <div class="media" v-action-show="'work-requests.store-invoice'">
                    <nuxt-link
                    v-if="
                      ['35', '100'].includes(workRequest.status.code) && workRequest.invoices.length < 1 &&
                      workRequest.items.length > 0 
                    " :to="
  `/maintenance/requests/create-invoice?id=${workRequest.id}`
" class="btn btn-primary mg-r-5">
                      <i class="icon ion-compose tx-14"></i> Create Invoice
                    </nuxt-link>
                    <nuxt-link class="btn btn-primary mg-r-5" v-for="invoice in workRequest.invoices" :key="invoice.id"
                      :to="`/finance/invoices/details?id=${invoice.id}`">View Invoice</nuxt-link>
                  </div>
                </div>
                <!-- col-sm-6 -->
                <div class="col-sm-6">
                  <p class="card-profile-position">
                    <b>Code:</b>
                    <span v-text="`#${workRequest.code}`"></span>
                  </p>
                  <p class="card-profile-position">
                    <b>Date Created:</b>
                    <span class="tx-inverse">{{ workRequest.created_at | dateFormat }} @
                      {{ workRequest.created_at | timeFormat }}</span>
                  </p>
                  <p class="card-profile-position" v-if="workRequest.unit">
                    <b>{{ workRequest.unit.hierarchy.name }}:</b>
                    <nuxt-link :to="`/location/units/details?id=${workRequest.unit.id}`" class="tx-inverse">
                      {{ workRequest.unit.name }}
                      <span v-if="workRequest.unit.parent">({{ workRequest.unit.parent.name }})</span>
                    </nuxt-link>
                  </p>
                  <p class="card-profile-position">
                    <b>Status:</b>
                    <span v-text="workRequest.status.name"></span>
                  </p>
                  <p class="card-profile-position" v-if="workRequest.children.length !== 0">
                    <b>Reopened as:</b>
                    <nuxt-link :to="
                      linkCheck(
                        'work-requests.show',
                        `/maintenance/requests/details?id=${workRequest.children[0].id}`
                      )
                    ">{{
                        ellipse(workRequest.children[0].code, 40)
                      }}</nuxt-link>
                  </p>
                  <p class="timeline-text" v-for="ratingData in workRequest.ratings" :key="ratingData.id">
                    <star-rating class="tx-30" :rangeArray="[1, 2, 3, 4, 5]" :rating="ratingData.rating" />
                    {{ ratingData.remark }}
                  </p>
                  <div class="media">
                    <request-delivery class="mg-r-5" v-if="
                      workRequest.status.code == '05' &&
                      authorized('work-requests.request-delivery')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <approve class="mg-r-5" v-if="
                      ['35', '100'].includes(workRequest.status.code) &&
                      authorized('work-requests.approve')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <start-job class="mg-r-5" v-if="
                      workRequest.status.code == '105' &&
                      authorized('work-requests.start-job')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <complete-job class="mg-r-5" v-if="
                      workRequest.status.code == '60' &&
                      authorized('work-requests.complete-job')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <rate-job class="mg-r-5" v-if="
                      workRequest.status.code == '65' || workRequest.status.code == '75' &&
                      authorized('work-requests.rate-job')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <stop-job class="mg-r-5" v-if="
                      workRequest.status.code == '60' &&
                      authorized('work-requests.stop-job')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <upload-jcf class="mg-r-5" v-if="
                      (workRequest.status.code == '65' ||
                        workRequest.status.code == '80') &&
                      workRequest.children.length == 0 &&
                      canUploadJCF.length
                    " :workRequest="workRequest" @update="updateWorkRequest()" />


                    <reopen-request class="mg-r-5" v-if="
                      (workRequest.status.code == '65' ||
                        workRequest.status.code == '80' || workRequest.status.code == '70') &&
                      workRequest.children.length == 0 &&
                      authorized('work-requests.reopen-request')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                    <terminate class="mg-r-5" v-if="
                      !['65', '80', '95', '70'].includes(workRequest.status.code) &&
                      authorized('work-requests.terminate')
                    " :workRequest="workRequest" @update="updateWorkRequest()" />
                  </div>

                  <div class="row px-3" v-if="workRequest.jcf">
                    <a class="btn btn-primary btn-sm" :href="workRequest.jcf" :download="workRequest.name + '-JCF'"
                      v-if="workRequest.jcf">
                      <i class="icon ion-ios-printer-outline"></i>
                      Download JCF</a>
                  </div>

                  <div class="mr-3" v-if="workRequest.jcf && canMarkAsBilled.length">
                    <label v-if="!workRequest.is_billed">Mark as billed </label>
                    <label v-else>Marked as billed </label>

                    <input :disabled="workRequest.is_billed" type="checkbox" :checked="workRequest.is_billed"
                      @change="markAsBilled($event)" />

                  </div>

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
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link :to="`/maintenance/requests/details?id=${workRequest.id}`" class="nav-link"
              exact-active-class="active">
              <i class="icon ion-ios-list-outline tx-primary"></i> Job Scope
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link :to="`/maintenance/requests/details/activity-log?id=${workRequest.id}`" class="nav-link"
              exact-active-class="active">
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :workRequest="workRequest" @update="updateWorkRequest()" />
      </div>
      <!-- col -->
      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="workRequest.logs" />
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
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import slaMixin from "@/mixins/performance/sla";
import timeFunctions from "@/mixins/timeFunctions";
import starRating from "@/components/ui/star-rating";

export default {
  components: {
    starRating,
    approve: () => import("@/components/maintenance/requests/approve"),
    "complete-job": () =>
      import("@/components/maintenance/requests/complete-job"),
    loading,
    "people-trail": () => import("@/components/ui/people-trail"),
    "request-delivery": () =>
      import("@/components/maintenance/requests/request-delivery"),
    "rate-job": () => import("@/components/maintenance/requests/rate-job"),
    "start-job": () => import("@/components/maintenance/requests/start-job"),
    "stop-job": () => import("@/components/maintenance/requests/stop-job"),
    "reopen-request": () =>
      import("@/components/maintenance/requests/reopen-request"),
    "upload-jcf": () =>
      import("@/components/maintenance/requests/upload-jcf"),
    terminate: () => import("@/components/maintenance/requests/terminate")
  },
  created() {
    this.setWorkRequest(this.$route.query.id);

    this.canMarkAsBilled = this.authUser.roles.filter((role) => role.systemFunctions.find((func) => func.code === 'mark-as-billed'))
    this.canUploadJCF = this.authUser.roles.filter((role) => role.systemFunctions.find((func) => func.code === 'upload-jcf'))

  },
  data: () => ({
    loading: true,
    workRequest: null,
    canMarkAsBilled: null,
    canUploadJCF: null
  }),
  head: () => ({
    title: "Work Request Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "work-requests.show"
  },
  methods: {
    async setWorkRequest(id) {
      const { detailedAssociations, workRequests, refresh } =
        this.$store.state.maintenance.workRequests;
      this.workRequest = workRequests.find(
        (workRequest) => workRequest.id == id
      );
      if (this.workRequest && !refresh) {
        if (Array.isArray(this.workRequest.items)) {
          return (this.loading = false);
        }
      }
      this.loading = true;


      try {
        const response = await this.$axios.get("work-requests/" + id, {
          params: { associations: detailedAssociations }
        });


        this.$store.commit(
          "maintenance/workRequests/setWorkRequest",
          response.data.workRequest
        );


        this.workRequest = this.workRequest
          ? Object.assign({}, response.data.workRequest)
          : response.data.workRequest;
        this.loading = false;
        this.$store.commit("maintenance/workRequests/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async markAsBilled(e) {


      const isAuthorized = this.authUser.roles.filter((rol) => rol.code === 'SYS' || rol.code === 'OA')

      if (isAuthorized.length) {

        this.disabled = true;

        const workRequest = JSON.parse(JSON.stringify(this.workRequest));


        if (!workRequest.is_billed) {
          try {
            const response = await this.$axios.post(
              "work-requests/mark-as-billed",
              { work_request_id: workRequest.id }
            );
            this.disabled = false;
            this.toast({ type: "info", title: "Request Marked as Billed!" });

          } catch (error) {
            console.log(error);
            this.disabled = false;
            const response = error.response;
            if (response && response.status && response.status == 422) {
              for (const error of response.data) {
                this.validationErrors[error.field] = error.message;
              }
            } else if (response && response.status && response.status == 429) {
              this.validationErrors.email = response.statusText;
            } else {
            }
          }
        }
      }


    },
    updateWorkRequest() {
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.setWorkRequest(this.workRequest.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, slaMixin, timeFunctions],
  watch: {
    $route(to, from) {
      // this.getNotification();

      if (to.query.id != from.query.id) this.setWorkRequest(to.query.id);
    }
  }
};
</script>

