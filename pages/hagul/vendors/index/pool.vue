<template>
  <form id="update-org-vendor-form" class="pd-t-10" v-if="!vendorsLoading && !organizationLoading">
    <div class="slim-card-title">
      <span class="mg-b-20">VENDORS</span>
    </div>
    <div class="card bd-0">
      <div class="card-header bg-white" style="background-color: black">
        <input type="text" v-model="search" class="form-control wd-200 float-left" placeholder="Type here to search" />
        <select name="trade" v-model="tradeCode" class="form-control wd-200 float-right">
          <option :value="null">Select Trades</option>
          <option v-for="trade in trades" :value="trade.code" :key="trade.id">
            {{ trade.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-layout">
      <div v-if="filteredVendors.length > 0">
        <v-paginate class="mg-t-10" :list="filteredVendors" perPage="90">
          <template v-slot="paginate">
            <div class="row mg-0">
              <div class="col-md-4 pd-md-0" v-for="vendor in paginate.list" :key="vendor.id">
                <ul class="list-group">
                  <li class="list-group-item vertical-align-center ht-80">
                    <p class="mg-b-0">
                      <span class="tx-inverse">
                        <strong class="tx-medium" v-text="vendor.business_name"></strong>
                        <br />
                        <span>
                          <span class="tx-medium">Rating:</span>
                          {{ vendor.rating | twoDP }}%
                        </span>
                      </span>
                      <label class="ckbox float-right">
                        <input type="checkbox" :value="vendor.id" v-model="vendorIds" />
                        <span>
                          <span class="d-none">ok</span>
                        </span>
                      </label>
                    </p>
                  </li>
                </ul>
              </div>
              <!-- col-4 -->
            </div>
            <!-- row -->
          </template>
          <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
        </v-paginate>
      </div>
      <div class="form-layout-footer tx-center mg-t-20">
        <v-button :disabled="disabled" class="btn btn-primary" @click="updateVendorPool()">SAVE</v-button>
      </div>
    </div>
  </form>
  <loading v-else />
  <!-- manager-wrapper -->
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import { mapActions } from "vuex";

export default {
  components: { loading, vButton, vPaginate },
  computed: {
    filteredVendors() {
      if (!this.search) return this.vendors;
      return this.vendors.filter((vendor) =>
        vendor.business_name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  created() {
    this.getTrades(this);
    this.getVendors(this);
    this.setOrganizationVendorIds();
  },
  data: () => ({
    byVendorTradeCodes: [],
    disabled: false,
    organization: null,
    organizationLoading: true,
    search: null,
    tradeCode: null,
    trades: [],
    validationErrors: {},
    vendorIds: [],
    vendorSearch: null,
    vendors: [],
    vendorsLoading: true
  }),
  methods: {
    ...mapActions({
      getVendors: "people/vendors/getVendors",
      getTrades: "people/trades/getTrades"
    }),
    async setOrganization(id) {
      const { organizations } = this.$store.state.onboarding.organizations;
      this.organization = organizations.find(
        (organization) => organization.id == id
      );
      if (this.organization) {
        if (Array.isArray(this.organization.vendors)) {
          return (this.organizationLoading = false);
        }
      }

      try {
        const response = await this.$axios.get("organizations/" + id, {
          params: { associations: ["vendors"] }
        });
        this.$store.commit(
          "onboarding/organizations/setOrganization",
          response.data.organization
        );
        this.organization = this.organization
          ? Object.assign({}, response.data.organization)
          : response.data.organization;
        this.organizationLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async setOrganizationVendorIds() {
      await this.setOrganization(this.authUser.organizations[0].id);
      this.vendorIds = this.organization.vendors.map((vendor) => vendor.id);
    },
    async updateVendorPool() {
      if (!this.validateForm("update-org-vendor-form")) return false;
      this.disabled = true;

      const new_vendor_ids = this.vendorIds.filter(
        (id) => !this.organization.vendors.find((vendor) => vendor.id == id)
      );
      const detached_vendor_ids = this.organization.vendors
        .filter((vendor) => !this.vendorIds.includes(vendor.id))
        .map((vendor) => vendor.id);

      try {
        await this.$axios.post(`organizations/update-vendors`, {
          new_vendor_ids,
          detached_vendor_ids
        });
        this.disabled = false;
        this.toast({ type: "info", title: "Vendors Updated" });
        this.$emit("update");
      } catch (error) {
        this.toast({ type: "warning", title: "Error Updating Vendors" });
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
  mixins: [authMixin, formMixin],
  watch: {
    tradeCode() {
      if (!this.tradeCode) {
        this.byVendorTradeCodes = [];
      } else {
        this.byVendorTradeCodes = [this.tradeCode];
      }
      this.$store.commit("people/vendors/toggleRefresh");
      this.getVendors(this);
    }
  }
};
</script>
