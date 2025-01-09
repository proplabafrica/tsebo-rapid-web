<template>
  <form id="create-sales-order-form" class="mg-t-10" v-if="false">
    <fieldset :disabled="orgLoading">
      <div class="form-layout">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">Unit</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="icon ion-location tx-16 lh-0 op-6"></i>
                  </span>
                </div>
                <select class="form-control" name="unit_id" v-model="salesOrder.unit_id">
                  <option value>Select Unit</option>
                  <option v-for="unit in org.units" :key="unit.id" :value="unit.id">
                    {{ unit.name }}
                    {{ unit.parent ? "(" + unit.parent.name + ")" : "" }}
                  </option>
                </select>
              </div>
              <small class="tx-bold tx-danger" v-if="validationErrors.unit_id"
                v-text="validationErrors.unit_id"></small>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">
                Requesting User
                <span class="tx-danger">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="icon ion-person tx-16 lh-0 op-6"></i>
                  </span>
                </div>
                <select class="form-control" name="requesting_user_id" v-model="salesOrder.requesting_user_id" required>
                  <option value>Select User</option>
                  <option v-for="user in org.users" :key="user.id" :value="user.id">
                    {{ user.name }}
                  </option>
                </select>
              </div>
              <small class="tx-bold tx-danger" v-if="validationErrors.requesting_user_id"
                v-text="validationErrors.requesting_user_id"></small>
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group">
              <label class="form-control-label">
                Request Type
                <span class="tx-danger">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="icon ion-bookmark tx-16 lh-0 op-6"></i>
                  </span>
                </div>
                <select class="form-control" name="sales_order_type_id" v-model="salesOrder.sales_order_type_id"
                  required>
                  <option value>Select Request Type</option>
                  <option v-for="type in salesOrderTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <small class="tx-bold tx-danger" v-if="validationErrors.sales_order_type_id"
                v-text="validationErrors.sales_order_type_id"></small>
            </div>
          </div>

          <div class="col-12">
            <a href="#" @click.prevent="add1Item()" class="btn btn-primary" v-if="items.length < 1">ADD ITEMS</a>
            <div class="form-group" v-else>
              <label class="form-control-label">Items</label>
              <div class="row">
                <div class="input-group items-input mg-b-10 pd-l-15 pd-r-15 col-md-6" v-for="(item, index) in items"
                  :key="`item-${index}`">
                  <div class="col pd-0">
                    <v-select placeholder="Material" class="form-control" label="name" selectOnTab
                      :options="item.materials" v-model="item.material" taggable
                      :createOption="(name) => ({ name, id: '' })" @change="setItemMaterials()"></v-select>
                    <input class="d-none" :name="'material_name' + index" v-model="item.material" required />
                    <small class="tx-bold tx-danger" v-text="validationErrors['material_name' + index]"></small>
                  </div>
                  <div class="col pd-0">
                    <input type="number" step="any" v-model="item.quantity" :name="'quantity' + index"
                      class="form-control" placeholder="Quantity" @change="setItemMaterials()" required />
                    <small class="tx-bold tx-danger" v-text="validationErrors['quantity' + index]"></small>
                  </div>
                  <div class="input-group-append cursor-pointer" @click="deleteItem(index)">
                    <span class="input-group-text bg-danger tx-white">
                      <i class="icon ion-trash-a tx-16 lh-0"></i>
                    </span>
                  </div>
                  <div class="input-group-append cursor-pointer" @click="add1Item()">
                    <span class="input-group-text">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- row -->

        <div class="form-layout-footer tx-center mg-t-20">
          <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitSalesOrder()">SUBMIT</v-button>
        </div>
        <!-- form-layout-footer -->
      </div>
    </fieldset>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  deliveryTypes: [],
  items: [],
  org: { materials: [], units: [], users: [] },
  organizations: [],
  orgLoading: false,
  salesOrder: {
    delivery_type_id: "",
    unit_id: "",
    requesting_user_id: "",
    sales_order_type_id: ""
  },
  salesOrderTypes: [],
  validationErrors: {}
});

export default {
  components: { vButton, vSelect },
  created() {
    this.add1Item();
    this.setUserOrg();
    this.getDeliveryTypes(this);
    this.getSalesOrderTypes(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Create Sales Order · Hagul"
  }),
  meta: {
    pageName: "hagul.inventory.sales-orders.create"
  },
  methods: {
    ...mapActions({
      getDeliveryTypes: "hagul/getDeliveryTypes",
      getSalesOrderTypes: "hagul/inventory/salesOrders/getSalesOrderTypes"
    }),
    add1Item() {
      this.items.push({
        material: {},
        materials: [],
        quantity: null,
        delivery_type_id: 1
      });
      this.setItemMaterials();
    },
    deleteItem(index) {
      this.items.splice(index, 1);
    },
    setItemMaterials() {
      this.items = this.items.map((item) => {
        item.materials = this.org.materials.filter(
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
    setUserOrg() {
      this.org = this.authUser.organizations[0];
      if (this.org)
        if (
          Array.isArray(this.org.materials) &&
          Array.isArray(this.org.units) &&
          Array.isArray(this.org.users)
        )
          return (this.orgLoading = false);

      this.$axios
        .get("organizations/" + this.org.id, {
          params: { associations: ["materials", "units.parent", "users"] }
        })
        .then((response) => {
          this.$store.commit(
            "onboarding/organizations/setOrganization",
            response.data.organization
          );
          this.org = this.org
            ? Object.assign({}, response.data.organization)
            : response.data.organization;
          this.orgLoading = false;
          this.shouldRefresh = false;
          this.setItemMaterials();
        })
        .catch((error) => {
          this.orgLoading = false;
          console.log(error);
        });
    },
    stockLeft(material) {
      var stockAdded = 0;
      for (const item of this.items) {
        if (item.material_id == material.id)
          stockAdded += parseFloat(item.quantity);
      }
      return parseFloat(material.stock) - stockAdded;
    },
    submitSalesOrder() {
      if (!this.validateForm("create-sales-order-form")) {
        return false;
      }
      this.disabled = true;
      const material_id = this.items.map((item) => item.material.id);
      const material_name = this.items.map((item) => item.material.name);
      const quantity = this.items.map((item) => parseFloat(item.quantity));
      const delivery_type_id = this.items.map((item) => item.delivery_type_id);
      const request = Object.assign(this.salesOrder, {
        material_id,
        material_name,
        quantity,
        delivery_type_id
      });

      this.$axios
        .post("sales-orders", request)
        .then((response) => {
          this.disabled = false;
          this.$store.commit(
            "hagul/inventory/salesOrders/setSalesOrder",
            response.data.salesOrder
          );
          var { organizations, salesOrderTypes } = this;
          var initialData = Object.assign(getInitialData(), {
            organizations,
            salesOrderTypes
          });
          Object.assign(this.$data, initialData);
          this.$store.commit("hagul/inventory/materials/toggleRefresh");
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.$router.push(
            `/hagul/inventory/sales-orders/details?id=${response.data.salesOrder.id}`
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
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, formMixin, hagulMixin, salesOrdersMixin]
};
</script>
