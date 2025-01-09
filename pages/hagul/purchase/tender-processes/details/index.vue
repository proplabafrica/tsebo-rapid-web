<template>
  <form id="edit-tender-process-items" class="mg-t-10" v-if="tenderProcess.status.code == 'pending'">
    <a href="#" @click.prevent="add1Item()" class="btn btn-primary" v-if="items.length < 1">ADD ITEMS</a>
    <div class="row mg-t-20" v-for="(item, index) in items" :key="`item-${index}`">
      <div class="form-group col-md-4" v-if="item.material || item.service">
        <label class="form-control-label">
          Delivery Type
          <span class="tx-danger">*</span>
        </label>
        <select v-model="item.deliveryType" :disabled="item.id" class="form-control">
          <option :value="{}">Select One</option>
          <option v-for="type in deliveryTypes" :key="type.id" :value="type" v-text="type.name"></option>
        </select>
        <input type="text" class="d-none" :value="item.deliveryType.id" :name="`delivery_type_id${index}`"
          title="Please select an item in the list" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`delivery_type_id${index}`]"></small>
      </div>

      <div class="form-group col-md-4" v-if="item.deliveryType && item.deliveryType.code == 'material'">
        <label class="form-control-label">
          Material
          <span class="tx-danger">*</span>
        </label>
        <v-select placeholder="Material" class="form-control" label="name" selectOnTab :options="item.materials"
          v-model="item.material" @change="setItemMaterials()" :disabled="item.id ? true : false"></v-select>
        <input class="d-none" :name="'material_name' + index" v-if="item.material" v-model="item.material.name"
          required />
        <small class="tx-bold tx-danger" v-text="validationErrors['material_name' + index]"></small>
        <small class="tx-bold" :class="[
          parseFloat(item.material.stock) >= item.quantity
            ? 'tx-success'
            : 'tx-danger'
        ]" v-text="`Material Stock: ${parseFloat(item.material.stock)}`" v-if="item.material"></small>
      </div>

      <div class="form-group col-md-4" v-if="item.deliveryType && item.deliveryType.code == 'service'">
        <label class="form-control-label">
          Service
          <span class="tx-danger">*</span>
        </label>
        <v-select placeholder="Service" class="form-control" label="name" selectOnTab :options="item.services"
          v-model="item.service" :disabled="false" @change="setItemServices()"></v-select>
        <input class="d-none" :name="'service_name' + index" v-if="item.service" v-model="item.service.name" required />
        <small class="tx-bold tx-danger" v-text="validationErrors['service_name' + index]"></small>
      </div>

      <div class="form-group col-md-4">
        <label class="form-control-label">
          Quantity
          <span class="tx-danger">*</span>
        </label>
        <input type="number" class="form-control" step="any" v-model="item.quantity" placeholder="Quantity" />
      </div>

      <div class="col-12 tx-center">
        <span @click="add1Item()" class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10">
          <div class="tx-20">+</div>
        </span>
        <span v-if="item.id" v-modal-open="'delete-tender-process-item-modal'" @click="
          itemToDelete = item;
        itemToDeleteIndex = index;
                  " class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
        <span v-else @click="deleteItem(item, index)"
          class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
      </div>
    </div>

    <div class="form-layout-footer tx-center mg-t-20">
      <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitTenderProcessItems()">SAVE</v-button>
    </div>
    <!-- form-layout-footer -->
    <v-modal ref="delete-tender-process-item-modal" v-if="itemToDelete">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'delete-tender-process-item-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <span class="tx-100 tx-warning lh-1 mg-t-20 d-inline-block">&#9888;</span>
            <h4 class="mg-b-20">
              Delete
              {{
                itemToDelete[itemToDelete.deliveryType.code]
                ? itemToDelete[itemToDelete.deliveryType.code].name
                : "this item"
              }}?
            </h4>
            <p class="mg-b-20 mg-x-20">
              Are you sure you want to delete
              {{
                itemToDelete[itemToDelete.deliveryType.code]
                ? itemToDelete[itemToDelete.deliveryType.code].name
                : "this item"
              }}
              from the Sales Order items list?
            </p>
            <button type="button" class="btn btn-primary pd-x-25" v-modal-close="'delete-tender-process-item-modal'"
              aria-label="Close" :disabled="disableDelete">
              <i class="icon ion-ios-close-outline"></i> Cancel
            </button>
            <v-button type="button" class="btn btn-danger pd-x-25" :disabled="disableDelete" @click="deleteItem()">
              <i class="icon ion-ios-checkmark-outline"></i> Delete
            </v-button>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </form>
  <div class="table-responsive mg-t-10" v-else>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tr v-for="(item, index) in tenderProcess.items" :key="item.id">
        <div v-if="item.material || item.service">
          <td>
            <span>{{ index + 1 }}</span>
          </td>
          <td>
            <nuxt-link :to="`/hagul/inventory/materials/details?id=${thisOrThat(item, ['material', 'service']).id
              }`" class="tx-inverse tx-14 tx-medium d-block" v-text="thisOrThat(item, ['material', 'service']).name">
            </nuxt-link>
            <span class="tx-11 d-block" v-if="item.material">#{{ thisOrThat(item, ["material", "service"]).code
            }}</span>
            <span class="tx-11 d-block" v-if="item.material">Stock: {{ thisOrThat(item, ["material", "service"]).stock
            }}</span>
          </td>
          <td>
            <span v-text="item.quantity"></span>
          </td>
        </div>
      </tr>
    </table>
  </div>
  <!-- table-responsive -->
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { vButton, vModal, vSelect },
  computed: {
    total() {
      var total = 0;
      for (const item of this.tenderProcess.items) {
        total +=
          this.thisOrThat(item, ["material", "service"]).cost * item.quantity;
      }
      return total;
    }
  },
  created() {
    this.populateItems();
    this.setUserOrg();
    this.getDeliveryTypes(this);
  },
  data: () => ({
    deliveryTypes: [],
    disabled: false,
    disableDelete: false,
    items: [],
    itemToDelete: null,
    itemToDeleteIndex: null,
    org: { materials: [], services: [] },
    orgLoading: true,
    validationErrors: {}
  }),
  methods: {
    ...mapActions({
      getDeliveryTypes: "hagul/getDeliveryTypes"
    }),
    add1Item() {
      this.items.push({
        deliveryType: {},
        material: null,
        materials: [],
        quantity: null,
        service: null,
        services: []
      });
      this.setItemMaterials();
      this.setItemServices();
    },
    deleteItem(itemToDelete = null, itemToDeleteIndex = null) {
      if (itemToDelete) this.itemToDelete = itemToDelete;
      if (itemToDeleteIndex) this.itemToDeleteIndex = itemToDeleteIndex;

      if (!this.itemToDelete.id) {
        this.items.splice(this.itemToDeleteIndex, 1);
        delete this.validationErrors["item_id" + this.itemToDeleteIndex];
        delete this.validationErrors["item_quantity" + this.itemToDeleteIndex];
        return true;
      }

      this.disableDelete = true;
      this.$axios
        .delete("tender-process-items/" + this.itemToDelete.id)
        .then((response) => {
          this.disableDelete = false;
          this.items.splice(this.itemToDeleteIndex, 1);
          delete this.validationErrors["item_id" + this.itemToDeleteIndex];
          delete this.validationErrors["quantity" + this.itemToDeleteIndex];
          this.$emit("update");
          this.closeModal("delete-tender-process-item-modal");
        })
        .catch((error) => {
          this.disableDelete = false;
          console.log(error);
        });
    },
    populateItems() {
      this.items = [];
      for (const item of this.tenderProcess.items) {
        this.items.push(Object.assign({}, item));
        this.setItemMaterials();
        this.setItemServices();
      }
      if (this.items.length < 1) this.add1Item();
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
    setItemServices() {
      this.items = this.items.map((item) => {
        item.services = this.org.services.filter(
          (service) =>
            !this.items.find(
              (item2) =>
                service.id == (item2.service == null ? null : item2.service.id)
            ) || service.id == (item.service == null ? null : item.service.id)
        );
        return item;
      });
    },
    setUserOrg() {
      var org = this.authUser.organizations[0];

      this.$axios
        .get("organizations/" + org.id, {
          params: {
            associations: ["materials", "services"]
          }
        })
        .then((response) => {
          this.$store.commit(
            "onboarding/organizations/setOrganization",
            response.data.organization
          );
          this.org = response.data.organization;
          this.orgLoading = false;
          this.setItemMaterials();
          this.setItemServices();
        })
        .catch((error) => {
          this.orgLoading = false;
          console.log(error);
        });
    },
    submitTenderProcessItems() {
      if (!this.validateForm("edit-tender-process-items")) {
        return false;
      }

      this.disabled = true;
      const material_id = this.items
        .filter((item) => item.deliveryType.code == "material")
        .map((item) => item.material.id);
      const material_name = this.items
        .filter((item) => item.deliveryType.code == "material")
        .map((item) => item.material.name);
      const service_id = this.items
        .filter((item) => item.deliveryType.code == "service")
        .map((item) => item.service.id);
      const service_name = this.items
        .filter((item) => item.deliveryType.code == "service")
        .map((item) => item.service.name);

      const quantity = this.items.map((item) => parseFloat(item.quantity));
      const delivery_type_id = this.items.map((item) => item.deliveryType.id);
      const tender_process_id = this.tenderProcess.id;

      this.$axios
        .post("tender-process-items/store-many", {
          delivery_type_id,
          material_id,
          material_name,
          quantity,
          service_id,
          service_name,
          tender_process_id
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
  mixins: [authMixin, formMixin, modalMixin],
  props: ["tenderProcess"],
  watch: {
    tenderProcess(val) {
      this.populateItems();
      this.setUserOrg();
    }
  }
};
</script>
