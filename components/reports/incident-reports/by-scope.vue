<template>
  <div>
    <v-paginate
      :list="incidentReports"
      perPage="30"
      v-if="!incidentReportsLoading"
    >
      <template v-slot="paginate">
        <div class="table-responsive bg-white">
          <table class="table table-responsiv">
            <thead>
              <tr>
                <th>Title</th>
                <th>Facility</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="incident in paginate.list" :key="incident.id">
                <td v-on:click="openModal(incident)" class="pointer">
                  <!-- <nuxt-link :to="`/`" class="tx-inverse"> -->

                  <span v-text="incident.name" class="tx-bold d-block"></span>
                  <!-- </nuxt-link> -->
                  <span
                    class="d-block tx-11"
                    v-text="`Code: ${incident.code}`"
                  ></span>
                </td>
                <td class="tx-inverse d-block">
                  {{ incident.unit.name }}
                  <span class="tx-11 d-block" v-if="incident.unit.parent"
                    >({{ incident.unit.parent.name }})</span
                  >
                </td>
                <td class="tx-inverse">
                  <span
                    v-text="incident.reporter.name"
                    class="tx-bold d-block"
                  ></span>
                  <span class="d-block tx-11"
                    >{{ incident.created_at | dateFormat }}
                    {{
                      new Date(incident.created_at).toLocaleTimeString("en-US")
                    }}</span
                  >
                </td>
                <td>
                  <span v-text="incident.status.name"></span>
                </td>
                <td v-if="incident.status.code == 'open'">
                  <!-- <v-button
                      class="btn btn-primary btn-sm"
                      :disabled="disabled"
                    >Close Incident</v-button> -->

                  <close-incident
                    v-if="incident.status.code == 'open'"
                    class="mg-l-5"
                    :incident="incident"
                    @update="updateIncidentReports()"
                  />
                </td>
                <td
                  v-else-if="
                    incident.status.code == 'closed' &&
                    incident.reportForm != null
                  "
                >
                  <nuxt-link
                    class="btn btn-primary bd-0 pd-x-25 mg-x-10"
                    style="background-color: #808080 !important"
                    :to="`/reports/incident-reports/details?id=${incident.id}`"
                  >
                    <i class="icon ion-ios-printer-outline"></i> PRINT
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="4">
                  <h5>No data to display</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>

    <!-- Incident Modal -->

    <div
      class="d-inline wrapper"
      v-if="openIncidentModal == true && singleIncident"
    >
      <!-- <span v-modal-open="'approve-invoice-modal'" class="btn btn-primary bd-0">
        <i class="icon ion-ios-checkmark-outline"></i> NEW MBIC
      </span> -->
      <v-modal ref="incident-modal">
        <div class="modal-dialog wd-300 wd-sm-400" role="document">
          <div class="modal-content tx-size-sm">
            <div class="modal-body tx-center pd-y-20 pd-x-20">
              <button
                type="button"
                class="close"
                v-modal-close="'incident-modal'"
                v-on:click="openModal(singleIncident)"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 class="mg-b-20">{{ singleIncident.name }}</h4>
              <div>
                <div class="modal-item">
                  <hr />
                  <div>
                    <span class="modal-item-header">Description:</span>
                    <span class="modal-item-text">{{
                      singleIncident.description
                    }}</span>
                  </div>
                  <!-- <span>Code:</span>
                  <span class="modal-item-text">{{ singleIncident.code }}</span> -->
                </div>
              </div>
              <form id="approve-invoice-form">
                <div class="form-layout-footer">
                  <close-incident-form
                    v-if="singleIncident.status.code == 'open'"
                    class="mg-l-5"
                    v-on:click="openModal(singleIncident)"
                    :incident="singleIncident"
                    @update="updateIncidentReports()"
                  />
                  <div v-else>
                    <nuxt-link
                      :to="`/reports/incident-reports/details?id=${incident.id}`"
                      >Print Incident Form {{ singleIncident.status.code }}
                    </nuxt-link>
                  </div>

                  <button
                    type="button"
                    class="btn btn-danger pd-x-25"
                    v-modal-close="'approve-invoice-modal'"
                    aria-label="Close"
                    :disabled="disabled"
                    v-on:click="openModal(singleIncident)"
                  >
                    <i class="icon ion-ios-close-outline"></i> Cancel
                  </button>
                </div>
              </form>
            </div>
            <!-- modal-body -->
          </div>
          <!-- modal-content -->
        </div>
        <!-- modal-dialog -->
      </v-modal>
    </div>
    <!-- ---------------- -->
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import vPaginate from "@/components/ui/paginate";
import vButton from "@/components/ui/v-button";

export default {
  components: {
    loading,
    quickRequestData,
    vPaginate,
    vButton,
    "close-incident": () =>
      import("@/components/reports/incident-reports/close-incident")
  },
  created() {
    this.setScope(this.$route.query.scope);
  },
  data: () => ({
    disabled: false,
    incidentReportsLoading: true,
    incidentReports: [],
    incidentReportsPerPage: 42,
    incidentReportSearch: null,
    incidentReportsSortBy: "updated_at",
    incidentReportsSortOrder: "desc",
    incidentReportStatusCodes: [],
    openIncidentModal: false,
    singleIncident: null
  }),
  methods: {
    ...mapActions({
      getIncidentReports: "maintenance/incidentReports/getIncidentReports"
    }),
    setScope(scope) {
      this.incidentReportStatusCodes = this.scopeStatuses[scope];
      this.$store.commit("maintenance/incidentReports/toggleRefresh");
      this.getIncidentReports(this);
    },
    updateIncidentReports() {
      this.$store.commit("maintenance/incidentReports/toggleRefresh");
      this.getIncidentReports(this);
      // this.openModal(this);
    },
    openModal(incident) {
      if (this.singleIncident == null) {
        this.singleIncident = incident;
      } else {
        this.singleIncident = null;
      }

      if (this.openIncidentModal == true) {
        this.openIncidentModal = false;
      } else {
        this.openIncidentModal = true;
      }
    }
  },
  props: ["scopeStatuses"],
  watch: {
    $route(to) {
      this.setScope(to.query.scope);
    },
    workRequestSearch(search) {
      this.debounce(() => {
        this.getIncidentReports(this);
      }, 300);
    }
  }
};
</script>

<style scoped>
.modal-item {
  margin-bottom: 15px;
}

.modal-item-header {
  font-size: 17px;
  font-weight: 700;
}
.modal-item-text {
  font-size: 15px;
  text-align: center;
  /* align-self: center;
  justify-self: center; */
}
.pointer {
  cursor: pointer;
}
.wrapper {
  position: fixed;
  background-color: rgba(29, 28, 28, 0.438);
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
}
.modal-dialog {
  margin-top: 10%;
}
</style>
