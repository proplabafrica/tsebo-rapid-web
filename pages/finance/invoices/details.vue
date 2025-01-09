<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/finance/invoices">Invoices</nuxt-link>
        </li>
        <li
          class="breadcrumb-item active"
          aria-current="page"
          v-text="invoice ? `#${invoice.code}` : 'Invoice Details'"
        ></li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="
          invoice ? `Invoice Details for #${invoice.code}` : 'Invoice Details'
        "
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading">
      <div class="bg-white pd-b-20">
        <form id="create-work-request-invoice-form">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th v-action-show="'invoices.send-to-client'">Unit Cost</th>
                  <th class="tx-right">Unit Cost To Client</th>
                  <th class="tx-right">Total Cost To Client</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>
                    <span v-text="item.quantity"></span>
                  </td>
                  <td v-action-show="'invoices.send-to-client'">
                    <span>{{ { value: getItemCost(item) } | toMoney }}</span>
                  </td>
                  <td class="tx-right">
                    <input
                      type="number"
                      step="any"
                      :oldmin="getItemCost(item)"
                      :name="'amount' + item.id"
                      v-model="item.amount"
                      :disabled="disableDelete"
                      class="form-control"
                      required
                    />
                  </td>

                  <td class="tx-right">
                    <span>{{
                      { value: getItemLife(item) * parseFloat(item.quantity) }
                        | toMoney
                    }}</span>
                  </td>
                </tr>

                <tr>
                  <td>Management Fee</td>
                  <td>
                    <span></span>
                  </td>
                  <td>
                    <span>{{ { value: management_cost } | toMoney }}</span>
                  </td>

                  <td class="tx-right">
                    <input
                      type="number"
                      step="any"
                      v-model="management_cost"
                      :disabled="disableDelete"
                      class="form-control"
                      required
                    />
                  </td>

                  <td class="tx-right">
                    <span>{{ { value: management_cost } | toMoney }}</span>
                  </td>
                </tr>

                <tr>
                  <!-- {{ invoice }} -->
                  <td>VAT</td>
                  <td>
                    <span></span>
                  </td>
                  <td>
                    <!-- <span>{{ { value: invoice.total} | toMoney }}</span> -->
                  </td>
                  <td>
                    <span>{{ { value: vat } | toMoney }}</span>
                  </td>

                  <td class="tx-right">
                    <span>{{ { value: vat } | toMoney }}</span>
                  </td>
                </tr>

                <tr v-if="invoice.items.length > 0">
                  <td colspan="2" rowspan="4" class="valign-middle">
                    <h4>
                      Profit:
                      <span class="tx-bold" :class="[profitClass]">
                        {{ getPercentage }}%
                      </span>
                    </h4>
                    <p>
                      <b>Status:</b>
                      {{ invoice.status.name }}
                    </p>
                    <p>
                      <nuxt-link
                        class="btn btn-sm btn-primary mg-r-5"
                        v-for="workRequest in invoice.workRequests"
                        :key="workRequest.id"
                        :to="
                          linkCheck(
                            'work-requests.show',
                            `/maintenance/requests/details?id=${workRequest.id}`
                          )
                        "
                      >
                        Work Request {{ workRequest.code }}</nuxt-link
                      >
                    </p>
                    <!-- <h4>
                      Profit:
                      <span class="tx-bold" :class="[profitClass]">
                        {{ getPercentage }}%
                      </span>
                    </h4> -->
                    
                  </td>
                  <td
                    class="d-flex flex-row justify-content-between"
                    v-action-show="'invoices.send-to-client'"
                  ></td>
                  <td
                    class="tx-right tx-uppercase tx-bold tx-inverse"
                    colspan="1"
                  >
                    Total
                  </td>
                  <td colspan="1" class="tx-right">
                    <h4 class="tx-primary tx-bold tx-lato">
                      {{ { value: total_Cost } | toMoney }}
                    </h4>
                  </td>
                </tr>
               
              </tbody>
            </table>
          </div>

          <div
            class="col paragraph tx-primary tx-bold tx-lato"
            v-if="canApproveInvoice.length"
          >
            <div class="mr-3">
              <label v-if="invoice.om_approved">Invoice Approved </label>
              <label v-else>Approve Invoice </label>

              <input
                :disabled="invoice.om_approved"
                type="checkbox"
                :checked="invoice.om_approved"
                @change="approveInvoice($event)"
              />
              <!-- <div>{{ invoice }}</div> -->
            </div>
          </div>
          <div class="col paragraph">
            <nuxt-link
              class="btn btn-sm btn-primary"
              :to="`/utilities/files/details?id=${file.id}`"
              v-for="file in invoice.files"
              :key="file.id"
            >
              <i class="icon ion-android-attach">&nbsp;</i> View Client Response
            </nuxt-link>
          </div>

          <!-- table-responsive -->
          <div
            class="form-layout-footer tx-center mg-t-20 d-flex align-items-center justify-content-center"
          >
            <span
              class="btn btn-primary bd-0 pd-x-25 mg-x-10"
              :disabled="disabled"
              v-if="invoice.om_approved == 0"
              @click="sendToOperationManager()"
              >SAVE DRAFT
            </span>
          </div>
          <div
            class="form-layout-footer tx-center mg-t-20 d-flex align-items-center justify-content-center"
          >
            <span
              class="btn btn-primary bd-0 pd-x-25 mg-x-10"
              :disabled="disabled"
              v-modal-open="'send-invoice-to-client-modal'"
              v-if="invoice.status.code == 'pending'"
              v-action-show="'invoices.send-to-client'"
              >SEND TO CLIENT</span
            >
            <nuxt-link
              class="btn btn-primary bd-0 pd-x-25 mg-x-10 mg-t-5"
              :to="`/finance/invoices/client-response?id=${invoice.id}`"
              v-if="invoice.status.code == 'negotiating'"
              v-action-show="'invoices.send-to-client'"
              >UPLOAD CLIENT RESPONSE</nuxt-link
            >
            <approve-invoice
              :invoice="invoice"
              v-if="invoice.status.code == 'negotiating'"
              v-action-show="'work-requests.rate-job'"
              class=""
              @update="updateInvoice()"
            />
            <nuxt-link
              class="btn btn-primary bd-0 pd-x-25 mg-x-10 mg-t-5"
              :to="`/finance/invoices/print?id=${invoice.id}`"
            >
              <i class="icon ion-ios-printer-outline"></i> PRINT
            </nuxt-link>
          </div>
          <v-modal
            ref="send-invoice-to-client-modal"
            v-if="invoice.om_approved"
          >
            <div class="modal-dialog wd-300 wd-sm-400" role="document">
              <div class="modal-content tx-size-sm">
                <div class="modal-body tx-center pd-20">
                  <button
                    type="button"
                    class="close"
                    v-modal-close="'send-invoice-to-client-modal'"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="mg-b-20">
                    Send To
                    {{
                      invoice.userBilledTo
                        ? invoice.userBilledTo.name
                        : "Client"
                    }}?
                  </h4>
                  <div class="form-layout-footer">
                    <v-button
                      class="btn btn-success bd-0 pd-x-25 mg-x-10"
                      :disabled="disabled"
                      @click="sendInvoiceToClient()"
                    >
                      <i class="icon ion-ios-checkmark-outline"></i> CONFIRM
                    </v-button>
                    <button
                      type="button"
                      class="btn btn-danger pd-x-25"
                      v-modal-close="'send-invoice-to-client-modal'"
                      aria-label="Close"
                      :disabled="disabled"
                    >
                      <i class="icon ion-ios-close-outline"></i> CANCEL
                    </button>
                  </div>
                </div>
                <!-- modal-body -->
              </div>
              <!-- modal-content -->
            </div>
            <!-- modal-dialog -->
          </v-modal>
        </form>
      </div>
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import approveInvoice from "@/components/finance/invoices/approve";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { approveInvoice, loading, vButton, vModal },
  computed: {
    profitClass() {
      for (const item of this.invoice.items) {
        return (item.amount + (this.management_cost || 0) ) > this.getItemCostStart ? "tx-teal" : "tx-danger";
      }
    },
    items() {
      if (!this.invoice) return [];
      const items = [];

      for (var index = 0; index < this.invoice.items.length; index++) {
        const invoiceItem = this.invoice.items[index];
        const materialOrSerice = this.thisOrThat(invoiceItem, [
          "material",
          "service"
        ]);
        var name = null;
        if (materialOrSerice) {
          name = materialOrSerice.name;
        } else if (this.invoice.floatRequests.length > 0) {
          name = this.invoice.floatRequests[0].items[index].description;
        }
        items.push(Object.assign(invoiceItem, { name }));
      }
      this.itemData = items[0].amount;
      return items;
    },
    totalCost() {
      return this.invoice.items.reduce((total, item) => {
        let quantity = item.quantity ? item.quantity : 1;
        return total + this.getItemCost(item) * parseFloat(quantity);
      }, 0);
    },
    totalAmount() {
      return this.invoice.items.reduce(
        (total, item) =>
          total + parseInt(item.amount) * parseFloat(item.quantity),
        0
      );
    },
    total() {
      let total = 0;
      for (const item of this.invoice.items) {
        let quantity = item.quantity ? item.quantity : 1;
        let InvoiceCost = parseInt(this.itemData) * parseFloat(quantity);
        let amountTotal =
          parseInt(InvoiceCost) + parseInt(this.invoice.management_fee);
        this.vatCost = parseInt(amountTotal) * 0.075;
        this.invoice.vat = parseInt(this.vatCost);
        this.invoice.total = amountTotal + parseInt(this.invoice.vat);
        total = amountTotal + parseInt(this.invoice.vat);
      }
      return total;
    },
    // vat() {
    //   return this.totalCost * 0.075;
    // },
    totalFloatCost() {
      return this.invoice.items.reduce((total, item) => {
        let quantity = item.quantity ? item.quantity : 1;
        return total + this.getItemCost(item) * parseFloat(quantity);
      }, 0);
    },
    getPercentage() {
      const profitItem = this.totalAmount || 0;

      let costItem = this.invoice.items.reduce(
        (total, item) =>
          total + parseInt(this.thisOrThat(item, ["material", "service"]).cost),
        0
      );

      // console.log("all the profit..", costItem)

      if (costItem > 0) {
        if (this.invoice.items.length > 1) {
          // let percentage = ((parseInt(profitItem) - parseInt(costItem)) / parseInt(costItem)) * 100;
          let percentage =
            (((this.totalAmount + parseInt(this.management_cost) || 0) - parseInt(this.totalCost)) /
              parseInt(this.totalCost)) *
            100;

          if (parseInt(percentage) || parseInt(percentage) === 0) {

            return percentage.toFixed(2);
          } else {
            return -100;
          }
        } else {
          let percentage =
            (((this.totalAmount + parseInt(this.management_cost) || 0) - parseInt(this.totalCost)) /
              parseInt(this.totalCost)) *
            100;

          if (parseInt(percentage) || parseInt(percentage) === 0) {
            // console.log(percentage, "PERCENTAGE", this.totalAmount, parseInt(this.totalCost), parseInt(this.cost_management));
            return percentage.toFixed(2);
          } else {
            return -100;
          }
        }
      }
      return profitItem || 0;
    },
    getItemCostStart() {
      for (const item of this.invoice.items) {
        if (!item.materialCost && !item.serviceCost) {
          return this.thisOrThat(item, ["material", "service"]).cost;
        }
        let cost = this.thisOrThat(item, [
          "materialCost",
          "serviceCost"
        ]).amount;
        if (cost) return cost;

        return this.thisOrThat(item, ["material", "service"]).cost;
      }
    },
  },
  created() {
    this.canApproveInvoice = this.authUser.roles.filter((role) =>
      role.systemFunctions.find((func) => func.code === "approval-for-invoice")
    );

    this.setInvoice(this.$route.query.id);
  },
  mounted() {
    this.setWorkRequest();
  },
  data: () => ({
    canApproveInvoice: null,
    disabled: false,
    disableBtn: true,
    loading: true,
    shouldRefresh: true,
    invoice: null,
    itemData: null,
    managementFee: 5000,
    vatCost: 1800,
    disableDelete: false,
    vatCost: "",
    workRequest: "",
    total_Cost: null,
    amount_Vat: null,
    management_cost: null,
    amount_Cost: null
  }),
  head: () => ({
    title: "Invoice Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "invoices.show"
  },
  methods: {
    getItemCost(item) {
      if (item.cost != null) return item.cost;
      if (!item.materialCost && !item.serviceCost) {
        return this.thisOrThat(item, ["material", "service"]).cost;
      }
      return this.thisOrThat(item, ["materialCost", "serviceCost"]).amount;
    },
    getItemLife(item) {
      if (!item.materialCost && !item.serviceCost) {
        return item?.amount;
      }
      let cost = parseInt(item?.amount);
      let quantity = this.thisOrThat(item, [
        "materialCost",
        "serviceCost"
      ]).quantity;
      if (cost) return cost;

      return cost * parseInt(quantity);
    },
    async approveInvoice(event) {
      if (this.canApproveInvoice.length) {
        this.disabled = true;
        const invoice_id = this.invoice.id;

        try {
          await this.$axios.post("invoices/approve-invoice/", {
            invoice_id
          });

          this.setInvoice(this.$route.query.id);
          this.disabled = false;
        } catch (error) {
          this.disabled = false;

          console.log(error);
        }
      }
    },

    setInvoice(id) {
      const { detailedAssociations, invoices } =
        this.$store.state.finance.invoices;
      // this.invoice = invoices.find((invoice) => invoice.id == id);
      // if (this.invoice && !this.shouldRefresh) {
      //   if (Array.isArray(this.invoice.items)) {
      //     return (this.loading = false);
      //   }
      // }

      this.loading = true;

      this.$axios
        .get("invoices/" + id, {
          params: { associations: detailedAssociations }
        })
        .then((response) => {
          // this.$store.commit(
          //   "finance/invoices/setInvoice",
          //   response.data.invoice
          // );
          this.invoice = this.invoice
            ? Object.assign({}, response.data.invoice)
            : response.data.invoice;
          this.loading = false;
          this.management_cost = this.invoice.items[0].management_fee;

          this.vat = this.invoice.items[0].vat;

          console.log(this.invoice, "VAT");
          this.total_Cost = this.invoice.items[0].item_total;

          this.setWorkRequest();

          if (this.invoice.om_approved) {
            this.disableDelete = true;
          }
          this.$store.commit("finance/invoices/toggleRefresh");
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    sendToOperationManager() {
      // if (!this.validateForm("create-work-request-invoice-form")) return false;
      this.disabled = true;

      const invoice_management_fee = parseInt(this.invoice.management_fee);
      const invoice_vat = parseInt(this.invoice.vat);
      const invoice_amount = parseInt(this.invoice.items[0].amount);
      const invoice_id = parseInt(this.invoice.id);
      const invoice_total = parseInt(this.invoice.total);
      const item_ids = parseInt(this.invoice.items[0].id);

      // this.toast({
      //       type: "success",
      //       title: "Message to Operation Manager"
      //     });

      // parseInt(invoice_management_fee)
      // parseInt(invoice_management_fee)
      // parseInt(invoice_management_fee)

      this.$axios
        .post("invoices/send-to-om", {
          invoice_id,
          invoice_amount,
          invoice_total,
          invoice_vat,
          invoice_management_fee,
          item_ids
        })
        .then((response) => {
          this.disabled = false;
          this.toast({
            type: "success",
            title: "Message to Operation Manager"
          });
        })
        .catch((error) => {
          console.log(error);
          this.disabled = false;
          const response = error.response;
          this.toast({
            type: "danger",
            title: "Failed Response"
          });
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response && response.status && response.status == 429) {
            this.validationErrors.email = response.statusText;
          } else {
          }
        });
    },

    async setWorkRequest() {
      const id = this.invoice.workRequests[0].id;
      try {
        const response = await this.$axios.get("work-requests/" + id, {
          params: {
            associations: [
              "items.deliveryType",
              "items.material.currency",
              "items.service.currency",
              "items.materialCost",
              "items.serviceCost",
              "status",
              "invoices"
            ]
          }
        });

        this.workRequest = this.workRequest
          ? Object.assign({}, response.data.workRequest)
          : response.data.workRequest;

        // this.amount_Vat = parseInt(this.workRequest.items[0].vat)
        // this.management_cost = parseInt(this.workRequest.items[0].management_fee)
        // this.amount_Cost = parseInt(this.workRequest.items[0].amount_cost)
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    sendInvoiceToClient() {
      this.disabled = true;
      const invoice_id = this.invoice.id;

      this.$axios
        .post("invoices/send-to-client", { invoice_id })
        .then((response) => {
          this.disabled = false;
          this.updateInvoice();
          this.closeModal("send-invoice-to-client-modal");
        })
        .catch((error) => {
          this.disabled = false;
          console.log(error);
        });
    },
    updateInvoice() {
      this.shouldRefresh = true;
      this.setInvoice(this.invoice.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, modalMixin, formMixin],
  watch: {
    $route(to, from) {
      this.setInvoice(to.query.id);
    }
  }
};
</script>

<style scoped>
.paragraph {
  display: flex;
  flex-direction: column;
  margin-top: -10px;
  align-items: flex-end;
}
</style>
