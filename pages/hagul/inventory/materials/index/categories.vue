<template>
  <div class="row mg-t-10" v-if="!materialCategoriesLoading">
    <div class="col-md-3">
      <div class="card card-body pd-25">
        <h6 class="slim-card-title mg-b-20">Create Categories</h6>
        <form id="create-material-categories-form" class="row">
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
    <v-paginate class="col mg-t-10 mg-md-0" :list="materialCategories" perPage="30">
      <template v-slot="paginate">
        <div class="row" v-if="paginate.list.length > 0">
          <div class="col-md-6 col-lg-4 pd-md-0" v-for="category in paginate.list" :key="category.id">
            <ul class="list-group">
              <li class="list-group-item">
                <p class="mg-b-0">
                  <strong class="tx-inverse tx-medium" v-text="category.name"></strong>
                  <i class="icon ion-trash-a tx-16 tx-danger cursor-pointer float-right"></i>
                </p>
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <!-- row -->
        <h4 v-else>No data to display</h4>
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <!-- v-paginate -->
  </div>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vPaginate },
  created() {
    this.add1Category();
    this.getMaterialCategories(this);
  },
  data: () => ({
    disabled: false,
    categoriesArray: [],
    categories: [],
    materialCategories: [],
    materialCategoriesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Material Categories · Hagul"
  }),
  meta: {
    pageName: "hagul.inventory.materials.categories"
  },
  methods: {
    ...mapActions({
      getMaterialCategories:
        "hagul/inventory/materialCategories/getMaterialCategories"
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
      if (!this.validateForm("create-material-categories-form")) {
        return false;
      }

      this.disabled = true;
      var name = [];

      for (const category of this.categories) {
        name.push(category.name);
      }

      try {
        const materialCategories = (
          await this.$axios.post("material-categories/store-many", { name })
        ).data.materialCategories;
        this.disabled = false;
        this.$store.commit(
          "hagul/inventory/materialCategories/setMaterialCategories",
          materialCategories
        );
        this.categoriesArray = [];
        this.categories = [];
        this.add1Category();
        this.$store.commit("hagul/inventory/materialCategories/toggleRefresh");
        this.getMaterialCategories(this);
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
  middleware: ["auth", "roleGuard"],
  mixins: [formMixin]
};
</script>
