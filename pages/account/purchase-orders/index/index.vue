<template>
  <div>
    <div class="card-header nav-statistics-wrapper client-rep mg-b-0 bd-b-0">
      <nav class="nav">
        <form class="search-box" style="border: none" @submit.prevent="searchPo">
          <input type="text" placeholder="Type and Press Enter" id="search-value" class="form-control"
            v-model="search" />
          <v-button type="submit" class="btn btn-primary" @click="search">
            <i class="ion-search"></i>
          </v-button>
        </form>
      </nav>
      <div></div>
      <div class="d-flex flex-row">
        <div>
          <strong>Rows Per Page:</strong>
          <select class="form-control wd-100 mg-l-5" v-model="rowsPerPage" @change="setPaginatedData()">
            <option v-for="option in pagination.options" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div>
          <select class="form-control wd-100 mg-l-5 mg-t-20" v-model="criticality" @change="setPaymentTerm($event)">
            <option :value="null">Criticality</option>
            <option v-for="paymentTerm in paymentTerms" :key="paymentTerm.id" :value="paymentTerm.criticality">
              {{ paymentTerm.criticality }}
            </option>
          </select>
        </div>
        <div>
          <select class="form-control wd-100 mg-l-5 mg-t-20" v-model="duration" @change="setDuration($event)">
            <option :value="null">Duration</option>
            <option v-for="duration in days" :key="duration.value" :value="duration.value">
              {{ duration.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <v-paginate :list="purchaseOrders" :perPage="pagination.perPage" v-if="!purchaseOrdersLoading && units.length">
      <template v-slot="paginate">
        <div class="row table-responsive spinner m-0">
          <table class="table table-hover mg-b-0">
            <thead>
              <tr>
                <!-- <th>PO Code</th> -->
                <th style="width: 120px;">VAMP FI Code</th>
                <th style="width: 30%">Work Order Title</th>
                <th>Amount</th>
                <th style="min-width: 100px;">Created By</th>
                <th>Date Created</th>
                <th>Criticality</th>
                <th>Status</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="purchaseOrder in paginate.list" :key="purchaseOrder.code">
                <td>
                  <nuxt-link :to="`/account/purchase-orders/by-id?id=${purchaseOrder.id}`"
                    class="tx-inverse tx-14 tx-medium d-block">
                    <span class="d-block">{{ purchaseOrder.code }}</span>
                    <span v-if="getWorkRequest(purchaseOrder)?.code" class="d-block">{{
          getWorkRequest(purchaseOrder).code
        }}</span>
                  </nuxt-link>
                </td>
                <td class="pd-l-20" v-if="getWorkRequest(purchaseOrder)?.code
          ">
                  <nuxt-link :to="'/maintenance/requests/details?id=' +
          getWorkRequest(purchaseOrder).id
          " class="tx-inverse tx-medium d-block">{{ getWorkRequest(purchaseOrder).name
                    }}</nuxt-link>
                  <nuxt-link :to="'/location/units/details?id=' +
          poWorkRequestUnit(purchaseOrder).id ||
          poWorkRequests(purchaseOrder)[0].unit.id
          " class="tx-inverse tx-uppercase tx-11">
                    <span v-if="!poWorkRequestUnit(purchaseOrder).parent ||
          !poWorkRequests(purchaseOrder)[0].unit.parent
          ">
                      {{
          poWorkRequestUnit(purchaseOrder).name ||
          poWorkRequests(purchaseOrder)[0].unit.name
        }}
                    </span>
                    <span v-else>{{ poWorkRequestUnit(purchaseOrder).name }} ({{
          poWorkRequestUnit(purchaseOrder).parent.name ||
          poWorkRequests(purchaseOrder)[0].unit.parent.name
        }})</span></nuxt-link>
                  <span v-if="purchaseOrder.vendor" class="tx-inverse tx-11 d-block"
                    v-text="purchaseOrder.vendor.business_name"></span>
                </td>
                <td class="pd-l-20" v-else-if="purchaseOrder.quotation.tenderProcess.workRequests.length
          ">
                  <nuxt-link :to="'/maintenance/requests/details?id=' +
          purchaseOrder.quotation.tenderProcess.workRequests.slice(
            -1
          )[0].id
          " class="tx-inverse tx-medium d-block">{{
          purchaseOrder.quotation.tenderProcess.workRequests.slice(
            -1
          )[0].name
        }}</nuxt-link>
                  <nuxt-link v-if="poWorkRequestUnit(purchaseOrder) &&
          Object.keys(poWorkRequestUnit(purchaseOrder)).length
          " :to="'/location/units/details?id=' +
          poWorkRequestUnit(purchaseOrder).id
          " class="tx-inverse tx-uppercase tx-11">
                    <span v-if="!poWorkRequestUnit(purchaseOrder).parent">
                      {{ poWorkRequestUnit(purchaseOrder).name }}
                    </span>
                    <span v-else>{{ poWorkRequestUnit(purchaseOrder).name }} ({{
          poWorkRequestUnit(purchaseOrder).parent.name
        }})</span></nuxt-link>
                  <span v-if="purchaseOrder.vendor" class="tx-inverse tx-11 d-block"
                    v-text="purchaseOrder.vendor.business_name"></span>
                </td>
                <td v-else>
                  <span v-text="purchaseOrder.description"></span>
                  <span v-if="purchaseOrder.vendor" class="tx-inverse tx-11 d-block"
                    v-text="purchaseOrder.vendor.business_name"></span>
                </td>
                <td>
                  &#8358;<span>{{
          purchaseOrderTotalWithModifiers(purchaseOrder) | moneyFormat
        }}</span>
                </td>
                <td>
                  <span v-text="purchaseOrder.createdBy.name"></span>
                </td>
                <td>
                  <span>{{ purchaseOrder.created_at | dateFormat }}</span>
                </td>
                <td>
                  <div style="display: flex; align-items: center;gap: 3px;">
                    <div :class="getPoCriticality(purchaseOrder)?.toLowerCase()"></div> <span
                      v-if="getPoCriticality(purchaseOrder)">
                      {{ getPoCriticality(purchaseOrder) }}
                    </span>
                  </div>

                </td>
                <td v-if="purchaseOrderStatuses.length">
                  <span>{{
          purchaseOrderStatuses.find(
            (status) => purchaseOrder.status_id === status.id
                    ).title
                    }}</span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </v-paginate>
    <div v-else-if="(purchaseOrdersLoading && units.length) ||
          (purchaseOrdersLoading && !units.length)
          ">
      <table class="table table-hover mg-b-0">
        <thead>
          <tr>
            <th>VAMP FI Code</th>
            <th style="width: 30%">Work Order Title</th>
            <th>Amount</th>
            <th>Created By</th>
            <th>Date Created</th>
            <th>Criticality</th>
            <th>Status</th>

          </tr>
        </thead>
      </table>
      <loading class="align-self-center" />
    </div>
    <div v-else>
      <table class="table table-hover mg-b-0">
        <thead>
          <tr>
            <th>VAMP FI Code</th>
            <th style="width: 30%">Work Order Title</th>
            <th>Amount</th>
            <th>Created By</th>
            <th>Date Created</th>
            <th>Criticality</th>
            <th>Status</th>

          </tr>
        </thead>
      </table>
      <h4>No data to display</h4>
    </div>
  </div>
  <!-- <div>All Purchase Order</div> -->
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { vButton, vPaginate, loading },
  created() {
    this.getPurchaseOrders(this);
    this.getPaymentTerms(this);

    this.getPurchaseOrderStatuses();
  },
  mounted() {
    this.startPolling()
  },
  beforeUnmount() {
    this.stopPolling()
  },
  data: () => ({
    purchaseOrders: [],
    purchaseOrdersLoading: true,
    purchaseOrderStatuses: [],
    poSearch: null,
    rowsPerPage: 20,
    posPerPage: 1000,
    pagination: {
      perPage: 20,
      options: [10, 20, 50, 100]
    },
    search: "",
    vendors: [],
    vendorsLoading: false,
    vendorId: null,
    paymentTerms: [],
    paymentTermsLoading: false,
    criticality: null,
    poPaymentTermId: null,
    duration: null,
    days: [
      {
        label: "1-10days",
        value: "1-10"
      },
      {
        label: "10-20days",
        value: "10-20"
      },
      {
        label: "20-30days",
        value: "20-30"
      },
      {
        label: "30-60days",
        value: "30-60"
      },
      {
        label: "60-90days",
        value: "60-90"
      },
    ]
  }),
  head: () => ({
    title: `Purchase Orders . VampFi`
  }),

  methods: {
    ...mapActions({
      getUnits: "location/units/getUnits",
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders",
      getPaymentTerms: "hagul/paymentTerms/getPaymentTerms"
    }),
    getWorkRequest(purchaseOrder) {
      if (purchaseOrder.quotation.tenderProcess.workRequests?.length) {
        return purchaseOrder.quotation.tenderProcess.workRequests[0]
      } else if (purchaseOrder.quotation.tenderProcess.salesOrders[0]?.workRequests?.length) {
        return purchaseOrder.quotation.tenderProcess.salesOrders[0].workRequests[0]
      }
      else {
        return null
      }
    },
    setDuration(event) {
      this.duration = event.target.value
    },
    setPaymentTerm(event) {
      const paymentTerm = this.paymentTerms.find(
        (paymentTerm) => paymentTerm.criticality === event.target.value
      );
      this.criticality = paymentTerm ? paymentTerm.criticality : null;
      this.poPaymentTermId = paymentTerm ? paymentTerm.id : null;
      this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      this.getPurchaseOrders(this);
    },
    setPaginatedData() {
      this.pagination.perPage = this.rowsPerPage;
      this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      this.getPurchaseOrders(this);
    },
    getPoCriticality(purchaseOrder) {
      const paymentTerm = this.paymentTerms.find(pt => pt.id === purchaseOrder.payment_term_id)
      return paymentTerm?.criticality
    },
    poWorkRequests(purchaseOrder) {
      if (purchaseOrder.quotation.tenderProcess.workRequests.length) {
        return purchaseOrder.quotation.tenderProcess.workRequests
      } else if (purchaseOrder.quotation.tenderProcess.salesOrders[0].workRequests.length) {
        return purchaseOrder.quotation.tenderProcess.salesOrders[0].workRequests
      }
      else {
        return null
      }
    },
    poWorkRequestUnit(purchaseOrder) {
      if (purchaseOrder.quotation.tenderProcess.workRequests.length) {
        return this.units.find(unit => unit.id === purchaseOrder.quotation.tenderProcess.workRequests[0].unit_id)
      } else if (purchaseOrder.quotation.tenderProcess.salesOrders[0].workRequests.length) {

        return this.units.find(unit => unit.id === purchaseOrder.quotation.tenderProcess.salesOrders[0].workRequests[0].unit_id)

      }
      else {
        return null
      }
    },
    async getPurchaseOrderStatuses() {
      const response = await this.$axios.get("purchase-order-statuses");
      this.purchaseOrderStatuses = response.data.data;
    },
    purchaseOrderTotalWithModifiers(purchaseOrder) {
      return purchaseOrder.modifiers.length === 0
        ? purchaseOrder.total
        : purchaseOrder.modifiers.reduce((acc, item) => {
          if (item.credit && item.credit > 0) {
            return acc + item.credit;
          } else if (item.debit && item.debit > 0) {
            return acc - item.debit;
          }
        }, purchaseOrder.total);
    },
    searchPo() {
      this.poSearch = this.search;
      this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      this.getPurchaseOrders(this);
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
        this.getPurchaseOrders(this);
      }, 1800000);
    },
    stopPolling() {
      clearInterval(this.pollingInterval)
    }
  },
  middleware: ["auth"],
  props: ["units", "unitsLoading"],
  mixins: [authMixin, formMixin],
  watch: {
    search(search) {
      this.debounce(() => {
        if (!search) {
          this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
          this.poSearch = search;
          this.getPurchaseOrders(this);

        }
      }, 300);
    },
    duration(duration) {
      this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      this.getPurchaseOrders(this);
    }
  }
};
</script>

<style scoped>
.urgent {

  height: 7px;
  width: 7px;
  border-radius: 4px;
  background-color: #FF0000;

}

.medium {
  height: 7px;
  width: 7px;
  border-radius: 4px;
  background-color: #FFFF00;

}

.high {
  height: 7px;
  width: 7px;
  border-radius: 4px;
  background-color: #FFA500;

}

.low {
  height: 7px;
  width: 7px;
  border-radius: 4px;
  background-color: #00FF00;
}
</style>
