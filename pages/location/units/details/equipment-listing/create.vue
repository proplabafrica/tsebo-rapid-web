<template>
  <form id="add-equipment-form" class="bg-white pd-20">
    <div class="form-layout">
      <div class="row mg-b-20">
        <div class="form-group col-md-4">
          <label class="form-control-label">
            Category
            <span class="tx-danger">*</span>
          </label>
          <select v-model="equipment.equipment_category_id" @change="fetchCategoryProperties()" class="form-control"
            name="equipment_category_id">
            <option :value="null">Select a Category</option>
            <option v-for="category in equipmentCategories" :key="category.id" :value="category.id"
              v-text="category.name"></option>
          </select>
          <small class="tx-bold tx-danger" v-text="validationErrors.equipment_category_id"></small>
        </div>
        <div class="form-group col-md-4">
          <label class="form-control-label">
            Brand
            <span class="tx-danger">*</span>
          </label>
          <select v-model="equipment.equipment_brand_id" @change="fetchBrandProperties()" class="form-control"
            name="equipment_brand_id" :disabled="loadingOptions">
            <option :value="null">Select Brand</option>
            <option v-for="brand in equipmentBrands" :key="brand.id" :value="brand.id" v-text="brand.name"></option>
          </select>
          <small class="tx-bold tx-danger" v-text="validationErrors.equipment_brand_id"></small>
        </div>
        <div class="form-group col-md-4">
          <label class="form-control-label">
            Capacity
            <span class="tx-danger">*</span>
          </label>
          <select v-model="equipment.equipment_capacity_id" @change="fetchCapacityProperties()" class="form-control"
            name="equipment_capacity_id" :disabled="loadingOptions">
            <option :value="null">Select Capacity</option>
            <option v-for="capacity in equipmentCapacities" :key="capacity.id" :value="capacity.id"
              v-text="capacity.name"></option>
          </select>
          <small class="tx-bold tx-danger" v-text="validationErrors.equipment_capacity_id"></small>
        </div>
        <div class="form-group col-md-4">
          <label class="form-control-label">
            Specification:
            <span class="tx-danger">*</span>
          </label>
          <input name="name" v-model="equipment.name" class="form-control" required
            placeholder="Equipment Specification" />
          <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
        </div>
        <div class="form-group col-md-4">
          <label for class="form-control-label">
            Equipment Number:
            <span class="tx-danger">*</span>
          </label>
          <input type="text" class="form-control" name="code" placeholder="Equipment Number" v-model="equipment.code" />
          <small class="tx-bold tx-danger" v-text="validationErrors.code"></small>
        </div>
        <div class="col-lg-4 form-group">
          <label class="form-control-label">Attachment (Max 2MB)</label>
          <div class="custom-file">
            <input type="file" @change="
              convertToBase64($event).then((data) => {
                equipment.file = data.file;
                equipment.file_name = data.file_name;
              })
            " class="custom-file-input" name="image" title="Select a file 1MB or less" />
            <label class="custom-file-label" for="customFile" v-text="equipment.file_name"></label>
          </div>
          <!-- custom-file -->
          <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
        </div>
        <!-- col-4 -->
        <div class="form-group col-md-4">
          <label for class="form-control-label">
            Date Acquired:
            <span class="tx-danger">*</span>
          </label>
          <input type="date" class="form-control" name="acquired_at" placeholder="Date Acquired"
            v-model="equipment.acquired_at" />
          <small class="tx-bold tx-danger" v-text="validationErrors.acquired_at"></small>
        </div>
        <div class="form-group col-md-4">
          <label for="expected_time" class="form-control-label">
            Expected Life Cycle
            <span class="tx-danger">*</span>
          </label>
          <div class="input-group">
            <input type="number" name="oem_life_cycle" placeholder="Expected Life Cycle" class="form-control"
              v-model="equipment.oem_life_cycle" required />
            <select name="oem_life_cycle_measurement" v-model="equipment.oem_life_cycle_measurement"
              class="form-control" required>
              <option :value="null">Select Unit</option>
              <option v-for="measurement in ['hours', 'days', 'weeks', 'years']" :key="measurement" :value="measurement"
                v-text="measurement"></option>
            </select>
          </div>
          <small class="tx-bold tx-danger" v-if="validationErrors.oem_life_cycle"
            v-text="validationErrors.oem_life_cycle"></small>
          <small class="tx-bold tx-danger float-right" v-if="validationErrors.oem_life_cycle_measurement"
            v-text="validationErrors.oem_life_cycle_measurement"></small>
        </div>
        <div class="form-group col-md-4">
          <label class="form-control-label">Criticality</label>
          <select name="equipment_criticality_id" class="form-control" v-model="equipment.equipment_criticality_id">
            <option :value="null">Select One</option>
            <option v-for="criticality in equipmentCriticalities" :key="criticality.id" :value="criticality.id"
              v-text="criticality.name"></option>
          </select>
        </div>
      </div>
      <div class="form-layout-footer tx-center">
        <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitEquipment()">SUBMIT</v-button>
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
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vSelect },
  created() {
    this.getEquipmentCategories(this);
    this.getEquipmentCriticalities(this);
  },
  data: () => ({
    equipment: {
      acquired_at: null,
      code: null,
      equipment_brand_id: null,
      equipment_capacity_id: null,
      equipment_category_id: null,
      equipment_criticality_id: null,
      oem_life_cycle: null,
      oem_life_cycle_measurement: null,
      name: null,
      file: null,
      file_name: "Select File"
    },
    equipmentBrands: [],
    equipmentCategories: [],
    equipmentCapacities: [],
    equipmentCriticalities: [],
    equipmentSpecs: [],
    disabled: false,
    loadingOptions: false,
    validationErrors: {}
  }),
  methods: {
    ...mapActions({
      getEquipmentCategories:
        "assets/equipmentCategories/getEquipmentCategories",
      getEquipmentCriticalities:
        "assets/equipmentCriticalities/getEquipmentCriticalities"
    }),
    async fetchBrandProperties() {
      this.loadingOptions = true;
      try {
        const response = await this.$axios.get(
          "equipment-brands/" + this.equipment.equipment_brand_id,
          {
            params: { associations: ["capacities", "specifications"] }
          }
        );
        this.equipmentCapacities = response.data.equipmentBrand.capacities;
        this.equipmentSpecs = response.data.equipmentBrand.specifications;
        this.loadingOptions = false;
      } catch (error) {
        this.loadingOptions = false;
        console.log(error);
      }
    },
    async fetchCapacityProperties() {
      this.loadingOptions = true;
      try {
        const response = await this.$axios.get(
          "equipment-capacities/" + this.equipment.equipment_capacity_id,
          {
            params: { associations: ["specifications"] }
          }
        );
        this.equipmentSpecs = response.data.equipmentCapacity.specifications;
        this.loadingOptions = false;
      } catch (error) {
        this.loadingOptions = false;
        console.log(error);
      }
    },
    async fetchCategoryProperties() {
      this.loadingOptions = true;
      try {
        const response = await this.$axios.get(
          "equipment-categories/" + this.equipment.equipment_category_id,
          {
            params: { associations: ["brands"] }
          }
        );
        this.equipmentBrands = response.data.equipmentCategory.brands;
        this.loadingOptions = false;
      } catch (error) {
        this.loadingOptions = false;
        console.log(error);
      }
    },
    async submitEquipment() {
      if (!this.validateForm("add-equipment-form")) return false;
      this.disabled = true;

      try {
        const { unit } = this;
        const response = await this.$axios.post("equipment", {
          ...this.equipment,
          unit_id: unit.id,
          equipment_specification_id: 0
        });
        this.disabled = false;
        this.equipment = {
          acquired_at: null,
          code: null,
          equipment_brand_id: null,
          equipment_capacity_id: null,
          equipment_category_id: null,
          equipment_criticality_id: null,
          oem_life_cycle: null,
          oem_life_cycle_measurement: null,
          name: null,
          file: null,
          file_name: "Select File"
        };
        this.$store.commit(
          "assets/equipment/setEquipment",
          response.data.equipment
        );
        this.$emit("update");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        }
      }
    }
  },
  mixins: [formMixin],
  props: ["unit"]
};
</script>
