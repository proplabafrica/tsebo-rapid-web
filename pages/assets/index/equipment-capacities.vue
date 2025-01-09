<template>
  <div class="row mg-t-10" v-if="!equipmentCapacitiesLoading">
    <div class="col-md-3">
      <div class="card card-body pd-25">
        <h6 class="slim-card-title mg-b-20">Create Specification</h6>
        <form id="create-capacity-form">
          <div class="form-group">
            <label class="form-control-label">
              Details:
              <span class="tx-danger">*</span>
            </label>
            <input name="name" v-model="capacity.name" class="form-control" required placeholder="Details" />
            <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
          </div>
          <div class="form-group">
            <label class="form-control-label">
              Select Categories:
              <span class="tx-danger">*</span>
            </label>
            <v-select class="form-control" placeholder="Pick Categories" aria-multiselectable label="name" multiple
              selectOnTab :options="equipmentCategories" v-model="capacity.equipment_category_ids"
              :reduce="(category) => category.id"></v-select>
            <input name="equipment_category_ids" :value="capacity.equipment_category_ids" required class="d-none" />
            <small class="tx-bold tx-danger" v-text="validationErrors.equipment_category_ids"></small>
          </div>

          <div class="form-group" v-if="false">
            <label class="form-control-label">
              Select Brands:
              <span class="tx-danger">*</span>
            </label>
            <v-select class="form-control" placeholder="Pick Brands" aria-multiselectable label="name" multiple
              selectOnTab :options="equipmentBrands" v-model="capacity.equipment_brand_ids"
              :reduce="(brand) => brand.id"></v-select>
            <input name="equipment_brand_ids" :value="capacity.equipment_brand_ids" required class="d-none" />
            <small class="tx-bold tx-danger" v-text="validationErrors.equipment_brand_ids"></small>
          </div>
        </form>
        <v-button :disabled="disabled" @click="submitCapacity()" class="btn btn-primary btn-block">SUBMIT</v-button>
      </div>
      <!-- card -->
    </div>
    <v-paginate class="col mg-t-10 mg-md-0" v-if="!equipmentCapacitiesLoading" :list="equipmentCapacities" perPage="60">
      <template v-slot="paginate">
        <div class="row">
          <div class="col-md-6 col-lg-4 pd-md-0" v-for="equipmentCapacity in paginate.list"
            :key="`capacity-${equipmentCapacity.id}`">
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <div class="d-flex justify-content-between">
                  <p class="mg-b-0">
                    <strong class="tx-inverse tx-medium" v-text="equipmentCapacity.name"></strong>
                    <i class="icon ion-trash-a tx-16 tx-danger cursor-pointer float-right d-none"></i>
                    <span class="d-block">
                      <span class="tx-12" v-for="(brand, index) in equipmentCapacity.brands"
                        :key="`brand-${brand.id}`">{{ brand.name
                        }}{{
                        index + 1 >= equipmentCapacity.brands.length
                        ? ""
                        : ", "
                        }}</span></span>
                    <span class="d-block">
                      <span class="tx-12" v-for="(
                          category, index
                        ) in equipmentCapacity.categories" :key="`category-${category.id}`">{{ category.name
                        }}{{
                        index + 1 >= equipmentCapacity.categories.length
                        ? ""
                        : ", "
                        }}</span></span>
                  </p>
                  <span v-modal-open="'delete-modal'" @click="equipmentCapacitiesToDelete = equipmentCapacity">
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
                  <span v-text="equipmentCapacitiesToDelete.name"></span>
                </h4>
                <div class="form-layout-footer">
                  <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                    @click="deleteEquipmentCapacity()">
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
    <!-- v-paginate -->
    <loading v-else />
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
  components: { loading, vButton, vPaginate, vSelect, vModal },
  created() {
    this.getEquipmentBrands(this);
    this.getEquipmentCategories(this);
    this.getEquipmentCapacities(this);
  },
  data: () => ({
    equipmentCapacitiesToDelete: [],
    capacity: {
      name: "",
      equipment_brand_ids: [],
      equipment_category_ids: []
    },
    disabled: false,
    equipmentBrands: [],
    equipmentCategories: [],
    equipmentCapacities: [],
    equipmentCapacitiesLoading: true,
    loading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Equipment Capacities · Tsebo-Rapid"
  }),
  meta: {
    pageName: "equipment-capacities.index"
  },
  methods: {
    async deleteEquipmentCapacity() {
      let equipmentCapacity = this.equipmentCapacitiesToDelete;
      const { categories, brands } = equipmentCapacity;
      const equipment_category_ids = categories.map((category) => category.id);
      const brand_ids = brands.map((brand) => brand.id);
      try {
        const response = await this.$axios.delete(
          `equipment-capacities/${equipmentCapacity.id}`,
          { equipment_category_ids, brand_ids }
        );
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Equipment Capactiy Deleted"
        });
        this.$router.go();
        this.$store.commit("assets/equipmentCapacities/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Equipment Capacity"
        });
      }
    },
    ...mapActions({
      getEquipmentBrands: "assets/equipmentBrands/getEquipmentBrands",
      getEquipmentCategories:
        "assets/equipmentCategories/getEquipmentCategories",
      getEquipmentCapacities:
        "assets/equipmentCapacities/getEquipmentCapacities"
    }),
    async submitCapacity() {
      if (!this.validateForm("create-capacity-form")) return false;
      this.disabled = true;
      try {
        const response = await this.$axios.post(
          "equipment-capacities",
          this.capacity
        );
        this.disabled = false;
        this.capacity = Object.assign(
          {},
          { name: "", equipment_brand_ids: [], equipment_category_ids: [] }
        );
        this.$store.commit(
          "assets/equipmentCapacities/setEquipmentCapacity",
          response.data.equipmentCapacity
        );
        this.$store.commit("assets/equipmentCapacities/toggleRefresh");
        this.getEquipmentCapacities(this);
        this.toast({
          type: "info",
          title: "Capacity Added"
        });
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
