<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
      </ol>
      <h6 class="slim-pagetitle">Incident Reports</h6>
    </div>
    <!-- slim-pageheader -->
    <div class="row mg-x-0 mg-t-5" v-if="!reportsloading">
      <div class="col-md-4 pd-5">
        <form id="create-incident-report-form" class="card pd-20">
          <fieldset :disabled="formDisabled">
            <div class="form-group">
              <label class="form-control-label">
                Title
                <span class="tx-danger">*</span>
              </label>
              <input type="text" max="60" class="form-control" required name="title" placeholder="Title"
                v-model="incidentReport.name" />
              <small class="tx-bold tx-danger" v-text="validationErrors.title"></small>
            </div>
            <div class="form-group">
              <label class="form-control-label">Description</label>
              <textarea class="form-control" name="description" maxlength="320" rows="4" required
                placeholder="Describe the incident" v-model="incidentReport.description"></textarea>
              <small class="tx-bold tx-danger" v-text="validationErrors.description"></small>
            </div>
            <!-- Hierarchy Selector -->
            <div v-for="(level, index) in unitHierarchy.levels" :key="level.id">
              <div class="form-group" v-if="level.hierarchies.length > 1">
                <label class="form-control-label">
                  Select Level
                  <span class="d-none" v-for="(hierarchy, index) in level.hierarchies" :key="hierarchy.id">{{
                  hierarchy.name
                  }}{{
                    index + 1 >= level.hierarchies.length ? "" : ", "
                    }}</span>
                  <span class="tx-danger">*</span>
                </label>
                <select class="form-control" :name="`hierarchy-${level.id}`" v-model="level.hierarchy" required>
                  <option :value="null">Select One</option>
                  <option v-for="hierarchy in level.hierarchies" :key="hierarchy.id" :value="hierarchy"
                    v-text="hierarchy.name"></option>
                </select>
                <small class="tx-bold tx-danger" v-if="validationErrors[`unit-${level.id}`]"
                  v-text="validationErrors[`unit-${level.id}`]"></small>
              </div>
              <div class="form-group" v-if="level.hierarchy != null">
                <label class="form-control-label">
                  Select
                  <span v-text="level.hierarchy.name"></span>
                  <span class="tx-danger" v-if="index == 0">*</span>
                </label>
                <select class="form-control" :name="`unit-${level.id}`" v-model="level.unit"
                  @change="sortHierarchies(level)" required>
                  <option :value="null">Select One</option>
                  <option v-for="unit in level.hierarchy.units" :key="unit.id" :value="unit" v-text="unit.name">
                  </option>
                </select>
                <small class="tx-bold tx-danger" v-if="validationErrors[`unit-${level.id}`]"
                  v-text="validationErrors[`unit-${level.id}`]"></small>
              </div>
            </div>
            <!-- Hierarchy Selector -->
            <div>
              <label class="form-control-label">
                How Critical?
                <span class="tx-danger">*</span>
              </label>
              <select class="form-control" name="report_priority_id" required v-model="incidentReport.sla_id">
                <option :value="null">Select Urgency</option>
                <option v-for="slaPriority in slaPriorities" :key="slaPriority.id" :value="slaPriority.id"
                  v-text="slaPriority.name"></option>
              </select>
              <small class="tx-bold tx-danger" v-text="validationErrors.report_priority_id"></small>
            </div>

            <div class="tx-center mg-t-20 form-layout-footer">
              <v-button class="btn btn-primary" :disabled="disabled" @click="submitIncidentReport()">SUBMIT</v-button>
            </div>
          </fieldset>
        </form>
      </div>

      <div class="col-md-8 pd-5">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link class="nav-link" exact-active-class="active" to="/reports/incident-reports">Open</nuxt-link>
            <nuxt-link class="nav-link" exact-active-class="active" :to="`/reports/incident-reports?scope=${scope}`"
              :key="scope" v-for="(statuses, scope) in scopeStatuses">{{ scope }}</nuxt-link>
          </nav>
        </div>
        <nuxt-child :scopeStatuses="scopeStatuses" ref="table" />
      </div>
      <!-- v-paginate -->
    </div>
  </div>
  <!-- container -->
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import slaMixin from "@/mixins/performance/sla";
import formMixin from "@/mixins/forms";
import { findIndex } from "lodash";
import vModal from "@/components/ui/v-modal";

