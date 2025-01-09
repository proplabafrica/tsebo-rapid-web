<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/maintenance/float-requests">Float Requests</nuxt-link>
        </li>
        <li
          class="breadcrumb-item active"
          aria-current="page"
          v-text="
            floatRequest ? `#${floatRequest.code}` : 'Float Request Details'
          "
        ></li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="
          floatRequest
            ? `Float Request #${floatRequest.code}`
            : 'Float Request Details'
        "
      ></h6>
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
                    <b>Code:</b>
                    <span v-text="`#${floatRequest.code}`"></span>
                  </p>
                  <p class="card-profile-position">
                    <b>Date Created:</b>
                    <span class="tx-inverse"
                      >{{ floatRequest.created_at | dateFormat }} @
                      {{ floatRequest.created_at | timeFormat }}</span
                    >
                  </p>
                  <p class="card-profile-position" v-if="floatRequest.unit">
                    <b>{{ floatRequest.unit.hierarchy.name }}:</b>
                    <nuxt-link
                      :to="`/location/units/details?id=${floatRequest.unit.id}`"
                      class="tx-inverse"
                    >
                      {{ floatRequest.unit.name }}
                      <span v-if="floatRequest.unit.parent"
                        >({{ floatRequest.unit.parent.name }})</span
                      >
                    </nuxt-link>
                  </p>
                  <p class="card-profile-position">
                    <b>Status:</b>
                    <span v-text="floatRequest.status.name"></span>
                  </p>
                  <!-- invoice -->
                  <div
                    class="media"
                    v-action-show="'work-requests.store-invoice'"
                  >
                    <nuxt-link
                      v-if="floatRequest.status.code == 'approved'"
                      :to="
                        `/maintenance/float-requests/create-invoice?id=${floatRequest.id}`
                      "
                      class="btn btn-primary mg-r-5"
                    >
                      <i class="icon ion-compose tx-14"></i> Create Invoice
                    </nuxt-link>
                    <nuxt-link
                      v-for="invoice in floatRequest.invoices"
                      :key="invoice.id"
                      :to="`/finance/invoices/details?id=${invoice.id}`"
                      class="btn btn-primary mg-r-5"
                    >
                      <i class="icon ion-ios-list-outline"></i> View Invoice
                    </nuxt-link>
                  </div>
                  <!-- invoice -->
                  <!-- {{}} -->
                  <p class="card-profile-position"
                    v-if="authUser.roles.find(role => role.code != 'FM' || role.code == 'OM')"
                  >
                    <approve
                      v-if="
                        floatRequest.status.code == 'pending' &&
                          authorized('float-requests.approve')
                      "
                      :floatRequest="floatRequest"
                      @update="updateFloatRequest()"
                    />
                    <terminate
                      v-if="
                        floatRequest.status.code == 'pending' &&
                          authorized('float-requests.terminate')
                      "
                      :floatRequest="floatRequest"
                      @update="updateFloatRequest()"
                    />
                  </p>
                </div>
                <!-- col-sm-6 -->
                <div class="col-sm-6">
                  <p>
                    <nuxt-link
                      :to="`/utilities/files/details?id=${file.id}`"
                      class="btn btn-sm btn-primary"
                      v-for="file in floatRequest.files"
                      :key="file.id"
                    >
                      <i class="icon ion-android-attach">&nbsp;</i> View
                      Attachment
                    </nuxt-link>
                  </p>
                </div>
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
            <nuxt-link
              :to="`/maintenance/float-requests/details?id=${floatRequest.id}`"
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-ios-list-outline tx-primary"></i> Items
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              :to="
                `/maintenance/float-requests/details/activity-log?id=${floatRequest.id}`
              "
              class="nav-link"
              exact-active-class="active"
            >
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child
          :floatRequest="floatRequest"
          @update="updateFloatRequest()"
        />
      </div>
      <!-- col -->
      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="floatRequest.logs" />
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

export default {
  components: {
    loading,
    "people-trail": () => import("@/components/ui/people-trail"),
    approve: () => import("@/components/maintenance/float-requests/approve"),
    terminate: () => import("@/components/maintenance/float-requests/terminate")
    // },
    // computed: {
    //   logStatusCodes() {
    //     return this.floatRequest.logs.map(log => log.status.code);
    //   }
  },
  created() {
    this.setFloatRequest(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    shouldRefresh: true,
    floatRequest: null
  }),
  head: () => ({
    title: "Float Request Details · Landwey"
  }),
  meta: {
    pageName: "float-requests.show"
  },
  methods: {
    async setFloatRequest(id) {
      const {
        detailedAssociations,
        floatRequests
      } = this.$store.state.maintenance.floatRequests;
      this.floatRequest = floatRequests.find(
        floatRequest => floatRequest.id == id
      );
      if (this.floatRequest && !this.shouldRefresh) {
        if (Array.isArray(this.floatRequest.items)) {
          return (this.loading = false);
        }
      }
      this.loading = true;

      try {
        const response = await this.$axios.get("float-requests/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit(
          "maintenance/floatRequests/setFloatRequest",
          response.data.floatRequest
        );
        this.floatRequest = this.floatRequest
          ? Object.assign({}, response.data.floatRequest)
          : response.data.floatRequest;
        this.loading = false;
        this.shouldRefresh = false;
        this.$store.commit("maintenance/floatRequests/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    updateFloatRequest() {
      this.shouldRefresh = true;
      this.setFloatRequest(this.floatRequest.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      this.setFloatRequest(to.query.id);
    }
  }
};
</script>
