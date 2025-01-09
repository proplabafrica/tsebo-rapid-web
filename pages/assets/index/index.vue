<template>
  <div>
    <input type="text" placeholder="Start typing here to search"
      class="form-control wd-200 mg-t-5 mg-b-10 mg-x-0 float-left" v-model="equipmentListSearch" />
    <select class="form-control wd-200 mg-t-5 mg-b-10 float-right tx-capitalize" v-model="unitId">
      <option :value="null">
        {{ unitId ? "Show All" : "Filter By Unit" }}
      </option>
      <option v-for="unit in units" :key="`units-${unit.id}`" :value="unit.id">
        {{ unit.name }} <span v-if="unit.parent">({{ unit.parent.name }})</span>
      </option>
    </select>
    <b class="float-right pd-10" v-if="equipmentListSearch || unitId">{{ equipmentList.length }} Matches</b>
    <div class="float-left wd-100p">
      <v-paginate v-if="!equipmentListLoading" :list="equipmentList" perPage="60">
        <template v-slot="paginate">
          <div class="row mg-0" v-if="paginate.list.length > 0">
            <div class="col-md-4 col-lg-3 pd-md-0" v-for="equipment in paginate.list"
              :key="`equipment-${equipment.id}`">
              <ul class="list-group">
                <li class="list-group-item ht-100">
                  <div class="d-flex justify-content-between">
                    <p class="mg-b-0">
                      <nuxt-link class="d-block tx-inverse" :to="`/assets/equipment/details?id=${equipment.id}`">
                        <strong v-if="equipment.specification">{{
                        equipment.specification.name
                        }}</strong>
                        <strong v-else class="tx-medium" v-text="equipment.name"></strong>
                      </nuxt-link>
                      <span class="d-block tx-inverse" :class="equipmentClasses(equipment, 'capacities')" v-for="(capacity, index) in equipment.specification
                      .capacities" :key="`capacity-${capacity.id}`">{{ capacity.name
                      }}{{
                        index + 1 >= equipment.specification.capacities.length
                        ? ""
                        : ", "
                        }}</span>
                      <span class="d-block">
                        <span class="tx-inverse" :class="equipmentClasses(equipment, 'brands')" v-for="(brand, index) in equipment.specification
                        .brands" :key="`brand-${brand.id}`">{{ brand.name
                        }}{{
                          index + 1 >= equipment.specification.brands.length
                          ? ""
                          : ", "
                          }}</span></span>
                      <span class="d-block">
                        <span class="tx-inverse" :class="equipmentClasses(equipment, 'categories')"
                          v-for="(category, index) in equipment.categories" :key="`category-2-${category.id}`">{{
                          category.name
                          }}{{
                          index + 1 >= equipment.categories.length ? "" : ", "
                          }}</span></span>
                      <nuxt-link class="d-block tx-inverse" :to="`/location/units/details?id=${equipment.unit.id}`">{{
                      ellipse(equipment.unit.name, 30) }}</nuxt-link>
                    </p>
                    <span v-modal-open="'delete-modal'" @click="equipmentToDelete = equipment">
                      <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
            <!-- col-4 -->
          </div>

          <!-- row -->
          <div v-else>
            <h4>No data to display</h4>
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
                    <span v-text="equipmentToDelete.name"></span>
                  </h4>
                  <div class="form-layout-footer">
                    <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4"
                      :disabled="disabled" @click="deleteEquipment()">
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
        </template>
        <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
      </v-paginate>
      <!-- v-paginate -->
      <loading v-else />
    </div>
  </div>
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
  components: { loading, vModal, vButton, vPaginate, vSelect },
  computed: {
    equipmentListByUnitIds() {
      if (!this.unitId) return [];
      return [this.unitId];
    }
  },
  created() {
    this.getEquipmentList(this);
    this.getUnits(this);
  },
  data: () => ({
    baseUnitHierarchies: true,
    disabled: false,
    hierarchies: [],
    equipmentList: [],
    equipmentToDelete: [],
    equipmentListLoading: true,
    equipmentListSearch: null,
    unitId: null,
    units: [],
    unitsAssociations: ["parent"],
    unitsLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Equipment List · Tsebo-Rapid"
  }),
  meta: {
    pageName: "equipment.index"
  },
  methods: {
    async deleteEquipment() {
      let equipment = this.equipmentToDelete;
      const { categories, brands, capacities } = equipment.specification;
      const equipment_category_ids = categories.map((category) => category.id);
      const brand_ids = brands.map((brand) => brand.id);
      const capacity_ids = capacities.map((capacity) => capacity.id);
      const unit_id = equipment.unit.id;
      try {
        const response = await this.$axios.delete(
          `equipment/${equipment.id}`,
          { equipment_category_ids, brand_ids, capacity_ids, unit_id }
        );
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Equipment Deleted"
        });
        this.$router.go();
        this.$store.commit("assets/equipment/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Equipment"
        });
      }
    },
    ...mapActions({
      getEquipmentList: "assets/equipment/getEquipmentList",
      getUnits: "location/units/getUnits"
    }),
    equipmentClasses(equipment, field) {
      if (field == "capacities" && !equipment.specification.name)
        return ["tx-medium"];
      if (
        field == "brands" &&
        !equipment.specification.name &&
        equipment.specification.capacities.length < 1
      )
        return ["tx-medium"];
      if (
        field == "categories" &&
        !equipment.specification.name &&
        equipment.specification.capacities.length < 1 &&
        equipment.specification.brands.length < 1
      )
        return ["tx-medium"];
      return ["tx-11"];
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [formMixin, modalMixin],
  watch: {
    equipmentListSearch(search) {
      this.debounce(() => {
        this.equipmentListLoading = true;
        this.getEquipmentList(this);
      }, 300);
    },
    equipmentListByUnitIds() {
      this.$store.commit("assets/equipment/toggleRefresh");
      this.equipmentListLoading = true;
      this.getEquipmentList(this);
    }
  }
};
</script>
