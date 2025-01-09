<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/tender-processes">Tender Processes</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-text="
          tenderProcess
            ? tenderProcess.name || tenderProcess.code
            : 'Tender Process Details'
        "></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        tenderProcess
          ? tenderProcess.name || 'Tender Process #' + tenderProcess.code
          : 'Tender Process Details'
      "></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!loading">
      <div class="col">
        <div class="card card-profile">
          <div class="card-body">
            <div class="media">
              <div class="media-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Created By:</span>
                      <nuxt-link class="tx-inverse" :to="`/people/users/details?id=${tenderProcess.createdBy.id}`"
                        v-text="tenderProcess.createdBy.name"></nuxt-link>
                    </div>
                    <!-- media -->
                    <div class="media">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Status:</span>
                      <span class="tx-inverse" v-text="tenderProcess.status.name"></span>
                    </div>
                    <!-- media -->
                  </div>
                  <!-- col -->
                  <div class="col-md-6">
                    <div class="media" v-if="tenderProcess.workRequests.length">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Work Request:</span>
                      <nuxt-link class="tx-medium tx-inverse" v-for="(
                                    workRequest, index
                                  ) in tenderProcess.workRequests" :key="workRequest.id"
                        :to="`/maintenance/requests/details?id=${workRequest.id}`">{{ workRequest.name }}
                        {{
                          tenderProcess.workRequests.length > index + 1
                          ? ", "
                          : ""
                        }}</nuxt-link>
                    </div>
                    <!-- media -->
                    <div v-for="(salesOrder, index) in tenderProcess.salesOrders" :key="salesOrder.id">
                      <span class="d-block">
                        <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Sales Order:</span>
                        <nuxt-link class="tx-inverse"
                          :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`">#{{ salesOrder.code }}
                          {{
                            tenderProcess.salesOrders.length > index + 1
                            ? ", "
                            : ""
                          }}</nuxt-link>
                      </span>
                      <span class="d-block">
                        <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Work Request:</span>
                        <nuxt-link class="tx-inverse" v-for="(
                                      workRequest, index
                                    ) in salesOrder.workRequests" :key="workRequest.id"
                          :to="`/maintenance/requests/details?id=${workRequest.id}`">{{ workRequest.name
                          }}{{
  index + 1 >= salesOrder.workRequests.length
  ? ""
  : ", "
}}</nuxt-link>
                      </span>
                      <span class="d-block">
                        <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Unit:</span>
                        <nuxt-link class="tx-inverse" v-for="workRequest in salesOrder.workRequests" :key="workRequest.id"
                          :to="`/location/units/details?id=${workRequest?.unit?.id}`">
                          {{ workRequest.unit?.name }}
                        </nuxt-link>
                      </span>
                    </div>
                    <!-- media -->
                    <div class="media">
                      <nuxt-link v-if="tenderProcess.status.code == 'pending'"
                        :to="`/hagul/purchase/tender-processes/send-rfq?id=${tenderProcess.id}`"
                        class="btn btn-primary mg-r-10">
                        <i class="icon ion-ios-copy"></i> Request Quotations
                      </nuxt-link>
                      <nuxt-link v-if="tenderProcess.status.code == 'rfq-sent'"
                        :to="`/hagul/purchase/tender-processes/upload-quotations?id=${tenderProcess.id}`"
                        class="btn btn-primary mg-r-10">
                        <i class="icon ion-ios-cloud-upload-outline"></i> Upload
                        Quotations
                      </nuxt-link>
                      <nuxt-link v-if="
                        tenderProcess.status.code == 'quotation-upload-closed'
                      " :to="`/hagul/purchase/tender-processes/select-vendors?id=${tenderProcess.id}`"
                        class="btn btn-primary mg-r-10">
                        <i class="icon ion-android-contacts"></i> Select Vendors
                      </nuxt-link>
                      <terminate class="mg-r-10" v-if="
                        ![
                          'terminated',
                          'vendors-engaged',
                          'vendors-selected'
                        ].includes(tenderProcess.status.code)
                      " @update="updateTenderProcess()" :tenderProcess="tenderProcess" />
                    </div>
                    <!-- media -->
                  </div>
                  <!-- col -->
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
            <nuxt-link :to="`/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`" class="nav-link"
              exact-active-class="active">
              <i class="icon ion-ios-list-outline tx-primary"></i> Items
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link :to="`/hagul/purchase/tender-processes/details/bidding?id=${tenderProcess.id}`" class="nav-link"
              active-class="active">
              <i class="icon ion-document-text tx-primary"></i> Bidding
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link :to="`/hagul/purchase/tender-processes/details/activity-log?id=${tenderProcess.id}`"
              class="nav-link" active-class="active">
              <i class="icon ion-ios-recording-outline tx-primary"></i> Activity
              Log
            </nuxt-link>
          </li>
        </ul>
        <!-- nav -->
        <nuxt-child :tenderProcess="tenderProcess" @update="updateTenderProcess()" />
      </div>
      <!-- col -->

      <div class="col-lg-3 mg-t-10 mg-lg-t-0">
        <div class="card card-people-list">
          <div class="slim-card-title">People Trail</div>
          <people-trail :logs="tenderProcess.logs" />
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import loading from "@/components/ui/loading";
import peopleTrail from "@/components/ui/people-trail";
import terminate from "@/components/hagul/purchase/tender-processes/terminate";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading, peopleTrail, terminate },
  created() {
    this.setTenderProcess(this.$route.query.id);
  },
  data: () => ({
    loading: true,
    tenderProcess: null,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Tender Process Details · Hagul"
  }),
  meta: {
    pageName: "tender-processes.show"
  },
  methods: {
    setTenderProcess(id) {
      const { detailedAssociations, tenderProcesses } =
        this.$store.state.hagul.purchase.tenderProcesses;
      this.tenderProcess = tenderProcesses.find(
        (tenderProcess) => tenderProcess.id == id
      );

      if (this.tenderProcess && !this.shouldRefresh) {
        if (Array.isArray(this.tenderProcess.items)) {
          return (this.loading = false);
        }
      }

      this.$axios
        .get("tender-processes/" + id, {
          params: { associations: detailedAssociations }
        })
        .then((response) => {
          this.$store.commit(
            "hagul/purchase/tenderProcesses/setTenderProcess",
            response.data.tenderProcess
          );
          this.tenderProcess = this.tenderProcess
            ? Object.assign({}, response.data.tenderProcess)
            : response.data.tenderProcess;
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateTenderProcess() {
      this.shouldRefresh = true;
      this.setTenderProcess(this.tenderProcess.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      this.setTenderProcess(to.query.id);
    }
  }
};
</script>
