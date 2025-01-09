<template>
  <form id="bulk-import-vendor-form" class="mg-t-20">
    <div class="form-layout">
      <div class="row">
        <div class="col-12">
          <a href="/sample-files/hagul-services-sample-file.xlsx" class="btn btn-sm btn-primary">
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

      <div v-if="!servicesLoading && (services.length > 0 || invalidRows.length > 0)
        ">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link to="/hagul/inventory/services/bulk-import" class="nav-link" exact-active-class="active">
              Valid Rows
              <span class="badge round-badge badge-success">{{
                services.length
              }}</span>
            </nuxt-link>
            <nuxt-link to="/hagul/inventory/services/bulk-import/errors" class="nav-link" exact-active-class="active">
              Invalid Rows
              <span class="badge round-badge badge-danger">{{
                invalidRows.length
              }}</span>
            </nuxt-link>
          </nav>
        </div>
        <!-- nav-statistics-wrapper -->
        <nuxt-child :services="services" :invalidRows="invalidRows" />

        <div class="form-layout-footer tx-center mg-t-20" v-if="services.length > 0 &&
          $route.fullPath == '/hagul/inventory/services/bulk-import'
          ">
          <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitServices()">SUBMIT</v-button>
        </div>
      </div>
      <loading v-else-if="servicesLoading" />
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
  trades: [],
  services: [],
  servicesLoading: false,
  servicesSchema: {
    name: { prop: "name", type: String, required: true },
    unit_cost: { prop: "cost", type: String, required: true },
    trade1: { prop: "trade1", type: String },
    trade2: { prop: "trade2", type: String },
    trade3: { prop: "trade3", type: String }
  }
});

export default {
  components: { loading, vButton },
  created() {
    this.getTrades(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Import Services · Hagul"
  }),
  meta: {
    pageName: "services.store"
  },
  methods: {
    ...mapActions({
      getTrades: "people/trades/getTrades"
    }),
    async processExcel(event) {
      var file = event.currentTarget.files[0];
      this.services = [];
      this.servicesLoading = true;
      const schema = this.servicesSchema;


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

          row.trades = [];
          const tradeKeys = ["trade1", "trade2", "trade3"];
          for (const key of tradeKeys) {
            if (row[key]) {
              const trade = this.trades.find(
                trade => trade.name.toLowerCase() == row[key].toLowerCase()
              );
              if (trade) row.trades.push(trade);
            }
          }

          this.services.push(Object.assign({}, row));

        }

        this.servicesLoading = false;
      } catch (error) {
        console.log(error);
        this.servicesLoading = false;
      }
    },
    submitServices() {
      for (const service of this.services) {
        this.submitService(service);
      }
      this.$store.commit("hagul/inventory/services/toggleRefresh");
      var { trades, tradesLoading } = this;
      var initialData = Object.assign(getInitialData(), {
        trades,
        tradesLoading
      });
      Object.assign(this.$data, initialData);
      this.toast({
        type: "info",
        title: "Bulk upload sent. Might take a while to populate"
      });
    },
    async submitService(service) {
      try {
        service.trade_ids = service.trades.map(trade => trade.id);
        const response = await this.$axios.post("services", service);
        this.toast({
          type: "success",
          title: `${service.name} submitted`
        });
      } catch (error) {
        console.log(error);
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
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin]
};
</script>
