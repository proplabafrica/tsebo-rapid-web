<template>
  <form v-if="editedMaterial" id="edit-material-form" class="mg-t-10">
    <div class="form-layout pd-l-10">
      <div class="row mg-md-b-20">
        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Material Name
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Material Name" name="name"
                v-model="editedMaterial.name" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.name" v-text="validationErrors.name"></small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Material Number
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-grid-view-outline tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Material Number" name="code"
                v-model="editedMaterial.code" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.code" v-text="validationErrors.code"></small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Material Cost
              <span class="tx-danger">*</span>
              <span>(&#8358;{{ material.cost | moneyFormat }})</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-pricetag tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="number" step="any" class="form-control" placeholder="Material Cost" name="cost"
                v-model="editedMaterial.cost" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.cost" v-text="validationErrors.cost"></small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Minimum Stock Level
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-android-radio-button-off tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="number" step="any" class="form-control" placeholder="Minimum Stock Level" name="min_stock"
                v-model="editedMaterial.min_stock" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.min_stock"
              v-text="validationErrors.min_stock"></small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">
              Maximum Stock Level
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-android-radio-button-on tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="number" step="any" class="form-control" placeholder="Maximum Stock Level" name="max_stock"
                v-model="editedMaterial.max_stock" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.max_stock"
              v-text="validationErrors.max_stock"></small>
          </div>
        </div>

        <div class="col-md-6" v-if="false">
          <div class="form-group">
            <label class="form-control-label">
              Current Stock Level
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-stats-bars tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="number" step="any" class="form-control" placeholder="Current Stock Level" name="stock"
                v-model="editedMaterial.stock" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.stock" v-text="validationErrors.stock"></small>
          </div>
        </div>

        <div class="col-md-6">
          <div class="form-group">
            <label class="form-control-label">Material Categories</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-filing-outline tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <v-select class="form-control" name="material_category_ids" label="name" placeholder="Pick Categories"
                aria-multiselectable multiple selectOnTab :options="materialCategories"
                v-model="editedMaterial.categories" :disabled="materialCategoriesLoading"></v-select>
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.material_category_ids"
              v-text="validationErrors.material_category_ids"></small>
          </div>
        </div>
      </div>
      <div class="form-layout-footer tx-center">
        <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="updateMaterial()">UPDATE</v-button>
      </div>
      <!-- form-layout-footer -->
    </div>
    <!-- form-layout -->
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import formMixin from "@/mixins/forms";

export default {
  components: { vButton, vSelect },
  created() {
    this.getMaterialCategories(this);
    this.setEditedMaterial();
  },
  data: () => ({
    disabled: false,
    editedMaterial: null,
    materialCategories: [],
    materialCategoriesLoading: true,
    validationErrors: {}
  }),
  methods: {
    ...mapActions({
      getMaterialCategories:
        "hagul/inventory/materialCategories/getMaterialCategories"
    }),
    setEditedMaterial() {
      const {
        categories,
        code,
        cost,
        name,
        min_stock,
        max_stock,
        stock
      } = this.material;

      this.editedMaterial = {
        categories,
        code,
        cost,
        name,
        min_stock,
        max_stock,
        stock
      };
    },
    async updateMaterial() {
      if (!this.validateForm("edit-material-form")) return false;
      this.disabled = true;

      const material_category_ids = this.editedMaterial.categories.map(
        (category) => category.id
      );

      try {
        await this.$axios.put(`materials/${this.material.id}`, {
          ...this.editedMaterial,
          material_category_ids
        });
        this.disabled = false;
        this.$emit("update");
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {}
      }
    }
  },
  mixins: [formMixin],
  props: ["material"]
};
</script>
