<template>
  <div>
    <div class="mg-y-10">
      <div class="d-flex flex-row justify-content-between">
        <input
          type="text"
          placeholder="Start typing here to search"
          class="form-control search mg-b-10"
          v-model="materialSearch"
        />
        <select
          class="form-control search col-3"
          :name="`material-filter`"
          v-model="category"
          @change="setCategory"
        >
          <option :value="null">
            {{ category ? "Show All" : "Filter By Category" }}
          </option>
          <option
            v-for="category in materialCategories"
            :key="category.id"
            :value="category"
            v-text="category.name"
          ></option>
        </select>
      </div>
    </div>
    <v-paginate :list="list" perPage="30" v-if="!materialsLoading">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped mg-b-0">
            <thead>
              <tr>
                <th>Material</th>
                <th>Unit Cost</th>
                <th>Stock</th>
                <th>Min/Max</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="material in paginate.list" :key="material.id">
                <td>
                  <nuxt-link
                    :to="`/hagul/inventory/materials/details?id=${material.id}`"
                    class="tx-inverse tx-14 tx-medium d-block"
                    v-text="material.name"
                  ></nuxt-link>
                  <span class="tx-11 d-block" v-if="material.code"
                    >#{{ material.code }}</span
                  >
                  <span class="tx-11 d-block">
                    <span
                      v-for="(category, index) in material.categories"
                      :key="category.id"
                      >{{ category.name
                      }}{{
                        index + 1 >= material.categories.length ? "" : ", "
                      }}</span
                    >
                  </span>
                </td>
                <td>
                  <span
                    v-html="
                      material.currency.unicode +
                      $options.filters.moneyFormat(material.cost)
                    "
                  ></span>
                </td>
                <td>
                  <span
                    class="tx-14 tx-medium d-block"
                    v-text="material.stock"
                  ></span>
                </td>
                <td>
                  <span class="tx-14 tx-medium d-block"
                    >{{ material.min_stock }}/{{ material.max_stock }}</span
                  >
                </td>
                <td>
                  <span
                    v-modal-open="'delete-modal'"
                    @click="materialToDelete = material"
                  >
                    <i
                      class="icon ion-trash-a tx-danger tx-16 cursor-pointer"
                    ></i>
                  </span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="3">
                  <h6>No data to display</h6>
                </td>
              </tr>
            </tbody>
          </table>
          <v-modal ref="delete-modal">
            <div class="modal-dialog wd-300 wd-sm-400" role="document">
              <div class="modal-content tx-size-sm">
                <div class="modal-body tx-center pd-y-20 pd-x-20">
                  <button
                    type="button"
                    class="close"
                    v-modal-close="'delete-modal'"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  <h4 style="font-size: 16px" class="mg-b-20">
                    Are you sure you want to delete
                    <span v-text="materialToDelete.name"></span>
                  </h4>
                  <div class="form-layout-footer">
                    <v-button
                      type="button"
                      style="border-radius: 8px"
                      class="btn btn-primary pd-x-4"
                      :disabled="disabled"
                      @click="deleteMaterial()"
                    >
                      <i class="icon ion-ios-checkmark-outline"></i>
                      Confirm
                    </v-button>
                    <button
                      style="border-radius: 8px"
                      type="button"
                      class="btn btn-danger pd-x-4"
                      v-modal-close="'delete-modal'"
                      aria-label="Close"
                      :disabled="disabled"
                    >
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
        </div>
        <!-- table-responsive -->
      </template>
      <!-- table-responsive -->
      <template
        v-slot:linksWrapper
        class="card-footer tx-13 pd-y-15 bg-transparent"
      ></template>
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";

export default {
  components: { loading, vButton, vPaginate, vModal },
  created() {
    this.getMaterials(this);
    this.getMaterialCategories(this);
  },
  data: () => ({
    filteredMaterials: [],
    materialCategories: [],
    materialSearch: null,
    materials: [],
    materialsLoading: true,
    materialToDelete: [],
    disabled: null,
    category: null
  }),
  head: () => ({
    title: "Materials · Hagul"
  }),
  meta: {
    pageName: "hagul.inventory.materials.index"
  },
  methods: {
    async setCategory() {
      this.materialsLoading = true;
      this.category ? await this.getCategory() : (this.category = null);
      this.materialsLoading = false;
    },
    async getCategory() {
      try {
        const response = await this.$axios.get(
          `material-categories/${this.category.id}`,
          {
            params: {
              associations: [
                "materials",
                "materials.categories",
                "materials.currency"
              ]
            }
          }
        );
        this.filteredMaterials = response.data.materialCategory.materials;
        this.disabled = false;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteMaterial() {
      let material = this.materialToDelete;
      const { categories } = material;
      const material_category_ids = categories.map((category) => category.id);
      try {
        const response = await this.$axios.delete(`materials/${material.id}`, {
          material_category_ids
        });
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Material Deleted"
        });
        this.$router.go();
        this.$store.commit("hagul/inventory/materials/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Material"
        });
      }
    },
    ...mapActions({
      getMaterials: "hagul/inventory/materials/getMaterials",
      getMaterialCategories:
        "hagul/inventory/materialCategories/getMaterialCategories"
    })
  },
  computed: {
    list() {
      if (!this.category) {
        return this.materials;
      }
      return this.filteredMaterials;
    }
  },
  middleware: ["auth"],
  watch: {
    materialSearch() {
      this.debounce(() => this.getMaterials(this), 500);
    }
  },
  mixins: [modalMixin]
};
</script>
