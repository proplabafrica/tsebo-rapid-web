<template>
  <form id="update-vendor-form" class="mg-t-20">
    <div class="form-layout">
      <div class="row">
        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">
              Business Name
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Business Name" name="business_name"
                v-model="editedVendor.business_name" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.business_name"
              v-text="validationErrors.business_name"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">Business Email</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-email tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Business Email" name="business_email"
                v-model="editedVendor.business_email" />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.business_email"
              v-text="validationErrors.business_email"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">
              Business Phone
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-telephone tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Business Phone" name="business_phone"
                v-model="editedVendor.business_phone" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.business_phone"
              v-text="validationErrors.business_phone"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">
              Representative Name
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-person tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Representative Name" name="rep_name"
                v-model="editedVendor.rep_name" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.rep_name"
              v-text="validationErrors.rep_name"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-8">
          <div class="form-group">
            <label class="form-control-label">
              Address
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-location tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <textarea type="text" class="form-control" name="address" v-model="editedVendor.address"
                required></textarea>
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.address" v-text="validationErrors.address"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group mg-b-10-force">
            <label class="form-control-label">Select Trades:</label>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-color-wand tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <v-select class="form-control" label="name" placeholder="Pick Trades" aria-multiselectable multiple
                selectOnTab :options="trades" v-model="editedVendor.trades"></v-select>
            </div>
            <input type="text" name="trade_ids" class="d-none" />
            <small class="tx-bold tx-danger" v-if="validationErrors.trade_ids"
              v-text="validationErrors.trade_ids"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group mg-b-10-force">
            <label class="form-control-label">Select Material Categories:</label>

            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-grid-view-outline tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <v-select class="form-control" label="name" placeholder="Pick Categories" aria-multiselectable multiple
                selectOnTab :options="materialCategories" v-model="editedVendor.materialCategories"></v-select>
            </div>
            <input type="text" name="material_category_ids" class="d-none" />
            <small class="tx-bold tx-danger" v-if="validationErrors.material_category_ids"
              v-text="validationErrors.material_category_ids"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">Tax Identification Number</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-clipboard tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Tax Identification Number"
                name="tax_identification_number" v-model="editedVendor.tax_identification_number" />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.tax_identification_number"
              v-text="validationErrors.tax_identification_number"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">
              Bank Account Name
              <span v-if="accountInfoRequired" class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-person tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Bank Account Name" name="bank_account_name"
                v-model="editedVendor.bank_account_name" :required="accountInfoRequired" />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.bank_account_name"
              v-text="validationErrors.bank_account_name"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">
              Bank Account Number
              <span v-if="accountInfoRequired" class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-card tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Bank Account Number" name="bank_account_number"
                v-model="editedVendor.bank_account_number" :required="accountInfoRequired" />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.bank_account_number"
              v-text="validationErrors.bank_account_number"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">
              Bank
              <span v-if="accountInfoRequired" class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-cash tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <select class="form-control" name="bank_id" v-model="editedVendor.bank_id"
                :required="accountInfoRequired">
                <option :value="null">Select Bank</option>
                <option v-for="bank in banks" :key="bank.id" :value="bank.id" v-text="bank.name"></option>
              </select>
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.bank_id" v-text="validationErrors.bank_id"></small>
          </div>
        </div>
      </div>
      <!-- row -->

      <div class="form-layout-footer tx-center mg-t-20">
        <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="updateVendor()">UPDATE</v-button>
      </div>
      <!-- form-layout-footer -->
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/hagul/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { vSelect, vButton },
  computed: {
    accountInfoRequired() {
      return (
        this.editedVendor.bank_account_name ||
        this.editedVendor.bank_account_number ||
        this.editedVendor.bank_id
      );
    }
  },
  created() {
    this.getMaterialCategories(this);
    this.getTrades(this);
    this.setEditedVendor();
  },
  data: () => ({
    banks: [
      { name: "Access Bank", id: 1 },
      { name: "Polaris Bank", id: 2 }
    ],
    disabled: false,
    materialCategories: [],
    trades: [],
    validationErrors: {},
    editedVendor: null
  }),
  head: () => ({
    title: "Create Vendors · Hagul"
  }),
  meta: {
    pageName: "hagul.vendors.create"
  },
  methods: {
    ...mapActions({
      getTrades: "people/trades/getTrades",
      getMaterialCategories:
        "hagul/inventory/materialCategories/getMaterialCategories"
    }),
    getBanks() { },
    setEditedVendor() {
      const address = this.vendor.address.address;
      const rep_name = this.vendor.contacts[0].name;
      var bank_account_name = null,
        bank_account_number = null,
        bank_id = null,
        bankAccount = this.vendor.bankAccounts[0];
      if (bankAccount)
        ({
          account_name: bank_account_name = bank_account_name,
          account_number: bank_account_number = bank_account_number,
          bank_id = bank_id
        } = bankAccount);
      this.editedVendor = Object.assign(
        { bank_account_name, bank_account_number, bank_id, rep_name },
        this.vendor
      );
      this.editedVendor = Object.assign(this.editedVendor, { address });
    },
    async updateVendor() {
      if (!this.validateForm("update-vendor-form")) return false;
      this.disabled = true;

      const trade_ids = this.editedVendor.trades.map((trade) => trade.id);
      const material_category_ids = this.editedVendor.materialCategories.map(
        (category) => category.id
      );

      try {
        await this.$axios.put(
          `vendors/${this.vendor.id}`,
          Object.assign(this.editedVendor, { trade_ids, material_category_ids })
        );
        this.$emit("update");
        this.$store.commit("people/vendors/toggleRefresh");
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data)
            this.validationErrors[error.field] = error.message;
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {}
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin],
  props: ["vendor"]
};
</script>
