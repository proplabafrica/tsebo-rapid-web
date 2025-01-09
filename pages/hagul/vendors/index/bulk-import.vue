<template>
  <form id="bulk-import-vendor-form" class="mg-t-20">
    <div class="form-layout">
      <div class="row">
        <div class="col-12">
          <a href="/sample-files/hagul-vendors-sample-import.xlsx" class="btn btn-sm btn-primary">
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

      <div v-if="!vendorsLoading && (vendors.length > 0 || invalidRows.length > 0)">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link to="/hagul/vendors/bulk-import" class="nav-link" exact-active-class="active">
              Valid Rows
              <span class="badge round-badge badge-success">{{
              vendors.length
              }}</span>
            </nuxt-link>
            <nuxt-link to="/hagul/vendors/bulk-import/errors" class="nav-link" exact-active-class="active">
              Invalid Rows
              <span class="badge round-badge badge-danger">{{
              invalidRows.length
              }}</span>
            </nuxt-link>
          </nav>
        </div>
        <!-- nav-statistics-wrapper -->
        <nuxt-child :vendors="vendors" :invalidRows="invalidRows" />

        <div class="form-layout-footer tx-center mg-t-20"
          v-if="vendors.length > 0 && $route.fullPath == '/hagul/vendors/bulk-import'">
          <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitVendors()">SUBMIT</v-button>
        </div>
      </div>
      <loading v-else-if="vendorsLoading" />
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

const getInitialData = () => ({
  banks: [],
  disabled: false,
  invalidRows: [],
  materialCategories: [],
  trades: [],
  validationErrors: {},
  vendors: [],
  vendorsLoading: false,
  vendorsSchema: {
    business_name: { prop: "business_name", type: String, required: true },
    business_email: { prop: "business_email", type: String, required: true },
    business_phone: { prop: "business_phone", type: String, required: true },
    representative_name: {
      prop: "rep_name",
      type: String,
      required: true
    },
    address: { prop: "address", type: String, required: true },
    trade1: { prop: "trade1", type: String },
    trade2: { prop: "trade2", type: String },
    trade3: { prop: "trade3", type: String },
    category1: { prop: "category1", type: String },
    category2: { prop: "category2", type: String },
    category3: { prop: "category3", type: String },
    bank_name: { prop: "bank_name", type: String },
    bank_account_number: { prop: "bank_account_number", type: String },
    tin: { prop: "tin", type: String }
  }
});

export default {
  components: { loading, vButton },
  computed: {
    accountInfoRequired() {
      return (
        this.vendor.bank_account_name ||
        this.vendor.bank_account_number ||
        this.vendor.bank_id
      );
    }
  },
  created() {
    this.getMaterialCategories(this);
    this.getTrades(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Import Vendors · Hagul"
  }),
  meta: {
    pageName: "vendors.store"
  },
  methods: {
    ...mapActions({
      getTrades: "people/trades/getTrades",
      getMaterialCategories:
        "hagul/inventory/materialCategories/getMaterialCategories"
    }),
    getBanks() { },
    async processExcel(event) {
      var file = event.currentTarget.files[0];
      this.vendors = [];
      this.vendorsLoading = true;
      const schema = this.vendorsSchema;

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

          row.trades = [];
          const tradeKeys = ["trade1", "trade2", "trade3"];
          for (const key of tradeKeys) {
            if (row[key]) {
              const trade = this.trades.find(
                (trade) => trade.name.toLowerCase() == row[key].toLowerCase()
              );
              if (trade) row.trades.push(trade);
            }
          }

          row.materialCategories = [];
          const categoryKeys = ["category1", "category2", "category3"];
          for (const key of categoryKeys) {
            if (row[key]) {
              const category = this.materialCategories.find(
                (category) =>
                  category.name.toLowerCase() == row[key].toLowerCase()
              );
              if (category) row.materialCategories.push(category);
            }
          }

          this.vendors.push(Object.assign({}, row));
        }
        this.vendorsLoading = false;
      } catch (error) {
        console.log(error);
        this.vendorsLoading = false;
      }
    },
    submitVendors() {
      for (const vendor of this.vendors) {
        this.submitVendor(vendor);
      }
      var { banks, trades } = this;
      var initialData = Object.assign(getInitialData(), { banks, trades });
      Object.assign(this.$data, initialData);
      this.toast({
        type: "info",
        title: "Bulk upload sent. Might take a while to populate"
      });
    },
    async submitVendor(vendor) {
      this.disabled = true;
      const trade_ids = vendor.trades.map((trade) => trade.id);
      const material_category_ids = vendor.materialCategories.map(
        (category) => category.id
      );
      try {
        const response = await this.$axios.post(
          "vendors",
          Object.assign(vendor, { trade_ids, material_category_ids })
        );
        this.disabled = false;
        this.$store.commit("hagul/inventory/materials/toggleRefresh");
        this.toast({
          type: "success",
          title: `${vendor.business_name} submitted`
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
              title: `Could not submit ${vendor.business_name}`,
              body: error.message
            });
          }
        }
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin]
};
</script>
