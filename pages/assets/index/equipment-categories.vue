<template>
  <div class="row mg-t-10">
    <div class="col-md-3">
      <div class="card card-body pd-25">
        <h6 class="slim-card-title mg-b-20">Create Categories</h6>
        <form id="create-categories-form" class="row">
          <div class="col-12" v-for="(category, index) in categoriesArray" :key="`category-${index}`">
            <div class="form-group">
              <div class="input-group">
                <input :name="'name' + index" v-model="categories[index].name" class="form-control" required
                  placeholder="Category Name" />
                <div class="input-group-append cursor-pointer" v-if="index != 0" @click="deleteCategory(index)">
                  <span class="input-group-text bg-danger tx-white">
                    <i class="icon ion-trash-a tx-16 lh-0"></i>
                  </span>
                </div>
                <div class="input-group-append cursor-pointer" @click="add1Category()">
                  <span class="input-group-text">+</span>
                </div>
              </div>
              <small class="tx-bold tx-danger" v-text="validationErrors['name' + index]"></small>
            </div>
          </div>
        </form>
        <v-button :disabled="disabled" @click="submitCategories()" class="btn btn-primary btn-block">SUBMIT</v-button>
      </div>
      <!-- card -->
    </div>
    <v-paginate class="col mg-t-10 mg-md-0" v-if="!equipmentCategoriesLoading" :list="equipmentCategories" perPage="60">
      <template v-slot="paginate">
        <div class="row">
          <div class="col-md-6 col-lg-4 pd-md-0" v-for="category in paginate.list" :key="category.id">
            <ul class="list-group">
              <li class="list-group-item">
                <p class="mg-b-0 d-flex justify-content-between">
                  <strong class="tx-inverse tx-medium" v-text="category.name"></strong>
                  <span v-modal-open="'delete-modal'" @click="equipmentCategoryToDelete = category">
                    <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                  </span>
                </p>
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
                  <span v-text="equipmentCategoryToDelete.name"></span>
                </h4>
                <div class="form-layout-footer">
                  <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                    @click="deleteEquipmentCategory()">
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
    <div class="tx-center" v-else>
      <loading />
    </div>
    <!-- v-paginate -->
  </div>
</template>

<script>
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vPaginate, vModal },
  created() {
    this.getEquipmentCategories(this);
    this.add1Category();
  },
  data: () => ({
    disabled: false,
    categoriesArray: [],
    categories: [],
    equipmentCategoryToDelete: [],
    equipmentCategories: [],
    equipmentCategoriesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Equipment Categories · Tsebo-Rapid"
  }),
  meta: {
    pageName: "equipment-categories.index"
  },
  methods: {
    async deleteEquipmentCategory() {
      let equipmentCategory = this.equipmentCategoryToDelete;
      try {
        const response = await this.$axios.delete(
          `equipment-categories/${equipmentCategory.id}`,
          {}
        );
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Equipment Category Deleted"
        });
        this.$router.go();
        this.$store.commit("assets/equipmentCategories/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Equipment Category"
        });
      }
    },
    ...mapActions({
      getEquipmentCategories:
        "assets/equipmentCategories/getEquipmentCategories"
    }),
    add1Category() {
      this.categoriesArray.push({});
      this.categories.push({ name: "" });
      this.validationErrors["name" + (this.categories.length - 1)] = null;
    },
    deleteCategory(index) {
      this.categoriesArray.splice(index, 1);
      this.categories.splice(index, 1);
      delete this.validationErrors["name" + index];
    },
    async submitCategories() {
      if (!this.validateForm("create-categories-form")) return false;
      this.disabled = true;

      try {
        const name = this.categories.map((category) => category.name);
        this.$axios.post("equipment-categories/store-many", { name });
        this.disabled = false;
        this.categoriesArray = [];
        this.categories = [];
        this.add1Category();
        this.$store.commit("assets/equipmentCategories/toggleRefresh");
        this.getEquipmentCategories(this);
      } catch (error) {
        console.log(error);
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data)
            this.validationErrors[error.field] = error.message;
        }
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [formMixin, modalMixin]
};
</script>
