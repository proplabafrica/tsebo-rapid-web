<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/maintenance/requests/pending">Pending Requests</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page"
          v-text="clientRequest ? `#${clientRequest.code}` : 'Request Approval'"></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        clientRequest
          ? `Request Approval For #${clientRequest.code}`
          : 'Request Approval'
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
                  <p class="card-profile-position">
                    <b>Short Description:</b>
                    <span v-text="clientRequest.name"></span>
                  </p>
                  <p class="card-profile-position">
                    <b>Code:</b>
                    <span v-text="`#${clientRequest.code}`"></span>
                  </p>
                  <p class="card-profile-position">
                    <b>Created at:</b>
                    <span class="tx-inverse">{{ clientRequest.created_at | dateFormat }}
                      {{ clientRequest.created_at | timeFormat }}</span>
                  </p>
                  <p class="card-profile-position">
                    <b>{{ clientRequest.unit.hierarchy.name }}:</b>
                    <nuxt-link :to="
                      `/location/units/details?id=${clientRequest.unit.id}`
                    " class="tx-inverse" v-text="clientRequest.unit.name"></nuxt-link>
                    <nuxt-link v-if="clientRequest.unit.parent" :to="
                      `/location/units/details?id=${clientRequest.unit.parent.id}`
                    " class="tx-inverse" v-text="`(${clientRequest.unit.parent.name})`"></nuxt-link>
                  </p>
                  <p class="card-profile-position">
                    <nuxt-link class="btn btn-sm btn-primary" v-for="file in clientRequest.files" :key="file.id"
                      :to="`/utilities/files/details?id=${file.id}`">
                      <i class="icon ion-android-attach">&nbsp;</i> View
                      Attachment
                    </nuxt-link>
                  </p>
                </div>
                <!-- col-sm-6 -->
                <div class="col-sm-6">
                  <p class="card-profile-position">
                    <b>Problem Description:</b>
                    <span v-text="clientRequest.description"></span>
                  </p>
                  <p v-if="authUser.roles.find(role => role.code != 'OCC')">
                    <approve class="d-inline" v-if="
                      clientRequest.status.code == 'pending' ||
                        clientRequest.status.code == 'clarification'
                    " :clientRequest="clientRequest" @update="updateClientRequest()" />
                    <seek-clarification class="d-inline" v-if="
                      clientRequest.status.code == 'pending' ||
                        clientRequest.status.code == 'clarification'
                    " :clientRequest="clientRequest" @update="updateClientRequest()" />
                    <submit-clarification class="d-inline" v-if="clientRequest.status.code == 'clarification'"
                      :clientRequest="clientRequest" @update="updateClientRequest()" />
                    <reject class="d-inline" v-if="
                      clientRequest.status.code == 'pending' ||
                        clientRequest.status.code == 'clarification'
                    " :clientRequest="clientRequest" @update="updateClientRequest()" />
                  </p>
                  <p v-if="authUser.roles.find(role => role.code != 'OCC')">
                    <nuxt-link class="btn btn-primary btn-sm" v-if="clientRequest.workRequest" :to="
                      `/maintenance/requests/details?id=${clientRequest.workRequest.id}`
                    ">View Work Request</nuxt-link>
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
            <nuxt-link :to="`/maintenance/requests/approval?id=${clientRequest.id}`" class="nav-link"
              exact-active-class="active">
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :clientRequest="clientRequest" @update="updateClientRequest()" />
      </div>
      <!-- col -->
      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="clientRequest.logs" />
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
import approve from "@/components/maintenance/requests/approval/approve";
import loading from "@/components/ui/loading";
import peopleTrail from "@/components/ui/people-trail";
import reject from "@/components/maintenance/requests/approval/reject";
import seekClarification from "@/components/maintenance/requests/approval/seek-clarification";
import submitClarification from "@/components/maintenance/requests/approval/submit-clarification";
import authMixin from "@/mixins/auth";

export default {
  components: {
    approve,
    loading,
    peopleTrail,
    reject,
    seekClarification,
    submitClarification
  },
  created() {
    this.setClientRequest(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    shouldRefresh: true,
    clientRequest: null
  }),
  head: () => ({
    title: "Approve Request · Tsebo-Rapid"
  }),
  meta: {
    pageName: "client-requests.show"
  },
  methods: {
    setClientRequest(id) {
      const {
        detailedAssociations,
        clientRequests
      } = this.$store.state.maintenance.clientRequests;
      this.clientRequest = clientRequests.find(
        clientRequest => clientRequest.id == id
      );
      if (this.clientRequest && !this.shouldRefresh)
        return (this.loading = false);

      this.loading = true;

      this.$axios
        .get("client-requests/" + id, {
          params: { associations: detailedAssociations }
        })
        .then(response => {
          this.$store.commit(
            "maintenance/clientRequests/setClientRequest",
            response.data.clientRequest
          );
          this.clientRequest = this.clientRequest
            ? Object.assign({}, response.data.clientRequest)
            : response.data.clientRequest;
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("maintenance/clientRequests/toggleRefresh");
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateClientRequest() {
      this.shouldRefresh = true;
      this.setClientRequest(this.clientRequest.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      this.setClientRequest(to.query.id);
    }
  }
};
</script>
