<template>
  <div class="col-12 col-md pd-0 mg-t-20 mg-md-t-0-force">
    <div class="container-lg">
      <div
        :style="{
          fontSize: '50px !important',
          backgroundColor: '#FFF',
          padding: '0 !important'
        }"
      >
        <div>
          <div class="card-header" :style="{ backgroundColor: '#e3e7f2' }">
            <h6 class="slim-card-title">Ready For Approval</h6>
          </div>
          <div class="container">
            <div
              class="row d-md-flex mg-t-20 mg-b-10"
              :style="{
                padding: '0 !important'
              }"
            >
              <div class="col-6 col-sm-6 mg-b-10 mg-md-b-0">
                <div
                  class="bg-white mg-t-0 mg-l-0"
                  :style="{
                    padding: '0 !important'
                  }"
                >
                  <input
                    type="text"
                    placeholder="Start typing here to search"
                    class="col form-control search mg-b-0 float-left"
                    v-model="workRequestSearch"
                  />
                </div>
              </div>
              <div class="col-6 col-sm-6 mg-b-10">
                <div class="form-group mg-b-10">
                  <select
                    class="form-control col-12 col-sm-12 wd-200 mg-t-5 mg-b-0 tx-capitalize"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-paginate
      :list="filteredList"
      perPage="20"
      v-if="!workRequestsLoading && workRequests.length > 0"
    >
      <template v-slot="paginate">
        <div
          class="container-lg"
          :style="{
            fontSize: '14px !important',
            backgroundColor: '#FFF',
            border: 'none',
            padding: '0 !important',
            positon: 'absolute',
            bottom: '160px'
          }"
        >
          <div class="col-12 col-sm-12 col-lg-12 pd-2">
            <div class="table-responsive">
              <table class="table table-stripped" id="mytable">
                <thead
                  :style="{
                    overflow: 'hidden',
                    position: 'sticky',
                    position: '-webkit-sticky'
                  }"
                >
                  <tr>
                    <th>Name</th>
                    <th>Created At</th>
                    <th>SLA</th>
                    <th>Cost</th>
                  </tr>
                </thead>

                <tbody v-if="paginate.list.length > 0">
                  <tr
                    v-for="workRequest in paginate.list"
                    :key="workRequest.id"
                  >
                    <td>
                      <request-data :workRequest="workRequest" />
                      <!-- <quick-request-data :workRequest="workRequest" /> -->
                    </td>
                    <td>
                      <span v-if="workRequest.created_at">{{
                        workRequest.created_at.substring(0, 10) | dateFormat
                      }}</span>
                    </td>
                    <td v-if="workRequest.sla">
                      <span
                        class="square-8 mg-r-5 rounded-circle"
                        :class="[
                          `bg-${priorityClasses[workRequest.sla.priority.code]}`
                        ]"
                      ></span>
                      <span>{{ workRequest.sla.name }}</span>
                    </td>
                    <td v-else>
                      <span class="square-8 rounded-circle bg-danger mg-r-5">
                      </span>
                      <span>Not approved</span>
                    </td>
                    <td>
                      <span v-if="!costLoading">{{
                        { value: itemCosts[workRequest.id] } | toMoney
                      }}</span>
                      <!-- <span v-else class="loader">
                        <div class="sk-double-bounce ht-20 mg-0-force">
                          <div
                            class="sk-child sk-double-bounce1 bg-gray-200"
                          ></div>
                          <div
                            class="sk-child sk-double-bounce2 bg-gray-200"
                          ></div>
                        </div>
                      </span> -->
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>
    <div v-else-if="!workRequestsLoading">
      <li class="list-group-item">
        <h5>No data to display</h5>
      </li>
    </div>
    <loading v-else />
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
import slaMixin from "@/mixins/performance/sla";
import timeFunctions from "@/mixins/timeFunctions";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import quickRequestData from "@/components/maintenance/requests/quick-data";
import requestData from "@/components/maintenance/requests/request-data";
import vPaginate from "@/components/ui/paginate";

export default {
  components: {
    loading,
    quickRequestData,
    vPaginate,
    requestData
  },
  created() {
    this.getUnits(this);
    this.getBaseHierarchies(this);
    this.getWorkRequests(this);
    this.getCosts();
  },
  computed: {},
  data: () => ({
    itemCosts: {},
    costLoading: true,
    search: null,
    workRequests: [],
    workRequestsLoading: true,
    workRequestsSortBy: "updated_at",
    workRequestsSortOrder: "desc",
    workRequestStatusCodes: ["35", "100"],
    // workRequestStatusCodes: ["01", "05", "20", "35", "100", "105"],
    workRequestsPerPage: 100,
    unitId: null,
    units: [],
    level: null,
    unitFilter: null,
    levelFilter: null,
    baseHierarchies: [],
    baseHierarchiesLoading: true,
    hierarchy: [],
    hierarchyLoading: true,
    workRequestSearch: null
  }),
  methods: {
    ...mapActions({
      getWorkRequests: "maintenance/workRequests/getWorkRequests",
      getUnits: "location/units/getUnits",
      getBaseHierarchies: `location/hierarchies/getBaseHierarchies`
    }),
    async getCosts() {
      this.costLoading = true;
      try {
        var response = await this.$axios("reporting/work-requests/cost");
        this.itemCosts = response.data.costs;
        this.costLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    setButton() {
      var result = this.workRequests
        .map((wr) => {
          var salesOrderItems = wr.salesOrders[0] ? wr.salesOrders[0] : "";
          return {
            id: wr.id,
            sales_order: salesOrderItems
          };
        })
        .filter((so) => so.sales_order != "");
      var result2 = result.map((soi) => {
        return {
          item_id: soi.sales_order.items[0],
          work_request_id: soi.id
        };
      });
    },
    setUnitFilter() {
      if (!this.levelFilter) {
        return;
      }

      this.hierarchy = this.baseHierarchies.find(
        (unit) => unit.name === this.levelFilter.name
      );
    },
    classByPriority(priority) {
      return priority.code == "P1" || priority.code == "P2"
        ? "danger"
        : priority.code == "P3" || priority.code == "P5"
        ? "info"
        : "warning";
    },
    getCompletedTimeExpended() {
      let requestTime;

      for (let i = 0; i < this.workRequest.logs.length; i++) {
        if (this.workRequest.logs[i].status.code == 65) {
          requestTime = this.workRequest.logs[i].created_at;
        }
      }
      return Date.parse(requestTime) - Date.parse(this.workRequest.created_at);
    }
  },
  computed: {
    workRequestsUnitId() {
      if (!this.unitId) return;
      return this.unitId.id;
    },
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
  mounted() {},
  watch: {
    $data: {
      handler: function (itemCosts) {},
      deep: true
    },
    unitId() {
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getWorkRequests(this);
    },
    unitFilter() {
      this.$store.commit("maintenance/workRequests/toggleRefresh");
      this.getWorkRequests(this);
    },
    workRequestSearch(search) {
      this.debounce(() => {
        this.getWorkRequests(this);
      }, 300);
    }
  },
  mixins: [authMixin, slaMixin, timeFunctions]
};
</script>
