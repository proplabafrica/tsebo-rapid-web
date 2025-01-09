<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/maintenance/requests">Jobs In Planning</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Create Invoice
          <span v-if="floatRequest">
            For
            <nuxt-link :to="`/maintenance/requests/details?id=${floatRequest.id}`" v-text="`#${floatRequest.code}`">
            </nuxt-link>
          </span>
        </li>
      </ol>
      <h6 class="slim-pagetitle" v-text="
        floatRequest
          ? `Create Invoice for #${floatRequest.code}`
          : 'Create Invoice'
      "></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="section-wrapper" v-if="!loading">
      <div v-if="true">
        <form id="create-float-request-invoice-form">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Unit Cost To Client</th>
                  <th>Total Cost To Client</th>
                </tr>
              </thead>
              <tr v-for="(item, index) in items" :key="item.id">
                <td>
                  <span v-text="index + 1"></span>
                </td>

                <td>
                  <span v-text="item.name" class="d-block"></span>
                  <nuxt-link :to="`/hagul/inventory/services/details?id=${item.id}`"
                    class="tx-inverse tx-14 tx-medium d-block" v-text="floatRequest.name"></nuxt-link>
                </td>
                <td>
                  <span v-text="item.quantity"></span>
                </td>
                <td>
                  <span>{{ { value: item.cost } | toMoney }}</span>
                </td>
                <td>
                  <input type="number" step="any" :oldmin="item.cost" :name="'amount' + item.id" v-model="item.amount"
                    class="form-control" required />
                  <small class="tx-bold tx-danger" v-if="validationErrors['amount' + item.id]"
                    v-text="validationErrors['amount' + item.id]"></small>
                </td>
                <td class="tx-right">
                  <span>{{
                  { value: item.cost * item.quantity } | toMoney
                  }}</span>
                </td>
              </tr>
              <tr v-if="items.length > 0">
                <td colspan="4" rowspan="4" class="valign-middle">
                  <h4>
                    Profit:
                    <span class="tx-bold" :class="[profitClass]">{{
                    (((total - totalCost) / totalCost) * 100) | twoDP
                    }}%</span>
                  </h4>
                </td>
                <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
                  Total
                </td>
                <td colspan="1" class="tx-right">
                  <h4 class="tx-primary tx-bold tx-lato">
                    {{ { value: total } | toMoney }}
                  </h4>
                </td>
              </tr>
            </table>
          </div>
          <!-- table-responsive -->
          <div class="form-layout-footer tx-center mg-t-20">
            <v-button class="btn btn-primary bd-0 pd-x-25 mg-x-10" :disabled="disabled" @click="saveInvoice()">SAVE
            </v-button>
          </div>
        </form>
      </div>
      <static-error v-else :error="{ title: 'Cannot Request Delivery' }" :redirect="{
        route: `/maintenance/float-requests/details?id=${floatRequest.id}`,
        text: 'Go To Float Request'
      }" />
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { loading, staticError, vButton, vModal },
  computed: {
    profitClass() {
      return this.total > this.totalCost ? "tx-teal" : "tx-danger";
    },
    totalCost() {
      return this.items.reduce(
        (total, item) => total + item.cost * parseFloat(item.quantity),
        0
      );
    },
    total() {
      return this.items.reduce(
        (total, item) => total + item.amount * parseFloat(item.quantity),
        0
      );
    }
  },
  created() {
    this.setfloatRequest(this.$route.query.id);
  },
  data: () => ({
    disabled: false,
    items: [],
    loading: true,
    shouldRefresh: true,
    validationErrors: {},
    floatRequest: null
  }),
  head: () => ({
    title: "Create Invoice · Tsebo-Rapid"
  }),
  meta: {
    pageName: "float-requests.store-invoice"
  },
  methods: {
    populateItems() {
      this.items = [];
      for (const item of this.floatRequest.items) {
        this.items.push(Object.assign({ amount: item.cost }, item));
      }
      if (this.items.length < 1) this.add1Item();
    },
    saveInvoice() {
      if (!this.validateForm("create-float-request-invoice-form")) return false;
      this.disabled = true;

      const float_request_id = this.floatRequest.id;
      const item_id = this.items.map((item) => item.id);
      const amount = this.items.map((item) => item.amount);

      this.$axios
        .post("float-requests/store-invoice", {
          float_request_id,
          item_id,
          amount
        })
        .then((response) => {
          this.disabled = false;
          this.$router.push(
            `/finance/invoices/details?id=${response.data.invoice.id}`
          );
        })
        .catch((error) => {
          console.log(error);
          this.disabled = false;
          const response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response && response.status && response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {}
        });
    },
    async setfloatRequest(id) {
      const {
        detailedAssociations,
        associations,
        floatRequests
      } = this.$store.state.maintenance.floatRequests;
      this.floatRequest = floatRequests.find(
        (floatRequest) => floatRequest.id == id
      );
      if (this.floatRequest && !this.shouldRefresh) {
        if (Array.isArray(this.floatRequest.items)) {
          return (this.loading = false);
        }
      }
      try {
        const response = await this.$axios.get("float-requests/" + id, {
          params: {
            associations: ["items", "status"]
          }
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
        this.populateItems();
        this.$store.commit("maintenance/floatRequests/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    sendInvoiceToClient() {
      this.disabled = true;
      const float_request_id = this.floatRequest.id;
      this.$axios
        .post("float-requests/request-delivery", { float_request_id })
        .then((response) => {
          this.disabled = false;
          this.closeModal("send-invoice-to-client-modal");
          this.$router.push(
            `/maintenance/float-requests/details?id=${this.floatRequest.id}`
          );
        })
        .catch((error) => {
          this.disabled = false;
          console.log(error);
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to, from) {
      this.setfloatRequest(to.query.id);
    }
  }
};
</script>
