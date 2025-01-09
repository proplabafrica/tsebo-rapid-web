<template>
  <div class="row mg-t-10" v-if="!equipmentCategoriesLoading">
    <div class="col-md-3">
      <div class="card card-body pd-25">
        <h6 class="slim-card-title mg-b-20">Create Brand</h6>
        <form id="create-brand-form">
          <div class="form-group">
            <label class="form-control-label">
              Brand Name:
              <span class="tx-danger">*</span>
            </label>
            <input name="name" v-model="brand.name" class="form-control" required placeholder="Brand Name" />
            <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
          </div>

          <div class="form-group">
            <label class="form-control-label">
              Select Categories:
              <span class="tx-danger">*</span>
            </label>
            <v-select class="form-control" placeholder="Pick Categories" aria-multiselectable label="name" multiple
              selectOnTab :options="equipmentCategories" v-model="brand.equipment_category_ids"
              :reduce="(category) => category.id"></v-select>
            <input name="equipment_category_ids" :value="brand.equipment_category_ids" required class="d-none" />
            <small class="tx-bold tx-danger" v-text="validationErrors.equipment_category_ids"></small>
          </div>
        </form>
        <v-button :disabled="disabled" @click="submitBrand()" class="btn btn-primary btn-block">SUBMIT</v-button>
      </div>
      <!-- card -->
    </div>
    <v-paginate class="col mg-t-10 mg-md-0" :list="equipmentBrands" perPage="30">
      <template v-slot="paginate">
        <div class="row">
          <div class="col-md-6 col-lg-4 pd-md-0" v-for="equipmentBrand in paginate.list" :key="equipmentBrand.id">
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <div class="d-flex justify-content-between">
                  <p class="mg-b-0">
                    <strong class="tx-inverse tx-medium" v-text="equipmentBrand.name"></strong>
                    <i class="icon ion-trash-a tx-16 tx-danger cursor-pointer float-right d-none"></i>
                    <span class="text-muted d-block">
                      <span v-for="(category, index) in equipmentBrand.categories" :key="category.id">{{ category.name
                      }}{{
                        index + 1 >= equipmentBrand.categories.length
                        ? ""
                        : ", "
                        }}</span>
                    </span>
                  </p>
                  <span v-modal-open="'delete-modal'" @click="equipmentBrandToDelete = equipmentBrand">
                    <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <v-modal ref="delete-modal">
          <div class="modal-dialog wd-300 wd-sm-400" role="document">
            <div class="modal-content tx-size-sm">
              <div class="modal-body tx-center pd-y-20 pd-x-20">
                <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 style="font-size: 16px" class="mg-b-20">
                  Are you sure you want to delete
                  <span v-text="equipmentBrandToDelete.name"></span>
                </h4>
                <div class="form-layout-footer">
                  <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                    @click="deleteEquipmentBrand()">
                    <i class="icon ion-ios-checkmark-outline"></i>
                    Confirm
                  </v-button>
                  <button style="border-radius: 8px" type="button" class="btn btn-danger pd-x-4"
                    v-modal-close="'delete-modal'" aria-label="Close" :disabled="disabled">
                    <i class="icon ion-ios-close-outline"></i> Cancel
                  </button>
                </div>
              </div>
              <!-- modal-body -->
            </div>
            <!-- modal-content -->
          </div>
          <!-- modal-dialog -->
        </v-modal>
        <!-- row -->
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
  </div>
  <loading v-else />
</template>

<script>
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vPaginate, vModal, vSelect },
  created() {
    this.getEquipmentBrands(this);
    this.getEquipmentCategories(this);
  },
  data: () => ({
    brand: {
      name: "",
      equipment_category_ids: []
    },
    disabled: false,
    equipmentBrands: [],
    equipmentBrandToDelete: [],
    equipmentBrandsLoading: true,
    equipmentCategories: [],
    equipmentCategoriesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Equipment Brands · Tsebo-Rapid"
  }),
  meta: {
    pageName: "equipment-brands.index"
  },
  methods: {
    async deleteEquipmentBrand() {
      let equipmentBrand = this.equipmentBrandToDelete;
      const { categories } = equipmentBrand;
      const equipment_category_ids = categories.map((category) => category.id);
      try {
        const response = await this.$axios.delete(
          `equipment-brands/${equipmentBrand.id}`,
          { equipment_category_ids }
        );
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Equipment Brand Deleted"
        });
        this.$router.go();
        this.$store.commit("assets/equipmentBrands/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Equipment Brand"
        });
      }
    },
    ...mapActions({
      getEquipmentBrands: "assets/equipmentBrands/getEquipmentBrands",
      getEquipmentCategories:
        "assets/equipmentCategories/getEquipmentCategories"
    }),
    async submitBrand() {
      if (!this.validateForm("create-brand-form")) return false;
      this.disabled = true;

      try {
        const response = await this.$axios.post("equipment-brands", this.brand);
        this.disabled = false;
        this.brand = Object.assign(
          {},
          { name: "", equipment_category_ids: [] }
        );
        this.$store.commit(
          "assets/equipmentBrands/setEquipmentBrand",
          response.data.equipmentBrand
        );
        this.$store.commit("assets/equipmentBrands/toggleRefresh");
        this.toast({ type: "info", title: "Brand Added" });
        this.getEquipmentBrands();
        location.reload()
      } catch (error) {
        console.log(error);
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else {
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [formMixin, modalMixin]
};
</script>
