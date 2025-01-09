<template>
  <form
    id="delivery-log-form"
    class="table-responsive"
    v-if="!deliveryStatusesLoading"
  >
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Item</th>
          <th width="20%">Quantity</th>
          <th class="tx-right"></th>
          <th width="17%">Delivery Status</th>
          <th class=""></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <!-- {{ item.quantity_delivered }}
          {{ item.quantities_rejected}} -->

          <!-- {{ item }} -->

          <td>
            <nuxt-link
              :to="`/hagul/inventory/materials/details?id=${
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].id
              }`"
              class="tx-inverse tx-14 tx-medium"
              v-text="
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].name
              "
            ></nuxt-link>
          </td>

          <td>
            <span class="d-block">
              Quantity Requested:
              {{ item.quotationItem.tenderItem.quantity }}
            </span>

            <span class="d-block">
              Quantity Delivered:
              <!-- {{ item_delievered || 0 }} -->
              {{ item.quantity_delivered || 0 }}
            </span>

            <span class="d-block">
              Quantity Rejected:
              <!-- {{ item_rejected || 0 }} -->
              <!-- {{ item_rejected}}
              {{ item.quantites_rejected }} -->
              <!-- {{ item }} -->

              {{ item.quantities_rejected || 0 }}

              <!-- {{ item }} -->

            </span>
          </td>



          <td
            v-if="
              parseInt(item.quotationItem.tenderItem.quantity) > 0 &&
              parseInt(item.quantity_delivered) === 0 &&
              parseInt(item.quantities_rejected) === 0
            "
          >
            <select class="form-control d-inline" v-model="item.status">
              <option :value="{}">Select One</option>
              <option
                v-for="status in item.deliveryStatuses"
                :key="status.id"
                :value="status"
                v-text="status.name"
              ></option>
            </select>
            <input
              type="text"
              class="d-none"
              :name="'delivery_status' + item.id"
              :value="item.status.id"
            />
            <small
              class="tx-bold tx-danger"
              v-if="validationErrors['delivery_status' + item.id]"
              v-text="validationErrors['delivery_status' + item.id]"
            ></small>
          </td>

          <td
          v-if="
              parseInt(item.quotationItem.tenderItem.quantity) > 0 &&
              parseInt(item.quantity_delivered) < 0 ||
              parseInt(item.quantities_rejected) > 0
            "
          >
            <select
              class="form-control d-inline"
              v-model="item.status"
              @change="changeDelivery()"
            >
              <option :value="{}">Select One</option>
              <option
                v-for="status in deliveryArray"
                :key="status.id"
                :value="status"
                v-text="status.name"
              ></option>
            </select>
            <input
              type="text"
              class="d-none"
              :name="'delivery_status' + item.id"
              :value="item.status.id"
            />
            <small
              class="tx-bold tx-danger"
              v-if="validationErrors['delivery_status' + item.id]"
              v-text="validationErrors['delivery_status' + item.id]"
            ></small>
          </td>



          <td
            v-if="
              parseInt(item.quotationItem.tenderItem.quantity) > 0 &&
              parseInt(item.quantity_delivered) === 0 &&
              parseInt(item.quantities_rejected) === 0
            "
          >
            <input
              type="number"
              step="any"
              class="form-control d-inline"
              :required="item.status.id"
              :name="'delivery_quantity' + item.id"
              :placeholder="`How many ${item.status.name || ''} items?`"
              v-model="item.quantity"
              :max="maxDelivery(item)"
              min="1"
            />
            <small
              class="tx-bold tx-danger"
              v-if="validationErrors['delivery_quantity' + item.id]"
              v-text="validationErrors['delivery_quantity' + item.id]"
            ></small>
          </td>

          <td
          v-if="
              parseInt(item.quotationItem.tenderItem.quantity) > 0 &&
              parseInt(item.quantity_delivered) < 0 ||
              parseInt(item.quantities_rejected) > 0
            "
          >
            <!-- {{ deliveryArray[0]?.code }}
            {{ item.status.name }} -->
            <span class="d-block" v-if="parseInt(item.quantity_delivered) >= 0">
              {{ item.quantity_delivered }}
              {{
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].name
              }}
            </span>
            <span class="d-block" v-if="parseInt(item.quantites_rejected) >= 0">
              {{ item.quantites_rejected }}
              {{
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].name
              }}
            </span>

            <span>
              {{
                parseInt(item.quantity_delivered) > 0 ? "Delivered" : "Rejected"
              }}
              <!-- {{ item.status.name }} -->
            </span>
            <!-- {{ parseInt(item.quotationItem.tenderItem.quantity) }}
              {{ parseInt(item.quantites_rejected) }}
              {{ parseInt(item.quantity_delivered) }} -->

            <!-- <div v-if="parseInt(item.quantity_delivered) > 0">
              <span>
                {{
                  parseInt(item.quantity_delivered) > 0
                    ? "Delivered"
                    : "Rejected"
                }}
              </span>
            </div> -->
          </td>
          <td
          v-if="
              parseInt(item.quotationItem.tenderItem.quantity) > 0 &&
              parseInt(item.quantity_delivered) > 0 ||
              parseInt(item.quantities_rejected) < 0
            "
          >
            <span class="d-block" v-if="parseInt(item.quantity_delivered) >= 0">
              {{ item.quantity_delivered }}
              {{
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].name
              }}
            </span>
            <span class="d-block" v-if="parseInt(item.quantites_rejected) >= 0">
              {{ item.quantites_rejected }}
              {{
                item.quotationItem.tenderItem[
                  item.quotationItem.tenderItem.deliveryType.code
                ].name
              }}
            </span>

            <span>
              {{
                parseInt(item.quantity_delivered) > 0 ? "Delivered" : "Rejected"
              }}

            </span>

          </td>
          <td
          v-if="
              parseInt(item.quotationItem.tenderItem.quantity) > 0 &&
              parseInt(item.quantity_delivered) > 0 ||
              parseInt(item.quantities_rejected) < 0
            "
          >

          </td>


          <!-- <td v-if="
            parseInt(item.quotationItem.tenderItem.quantity) ===
            parseInt(item.quantity_delivered) +
              parseInt(item.quantites_rejected)
          ">

            <input
              type="number"
              step="any"
              class="form-control d-inline"
              :required="item.status.id"
              :name="'delivery_quantity' + item.id"
              :placeholder="`How many ${item.status.name || ''} items?`"
              v-model="item.quantity"
              :max="maxDelivery(item)"
              min="1"
            />
            <small class="tx-bold tx-danger" v-if="validationErrors['delivery_quantity' + item.id]"
              v-text="validationErrors['delivery_quantity' + item.id]"></small>
          </td> -->

          <!-- <td v-if="
            parseInt(item.quantity_delivered) > 0
          ">
            <span>
              {{ (parseInt(item.quantity_delivered) > 0) ? "Delivered" : "Rejected"}}
            </span>
          </td> -->
        </tr>
      </tbody>
    </table>
    <!-- (parseInt(item_delievered) > 0 ? true: false) -->
    <div class="form-layout-footer tx-center mg-t-20" v-if="!isDelivered">
      <!-- {{ isDelivered }} -->
      <v-button
        type="button"
        class="btn btn-primary pd-x-25"
        :disabled="disabled"
        @click="submitDeliveries()"
        >SAVE
      </v-button>
    </div>

  </form>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import starInput from "@/components/ui/star-input";
import vButton from "@/components/ui/v-button";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  items: [],
  deliveryStatuses: [],
  deliveryStatusesLoading: true,
  disabled: false,
  isDisabled: true,
  item_rejected: 0,
  item_delievered: 0,
  validationErrors: {},
  isDelivered: null,
  // purchaseOrders: [],
  deliveryArray: [
    { id: 2, name: "Delivered", code: "delivered" },
    // { id: 3, name: "Rejected", code: "rejected" }
  ]
});

export default {
  components: { loading, starInput, vButton },
  computed: {
    isFullyDelivered() {
      var isFullyDelivered = true;
      for (const item of this.purchaseOrder.items) {
        if (item.delivered_at == null) {
          isFullyDelivered = false;
        }
      }
      return isFullyDelivered;
    },
    unDeliveredItems() {
      return this.purchaseOrder.items.filter(
        (item) => item.delivered_at == null
      );
    }
  },
  async created() {
    await this.getDeliveryStatuses(this);
    // await this.getPurchaseOrders(this);
    this.populateItems();
  },
  mounted() {
    this.changeItemValue();
  },
  data: () => getInitialData(),
  methods: {
    ...mapActions({
      getDeliveryStatuses: "hagul/getDeliveryStatuses"
      // getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders",
    }),
    async changeItemValue() {
      await this.getDeliveryStatuses(this);
      for (const item of this.items) {
        this.item_delievered = item.quantity_delivered;
        this.item_rejected = item.quantities_rejected;
      }
    },


    changeDelivery() {
      if (!this.items[0]?.status.code) return 0;

      if (this.items[0]?.status.code == "delivered") {
        // this.item_rejected = 0;
        // this.item_delievered = this.items[0]?.deliveryLogs[0]?.quantity;
        // this.items[0]?.quantites_rejected = 0;
      }

      // if (this.items[0]?.status.code == "rejected") {
      //   this.item_rejected = 1;
      //   this.item_delievered = 0;
      //   "second line..", this.items[0]?.status);
      // }

      // const status = this.items.map((item) => {
      //   return item.status?.name
      // })

      // "jugging..", status);

      this.items = this.items.map((item) => {
        item = Object.assign(item, {
          // quantity_delivered: this.item_delievered,
          // quantity_rejected: this.item_rejected,
          status: this.items[0]?.status
        });
        return item;
      });
    },
    maxDelivery(item) {
      if (!item.status.code) return 0;
      if (item.status.code == "delivered")
        return item.quotationItem.tenderItem.quantity - item.quantity_delivered;
      if (item.status.code == "rejected")
        return item.quotationItem.tenderItem.quantity - item.quantites_rejected;
      return 0;
    },
    populateItems() {
      this.items = this.purchaseOrder.items.map((item) => {
        const deliveryStatuses = this.deliveryStatuses.filter(
          (status) =>
            status.code != "pending" && item.status.code != status.code
        );
        const quantity_delivered = item.deliveryLogs
          .filter((log) => log.status.code == "delivered")
          .reduce((quantity, log) => quantity + log.quantity, 0);
        const quantity_rejected = item.deliveryLogs
          .filter((log) => log.status.code == "rejected")
          .reduce((quantity, log) => quantity + log.quantity, 0);

        const status = item.deliveryLogs.map((log) => log.status?.name);

        this.isDelivered = item.quantity_delivered

        item = Object.assign({ deliveryStatuses, quantity: null }, item);
        item = Object.assign(item, {
          quantity_delivered,
          quantity_rejected,
          status: {}
        });
        return item;
      });
    },
    submitDeliveries() {
      if (!this.validateForm("delivery-log-form")) return false;
      this.disabled = true;
      const purchase_order_id = this.purchaseOrder.id;
      var items = this.items.filter((item) => item.status.code);
      const purchase_order_item_id = items.map((item) => item.id);
      const quantity = items.map(
        (item) => item.quotationItem.tenderItem.quantity
      );
      // const quantity = items.map((item) => item.quantity);
      const delivery_status_id = items.map((item) => item.status.id);
      const rating = items.map((item) =>
        item.status.code == "delivered" ? 5 : 1
      );

      let rejectedQuantity = this.purchaseOrder.items.map((item) => {
        item.deliveryLogs
          .filter((log) => log.status.code == "rejected")
          .reduce((quantity, log) => quantity + log.quantity, 0);
      });

      let deliveredQuantity = this.purchaseOrder.items.map((item) => {
        item.deliveryLogs
          .filter((log) => log.status.code == "delivered")
          .reduce((quantity, log) => quantity + log.quantity, 0);
      });

      let quantity_delivered = this.items.map((item) => {
        let delivered_array = [];
        // || item?.deliveryLogs[0]?.status?.code === "rejected"
        if(item?.status?.code === "rejected"){
          let empty_quantity = 0
          delivered_array.push(parseInt(empty_quantity))
        }
        // if (item?.deliveryLogs[0]?.status?.code === "rejected") {
        //   let quantity = item?.quantity;
        //   if (quantity === null) {
        //     quantity = item?.deliveryLogs[0]?.quantity
        //   }
        //   delivered_array.push(quantity)
        // }
        if(item?.status?.code === "delivered"){
          let quantity = item?.quantity;
          if (quantity === null) {
            quantity = item?.deliveryLogs[0]?.quantity
          }
          delivered_array.push(parseInt(quantity))
        }
        // if (item?.deliveryLogs[0]?.status?.code === "delivered") {
        //   let empty_quantity = 0
        //   delivered_array.push(empty_quantity)
        // }
        // let all_array = parseInt(delivered_array.join(''))

        // return all_array;
        return delivered_array;
      })

      let quantities_rejected = this.items.map((item) => {
        let rejected_array = [];
        if(item?.status?.code === "rejected"){
          let quantity = item?.quantity;
          if (quantity === null) {
            quantity = item?.deliveryLogs[0]?.quantity
          }
          rejected_array.push(parseInt(quantity))
        }
        // if (item?.deliveryLogs[0]?.status?.code === "rejected") {
        //   let quantity = item?.quantity;
        //   if (quantity === null) {
        //     quantity = item?.deliveryLogs[0]?.quantity
        //   }
        //   rejected_array.push(parseInt(quantity))
        // }
        if(item?.status?.code === "delivered"){
          let empty_quantity = 0
          rejected_array.push(parseInt(empty_quantity))
        }
        // if (item?.deliveryLogs[0]?.status?.code === "delivered") {
        //   let empty_quantity = 0
        //   rejected_array.push(parseInt(empty_quantity))
        // }


        // let all_array = parseInt(rejected_array.join(''))
        // return all_array;
        return rejected_array
      })
      // let pattern = []
      // let empty_bar = 0

      // let delivery_status_life = this.items.map((item) => item?.status?.code === "rejected" ? pattern.push(empty_bar) : pattern.push(parseInt(item?.quantity)));

      // let patternLife = []
      // let empty_baring = 0

      // let delivery_status_super = this.items.map((item) => item?.status?.code === "delivered" ? patternLife.push(parseInt(item?.quantity)) : patternLife.push(empty_baring));


      // let quantity_delivered = this.items[0]?.status.code == "delivered" ? quantity : 0;
      // let quantities_rejected = this.items[0]?.status.code == "rejected" ? quantity : 0;


      this.populateItems();

      this.$axios
        .post("purchase-orders/delivery-logs/store-many", {
          purchase_order_id,
          purchase_order_item_id,
          quantity,
          delivery_status_id,
          rating,
          quantity_delivered,
          quantities_rejected
        })
        .then((response) => {
          this.disabled = false;
          this.$store.commit("hagul/deliveryLogs/toggleRefresh");
          this.$emit("update");

          const { deliveryStatuses, deliveryStatusesLoading } = this;
          var initialData = Object.assign(getInitialData(), {
            deliveryStatuses,
            deliveryStatusesLoading
          });
          Object.assign(this.$data, initialData);
          this.$router.go();
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
    }
  },
  mixins: [formMixin],
  props: ["purchaseOrder"],
  watch: {
    purchaseOrder(val) {
      this.populateItems();
    }
  }
};
</script>
