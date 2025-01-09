<template>
  <form id="work-request-items-form" class="pd-30 bg-white"
    v-if="workRequest.status.code == '01' || workRequest.status.code == '05'">
    <div class="row">
      <div class="col-md-6 form-group" v-if="workRequest.type.code != 'project'">
        <!-- {{ trades }} -->
        <!-- {{ editedWorkRequest.trade }} -->
        <label class="form-control-label">
          Select Trade
          <span class="tx-danger">*</span>
        </label>
        <v-select class="form-control" label="name" placeholder="Select Trades" selectOnTab :options="trades"
          v-model="editedWorkRequest.trade"></v-select>
        <input type="text" class="d-none" name="trade_id"
          :value="editedWorkRequest.trade ? editedWorkRequest.trade.id : ''" required />
        <small class="tx-bold tx-danger" v-text="validationErrors.trade_id"></small>
      </div>
      <div class="col-md-6 form-group" v-if="workRequest.type.code != 'project'">
        <!-- <div
        class="d-flex flex-row align-items-center justify-content-center mg-t-6"
        >
            <div class="text-center text-uppercase fw-semibold mx-1 mg-t-2" style="position: relative; top: -4px">
              {{workRequest}}
            </div>
        </div> -->
        <label class="form-control-label">
          Service Type
          <span class="tx-danger">*</span>
        </label>
        <select class="form-control" name="sla_id" v-model="editedWorkRequest.sla_id" required>
          <option :value="null">Select One</option>
          <option v-for="sla in slasByPriority" :key="sla.id" :value="sla.id" v-text="sla.name"></option>
        </select>
        <small class="tx-bold tx-danger" v-text="validationErrors.sla_id"></small>
      </div>

      <div class="col-md-6 form-group" v-if="workRequest.type.code == 'project'">
        <label for="expected_time" class="form-control-label">
          Expected Time
          <span class="tx-danger">*</span>
        </label>
        <div class="input-group">
          <input type="number" name="expected_time" placeholder="Expected Time" class="form-control"
            v-model="editedWorkRequest.expected_time" required />
          <select name="expected_time_measurement" v-model="editedWorkRequest.expected_time_measurement"
            class="form-control" required>
            <option :value="null">Select Unit</option>
            <option v-for="measurement in ['hours', 'days', 'weeks']" :key="measurement" :value="measurement"
              v-text="measurement"></option>
          </select>
        </div>
        <small class="tx-bold tx-danger" v-if="validationErrors.expected_time"
          v-text="validationErrors.expected_time"></small>
        <small class="tx-bold tx-danger float-right" v-if="validationErrors.expected_time_measurement"
          v-text="validationErrors.expected_time_measurement"></small>
      </div>

      <div class="col-12 row mg-t-10 form-group">
        <div class="col-6 col-lg-3" @click="typeChanged(false)">
          <label class="rdiobox">
            <input name="radio" type="radio" v-model="editedWorkRequest.outsourced" :value="0" />
            <span>In House</span>
          </label>
        </div>
        <!-- col-3 -->
        <div class="col-6 col-lg-3" @click="typeChanged(true)">
          <label class="rdiobox">
            <input name="radio" type="radio" v-model="editedWorkRequest.outsourced" :value="1" />
            <span>Out Sourced</span>
          </label>
        </div>
        <!-- col-3 -->
      </div>
      <div class="form-group col-md-8 mg-t-10" v-if="editedWorkRequest.outsourced == 0">
        <label for="description" class="form-control-label">FM Problem Description</label>
        <textarea name="description" v-model="editedWorkRequest.description" class="form-control"
          placeholder="FM Problem Description"></textarea>
      </div>
      <div class="col-md-6 form-group" v-if="editedWorkRequest.outsourced == 0">
        <label class="form-control-label">
          Select Technicians
          <span class="tx-danger">*</span>
        </label>
        <v-select aria-multiselectable class="form-control" label="name" multiple placeholder="Select Technicians"
          selectOnTab :options="technicians" v-model="editedWorkRequest.technicians"></v-select>
      </div>

      <div class="col-md-6 form-group" v-if="editedWorkRequest.outsourced == 0">
        <label class="form-control-label">Select Equipment</label>
        <v-select aria-multiselectable class="form-control" label="name" multiple placeholder="Select Equipment"
          selectOnTab :options="equipmentList" v-model="editedWorkRequest.equipment"></v-select>
      </div>
    </div>
    <!-- row -->

    <div class="slim-card-title">Items</div>
    <span class="btn btn-primary" v-if="editedWorkRequest.items.length < 1" @click="add1Item()">ADD ITEMS</span>
    <div class="row mg-t-20 items-input" v-for="(item, index) in editedWorkRequest.items" :key="`item-${index}`">
      <div class="form-group col-md-4" v-if="editedWorkRequest.outsourced">
        <label class="form-control-label">
          Delivery Type
          <span class="tx-danger">*</span>
        </label>
        <select v-model="item.deliveryType" required class="form-control">
          <option v-for="type in deliveryTypes" :key="type.id" :value="type" v-text="type.name"></option>
        </select>
        <input type="text" class="d-none" :value="item.deliveryType.id" :name="`delivery_type_id${index}`"
          title="Please select an item in the list" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`delivery_type_id${index}`]"></small>
      </div>

      <div class="form-group col-md-5" v-if="item.deliveryType.code == 'material'">
        <label class="form-control-label">
          Material
          <!-- <span class="tx-danger">*</span> -->
        </label>
        <v-select placeholder="Material" class="form-control" label="name" selectOnTab :options="item.materials"
          v-model="item.material" @change="setItemMaterials()" @search="searchMaterials">
          <template slot="no-options">type to search materials...</template>
        </v-select>
        <input class="d-none" :name="'material_name' + index" v-if="item.material" v-model="item.material.name"
          required />
        <small class="tx-bold tx-danger" v-text="validationErrors['material_name' + index]"></small>
        <small class="tx-bold" :class="[
      parseFloat(item.material.stock) >= item.quantity
        ? 'tx-success'
        : 'tx-danger'
    ]" v-text="`Material Stock: ${parseFloat(item.material.stock)}`" v-if="item.material"></small>
      </div>

      <div class="form-group col-md-4" v-if="item.deliveryType.code == 'service'">
        <label class="form-control-label">
          Service
          <!-- <span class="tx-danger">*</span> -->
        </label>
        <v-select placeholder="Service" class="form-control" label="name" selectOnTab :options="item.services"
          v-model="item.service" @change="setItemServices()" @search="searchServices">
          <template slot="no-options">type to search services...</template>
        </v-select>
        <input class="d-none" :name="'service_name' + index" v-if="item.service" v-model="item.service.name" required />
        <small class="tx-bold tx-danger" v-text="validationErrors['service_name' + index]"></small>
      </div>

      <div class="form-group col-md-3">
        <label class="form-control-label">
          Quantity
          <!-- <span class="tx-danger">*</span> -->
        </label>
        <input type="number" class="form-control" step="any" v-model="item.quantity" placeholder="Quantity"
          :name="`item-quantity${index}`" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`item-quantity${index}`]"></small>
      </div>

      <div class="col-12 tx-center">
        <span @click="add1Item()" class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10">
          <div class="tx-20">+</div>
        </span>
        <span v-modal-open="'delete-work-request-item-modal'" @click="
      itemToDelete = item;
    itemToDeleteIndex = index;
    " class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
      </div>

    </div>
    <div class="form-layout-footer tx-center mg-t-20">
      <v-button class="btn btn-primary mg-5" @click="submitJobScoping()" :disabled="disabled">SAVE DRAFT</v-button>
      <request-delivery class="mg-5 d-inline" v-if="workRequest.status.code == '05'" :workRequest="workRequest"
        @update="$emit('update')" />
    </div>
    <v-modal ref="delete-work-request-item-modal" v-if="itemToDelete">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'delete-work-request-item-modal'" aria-label="Close">
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
            <v-button type="button" class="btn btn-danger pd-x-25" :disabled="disableDelete" @click="deleteItem()">
              <i class="icon ion-ios-checkmark-outline"></i> Delete
            </v-button>
            <button type="button" class="btn btn-primary pd-x-25" v-modal-close="'delete-work-request-item-modal'"
              aria-label="Close" :disabled="disableDelete">
              <i class="icon ion-ios-close-outline"></i> Cancel
            </button>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </form>
  <job-description :workRequest="workRequest" v-else />
