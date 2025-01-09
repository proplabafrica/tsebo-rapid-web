<template>
  <div>
    <div class="d-flex justify-content-between">
      <input
        type="text"
        placeholder="Start typing here to search"
        class="form-control search mg-y-10 h-25"
        v-model="workRequestSearch"
      />
      <span class="d-flex flex-column">
        <select
          class="form-control wd-200 mg-t-5 mg-b-0 tx-capitalize"
          name="`hierarchy-`"
          v-model="levelFilter"
          @change="setUnitFilter()"
        >
          <option :value="null">
            {{ levelFilter ? "Show All" : "Filter By Level" }}
          </option>
          <option
            v-for="level in baseHierarchies"
            :key="`level-${level.id}`"
            :value="level"
          >
            {{ level.name }}
          </option>
        </select>
        

        <select
          class="form-control wd-200 mg-t-0 mg-b-10 tx-capitalize"
          v-model="unitFilter"
          v-if="`${hierarchy}`"
        >
          <option :value="null">
            {{ "Select Unit" }}
          </option>
          <option
            v-for="unit in hierarchy.units"
            :key="`sub-level-${unit}`"
            :value="unit"
          >
            {{ unit.name }}
          </option>
        </select>
      </span>
    </div>
    <v-paginate
      class="col mg-t-5"
      v-if="!workRequestsLoading"
      :list="filteredList"
      perPage="42"
    >
      <template v-slot="paginate">
        <div class="row" v-if="paginate.list.length > 0">
          <div
            class="col-md-4 col-lg-2 pd-md-0"
            v-for="workRequest in paginate.list"
            :key="workRequest.id"
          >
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <quick-request-data :workRequest="workRequest" />
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <!-- row -->
        <h4 class="mg-10" v-else>No data to display</h4>
      </template>
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import vPaginate from "@/components/ui/paginate";

export default {
  components: { loading, quickRequestData, vPaginate },
  created() {
    this.setScope(this.$route.query.scope);
    this.getUnits(this);
    this.getBaseHierarchies(this);
  },
  data: () => ({
    workRequests: [],
    workRequestsLoading: true,
    workRequestsPerPage: 1000,
    workRequestSearch: null,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "desc",
    workRequestStatusCodes: [],
    unitId: null,
    units: [],
    level: null,
    unitFilter: null,
    levelFilter: null,
    baseHierarchies: [],
    baseHierarchiesLoading: true,
    hierarchy: [],
    hierarchyLoading: true
  }),
  computed: {
    workRequestsUnitId() {
      if (!this.unitId) return;
      return this.unitId.id;
    }
  },
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests",
      getUnits: "location/units/getUnits",
      getBaseHierarchies: `location/hierarchies/getBaseHierarchies`
    }),
    setUnitFilter() {
      if (!this.levelFilter) {
        return;
      }

      this.hierarchy = this.baseHierarchies.find(
        (unit) => unit.name === this.levelFilter.name
      );
    },
    async setScope(scope) {
      this.workRequestStatusCodes = this.scopeStatuses[scope];
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      const columnData =
        this.$store.state.maintenance.workRequests.workRequestColumnData[scope];
      if (columnData) {
        this.workRequests = columnData.workRequests;
        this.workRequestsLoading = columnData.workRequestsLoading;
        return;
      }
      await this.getWorkRequests(this);

      this.$store.commit("maintenance/workRequests/setWorkRequestColumnData", {
        column: scope,
        data: Object.assign({}, this.$data)
      });
    }
  },
  computed: {
    filteredList() {
      if (!this.unitFilter) {
        return this.workRequests;
      }
      if (!this.levelFilter) {
        return this.workRequests;
      }

      return this.workRequests.filter(
        (workRequest) =>
          workRequest.unit.name === this.unitFilter.name ||
          (workRequest.unit.parent !== null &&
            workRequest.unit.parent.name === this.unitFilter.name)
      );
    }
  },
  props: ["scopeStatuses"],
  watch: {
    unitId() {
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getWorkRequests(this);
    },
    unitFilter() {
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getWorkRequests(this);
    },
    $route(to) {
      this.setScope(to.query.scope);
    },
    workRequestSearch(search) {
      this.debounce(() => {
        this.getWorkRequests(this);
      }, 300);
    }
  }
};
</script>
