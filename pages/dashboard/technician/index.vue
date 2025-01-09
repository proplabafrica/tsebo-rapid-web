<template>
  <div class="slim-mainpanel chat-ui">
    <div class="container container-messages" v-if="!workRequestsLoading">
      <div class="messages-left" :class="[`${showJobList ? 'd-block' : 'd-none d-sm-block'}`]">
        <div class="slim-pageheader">
          <h6 class="slim-pagetitle">Pending</h6>
          <a href class="messages-compose">
            <i class="icon ion-ios-cog-outline"></i>
          </a>
        </div>
        <!-- slim-pageheader -->

        <div class="messages-list">
          <nuxt-link :to="`/dashboard/technician/?id=${job.id}`" @click.native="showJobList = !showJobList"
            class="media" exact-active-class="active" v-for="job in workRequests" :key="job.id">
            <div class="media-left"></div>
            <!-- media-left -->
            <div class="media-body">
              <div>
                <h6 v-text="job.name"></h6>
                <p>
                  {{ job.unit.name }}
                  <span class="d-block" v-if="job.unit.parent">{{
                  job.unit.parent.name
                  }}</span>
                </p>
              </div>
            </div>
            <!-- media-body -->
          </nuxt-link>
          <!-- media -->
        </div>
        <!-- messages-list -->
        <!-- messages-left-footer -->
      </div>
      <!-- messages-left -->

      <div class="messages-right mg-t-5 mg-sm-t-0" v-if="workRequest != null"
        :class="[`${!showJobList ? 'd-block' : null}`]">
        <div class="message-header pd-10">
          <a href="#" @click.prevent="showJobList = !showJobList" class="message-back">&larr;</a>
          <div class="media">
            <!-- <img src="http://via.placeholder.com/500x500" alt /> -->
            <div class="media-body">
              <h6>{{ workRequest.name }}</h6>
              <p>{{ workRequest.created_at | dateFormat }}</p>
            </div>
            <!-- media-body -->
          </div>
          <!-- media -->
          <div class="message-option"></div>
        </div>
        <!-- message-header -->
        <div class="message-body" v-if="workRequest">
          <div class="pd-10 tx-center">
            <start-job v-if="
              workRequest.status.code == '35' ||
                workRequest.status.code == '105'
            " :workRequest="workRequest" @update="refresh()" />
            <complete-job v-if="workRequest.status.code == '60'" :workRequest="workRequest" @update="refresh()" />
          </div>
          <job-description :workRequest="workRequest" />
        </div>
        <!-- message-body -->
      </div>
    </div>
    <!-- container -->
    <loading v-else />
  </div>
</template>

<script>
import jobDescription from "@/components/maintenance/requests/job-description";
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";
import Notifications from "vue-notification";

import Vue from "vue";

export default {
  components: {
    "complete-job": () =>
      import("@/components/maintenance/requests/complete-job"),
    jobDescription,
    loading,
    "start-job": () => import("@/components/maintenance/requests/start-job")
  },
  created() {
    // const messaging = firebase.messaging();
    // messaging
    //   .requestPermission()
    //   .then(() => {
    //     "Notification permission granted.");
    //     return messaging.getToken();
    //   })
    //   .then(token => {
    //     // You update this token for server by call api
    //     "The token is: ", token);
    //   })
    //   .catch(function(err) {
    //     "Unable to get permission to notify.", err);
    //   });

    // messaging.onMessage(function(payload) {
    //   "Message received. ", payload);
    // });
  },
  computed: {
    workRequest() {
      const id = this.$route.query.id;
      if (!id) return null;
      const workRequest = this.workRequests.find(
        workRequest => workRequest.id == id
      );
      if (!workRequest) return null;
      return workRequest;
    }
  },
  created() {
    this.getWorkRequests();
  },
  data: () => ({
    workRequests: [],
    workRequestsLoading: true,
    showJobList: true
  }),
  head: () => ({
    title: "Tehnician Dashboard · Resido"
  }),
  meta: {
    pageName: "maintenance.work-requests.details"
  },
  methods: {
    getWorkRequests() {
      var {
        detailedAssociations,
        workRequests,
        pagination,
        refresh
      } = this.$store.state.maintenance.workRequests;
      const { page, perPage } = pagination;

      if (refresh == false) {
        this.workRequestsLoading = false;
        return (this.workRequests = workRequests);
      }

      this.$axios
        .get("work-requests", {
          params: {
            associations: detailedAssociations,
            byStatusCodes: ["60", "35", "105"],
            page,
            perPage
          }
        })
        .then(response => {
          this.$store.commit(
            "maintenance/workRequests/setWorkRequests",
            response.data.data
          );
          this.$store.commit(
            "maintenance/workRequests/setPagination",
            response.data
          );
          this.workRequests = this.$store.state.maintenance.workRequests.workRequests;
          if (!this.$route.query.id && this.workRequests.length > 0) {
            this.$router.replace(
              `/dashboard/technician/?id=${this.workRequests[0].id}`
            );
          }
          this.workRequestsLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
      return true;
    },
    refresh() {
      this.workRequestsLoading = true;
      this.$router.replace("/dashboard/technician");
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getWorkRequests();
    }
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