</template>

<script>
import { mapActions } from "vuex";
import jobDescription from "@/components/maintenance/requests/job-description";
import requestDelivery from "@/components/maintenance/requests/request-delivery";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import slaMixin from "@/mixins/performance/sla";
import modalMixin from "@/mixins/modal";
import onboardingMixin from "@/mixins/onboarding";

export default {
  components: { jobDescription, requestDelivery, vButton, vModal, vSelect },
  computed: {
    slasByPriority() {
      if (!this.editedWorkRequest.trade.id) return [];
      return this.slas
        .filter(
          (sla) => sla.trade_id == this.editedWorkRequest.trade.id
          // &&
          // sla.measurement_id !== null
        )
        .filter(
          (sla) =>
            sla.parent_sla_id == null || sla.unit_id == this.workRequest.unit.id
        );
    }
  },
  async created() {
    this.$root.$refs.scopeJob = this;
    // await this.getRoles({
    //   byOrganizationIds: this.authUser.organizations.map((org) => org.id)
    // });
    // const fmRole = this.roles.find((role) => role.code == "TCHN");
    this.getSlaPriorities(this);
    this.getSlas(this);
    this.getDeliveryTypes(this);
    this.getTechnicians(this);
    this.getTrades(this);
    // this.getWorkRquestItem()
  },
  data: () => ({
    editedWorkRequest: {
      description: "",
      failure_type_id: null,
      items: [],
      sla_id: null,
      outsourced: false,
      technicians: [],
      trade: {},
      equipment_ids: [],
      expected_time: null,
      expected_time_measurement: null,
    },
    deliveryTypes: [],
    disabled: false,
    disableDelete: false,
    itemToDelete: null,
    itemToDeleteIndex: null,
    materials: [],
    services: [],
    slas: [],
    slaEntityCodes: ["WKR"],
    slasLoading: true,
    slaPriorities: [],
    slaPriorityCode: null,
    technicians: [],
    trades: [],
    validationErrors: {},
    equipmentList: [],
    slaPriorities: [],
    roles: [],
    rolesLoading: true
  }),
  head: () => ({
    title: "Job Scope · VampFi"
  }),
  meta: {
    pageName: "maintenance.work-requests.create"
  },
  methods: {
    ...mapActions({
      getDeliveryTypes: "hagul/getDeliveryTypes",
      getMaterials: "hagul/inventory/materials/getMaterials",
      getServices: "hagul/inventory/services/getServices",
      getSlas: "performance/slas/getSlas",
      getSlaPriorities: "performance/slaPriorities/getSlaPriorities",
      getTechnicians: "people/technicians/getTechnicians",
      getTrades: "people/trades/getTrades"
    }),
    // getWorkRquestItem(){
    //   "enter his gates..", this.authUser.organizations.map((org) => org.id)[0]);
    //   "working for the request..", this.trades);
    //   "object", this.slas.filter(sla => "first", sla.organization_id === 1))
    //   );

    // },
    add1Item() {
      this.editedWorkRequest.items.push({
        deliveryType: {},
        material: null,
        materials: [],
        quantity: null,
        service: null,
        services: []
      });
      this.setItemMaterials();
      this.setItemServices();
      this.setDeliveryTypes();
    },
    async deleteItem() {
      if (!this.itemToDelete.id) {
        this.editedWorkRequest.items.splice(this.itemToDeleteIndex, 1);
        delete this.validationErrors["item_id" + this.itemToDeleteIndex];
        delete this.validationErrors["item_quantity" + this.itemToDeleteIndex];
        this.setItemMaterials();
        this.setItemServices();
        this.closeModal("delete-work-request-item-modal");
        return true;
      }

      this.disableDelete = true;

      try {
        const response = await this.$axios.delete(
          "work-request-items/" + this.itemToDelete.id
        );
        this.disableDelete = false;
        this.editedWorkRequest.items.splice(this.itemToDeleteIndex, 1);
        delete this.validationErrors["item_id" + this.itemToDeleteIndex];
        delete this.validationErrors["quantity" + this.itemToDeleteIndex];
        this.$emit("update");
        this.setItemMaterials();
        this.setItemServices();
        this.closeModal("delete-work-request-item-modal");
      } catch (error) {
        this.disableDelete = false;
        console.log(error);
      }
    },
    async searchMaterials(search, loading) {
      this.debounce(async () => {
        this.materials = [];
        if (!search) return this.setItemMaterials();
        loading(true);
        this.materialSearch = search;
        await this.getMaterials(this);
        this.setItemMaterials();
        loading(false);
      }, 500);
    },
    async searchServices(search, loading) {
      this.debounce(async () => {
        this.services = [];
        if (!search) return this.setItemServices();
        loading(true);
        this.serviceSearch = search;
        await this.getServices(this);
        this.setItemServices();
        loading(false);
        this.setItemServices();
      }, 500);
    },
    setDeliveryTypes() {
      if (this.editedWorkRequest.outsourced) {
        for (const code in this.editedWorkRequest.deliveryType) {
          // const code = this.editedWorkRequest.outsourced ? "service" : "material";
          const deliveryType = this.deliveryTypes.find(
            (type) => type.code == code
          );
          this.editedWorkRequest.items = this.editedWorkRequest.items.map(
            (item) => {
              item.deliveryType = deliveryType;
              return item;
            }
          );
        }
      } else {
        // const code = "material";
        const deliveryType = this.deliveryTypes.find(
          (type) => type.code == "material"
        );
        this.editedWorkRequest.items = this.editedWorkRequest.items.map(
          (item) => {
            item.deliveryType = deliveryType;
            return item;
          }
        );
      }
    },
    setEditedWorkRequest(workRequest) {
      var { description, sla_id, items, outsourced, technicians, trades, sla } =
        workRequest;
      items = items.map((item) => Object.assign({}, item));
      const expected_time = sla ? sla.expected_time : null;
      const expected_time_measurement = !sla
        ? null
        : !sla.measurement
          ? null
          : sla.measurement.code;
      technicians = technicians.map((technician) => {
        technician.name = technician.user.name;
        return technician;
      });
      var equipment;
      var newEquipmentArr = [];
      if (this.workRequest.clientRequest) {
        var newEquipmentArr = this.workRequest.clientRequest.equipment
          .map((obj) => Object.assign({}, obj))
          .map((obj) => {
            obj.name = `${obj.name} (${obj.code})`;
            return obj;
          });
      }

      equipment = newEquipmentArr;

      var newEquipmentListArr = this.workRequest.unit.equipment
        .map((obj) => Object.assign({}, obj))
        .map((obj) => {
          obj.name = `${obj.name} (${obj.code})`;
          return obj;
        });
      this.equipmentList = newEquipmentListArr;

      const trade = workRequest.trades.length > 0 ? workRequest.trades[0] : "";
      this.editedWorkRequest = Object.assign(
        {},
        {
          equipment,
          description,
          sla_id,
          items,
          outsourced,
          technicians,
          trade,
          expected_time,
          expected_time_measurement
        }
      );

      this.setItemMaterials();
      this.setItemServices();
      if (this.editedWorkRequest.items.length < 1) this.add1Item();
    },
    setItemMaterials() {
      this.editedWorkRequest.items = this.editedWorkRequest.items.map(
        (item) => {
          item.materials = this.materials.filter(
            (material) =>
              !this.editedWorkRequest.items.find(
                (item2) =>
                  material.id ==
                  (item2.material == null ? null : item2.material.id)
              ) ||
              material.id == (item.material == null ? null : item.material.id)
          );
          return item;
        }
      );
    },
    setItemServices() {
      this.editedWorkRequest.items = this.editedWorkRequest.items.map(
        (item) => {
          item.services = this.services.filter(
            (service) =>
              !this.editedWorkRequest.items.find(
                (item2) =>
                  service.id ==
                  (item2.service == null ? null : item2.service.id)
              ) || service.id == (item.service == null ? null : item.service.id)
          );
          return item;
        }
      );
    },
    async submitJobScoping() {
      if (!this.validateForm("work-request-items-form")) return false;

      this.disabled = true;


      const {
        description,
        failure_type_id,
        items,
        sla_id,
        outsourced,
        technicians,
        trade,
        equipment,
        expected_time,
        expected_time_measurement,
      } = this.editedWorkRequest;
      const technician_ids = technicians.map((technician) => technician.id);
      const equipment_ids = equipment.map((equipment) => equipment.id);
      const trade_ids = [trade.id];
      const work_request_id = this.workRequest.id;
      const delivery_type_id = items.map((item) => item.deliveryType.id);
      const item_id = items.map((item) =>
        item[item.deliveryType.code] ? item[item.deliveryType.code].id : null
      );
      const item_name = items.map((item) =>
        item[item.deliveryType.code] ? item[item.deliveryType.code].name : null
      );
      const quantity = items.map((item) =>
        item.quantity ? item.quantity : null
      );

      try {
        const response = await this.$axios.post("work-requests/job-scoping", {
          delivery_type_id,
          description,
          failure_type_id,
          item_id,
          item_name,
          sla_id,
          outsourced,
          quantity,
          technician_ids,
          trade_ids,
          work_request_id,
          equipment_ids,
          expected_time,
          expected_time_measurement,
        });
        this.disabled = false;
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {
        }
      }
    },
    typeChanged(value) {
      this.editedWorkRequest.outsourced = value;
      this.setDeliveryTypes();
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, formMixin, slaMixin, modalMixin, onboardingMixin],
  props: ["workRequest"],
  watch: {
    deliveryTypes(val) {
      this.setEditedWorkRequest(this.workRequest);
    },
    workRequest(val) {
      this.setEditedWorkRequest(val);
    }
  }
};
</script>
