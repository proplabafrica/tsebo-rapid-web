<template>
  <form id="bulk-import-vendor-form" class="mg-t-20">
    <div class="form-layout">
      <div class="row">
        <div class="col-12">
          <a href="/sample-files/hagul-materials-sample-file.xlsx" class="btn btn-sm btn-primary">
            <i class="icon ion-android-attach">&nbsp;</i> Download Sample File
          </a>
        </div>

        <div class="col-md-6 col-lg-4 mg-t-20">
          <div class="form-group">
            <div class="custom-file">
              <input type="file" @change="processExcel($event)" class="custom-file-input" title="Select a file"
                name="file" />
              <label class="custom-file-label" for="customFile">Upload an XSLX File</label>
            </div>
            <!-- custom-file -->
          </div>
        </div>
      </div>
      <!-- row -->

      <div v-if="
        !materialsLoading && (materials.length > 0 || invalidRows.length > 0)
      ">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link to="/hagul/inventory/materials/bulk-import" class="nav-link" exact-active-class="active">
              Valid Rows
              <span class="badge round-badge badge-success">{{
              materials.length
              }}</span>
            </nuxt-link>
            <nuxt-link to="/hagul/inventory/materials/bulk-import/errors" class="nav-link" exact-active-class="active">
              Invalid Rows
              <span class="badge round-badge badge-danger">{{
              invalidRows.length
              }}</span>
            </nuxt-link>
          </nav>
        </div>
        <!-- nav-statistics-wrapper -->
        <nuxt-child :materials="materials" :invalidRows="invalidRows" />

        <div class="form-layout-footer tx-center mg-t-20" v-if="
          materials.length > 0 &&
          $route.fullPath != '/hagul/inventory/materials/bulk-import/errors'
        ">
          <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitMaterials()">SUBMIT</v-button>
        </div>
      </div>
      <loading v-else-if="materialsLoading" />
      <!-- form-layout-footer -->
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import readXlsxFile from "read-excel-file";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/hagul/auth";

const getInitialData = () => ({
  disabled: false,
  invalidRows: [],
  materialCategories: [],
  materials: [],
  materialsLoading: false,
  materialsSchema: {
    name: { prop: "name", type: String, required: true },
    code: { prop: "code", type: String },
    unit_cost: { prop: "cost", type: String, required: true },
    max_stock: {
      prop: "max_stock",
      type: String,
      required: true
    },
    min_stock: { prop: "min_stock", type: String, required: true },
    current_stock: { prop: "stock", type: String, required: true },
    category1: { prop: "category1", type: String },
    category2: { prop: "category2", type: String },
    category3: { prop: "category3", type: String }
  }
});

export default {
  components: { loading, vButton },
  created() {
    this.getMaterialCategories(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Import Materials · Hagul"
  }),
  meta: {
    pageName: "hagul.vendors.create"
  },
  methods: {
    ...mapActions({
      getMaterialCategories:
        "hagul/inventory/materialCategories/getMaterialCategories"
    }),
    async processExcel(event) {
      var file = event.currentTarget.files[0];
      this.materials = [];
      this.materialsLoading = true;
      const schema = this.materialsSchema;

      try {
        const { rows, errors } = await readXlsxFile(file, { schema });

        for (var index in rows) {
          var row = rows[index];
          index = parseInt(index);
          row.number = index + 1;
          row.errors = errors.filter(
            (error) => parseInt(error.row) == index + 1
          );

          if (row.errors.length > 0) {
            this.invalidRows.push(Object.assign({}, row));
            continue;
          }

          row.categories = [];
          const categoryKeys = ["category1", "category2", "category3"];
          for (const key of categoryKeys) {
            if (row[key]) {
              const category = this.materialCategories.find(
                (category) =>
                  category.name.toLowerCase() == row[key].toLowerCase()
              );
              if (category) row.categories.push(category);
            }
          }

          this.materials.push(Object.assign({}, row));
        }
        this.materialsLoading = false;
      } catch (error) {
        console.log(error);
        this.materialsLoading = false;
      }
    },
    submitMaterials() {
      for (const material of this.materials) {
        this.submitMaterial(material);
      }
      var { materialCategories } = this;
      var initialData = Object.assign(getInitialData(), {
        materialCategories
      });
      Object.assign(this.$data, initialData);
      this.toast({
        type: "info",
        title: "Bulk upload sent. Might take a while to populate"
      });
    },
    async submitMaterial(material) {
      this.disabled = true;

      const material_category_ids = material.categories.map(
        (category) => category.id
      );
      const request = Object.assign(material, { material_category_ids });

      try {
        const response = await this.$axios.post("materials", request);
        this.disabled = false;
        this.$store.commit("hagul/inventory/materials/toggleRefresh");
        await this.getMaterials(this);
        this.toast({
          type: "success",
          title: `${material.name} submitted`
        });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (!response) return;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.toast({
              type: "danger",
              title: `Could not submit ${material.name}`,
              body: error.message
            });
          }
        }
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
