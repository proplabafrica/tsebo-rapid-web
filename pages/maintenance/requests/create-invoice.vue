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
          <span v-if="workRequest">
            For
            <nuxt-link
              :to="`/maintenance/requests/details?id=${workRequest.id}`"
              v-text="`#${workRequest.code}`"
            >
            </nuxt-link>
          </span>
        </li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="
          workRequest
            ? `Create Invoice for #${workRequest.code}`
            : 'Create Invoice'
        "
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="section-wrapper" v-if="!loading">
      <div v-if="true">
        <form id="create-work-request-invoice-form">
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
                <td v-if="item.deliveryType.code == 'material'">
                  <span v-text="item.deliveryType.name" class="d-block"></span>
                  <nuxt-link
                    :to="`/hagul/inventory/materials/details?id=${item.material.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="item.material.name"
                  ></nuxt-link>
                  <span v-if="item.material.code" class="tx-11 d-block"
                    >#{{ item.material.code }}</span
                  >
                  <span v-if="item.material.stock" class="tx-11 d-block"
                    >Stock: {{ item.material.stock }}</span
                  >
                </td>
                <td v-if="item.deliveryType.code == 'service'">
                  <span v-text="item.deliveryType.name" class="d-block"></span>
                  <nuxt-link
                    :to="`/hagul/inventory/services/details?id=${item.service.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="item.service.name"
                  ></nuxt-link>
                </td>
                <td>
                  <span v-text="item.quantity"></span>
                </td>
                <td>
                  <span>{{ getItemCost(item) }}</span>
                </td>
                <td>
                  <!-- <div>{{ totalAmount }}</div> -->
                  <input
                    type="number"
                    step="any"
                    :oldmin="getItemCost(item)"
                    :name="'amount' + item.id"
                    v-model="item.amount"
                    class="form-control"
                    required
                  />
                  <small
                    class="tx-bold tx-danger"
                    v-if="validationErrors['amount' + item.id]"
                    v-text="validationErrors['amount' + item.id]"
                  ></small>
                </td>

                <td class="tx-right">
                  <span>{{
                    { value: getItemLife(item) * parseFloat(item.quantity) }
                      | toMoney
                  }}</span>
                </td>
              </tr>

              <tr>
                <td>
                  <!-- <span>{{ { value: totalCost } | toMoney }}</span> -->
                </td>
                <td>Management Fee</td>
                <td></td>
                <td>
                  <span>{{ { value: cost_management } | toMoney }}</span>
                </td>
                <td class="tx-right">
                  <input
                    type="number"
                    step="any"
                    v-model="cost_management"
                    class="form-control"
                    required
                  />
                </td>

                <td class="tx-right">
                  <span>{{ { value: cost_management } | toMoney }}</span>
                </td>
              </tr>

              <tr v-if="items.length > 0">
                <!-- {{ invoice }} -->
                <td>
                  <!-- <span>{{ item.vat }}</span> -->
                </td>
                <td>VAT</td>
                <td></td>
                <td>
                  <span>{{ { value: vat_fee } | toMoney }}</span>
                </td>

                <td class="tx-right">
                  <input
                    type="number"
                    step="any"
                    v-model="vat_fee"
                    class="form-control"
                    required
                  />
                </td>

                <!-- <td>
                  <span>{{ { value: vat_fee } | toMoney }}</span>
                </td> -->

                <td class="tx-right">
                  <span>{{ { value: vat_fee } | toMoney }}</span>
                </td>
              </tr>

              <tr v-if="items.length > 0">
                <td colspan="4" rowspan="4" class="valign-middle">
                  <h4>
                    {{ getPercentage >= 0.00 ? 'Profit:': 'Loss:' }}

                    <span class="tx-bold" :class="[profitClass]">
                      {{ absoluteValue(getPercentage)}}%

                      <!-- {{ item }} -->
                    </span>
                  </h4>
                </td>
                <td
                  class="tx-right tx-uppercase tx-bold tx-inverse"
                  colspan="1"
                >
                  Total
                </td>
                <td colspan="1" class="tx-right">
                  <h4 class="tx-primary tx-bold tx-lato">
                    {{ { value: total } | toMoney }}
                  </h4>

                  <div class="col paragraph tx-primary tx-bold tx-lato mg-t-40">
                    <div class="">
                      <label>Invoice Approved</label>
                      <input :disabled="true" type="checkbox" />
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <!-- table-responsive -->
          <div class="form-layout-footer tx-center mg-t-20">
            <!-- <v-button class="btn btn-primary bd-0 pd-x-25 mg-x-10" :disabled="disabled" @click="saveInvoice()">SAVE
            </v-button> -->

            <!-- <v-button
              class="btn btn-primary bd-0 pd-x-25 mg-x-10"
              :disabled="disabled"
              @click="saveInvoice()"
              >SAVE DRAFT
            </v-button> -->
            <span
              v-modal-open="'approve-request-modal'"
              class="btn btn-primary bd-0 pd-x-25 mg-x-10"
            >
              SAVE DRAFT
            </span>

            <!-- <div>{{  items  }}</div> -->
          </div>
          <v-modal ref="approve-request-modal">
            <div class="modal-dialog " role="document">
              <div class="modal-content tx-size-sm">
                <div class="modal-body tx-center pd-y-20 pd-x-20">
                  <button
                    type="button"
                    class="close"
                    v-modal-close="'approve-request-modal'"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 class="mg-b-20">Are you sure you want to process to creating the invoice?</h4>
                  <form id="approve-request-form">
                    <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <!-- <th>Unit Cost</th> -->
                  <th>Unit Cost To Client</th>
                  <th>Total Cost To Client</th>
                </tr>
              </thead>
              <tr v-for="(item, index) in items" :key="item.id">
                <td>
                  <span v-text="index + 1"></span>
                </td>

                <td v-if="item.deliveryType.code == 'material'">
                  <span v-text="item.deliveryType.name" class="d-block"></span>
                  <nuxt-link
                    :to="`/hagul/inventory/materials/details?id=${item.material.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="item.material.name"
                  ></nuxt-link>
                  <span v-if="item.material.code" class="tx-11 d-block"
                    >#{{ item.material.code }}</span
                  >
                  <span v-if="item.material.stock" class="tx-11 d-block"
                    >Stock: {{ item.material.stock }}</span
                  >
                </td>
                <td v-if="item.deliveryType.code == 'service'">
                  <span v-text="item.deliveryType.name" class="d-block"></span>
                  <nuxt-link
                    :to="`/hagul/inventory/services/details?id=${item.service.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="item.service.name"
                  ></nuxt-link>
                </td>

                <td>
                  <span v-text="item.quantity"></span>
                </td>

                <td>
                  <span v-text="item.amount"></span>
                </td>
                <!-- <td>
                  
                  <input
                    type="number"
                    step="any"
                    :oldmin="getItemCost(item)"
                    :name="'amount' + item.id"
                    v-model="item.amount"
                    class="form-control"
                    required
                  />
                  <small
                    class="tx-bold tx-danger"
                    v-if="validationErrors['amount' + item.id]"
                    v-text="validationErrors['amount' + item.id]"
                  ></small>
                </td> -->

                <td class="tx-right">
                  <span>{{
                    { value: getItemLife(item) * parseFloat(item.quantity) }
                      | toMoney
                  }}</span>
                </td>
              </tr>

              <tr>
                <td>
                  <!-- <span>{{ { value: totalCost } | toMoney }}</span> -->
                </td>
                <td>Management Fee</td>
                <td></td>
                <td>
                  <span>{{ { value: cost_management } | toMoney }}</span>
                </td>
                <!-- <td class="tx-right">
                  <input
                    type="number"
                    step="any"
                    v-model="cost_management"
                    class="form-control"
                    required
                  />
                </td> -->

                <td class="tx-right">
                  <span>{{ { value: cost_management } | toMoney }}</span>
                </td>
              </tr>

              <tr v-if="items.length > 0">
                <!-- {{ invoice }} -->
                <td>
                  <!-- <span>{{ item.vat }}</span> -->
                </td>
                <td>VAT</td>
                <td></td>
                <td>
                  <span>{{ { value: vat_fee } | toMoney }}</span>
                </td>

                <!-- <td class="tx-right">
                  <input
                    type="number"
                    step="any"
                    v-model="vat_fee"
                    class="form-control"
                    required
                  />
                </td> -->

                <!-- <td>
                  <span>{{ { value: vat_fee } | toMoney }}</span>
                </td> -->

                <td class="tx-right">
                  <span>{{ { value: vat_fee } | toMoney }}</span>
                </td>
              </tr>

              <tr v-if="items.length > 0">
                <td colspan="3" rowspan="2" class="valign-middle">
                  <h4>
                    {{ getPercentage >= 0.00 ? 'Profit:': 'Loss:' }}

                    <span class="tx-bold" :class="[profitClass]">
                      {{ absoluteValue(getPercentage)}}%

                      <!-- {{ item }} -->
                    </span>
                  </h4>
                </td>
                <td
                  class="tx-right tx-uppercase tx-bold tx-inverse"
                  colspan="1"
                >
                  Total
                </td>
                <td colspan="1" class="tx-right">
                  <h4 class="tx-primary tx-bold tx-lato">
                    {{ { value: total } | toMoney }}
                  </h4>

                 
                </td>
              </tr>
            </table>
                    <div class="form-layout-footer">
                      <v-button
                        class="btn btn-primary bd-0 pd-x-25 mg-x-10"
                        :disabled="disabled"
                        @click="saveInvoice()"
                        > <i class="icon ion-ios-checkmark-outline"></i> Confirm
                      </v-button>
                      <button
                        type="button"
                        class="btn btn-danger pd-x-25"
                        v-modal-close="'approve-request-modal'"
                        aria-label="Close"
                        :disabled="disabled"
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
        </form>
      </div>
      <static-error
        v-else
        :error="{ title: 'Cannot Request Delivery' }"
        :redirect="{
          route: `/maintenance/requests/details?id=${workRequest.id}`,
          text: 'Go To Work Request'
        }"
      />
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
      for (const item of this.items) {
        // console.log("first", this.cost_management, "time..", item.amount, "right..", this.getItemCostStart)
        // return item.amount + (this.cost_management || 0) > this.getItemCostStart ? "tx-teal" : "tx-danger";
        return this.getPercentage >= 0.00 ? "tx-teal" : "tx-danger";
      }
    },
    colorClass() {
      for (const item of this.items) {
        return item.amount + (this.cost_management || 0) > this.getItemCostStart ? "Profit:" : "Loss:";
      }
    },
    totalCost() {
      return this.items.reduce(
        (total, item) =>
          total + this.getItemCost(item) * parseFloat(item.quantity),
        0
      );
    },
    totalAmount() {
      return this.items.reduce(
        (total, item) =>
          total + parseInt(item.amount) * parseFloat(item.quantity),
        0
      );
    },

    getItemCostStart() {
      for (const item of this.items) {
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
    getPercentage() {
      const profitItem = this.totalAmount || 0;

      let costItem = this.items.reduce(
        (total, item) =>
          total + parseInt(this.thisOrThat(item, ["material", "service"]).cost),
        0
      );

      // console.log("all the profit..", costItem)
      let newCost = this.cost_management || 0

      if (costItem > 0) {
        if (this.items.length > 1) {
          // let percentage = ((parseInt(profitItem) - parseInt(costItem)) / parseInt(costItem)) * 100;
          let percentage =
            (((this.totalAmount + parseInt(newCost) || 0) -
              parseInt(this.totalCost)) /
              parseInt(this.totalCost)) *
            100;

          if (parseInt(percentage) || parseInt(percentage) === 0) {
            // console.log("rapid..", percentage, parseInt(profitItem) , parseInt(costItem))
            return percentage.toFixed(2);
          } else {
            return -100;
          }
        } else {
          let percentage =
            (((this.totalAmount + parseInt(newCost) || 0) -
              parseInt(this.totalCost)) /
              parseInt(this.totalCost)) *
            100;

          if (parseInt(percentage) || parseInt(percentage) === 0) {
            // console.log(percentage, "PERCENTAGE", this.totalAmount, parseInt(this.totalCost), parseInt(newCost));
            return percentage.toFixed(2);
          } else {
            return -100;
          }
        }
      }
      return profitItem || 0;
    },

    total() {
      const totalCost = this.totalAmount || 0;

      const managementCost = parseInt(this.cost_management) || 0;

      const vat = this.vat_fee || 0;

      const total = parseFloat(totalCost) + parseFloat(managementCost) + parseFloat(vat);

      // console.log("first...", managementCost)

      for (const item of this.items) {
        item.management_fee = this.cost_management;
        item.vat = this.vat_fee;

        item.item_total = total;
      }

      return total;
    }
    // profitCost() {
    //   "ITEMS")
    //   return this.items.reduce((total, item) => {
    //     let quantity = item.quantity ? item.quantity : 1;
    //     total, "TOAL")
    //     return (total + item.amount * quantity);
    //   }, 0);
    // }
  },
  created() {
    this.setWorkRequest(this.$route.query.id);
    // this.setInvoice();
    this.getItemQuantity();
  },

  data: () => ({
    disabled: false,
    items: [],
    loading: true,
    shouldRefresh: true,
    validationErrors: {},
    workRequest: null,
    allItem: [],
    invoice: null,
    cost_management: 0,
    management_fee: null,
    vat_fee: 0,
    amount_cost: null,
    vat_cost: 0
  }),
  head: () => ({
    title: "Create Invoice · Tsebo-Rapid"
  }),
  meta: {
    pageName: "work-requests.store-invoice"
  },
  methods: {
    getItemCost(item) {
      if (!item.materialCost && !item.serviceCost) {
        return this.thisOrThat(item, ["material", "service"]).cost;
      }
      let cost = this.thisOrThat(item, ["materialCost", "serviceCost"]).amount;
      if (cost) return cost;

      return this.thisOrThat(item, ["material", "service"]).cost || 0;
    },
    getItemQuantity() {
      for (const item of this.items) {
        if (!item.materialCost && !item.serviceCost) {
          return this.thisOrThat(item, ["material", "service"]).cost;
        }
        let quantity = this.thisOrThat(item, [
          "materialCost",
          "serviceCost"
        ]).quantity;
        if (cost) return cost;

        return (
          this.thisOrThat(item, ["material", "service"]).cost *
            parseInt(quantity) || 0
        );
      }
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

      return cost * parseInt(quantity) || 0;
    },
    populateItems() {
      this.items = [];
      this.allItem = [];
      for (const item of this.workRequest.items) {
        this.items.push(
          Object.assign({ amount: this.getItemCost(item) }, item)
        );
        this.allItem.push(
          Object.assign({ amount: this.getItemCost(item) }, item)
        );
      }

      if (this.items.length < 1) this.add1Item();

      console.log("object", this.items);
    },
    saveInvoice() {
      if (!this.validateForm("create-work-request-invoice-form")) return false;
      this.disabled = true;

      const amount_item = this.items.map((item) => item.amount);
      this.items.amount_cost = amount_item;

      const work_request_id = this.workRequest.id;
      // const item_id = this.items.map((item) => item.id);
      // const amount = this.items.map((item) => item.amount);

      const item_id = this.items.map((item) => item.id);
      const management_fee = this.items.map((item) => item.management_fee);
      const vat = this.items.map((item) => item.vat);
      const amount = this.items.amount_cost;
      const item_total = this.items.map((item) => item.item_total);

      // const profit = ((this.total - this.totalCost) / this.totalCost) * 100
      // if (profit < 0) {
      //   amount, "AMOUNT")
      //   this.disabled = false
      //   return
      // }

      this.$axios
        .post("work-requests/send-to-om", {
          work_request_id,
          item_id,
          management_fee,
          vat,
          amount,
          item_total
        })
        .then((response) => {
          this.disabled = false;
          this.toast({
            type: "success",
            title: "Message to Operation Manager"
          });
          this.$router.push(
            `/finance/invoices/details?id=${response.data.invoice.id}`
          );
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
    async setWorkRequest(id) {
      const { detailedAssociations, workRequests } =
        this.$store.state.maintenance.workRequests;
      this.workRequest = workRequests.find(
        (workRequest) => workRequest.id == id
      );
      if (this.workRequest && !this.shouldRefresh) {
        if (Array.isArray(this.workRequest.items)) {
          return (this.loading = false);
        }
      }
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

        this.$store.commit(
          "maintenance/workRequests/setWorkRequest",
          response.data.workRequest
        );
        this.workRequest = this.workRequest
          ? Object.assign({}, response.data.workRequest)
          : response.data.workRequest;

        // "item Request for the other way..", this.items);
        this.loading = false;
        this.shouldRefresh = false;
        this.populateItems();

        // this.management_fee = this.items.management_fee
        // this.vat_cost = this.items.vat
        // amount_cost = this.items.amount_cost
        this.$store.commit("maintenance/workRequests/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    sendInvoiceToClient() {
      this.disabled = true;
      const work_request_id = this.workRequest.id;
      this.$axios
        .post("work-requests/request-delivery", { work_request_id })
        .then((response) => {
          this.disabled = false;
          this.closeModal("send-invoice-to-client-modal");
          this.$router.push(
            `/maintenance/requests/details?id=${this.workRequest.id}`
          );
        })
        .catch((error) => {
          this.disabled = false;
          console.log(error);
        });
    },
    setInvoice() {
      const work_request_id = this.workRequest.id;
      const amount = this.items.map((item) => item.amount);
      // const amount_cost = this.items.map((item) => item.amount_cost);
      const wr = this.workRequest;
      const item_life = this.items;
      this.items.amount_cost = amount;
    },
    absoluteValue(value) {
      return Math.abs(value);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to, from) {
      this.setWorkRequest(to.query.id);
    }
  }
};
</script>
