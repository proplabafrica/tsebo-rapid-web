<template>
  <div class="table-responsive mg-t-10">
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Material</th>
          <th>Quantity</th>
          <th class="tx-right">Estimated Cost</th>
          <th class="tx-right">Total</th>
        </tr>
      </thead>
      <tr v-for="(item, index) in salesOrder.items" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td>
          <nuxt-link :to="`/hagul/inventory/materials/details?id=${item.material.id}`"
            class="tx-inverse tx-14 tx-medium d-block" v-text="item.material.name"></nuxt-link>
          <span v-if="item.material.code" class="tx-11 d-block">#{{ item.material.code }}</span>
          <span v-if="item.material.stock" class="tx-11 d-block">Stock: {{ item.material.stock }}</span>
        </td>
        <td>
          <span v-text="item.quantity"></span>
        </td>
        <td class="tx-right">
          <span v-if="item.materialCost" v-html="
            item.materialCost.currency.unicode +
            $options.filters.moneyFormat(item.materialCost.amount)
          "></span>
          <span v-else v-html="
            item.material.currency.unicode +
            $options.filters.moneyFormat(item.material.cost)
          "></span>
        </td>
        <td class="tx-right">
          <span v-if="item.materialCost" v-html="
            item.materialCost.currency.unicode +
            $options.filters.moneyFormat(
              item.materialCost.amount * item.quantity
            )
          "></span>
          <span v-else v-html="
            item.material.currency.unicode +
            $options.filters.moneyFormat(item.material.cost * item.quantity)
          "></span>
        </td>
      </tr>
      <tr>
        <td colspan="3" rowspan="4" class="valign-middle"></td>
        <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
          Estimated Total
        </td>
        <td colspan="1" class="tx-right">
          <h4 class="tx-primary tx-bold tx-lato" v-html="
            salesOrder.currency.unicode + $options.filters.moneyFormat(total)
          "></h4>
        </td>
      </tr>
    </table>

    <div class="form-layout-footer tx-center">
      <dispatch @update="$emit('update')" v-if="stockIsSufficient" :salesOrder="salesOrder" />
    </div>
  </div>
  <!-- table-responsive -->
</template>

<script>
import dispatch from "@/components/hagul/inventory/sales-orders/dispatch.vue";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { dispatch, vButton, vModal, vSelect },
  computed: {
    stockIsSufficient() {
      var stockIsSufficient = true;
      for (const item of this.salesOrder.items) {
        if (item.material.stock < item.quantity) {
          stockIsSufficient = false;
        }
      }
      return stockIsSufficient;
    },
    total() {
      return this.salesOrder.items.reduce((total, item) => {
        const cost = item.materialCost
          ? item.materialCost.amount
          : item.material.cost;
        return total + cost * item.quantity;
      }, 0);
    }
  },
  created() {
    this.getOrgMaterials();
    this.populateItems();
  },
  data: () => ({
    disabled: false,
    disableDelete: false,
    items: [],
    itemToDelete: null,
    itemToDeleteIndex: null,
    materials: [],
    validationErrors: {}
  }),
  methods: {
    add1Item() {
      this.items.push({
        material: {},
        materials: [],
        quantity: null,
        delivery_type_id: 1
      });
      this.setItemMaterials();
      this.validationErrors["item_id" + (this.items.length - 1)] = null;
      this.validationErrors["item_quantity" + (this.items.length - 1)] = null;
    },
    deleteItem() {
      if (!this.itemToDelete.id) {
        this.items.splice(this.itemToDeleteIndex, 1);
        delete this.validationErrors["item_id" + this.itemToDeleteIndex];
        delete this.validationErrors["item_quantity" + this.itemToDeleteIndex];
        this.closeModal("delete-sales-order-item-modal");
        return true;
      }

      this.disableDelete = true;
      this.$axios
        .delete("sales-order-items/" + this.itemToDelete.id)
        .then((response) => {
          this.disableDelete = false;
          this.items.splice(this.itemToDeleteIndex, 1);
          delete this.validationErrors["item_id" + this.itemToDeleteIndex];
          delete this.validationErrors[
            "item_quantity" + this.itemToDeleteIndex
          ];
          this.$emit("update");
          this.closeModal("delete-sales-order-item-modal");
        })
        .catch((error) => {
          this.disableDelete = false;
          console.log(error);
        });
    },
    getOrgMaterials() {
      const byOrganizationId = this.salesOrder.organization_id;
      this.loading = true;
      this.$axios
        .get("materials", { params: { byOrganizationId } })
        .then((response) => {
          this.materials = response.data.data;
          this.setItemMaterials();
        });
    },
    populateItems() {
      this.items = [];
      for (const item of this.salesOrder.items) {
        this.items.push(Object.assign({}, item));
        this.setItemMaterials();
      }
    },
    setItemMaterials() {
      this.items = this.items.map((item) => {
        item.materials = this.materials.filter(
          (material) =>
            !this.items.find(
              (item2) =>
                material.id ==
                (item2.material == null ? null : item2.material.id)
            ) ||
            material.id == (item.material == null ? null : item.material.id)
        );
        return item;
      });
    },
    submitSalesOrderItems() {
      if (!this.validateForm("edit-sales-order-items")) {
        return false;
      }

      this.disabled = true;
      const material_id = this.items.map((item) => item.material.id);
      const material_name = this.items.map((item) => item.material.name);
      const quantity = this.items.map((item) => parseFloat(item.quantity));
      const delivery_type_id = this.items.map((item) => item.delivery_type_id);
      const sales_order_id = this.salesOrder.id;

      this.$axios
        .post("sales-order-items/store-many", {
          material_id,
          material_name,
          quantity,
          delivery_type_id,
          sales_order_id
        })
        .then((response) => {
          this.disabled = false;
          this.$emit("update");
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
  mixins: [formMixin, modalMixin],
  props: ["salesOrder"],
  watch: {
    salesOrder(val) {
      this.populateItems();
      this.getOrgMaterials();
    }
  }
};
</script>
