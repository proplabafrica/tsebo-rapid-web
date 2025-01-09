<template>
  <form id="edit-equipment-form" class="bg-white pd-20">
    <div class="form-layout">
      <div class="row mg-b-20">
        <div class="form-group col-md-3">
          <label for class="form-control-label">
            Equipment Name:
            <span class="tx-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            name="name"
            placeholder="Equipment Name"
            v-model="editedEquipment.name"
          />
          <small
            class="tx-bold tx-danger"
            v-text="validationErrors.name"
          ></small>
        </div>
        <div class="form-group col-md-3">
          <label for class="form-control-label">
            Equipment Number:
            <span class="tx-danger">*</span>
          </label>
          <input
            type="text"
            class="form-control"
            name="code"
            placeholder="Equipment Number"
            v-model="editedEquipment.code"
          />
          <small
            class="tx-bold tx-danger"
            v-text="validationErrors.code"
          ></small>
        </div>
        <div class="form-group col-md-5">
          <label for="expected_time" class="form-control-label">
            Expected Life Cycle
            <span class="tx-danger">*</span>
          </label>
          <div class="input-group">
            <input
              type="number"
              name="oem_life_cycle"
              placeholder="Expected Life Cycle"
              class="form-control"
              v-model="editedEquipment.oem_life_cycle"
              required
            />
            <select
              name="oem_life_cycle_measurement"
              v-model="editedEquipment.oem_life_cycle_measurement"
              class="form-control"
              required
            >
              <option :value="null">Select Unit</option>
              <option
                v-for="measurement in ['hours', 'days', 'weeks', 'years']"
                :key="measurement"
                :value="measurement"
                v-text="measurement"
              ></option>
            </select>
          </div>
          <small
            class="tx-bold tx-danger"
            v-if="validationErrors.oem_life_cycle"
            v-text="validationErrors.oem_life_cycle"
          ></small>
          <small
            class="tx-bold tx-danger float-right"
            v-if="validationErrors.oem_life_cycle_measurement"
            v-text="validationErrors.oem_life_cycle_measurement"
          ></small>
        </div>
        <div class="form-group col-md-4">
          <label class="form-control-label">Criticality</label>
          <select
            name="equipment_criticality_id"
            class="form-control"
            v-model="editedEquipment.equipment_criticality_id"
          >
            <option :value="null">Select One</option>
            <option
              v-for="criticality in equipmentCriticalities"
              :key="criticality.id"
              :value="criticality.id"
              v-text="criticality.name"
            ></option>
          </select>
        </div>
      </div>
      <div class="form-layout-footer tx-center">
        <v-button
          class="btn btn-primary bd-0"
          :disabled="disabled"
          @click="updateEquipment()"
          >SUBMIT</v-button
        >
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vSelect },
  created() {
    this.getEquipmentCategories(this);
    this.getEquipmentCriticalities(this);
    this.setEditedEquipment();
  },
  data: () => ({
    editedEquipment: null,
    equipmentBrands: [],
    equipmentCategories: [],
    equipmentCapacities: [],
    equipmentCriticalities: [],
    equipmentSpecs: [],
    disabled: false,
    loadingOptions: false,
    validationErrors: {} 
  }),
  head() {
    return {
      title: this.equipment
        ? `Settings · ${this.equipment.name} · ${this.authUser.organizations[0].name}`
        : `Equipment Settings · ${this.authUser.organizations[0].name}`
    };
  },
  methods: {
    ...mapActions({
      getEquipmentCategories:
        "assets/equipmentCategories/getEquipmentCategories",
      getEquipmentCriticalities:
        "assets/equipmentCriticalities/getEquipmentCriticalities"
    }),
    setEditedEquipment() {
      const {
        name,

        code, 
        oem_life_cycle,
        oemLifeCycleMeasurement,
        equipment_criticality_id
      } = this.equipment;
      const oem_life_cycle_measurement = oemLifeCycleMeasurement
        ? oemLifeCycleMeasurement.code
        : null;
      this.editedEquipment = Object.assign(
        {},
        {
          name,
          code,
          oem_life_cycle,
          oem_life_cycle_measurement,
          equipment_criticality_id
        }
      );
    },
    async updateEquipment() {
      if (!this.validateForm("edit-equipment-form")) return false;
      this.disabled = true;

      try {
        const { editedEquipment } = this;
        const response = await this.$axios.put(
          `equipment/${this.equipment.id}`,
          this.editedEquipment
        );
        this.disabled = false;
        this.toast({ type: "info", title: "Equipment Updated" });
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({ type: "danger", title: "Unable to Update Equipment" });
      }
    }
  },
  mixins: [authMixin, formMixin],
  props: ["equipment"]
};
</script>
