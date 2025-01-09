<template>
  <div class="slim-mainpanel">
    <div class="container">
      <div class="slim-pageheader">
        <ol class="breadcrumb slim-breadcrumb">
          <li class="breadcrumb-item">
            <nuxt-link to="/">Home</nuxt-link>
          </li>
          <li aria-current="page" class="breadcrumb-item active">
            Edit
            <nuxt-link :to="`/account/purchase-orders/by-id?id=${purchaseOrder.id}`">
              Purchase Order {{ purchaseOrder.code }}</nuxt-link
            >
          </li>
        </ol>
        <h6 class="slim-pagetitle">
          Edit Purchase Order {{ purchaseOrder.code }}
        </h6>
      </div>

      <div class="section-wrapper">
        <toast />
        <form enctype="multipart/form-data" class="row">
          <div class="col-md-3 card card-table">
            <div
              class="form-group col-10 offset-1 pd-y-10"
              v-if="!purchaseOrderModifierTypesLoading"
            >
              <label for="vendor_id" class="form-control-label row"
                ><h6>MODIFIERS</h6></label
              >
              <div
                class="form-group"
                v-for="modifierType in purchaseOrderModifierTypes"
                :key="modifierType.id"
              >
                <label class="ckbox"
                  ><input
                    type="checkbox"
                    control-id="ControlID-1"
                    v-model="modifierType.isChecked"
                    :value="modifierType.id"
                    @change="setModifierTypesInput(modifierType)"
                  />
                  <span
                    ><span>{{ modifierType.name }}</span></span
                  ></label
                >
                <input
                  type="number"
                  step="any"
                  class="form-control"
                  control-id="ControlID-2"
                  v-model="modifierType.percentage"
                />
              </div>
            </div>
          </div>
          <div class="col-md-9">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th class="tx-center">Quantity</th>
                    <th class="tx-center">Unit Price</th>
                    <th class="tx-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in purchaseOrder.items"
                    :key="item.id"
                  >
                    <th scope="row">
                      <span>{{ index + 1 }}</span>
                    </th>
                    <td>
                      <span> {{ item.quotationItem.tenderItem.name }}</span>
                    </td>
                    <td class="tx-center">
                      <span>{{ item.quotationItem.tenderItem.quantity }}</span>
                    </td>
                    <td class="tx-center">
                      <span>{{ item.quotationItem.price | money }}</span>
                    </td>
                    <td class="tx-right">
                      <span>{{
                        (item.quotationItem.tenderItem.quantity *
                          item.quotationItem.price)
                          | money
                      }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td colspan="1" class="tx-right"><b>SUB TOTAL</b></td>
                    <td class="tx-right">
                      <span>{{ subTotal | money }}</span>
                    </td>
                  </tr>
                  <tr v-for="modifier in modifiers" :key="modifier.name">
                    <td colspan="3"></td>
                    <td colspan="1" class="tx-right">
                      <b>{{ modifier.name }}</b>
                      <b
                        ><span
                          >(<span>{{ modifier.percentage }}</span
                          >%)</span
                        ></b
                      >
                    </td>
                    <td class="tx-right">
                      <span>{{
                        subTotal
                          ? (modifier.percentage * subTotal) / 100
                          : modifier.percentage
                      }}</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3"></td>
                    <td colspan="1" class="tx-right"><b>TOTAL</b></td>
                    <td class="tx-right">
                      <span>{{ total | money }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pd-20 form-layout-footer">
              <v-button
                :disabled="purchaseOrderModifierLoading"
                type="button"
                class="btn btn-primary bd-0"
                control-id="ControlID-7"
                @click="savePurchaseOrderModifier"
              >
                SAVE
              </v-button>
              <a
                :href="fileUrl"
                target="_blank"
                class="btn btn-primary bd-0 text-white float-right"
                ><i class="fa fa-print"></i> PRINT
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/account/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { vButton, vPaginate, loading },
  created() {
    this.setPurchaseOrder(this.$route.query.id);
    this.getPurchaseOrderModifierTypes();
  },
  data: () => ({
    purchaseOrder: {},
    purchaseOrderId: 83,
    purchaseOrderModifierTypeStore: {},
    purchaseOrderModifierStore: {},
    purchaseOrderModifierTypes: [],
    purchaseOrderModifierTypesLoading: false,
    purchaseOrderModifier: {},
    purchaseOrderModifierLoading: false,
    modifiers: [],
    withHoldingTax: 0,
    purchaseOrders: [],
    purchaseOrdersLoading: true
  }),
  head: () => ({
    title: `Purchase Orders . VampFi`
  }),

  methods: {
    ...mapActions({
      getPurchaseOrders: "hagul/purchase/purchaseOrders/getPurchaseOrders"
    }),
    async getUnits() {
      if (!this.unitsLoading && this.units.length) return;
      this.unitsLoading = true;
      const response = await this.$axios.get("units", {
        params: {
          associations: ["parent.hierarchy"]
        }
      });
      this.unitsLoading = false;
      this.units = response.data.data;
    },
    async setPurchaseOrder(id) {
      const { detailedAssociations, purchaseOrders, refresh } =
        this.$store.state.hagul.purchase.purchaseOrders;
      this.purchaseOrder = purchaseOrders.find(
        (purchaseOrder) => purchaseOrder.id == id
      );
      if (Object.keys(this.purchaseOrder).length && !refresh) {
        return (this.purchaseOrderLoading = false);
      }
      this.purchaseOrderLoading = true;

      try {
        const response = await this.$axios.get("purchase-orders/" + id, {
          params: { associations: detailedAssociations }
        });

        this.$store.commit(
          "hagul/purchase/purchaseOrders/setPurchaseOrder",
          response.data.purchaseOrders
        );

        this.purchaseOrder = this.purchaseOrder
          ? Object.assign({}, response.data.purchaseOrder)
          : response.data.purchaseOrder;
        this.purchaseOrderLoading = false;
        this.$store.commit("hagul/purchase/purchaseOrders/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async getPurchaseOrderModifierTypes() {
      this.purchaseOrderModifierTypesLoading = true;
      const response = await this.$axios.get("purchase-order-modifier-types");
      this.purchaseOrderModifierTypes = response.data.data;
      this.purchaseOrderModifierTypes.map((modifier) => {
        const modifiers = this.purchaseOrder.modifiers;
        for (let i = 0; i < modifiers.length; i++) {
          if (modifier.id === modifiers[i].purchase_order_modifier_type_id) {
            if (modifier.deduction) {
              let credit = 0;
              let total = modifiers.reduce((acc, item) => {
                if (item.credit && item.credit > 0) {
                  credit = item.credit;
                  return acc + item.credit;
                } else if (item.debit && item.debit > 0) {
                  return acc - item.debit;
                }
              }, this.purchaseOrder.total);

              modifier.percentage =
                ((this.purchaseOrder.total + credit - total) * 100) /
                this.purchaseOrder.total;
            }
            modifier.isChecked = true;
            this.modifiers.push(modifier);
          }
        }
      });

      this.purchaseOrderModifierTypesLoading = false;
    },
    async savePurchaseOrderModifier() {
      this.purchaseOrderModifierLoading = true;
      for (let i = 0; i < this.modifiers.length; i++) {
        let modifier = this.modifiers[i];
        if (modifier.isChecked) {
          const response = await this.$axios.post("purchase-order-modifiers", {
            credit: modifier.deduction
              ? 0
              : (modifier.percentage * this.subTotal) / 100,
            debit: modifier.deduction
              ? (modifier.percentage * this.subTotal) / 100
              : 0,
            active: true,
            purchase_order_id: this.purchaseOrder.id,
            purchase_order_modifier_type_id: modifier.id,
            created_by: this.purchaseOrder.created_by
          });
        } else {
          const response = await this.$axios.post("purchase-order-modifiers", {
            credit: 0,
            debit: 0,
            active: false,
            purchase_order_id: this.purchaseOrder.id,
            purchase_order_modifier_type_id: modifier.id,
            created_by: this.purchaseOrder.created_by
          });
        }
      }
      this.purchaseOrderModifierLoading = false;
      this.toast({
        type: "success",
        title: "Modifier saved!"
      });
    },
    setModifierTypesInput(modifierType) {
      modifierType.isChecked === true ? this.modifiers.push(modifierType) : "";
      this.modifiers = this.modifiers.filter(
        (modifier) => modifier.isChecked === true
      );
    }
  },
  computed: {
    fileUrl() {
      if (Object.keys(this.purchaseOrder).length === 0) return "";

      const purchaseOrderQuotation = this.purchaseOrder.quotation;

      return purchaseOrderQuotation.files.length
        ? purchaseOrderQuotation.files[purchaseOrderQuotation.files.length - 1]
            .file_path
        : "";
    },
    subTotal() {
      if (Object.keys(this.purchaseOrder).length === 0) return 0;
      return this.purchaseOrder.items?.reduce((acc, item) => {
        return (
          acc +
          item.quotationItem.price * item.quotationItem.tenderItem.quantity
        );
      }, 0);
    },
    total() {
      if (typeof this.subTotal == "undefined") return 0;
      if (!this.modifiers.length) return this.subTotal;

      return this.modifiers.reduce((acc, item, i) => {
        if (item.percentage < 1 && i === 0 && this.modifiers.length === 1) {
          return this.subTotal;
        } else if (
          item.percentage < 1 &&
          i === 0 &&
          this.modifiers.length > 1
        ) {
          return 0;
        } else if (!item.deduction) {
          return acc + this.subTotal + (this.subTotal * item.percentage) / 100;
        } else if (item.deduction) {
          return acc - (item.percentage * this.subTotal) / 100;
        } else {
          return acc;
        }
      }, 0);
    }
  },
  middleware: ["auth"],
  props: ["units", "unitsLoading"],
  mixins: [authMixin, formMixin],
  watch: {
    $route(to) {
      this.setPurchaseOrder(to.query.id);
    }
  }
};
</script>
