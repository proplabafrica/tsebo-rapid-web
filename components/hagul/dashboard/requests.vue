<template>
  <div class="card card-table">
    <!-- <div class="card-header row mg-b-10">
      <span class="slim-card-title">{{ name }}</span>
      <div class="row float-right">
        <input type="text" placeholder="Start typing here to search" class="form-control search " v-model="search" />

        <div>
          <select class="form-control wd-100 mg-l-5" v-model="unitId">
            <option :value="null">
              {{ unitId ? "Show All" : "Filter By Unit" }}
            </option>
            <option v-for="unit in units" :key="`units-${unit.id}`" :value="unit.id">
              {{ unit.name }} <span v-if="unit.parent">({{ unit.parent.name }})</span>
            </option>
          </select>
        </div>

       
      </div>
    </div> -->


    <div class="container-lg card-head">
      <div :style="{
        fontSize: '50px !important',
        backgroundColor: '#FFF',
        // padding: '0 !important',
      }">
        <div>
          <div class="card-header" :style="{ backgroundColor: '#e3e7f2' }">
            <h6 class="slim-card-title">{{ name }}</h6>
          </div>
          <div class="container">
            <div class="row d-md-flex mg-t-20 mg-b-10" :style="{
        padding: '0 !important',
      }">
              <div class="col-6 col-sm-6 mg-b-10 mg-md-b-0">
                <div class="bg-white mg-t-0 mg-l-0" :style="{
        padding: '0 !important',
      }">
                  <input type="text" placeholder="Start typing here to search"
                    class="col form-control search mg-b-0 float-left" v-model="search" />
                </div>
              </div>
              <div class="col-6 col-sm-6 mg-b-10 others" style="display:flex; justify-content: end;">
                <div class="form-group mg-b-10">
                  <select class="
                      form-control
                      col-12 col-sm-12
                      wd-200
                      mg-b-0
                      tx-capitalize
                    " name="`hierarchy-`" v-model="levelFilter" @change="setUnitFilter()">
                    <option :value="null">
                      {{ levelFilter ? "Show All" : "Filter By Level" }}
                    </option>
                    <option v-for="level in baseHierarchies" :key="`level-${level.id}`" :value="level">
                      {{ level.name }}
                    </option>
                  </select>

                  <select class="form-control wd-200 mg-t-0 mg-b-10 tx-capitalize" v-model="unitId"
                    v-if="`${hierarchy}`">
                    <option :value="null">
                      {{ "Select Unit" }}
                    </option>
                    <option v-for="unit in hierarchy.units" :key="`sub-level-${unit.id}`" :value="unit.id">
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

    <!-- card-header -->
    <v-paginate :list="requests" perPage="10" v-if="!salesOrdersLoading && !tenderProcessesLoading">
      <template v-slot="paginate">
        <!-- {{ requests }} -->
        <div class="table-responsive">
          <table class="table table-striped mg-b-0 tx-13">
            <thead>
              <tr class="tx-10">
                <th class="pd-y-5" width="40%">Request</th>
                <th class="pd-y-5">Status</th>
                <th class="pd-y-5">Created At</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="request in paginate.list" :key="request.id">
                <td>
                  <nuxt-link :to="request.link" class="tx-inverse tx-14 tx-medium d-block"
                    v-text="request.code"></nuxt-link>
                  <span class="d-block" v-text="request.name"></span>
                  <div v-for="(salesOrder, index) in request.salesOrders" :key="salesOrder.id">
                    <span class="d-block">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Sales Order:</span>
                      <nuxt-link class="tx-inverse"
                        :to="`/hagul/inventory/sales-orders/details?id=${salesOrder.id}`">#{{
        salesOrder.code }}
                        {{
        request.salesOrders.length > index + 1 ? ", " : ""
      }}</nuxt-link>
                    </span>
                    <span class="d-block">
                      <span class="tx-bold tx-14 tx-gray-700 mg-r-5">Work Request:</span>
                      <span class="tx-inverse" v-for="(workRequest, index) in salesOrder.workRequests"
                        :key="workRequest.id">{{ workRequest.name
                        }}{{
        index + 1 >= salesOrder.workRequests.length
          ? ""
          : ", "
      }}</span>
                    </span>
                  </div>

                  <span class="tx-inverse" v-for="(workRequest, index) in request.workRequests" :key="workRequest.id">
                    {{ workRequest.name }}
                    <span class="d-block tx-11">#{{ workRequest.code
                      }}{{
        index + 1 >= request.workRequests.length ? "" : ", "
                      }}</span>
                  </span>
                </td>
                <td>
                  <!-- <span class="square-8 mg-r-5 rounded-circle bg-primary"></span> -->
                  <span v-text="request.status.name"></span>
                </td>
                <td>
                  <span>{{ request.created_at | dateFormat }}</span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="12">
                  <h5>No data to display</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <!-- table-responsive -->
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
      <!-- card-footer -->
    </v-paginate>
    <loading v-else />
  </div>
  <!-- card -->
</template>

<script>
import { mapActions } from "vuex";
import { dataSort } from "@/mixins/store";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";

export default {
  beforeDestroy() {
    this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
    this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
  },
  components: { loading, vPaginate },
  computed: {
    bidSearch() {
      return this.search;
    },
    salesOrderSearch() {
      return this.search;
    },
    requests() {
      // this.salesOrders, "all sales orders");
      const salesOrders = this.salesOrders.map((salesOrder) => {
        salesOrder.link = `/hagul/inventory/sales-orders/details?id=${salesOrder.id}`;

        return salesOrder;
      });
      const tenderProcesses = this.tenderProcesses.map((bid) => {
        bid.link = `/hagul/purchase/tender-processes/details?id=${bid.id}`;
        return bid;
      });
      return dataSort.populateList({
        targetArray: salesOrders,
        newArray: tenderProcesses,
        sortBy: "created_at",
        sortOrder: "desc",
      });
    },
  },
  async created() {
    this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
    this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
    this.getUnits(this);
    this.getSalesOrders(this);
    this.getTenderProcesses(this);
    this.getBaseHierarchies(this)
  },
  data: () => ({
    search: null,
    salesOrders: [],
    salesOrdersLoading: true,
    tenderProcesses: [],
    tenderProcessesLoading: true,
    unitId: null,
    units: [],
    level: null,
    unitFilter: null,
    levelFilter: null,
    baseHierarchies: [],
    baseHierarchiesLoading: true,
    hierarchy: [],
    hierarchyLoading: true,


  }),
  methods: {
    ...mapActions({
      getUnits: "location/units/getUnits",
      getSalesOrders: "hagul/inventory/salesOrders/getSalesOrders",
      getTenderProcesses: "hagul/purchase/tenderProcesses/getTenderProcesses",
      getBaseHierarchies: `location/hierarchies/getBaseHierarchies`,

    }),

    setUnitFilter() {
      if (!this.levelFilter) {
        return;
      }

      this.hierarchy = this.baseHierarchies.find(
        (unit) => unit.name === this.levelFilter.name
      );
    },

  },
  props: ["bidStatusCodes", "name", "salesOrderStatusCodes"],
  watch: {
    search(search) {
      this.debounce(() => {
        this.getSalesOrders(this);
        this.getTenderProcesses(this);
      }, 300);
    },
    unitId(unitId) {
      this.getSalesOrders(this);
      this.getTenderProcesses(this)
    },
    unitFilter(unitId) {
      this.getSalesOrders(this);
      this.getTenderProcesses(this)
    },
  },
};

</script>


<style scoped>
/* .card {
  align-items: center;
} */

.card-head {
  width: 100%;
  justify-content: space-between !important;
}
</style>