export default {
  components: { loading, vButton, vPaginate, vSelect },
  toast: () => import("@/components/ui/toast"),
  computed: {
    slasByPriority() {
      if (this.slaPriorityId == null) return [];
      return this.slas.filter(
        (sla) => sla.sla_priority_id == this.slaPriorityId
      );
    }
  },
  created() {
    this.getIncidentReports(this);
    this.setUserOrg();
    this.getSlaPriorities(this);
    this.incidentReport.reported_by = this.authUser.id;
    this.incidentReport.status = "open";
  },
  data: () => ({
    baseHierarchies: [],
    baseHierarchiesLoading: true,
    disabled: false,
    formDisabled: false,
    hierarchies: [],
    hierarchiesLoading: true,
    scopeStatuses: {
      closed: ["closed"]
    },
    reportsloading: false,
    validationErrors: {},
    formDisabled: false,
    unitHierarchy: {
      levels: []
    },
    units: [],
    slas: [],
    slaEntityCodes: ["WKR"],
    slasLoading: true,
    slaPriorityId: null,
    slaPriorities: [],
    incidentReportsLoading: true,
    incidentReport: {
      name: "",
      description: "",
      unit_id: "",
      sla_id: "",
      reported_by: "",
      status: ""
    },
    incidentReports: [],
    incidentReportsPerPage: 42,
    incidentReportSearch: null,
    incidentReportsSortBy: "updated_at",
    incidentReportsSortOrder: "desc",
    incidentReportStatusCodes: ["open", "closed"]
  }),
  head: () => ({
    title: "Request Monitoring"
  }),
  meta: {
    pageName: "reports.requests"
  },
  methods: {
    ...mapActions({
      getSlaPriorities: "performance/slaPriorities/getSlaPriorities",
      getSlas: "performance/slas/getSlas",
      getIncidentReports: "maintenance/incidentReports/getIncidentReports"
    }),
    setDefaultHierarchy(level) {
      if (level.hierarchies > 1) return true;
      level.hierarchy = level.hierarchies[0];
      return false;
    },
    async getBaseHierarchies() {
      try {
        const response = await this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent"], baseHierarchies: true }
        });
        this.baseHierarchies = response.data.data;
        this.baseHierarchiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getHierarchies() {
      try {
        const response = await this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent"] }
        });
        this.hierarchies = response.data.data;
        this.hierarchiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getUnits() {
      this.unitsLoading = true;
      try {
        const response = await this.$axios.get("units", {
          params: {
            associations: ["children", "equipment.specification", "hierarchies"]
          }
        });
        this.units = response.data.data;
        this.unitsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getUsers() {
      this.usersLoading = true;
      try {
        const response = await this.$axios.get("users");
        this.users = response.data.data;
        this.usersLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async setUserOrg() {
      await this.getBaseHierarchies();
      await this.getHierarchies();
      await this.getUnits();

      const hierarchies = this.baseHierarchies.map((hierarchy) => {
        hierarchy.units = this.units.filter(
          (unit) => unit.unit_hierarchy_id == hierarchy.id
        );
        return hierarchy;
      });

      const level = {
        equipment: [],
        hierarchies,
        hierarchy: null,
        id: "base-level",
        unit: null
      };
      this.unitHierarchy.levels.push(level);
      this.setDefaultHierarchy(level);
      this.orgLoading = false;
    },
    sortHierarchies(level) {
      const levelIndex = findIndex(this.unitHierarchy.levels, ["id", level.id]);
      this.unitHierarchy.levels.splice(levelIndex + 1);
      this.incidentReport.unit_id = level.unit.id;
    },
    submitIncidentReport() {
      if (!this.validateForm("create-incident-report-form")) return false;
      this.disabled = true;
      const {
        name,
        description,
        unit_id,
        sla_id,
        reported_by,
        status
      } = this.incidentReport;

      this.$axios
        .post("incident-reports", {
          name,
          description,
          unit_id,
          sla_id,
          reported_by,
          status
        })
        .then((response) => {
          this.disabled = false;
          this.$store.commit(
            "maintenance/incidentReports/setIncidentReports",
            response.data.incidentReport
          );
          var child = this.$refs.table;
          child.updateIncidentReports();
          this.clearFields();
          this.toast({ type: "success", title: "Report Submitted" });
        })
        .catch((error) => {
          this.toast({ type: "danger", title: "Unable to Submit Report" });
          this.disabled = false;
          const response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response.status == 413) {
            this.validationErrors.file = response.statusText;
          } else if (response && response.status && response.status == 429) {
            this.validationErrors.email = response.statusText;
          }
        });
    },
    clearFields() {
      this.incidentReport.name = "";
      this.incidentReport.description = "";
      this.incidentReport.unit_id = "";
      this.incidentReport.sla_id = "";
      this.incidentReport.reported_by = "";
      this.incidentReport.status = "";
    }
  },
  watch: {
    incidentReportSearch(search) {
      this.debounce(() => {
        this.getIncidentReports(this);
      }, 300);
    }
  },
  meta: {
    pageName: "reports.index"
  },
  middleware: ["auth"],
  mixins: [authMixin, formMixin]
};
</script>
