<template>
  <form id="initiate-tender-process-form" class="mg-t-10">
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label class="form-control-label">
            Delivery Type
            <span class="tx-danger">*</span>
          </label>
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
              </span>
            </div>
            <select class="form-control" v-model="tenderProcess.deliveryType">
              <option :value="{}">Select Delivery Type</option>
              <option v-for="type in deliveryTypes" :key="type.id" :value="type" v-text="type.name"></option>
            </select>
          </div>
          <input type="text" class="d-none" v-model="tenderProcess.deliveryType.id" required name="delivery_type_id" />
          <small class="tx-bold tx-danger" v-if="validationErrors.delivery_type_id"
            v-text="validationErrors.delivery_type_id"></small>
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
                <v-select placeholder="Material" class="form-control" label="name" selectOnTab :options="item.materials"
                  v-model="item.material" taggable :createOption="(name) => ({ name, id: '' })"
                  @change="setItemMaterials()"></v-select>
                <input class="d-none" :name="'item_name' + index" v-model="item.material" required />
                <small class="tx-bold tx-danger" v-text="validationErrors['item_name' + index]"></small>
              </div>
              <div class="col pd-0">
                <input type="number" step="any" v-model="item.quantity" :name="'quantity' + index" class="form-control"
                  placeholder="Quantity" @change="setItemMaterials()" required />
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
      <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitTenderProcess()">SAVE</v-button>
    </div>
    <!-- form-layout-footer -->
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { vButton, vSelect },
  created() {
    this.setUserOrg();
    this.getDeliveryTypes(this);
    if (this.$route.query["sales-order-id"])
      this.setSalesOrder(this.$route.query["sales-order-id"]);
  },
  data: () => ({
    deliveryTypes: [],
    disabled: false,
    items: [],
    org: { materials: [] },
    salesOrder: null,
    tenderProcess: {
      deliveryType: {}
    },
    validationErrors: {}
  }),
  head: () => ({
    title: "Initiate Tender Process · Hagul"
  }),
  meta: {
    pageName: "tender-processes.store"
  },
  methods: {
    ...mapActions({
      getDeliveryTypes: "hagul/getDeliveryTypes"
    }),
    add1Item() {
      this.items.push({
        material: null,
        materials: [],
        quantity: null
      });
      this.setItemMaterials();
    },
    deleteItem(index) {
      this.items.splice(index, 1);
      this.setItemMaterials();
    },
    populateItems(items) {
      this.items = [];
      for (const item of items) {
        this.items.push(Object.assign({}, item));
      }
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
    setSalesOrder(id) {
      const { salesOrders } = this.$store.state.hagul.inventory.salesOrders;
      this.salesOrder = salesOrders.find((salesOrder) => salesOrder.id == id);
      if (this.salesOrder) {
        if (Array.isArray(this.salesOrder.items)) {
          this.populateItems(this.salesOrder.items);
          return (this.loading = false);
        }
      }

      this.$axios
        .get("sales-orders/" + id, {
          params: { associations: ["items.material"] }
        })
        .then((response) => {
          this.$store.commit(
            "hagul/inventory/salesOrders/setSalesOrder",
            response.data.salesOrder
          );
          this.salesOrder = this.salesOrder
            ? Object.assign({}, response.data.salesOrder)
            : response.data.salesOrder;
          this.loading = false;
          this.$store.commit("hagul/inventory/salesOrders/toggleRefresh");
          this.populateItems(this.salesOrder.items);
          this.setItemMaterials();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setUserOrg() {
      this.org = this.authUser.organizations[0];
      if (this.org) {
        if (Array.isArray(this.org.materials)) {
          return (this.orgLoading = false);
        }
      }

      this.$axios
        .get("organizations/" + this.org.id, {
          params: { associations: ["materials"] }
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
    submitTenderProcess() {
      if (!this.validateForm("initiate-tender-process-form")) {
        return false;
      }
      this.disabled = true;
      const sales_order_id = this.salesOrder ? this.salesOrder.id : null;
      const delivery_type_id = this.tenderProcess.deliveryType.id;
      const material_id = this.items.map(({ material }) => material.id);
      const material_name = this.items.map(({ material }) => material.name);
      const quantity = this.items.map((item) => parseFloat(item.quantity));

      this.$axios
        .post("tender-processes", {
          sales_order_id,
          delivery_type_id,
          material_id,
          material_name,
          quantity
        })
        .then((response) => {
          this.disabled = false;
          this.$store.commit(
            "hagul/purchase/tenderProcesses/setTenderProcess",
            response.data.tenderProcess
          );
          this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
          this.$router.push(
            `/hagul/purchase/tender-processes/details?id=${response.data.tenderProcess.id}`
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
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin],
  watch: {
    $route(to, from) {
      if (to.query["sales-order-id"]) {
        this.setSalesOrder(to.query["sales-order-id"]);
      }
    }
  }
};
</script>
