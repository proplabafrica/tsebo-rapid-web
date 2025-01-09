<template>
  <div class="card">
    <div class="card-header bg-white" style="background-color: black">
      <input
        type="text"
        placeholder="Start typing here to search"
        class="form-control search mg-b-10 float-left"
        v-model="search"
      />

      <create-request class="float-right" />
    </div>
    <!-- card-header -->
    <div class="card-body p-0 work-request-grouping">
      <div class="row mg-x-0">
        <div class="col-12 col-md pd-0">
          <ul class="list-group">
            <li class="list-group-item list-header">
              <h6>PENDING REQUESTS</h6>
            </li>
            <div
              v-if="
                (!clientRequestsLoading && clientRequests.length > 0) ||
                (!maintenanceCyclesLoading && maintenanceCycles.length > 0)
              "
            >
              <li
                class="list-group-item"
                v-for="clientRequest in clientRequestSearch"
                :key="clientRequest.id"
              >
                <nuxt-link
                  :to="`/maintenance/requests/approval?id=${clientRequest.id}`"
                  class="tx-inverse tx-14 tx-medium d-block"
                  style="
                    max-width: 200px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                  "
                >
                  {{ clientRequest.name }}
                </nuxt-link>
                <span
                  class="tx-11 d-block tx-uppercase"
                  v-if="clientRequest.unit"
                >
                  <nuxt-link
                    v-if="clientRequest.unit"
                    :to="`/location/units/details?id=${clientRequest.unit.id}`"
                    class="tx-inverse d-block"
                    >{{ clientRequest.unit.name }}</nuxt-link
                  >
                  <nuxt-link
                    v-if="clientRequest.unit.parent"
                    :to="`/location/units/details?id=${clientRequest.unit.parent.id}`"
                    class="tx-inverse d-block"
                    >({{ clientRequest.unit.parent.name }})</nuxt-link
                  >
                </span>
                <span class="tx-11 d-block">
                  {{ clientRequest.status.name }}
                </span>
              </li>
              <div v-if="maintenanceCycles.length">
                <maintenance-cycle-column
                  :cycles="maintenanceCycles"
                  :cyclesLoading="maintenanceCyclesLoading"
                />
              </div>
              <loading v-else-if="!maintenanceCycles.length" />
              <div v-else>
                <li class="list-group-item">
                  <h5>No data to display</h5>
                </li>
              </div>
            </div>
            <div v-else-if="!clientRequestsLoading">
              <li class="list-group-item">
                <h5>No data to display</h5>
              </li>
            </div>
            <loading v-else />
          </ul>
        </div>
        <work-request-column
          name="PLANNING"
          workRequestsPerPage="40"
          :workRequestSearch="search"
          :workRequestStatusCodes="['01', '05', '20']"
          workRequestUserId="authUser.id"
        />
        <work-request-column
          v-if="authorized('work-requests.approve')"
          name="COSTED"
          workRequestsPerPage="40"
          :workRequestSearch="search"
          :workRequestStatusCodes="['35', '100']"
          workRequestUserId="authUser.id"
        />
        <work-request-column
          v-if="!authorized('work-requests.approve')"
          name="COSTED"
          workRequestsPerPage="40"
          :workRequestSearch="search"
          :workRequestStatusCodes="['35', '100', '105']"
          workRequestUserId="authUser.id"
        />
        <work-request-column
          name="STARTED"
          workRequestsPerPage="40"
          :workRequestSearch="search"
          :workRequestStatusCodes="['60']"
          workRequestUserId="authUser.id"
        />
        <work-request-column
          name="COMPLETED"
          workRequestsPerPage="40"
          :workRequestSearch="search"
          :workRequestStatusCodes="['65', '80', '70', '72']"
          workRequestUserId="authUser.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import workRequestColumn from "@/components/maintenance/requests/status-table/work-request-column";
import maintenanceCycleColumn from "@/components/maintenance/requests/status-table/maintenance-cycle-column";
import authMixin from "@/mixins/auth";
import vButton from "@/components/ui/v-button";

export default {
  beforeDestroy() {
    this.$store.commit("maintenance/clientRequests/toggleRefresh");
    this.$store.commit("maintenance/workRequests/toggleRefresh");
  },
  components: {
    loading,
    workRequestColumn,
    maintenanceCycleColumn,
    "create-request": () =>
      import("@/components/maintenance/requests/status-table/create-modal")
  },
  computed: {
    clientRequestSearch() {
      // return this.search
      return this.clientRequests.filter(
        (request) =>
          request.name.toLowerCase().includes(this.search.toLowerCase()) ||
          (request.unit &&
            request.unit.name.toLowerCase().includes(this.search.toLowerCase()))
      );
      // "first")
    }
  },
  created() {
    this.$store.commit("maintenance/clientRequests/toggleRefresh");
    this.$store.commit("maintenance/workRequests/toggleRefresh");
    this.getClientRequests(this);
    this.getMaintenanceCycles(this);
  },
  data: () => ({
    clientRequests: [],
    clientRequestsLoading: true,
    clientRequestStatusCodes: ["pending", "clarification"],
    search: "",
    maintenancePlans: [],
    maintenancePlansLoading: true,
    maintenanceCycles: [],
    maintenanceCyclesLoading: true
  }),
  methods: {
    ...mapActions({
      getClientRequests: "maintenance/clientRequests/getClientRequests",
      getMaintenanceCycles: "maintenance/maintenanceCycles/getMaintenanceCycles"
    })
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>
