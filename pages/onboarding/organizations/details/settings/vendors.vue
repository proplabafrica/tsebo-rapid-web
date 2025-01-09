<template>
  <div class="manager-wrapper mg-t-0">
    <div class="manager-right" style="margin-left: 0px">
      <form id="update-org-vendor-form" class="pd-20 card">
        <div class="form-layout" v-if="!vendorsLoading">
          <div class="slim-card-title">
            <span class="mg-b-20">VENDORS</span>
            <input type="text" v-model="search" class="form-control wd-200" placeholder="Type here to search" />
          </div>
          <div v-if="filteredVendors.length > 0">
            <v-paginate class="mg-t-10" :list="filteredVendors" perPage="90">
              <template v-slot="paginate">
                <div class="row mg-0">
                  <div class="col-md-4 pd-md-0" v-for="vendor in paginate.list" :key="vendor.id">
                    <ul class="list-group">
                      <li class="list-group-item vertical-align-center ht-60">
                        <p class="mg-b-0">
                          <span class="tx-inverse">
                            <strong class="tx-medium" v-text="vendor.business_name"></strong>
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
            <v-button :disabled="disabled" class="btn btn-primary" @click="updateOrganization()">SAVE</v-button>
          </div>
        </div>
        <loading v-else />
      </form>
    </div>
    <!-- manager-right -->
  </div>
  <!-- manager-wrapper -->
</template>

<script>
import createRole from "@/components/people/roles/create";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import formMixin from "@/mixins/forms";
import { mapActions } from "vuex";

export default {
  components: { createRole, loading, vButton, vPaginate },
  computed: {
    filteredVendors() {
      if (!this.search) return this.vendors;
      return this.vendors.filter((vendor) =>
        vendor.business_name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  created() {
    this.getVendors(this);
    this.setOrganizationVendorIds();
  },
  data: () => ({
    disabled: false,
    role: null,
    roleCodes: ["FM", "OA", "OCC", "PM", "PO", "SYS", "TCHN", "VND"],
    roleSystemFunctions: [],
    roleSystemFunctionsLoading: true,
    search: null,
    systemFunctions: [],
    systemFunctionsLoading: true,
    validationErrors: {},
    vendorIds: [],
    vendorSearch: null,
    vendors: [],
    vendorsLoading: true
  }),
  methods: {
    ...mapActions({
      getVendors: "people/vendors/getVendors"
    }),
    setOrganizationVendorIds() {
      this.vendorIds = this.organization.vendors.map((vendor) => vendor.id);
    },
    async updateOrganization() {
      if (!this.validateForm("update-org-vendor-form")) return false;
      this.disabled = true;

      const new_vendor_ids = this.vendorIds
        .filter(
          (id) => !this.organization.vendors.find((vendor) => vendor.id == id)
        )
        .map((vendor) => vendor.id);
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
  mixins: [formMixin],
  props: ["organization"]
};
</script>
