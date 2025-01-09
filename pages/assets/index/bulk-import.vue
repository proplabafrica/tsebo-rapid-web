<template>
  <form id="bulk-import-vendor-form" class="mg-t-20">
    <div class="form-layout">
      <div class="row">
        <div class="col-12">
          <a href="/sample-files/assets-equipment-sample-import.xlsx" class="btn btn-sm btn-primary">
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
        !equipmentListLoading &&
          (equipmentList.length > 0 || invalidRows.length > 0)
      ">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link to="/assets/bulk-import" class="nav-link" exact-active-class="active">
              Valid Rows
              <span class="badge round-badge badge-success">{{
              equipmentList.length
              }}</span>
            </nuxt-link>
            <nuxt-link to="/assets/bulk-import/errors" class="nav-link" exact-active-class="active">
              Invalid Rows
              <span class="badge round-badge badge-danger">{{
              invalidRows.length
              }}</span>
            </nuxt-link>
          </nav>
        </div>
        <!-- nav-statistics-wrapper -->
        <nuxt-child :equipmentList="equipmentList" :invalidRows="invalidRows" />

        <div class="form-layout-footer tx-center mg-t-20" v-if="
          equipmentList.length > 0 &&
            $route.fullPath != '/assets/bulk-import/errors'
        ">
          <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitEquipmentList()">SUBMIT</v-button>
        </div>
      </div>
      <loading v-else-if="equipmentListLoading" />
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
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton },
  created() {
    this.getEquipmentBrands(this);
    this.getEquipmentCapacities(this);
    this.getEquipmentCategories(this);
    this.getEquipmentCriticalities(this);
    this.getUnits(this).then(() =>
      this.$store.commit("location/units/toggleRefresh")
    );
  },
  data: () => ({
    disabled: false,
    equipmentBrands: [],
    equipmentBrandsLoading: true,
    equipmentCapacities: [],
    equipmentCapacitiesLoading: true,
    equipmentCategories: [],
    equipmentCategoriesLoading: true,
    equipmentCriticalities: [],
    equipmentCriticalitiesLoading: true,
    equipmentList: [],
    equipmentListLoading: false,
    equipmentSchema: {
      brand: { prop: "brand", type: String, required: true },
      capacity: { prop: "capacity", type: String, required: true },
      category: { prop: "category", type: String, required: true },
      criticality: { prop: "criticality", type: String, required: true },
      date_acquired: { prop: "acquired_at", type: String, required: true },
      equipment_number: {
        prop: "equipment_number",
        type: String,
        required: true
      },
      specification: { prop: "specification", type: String, required: true },
      unit: { prop: "unit", type: String, required: true },
      unit_parent: { prop: "unit_parent", type: String, required: false }
    },
    invalidRows: [],
    equipmentSubmissionInfo: { failed: 0, sent: 0, successful: 0 },
    units: [],
    unitsAssociations: ["parent"],
    unitsLoading: true,
    unitsPerPage: 700000,
    validationErrors: {}
  }),
  head: () => ({ title: "Import Equipment · Tsebo-Rapid" }),
  meta: {
    pageName: "equipment.store"
  },
  methods: {
    ...mapActions({
      getEquipmentBrands: "assets/equipmentBrands/getEquipmentBrands",
      getEquipmentCapacities:
        "assets/equipmentCapacities/getEquipmentCapacities",
      getEquipmentCategories:
        "assets/equipmentCategories/getEquipmentCategories",
      getEquipmentCriticalities:
        "assets/equipmentCriticalities/getEquipmentCriticalities",
      getUnits: "location/units/getUnits"
    }),
    displaySubmissionInfo() {
      if (
        this.equipmentSubmissionInfo.failed +
        this.equipmentSubmissionInfo.successful <
        this.equipmentSubmissionInfo.sent
      )
        return;

      this.toast({
        type: "info",
        title: "Upload Complete",
        body: `${this.equipmentSubmissionInfo.successful} successful. ${this.equipmentSubmissionInfo.failed
          } failed`
      });
      this.equipmentList = [];
      this.equipmentListLoading = false;
      this.invalidRows = [];
    },
    async processExcel(event) {
      var file = event.currentTarget.files[0];
      this.equipmentList = [];
      this.equipmentListLoading = true;
      const schema = this.equipmentSchema;

      try {
        const { rows, errors } = await readXlsxFile(file, { schema });

        for (var index in rows) {
          var row = rows[index];
          index = parseInt(index);
          row.number = index + 1;
          row.errors = errors.filter(error => parseInt(error.row) == index + 1);

          if (row.errors.length > 0) {
            this.invalidRows.push(Object.assign({}, row));
            continue;
          }

          const brand = this.equipmentBrands.find(
            testBrand => this.slugify(testBrand.name) == this.slugify(row.brand)
          );
          const capacity = this.equipmentCapacities.find(
            testCapacity =>
              this.slugify(testCapacity.name) == this.slugify(row.capacity)
          );
          const category = this.equipmentCategories.find(
            testCategory =>
              this.slugify(testCategory.name) == this.slugify(row.category)
          );
          const criticality = this.equipmentCriticalities.find(
            testCriticality =>
              this.slugify(testCriticality.name) ==
              this.slugify(row.criticality)
          );

          const unit = this.units
            .filter(
              testUnit => this.slugify(testUnit.name) == this.slugify(row.unit)
            )
            .find(testUnit => {
              if (!row.unit_parent || !testUnit.parent) return true;
              return (
                this.slugify(row.unit_parent) ==
                this.slugify(testUnit.parent.name)
              );
            });

          this.equipmentList.push(
            Object.assign(row, {
              code: row.equipment_number,
              equipment_brand_id: brand ? brand.id : null,
              equipment_capacity_id: capacity ? capacity.id : null,
              equipment_category_id: category ? category.id : null,
              equipment_criticality_id: criticality ? criticality.id : null,
              name: row.specification,
              unit_id: unit ? unit.id : null
            })
          );
        }
        this.equipmentListLoading = false;
      } catch (error) {
        console.log(error);
        this.equipmentListLoading = false;
      }
    },
    slugify(str, separator = "-") {
      if (!str) return null;
      str = str.trim();
      str = str.toLowerCase();

      // remove accents, swap ñ for n, etc
      const from = "åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
      const to = "aaaaaaeeeeiiiioooouuuunc------";

      for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }

      return str
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-") // collapse whitespace and replace by -
        .replace(/-+/g, "-") // collapse dashes
        .replace(/^-+/, "") // trim - from start of text
        .replace(/-+$/, "") // trim - from end of text
        .replace(/-/g, separator);
    },
    submitEquipmentList() {
      for (const equipment of this.equipmentList) {
        this.submitEquipment(equipment);
        this.equipmentSubmissionInfo.sent++;
      }
    },
    async submitEquipment(equipment) {
      this.disabled = true;
      try {
        const response = await this.$axios.post("equipment", {
          ...equipment,
          equipment_specification_id: 0
        });
        this.disabled = false;
        this.$store.commit(
          "assets/equipment/setEquipment",
          response.data.equipment
        );
        this.equipmentSubmissionInfo.successful++;
        this.displaySubmissionInfo();
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.equipmentSubmissionInfo.failed++;
        this.displaySubmissionInfo();
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin]
};
</script>
