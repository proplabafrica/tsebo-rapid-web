<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/purchase/tender-processes">Tender Processes</nuxt-link>
        </li>
        <li class="breadcrumb-item" v-text="
          tenderProcess
            ? 'Request Quotations For #' + tenderProcess.code
            : 'Request Quotations'
        "></li>
      </ol>
      <h6 class="slim-pagetitle">
        <span v-if="tenderProcess">
          Request Quotations For
          <nuxt-link :to="`/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`" class="tx-inverse">#{{
          tenderProcess.code }}</nuxt-link>
        </span>
      </h6>
    </div>
    <!-- slim-pageheader -->

    <div v-if="!loading">
      <div class="row" v-if="tenderProcess.status.code == 'pending'">
        <div class="col table-responsive">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tenderProcess.items" :key="item.id">
                <td v-if="item.material || item.service">{{ index + 1 }}</td>
                <td v-if="item.material || item.service">
                  <span class="tx-14 tx-medium" v-text="thisOrThat(item, ['material', 'service']).name"></span>
                </td>
                <td v-if="item.material || item.service">
                  <span class="tx-14 tx-medium" v-text="item.quantity"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-3">
          <div class="card card-body pd-25">
            <form id="send-rfqs-form">
              <div class="form-group">
                <label class="form-control-label">
                  Select Vendors
                  <span class="tx-danger">*</span>
                </label>
                <div class="input-group">
                  <v-select class="form-control" label="business_name" placeholder="Pick Vendors" aria-multiselectable
                    multiple selectOnTab @search="searchVendors" :options="vendors" v-model="selectedVendors"
                    :value="vendors.business_name">
                    <template slot="no-options">type to search vendors...</template>
                  </v-select>
                </div>
                <input type="text" name="selectedVendors" class="d-none" />
                <small class="tx-bold tx-danger" v-if="validationErrors.selectedVendors"
                  v-text="validationErrors.selectedVendors"></small>
              </div>
              <div class="form-group" v-if="selectedVendors.length < 3">
                <label class="form-control-label">
                  Not Enough Vendors Selected. Say Why
                  <span class="tx-danger">*</span>
                </label>
                <textarea name="text" v-model="text" class="form-control" required></textarea>
                <small class="tx-bold tx-danger" v-if="validationErrors.text" v-text="validationErrors.text"></small>
              </div>
              <v-button :disabled="disabled" @click="sendRfqs()" class="btn btn-primary btn-block">SUBMIT</v-button>
            </form>
          </div>
        </div>
      </div>
      <static-error v-else :error="{ title: 'Quotation Requests Already Sent' }" :redirect="{
        route: `/hagul/purchase/tender-processes/details?id=${tenderProcess.id}`,
        text: 'Go To Tender Process'
      }" />
    </div>
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import staticError from "@/components/ui/static-error";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";
import peopleMixin from "@/mixins/people";

export default {
  components: { loading, staticError, vButton, vSelect },
  created() {
    this.setTenderProcess(this.$route.query.id);
  },
  data: () => ({
    byAccountStatusCodes: ["ACTIVE"],
    disabled: false,
    loading: true,
    tenderProcess: null,
    validationErrors: {},
    vendors: [],
    vendorSearch: null,
    vendorsLoading: false,
    // vendor_ids: [],
    selectedVendors: [],
    text: ""
  }),
  head: () => ({
    title: "Request Quotations · Hagul"
  }),
  meta: {
    pageName: "tender-processes.send-rfq"
  },
  methods: {
    ...mapActions({
      getVendors: "people/vendors/getVendors"
    }),
    async searchVendors(search, loading) {
      this.debounce(async () => {
        this.vendors = [];
        if (!search) return;
        loading(true);
        this.vendorSearch = search;
        await this.getVendors(this);
        this.vendors = this.vendors.filter(
          (vendor) => vendor.status.code == "ACTIVE"
        );
        loading(false);
      }, 800);
    },
    async sendRfqs() {
      if (!this.validateForm("send-rfqs-form")) return false;

      this.disabled = true;
      const vendor_ids = this.selectedVendors.map(
        (selectedVendor) => selectedVendor.id
      );
      const { tenderProcess, text } = this;
      const tender_process_id = tenderProcess.id;

      try {
        const response = await this.$axios.post("tender-processes/send-rfq", {
          tender_process_id,
          text,
          vendor_ids
        });
        this.disabled = false;
        this.$router.push(
          `/hagul/purchase/tender-processes/upload-quotations?id=${tenderProcess.id}`
        );
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response.status == 400) {
          this.validationErrors.selectedVendors = response.data.message;
        } else {}
      }
    },
    async setTenderProcess(id) {
      const { tenderProcesses } =
        this.$store.state.hagul.purchase.tenderProcesses;
      this.tenderProcess = tenderProcesses.find(
        (tenderProcess) => tenderProcess.id == id
      );
      if (this.tenderProcess && !this.shouldRefresh) {
        if (Array.isArray(this.tenderProcess.items)) {
          return (this.loading = false);
        }
      }
      try {
        const response = await this.$axios.get("tender-processes/" + id, {
          params: {
            associations: ["items.material", "items.service", "status"]
          }
        });

        this.$store.commit(
          "hagul/purchase/tenderProcesses/setTenderProcess",
          response.data.tenderProcess
        );
        this.tenderProcess = this.tenderProcess
          ? Object.assign({}, response.data.tenderProcess)
          : response.data.tenderProcess;
        this.loading = false;
        this.shouldRefresh = false;
        this.$store.commit("hagul/purchase/tenderProcesses/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin, peopleMixin],
  watch: {
    $route(to, from) {
      this.setTenderProcess(to.query.id);
    }
  }
};
</script>
