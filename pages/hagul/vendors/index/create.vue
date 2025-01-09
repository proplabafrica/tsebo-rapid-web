<template>
  <form id="register-vendor-form" class="mg-t-20">
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
                v-model="vendor.business_name" required />
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
                v-model="vendor.business_email" />
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
                v-model="vendor.business_phone" required />
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
                v-model="vendor.rep_name" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.rep_name"
              v-text="validationErrors.rep_name"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group">
            <label class="form-control-label">Company Registration <span class="tx-danger">*</span></label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-ios-person tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Company Registration"
                name="company_registration_number" v-model="vendor.company_registration_number" required />
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.company_registration_number"
              v-text="validationErrors.company_registration_number"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
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
              <textarea type="text" class="form-control" name="address" v-model="vendor.address" required></textarea>
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.address" v-text="validationErrors.address"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group mg-b-10-force">
            <label class="form-control-label">
              Country:
              <span class="tx-danger">*</span>
            </label>

            <div class="input-group">
              <select name="country_code" class="form-control" required v-model="vendor.country_code"
                @change="vendor.state = null">
                <option :value="null">Select a Country</option>
                <option v-for="country in countries" :key="country.alpha2Code" :value="country.alpha2Code"
                  v-text="country.name"></option>
              </select>
            </div>
            <input type="text" name="country" class="d-none" />
            <small class="tx-bold tx-danger" v-if="validationErrors.country" v-text="validationErrors.country"></small>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="form-group mg-b-10-force">
            <label class="form-control-label">
              State/Province:
              <span class="tx-danger" v-if="statesByCountry.length > 0">*</span>
            </label>

            <div class="input-group">
              <select name="state" class="form-control" v-model="vendor.state" :required="statesByCountry.length > 0">
                <option :value="null">Select a State/Province</option>
                <option v-for="state in statesByCountry" :key="state.name" :value="state.name" v-text="state.name">
                </option>
              </select>
            </div>
            <input type="text" name="country" class="d-none" />
            <small class="tx-bold tx-danger" v-if="validationErrors.country" v-text="validationErrors.country"></small>
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
                selectOnTab :options="trades" v-model="vendor.trade_ids" :reduce="trade => trade.id"></v-select>
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
                selectOnTab :options="materialCategories" v-model="vendor.material_category_ids"
                :reduce="category => category.id"></v-select>
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
                name="tax_identification_number" v-model="vendor.tax_identification_number" />
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
                v-model="vendor.bank_account_name" :required="accountInfoRequired" />
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
                v-model="vendor.bank_account_number" :required="accountInfoRequired" />
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
              <select class="form-control" name="bank_id" v-model="vendor.bank_id" :required="accountInfoRequired">
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
        <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitVendor()">SUBMIT</v-button>
      </div>
      <!-- form-layout-footer -->
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex'
import vButton from '@/components/ui/v-button'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import authMixin from '@/mixins/hagul/auth'
import formMixin from '@/mixins/forms'
import onboardingMixin from '@/mixins/onboarding'

const getInitialData = () => ({
  banks: [],
  disabled: false,
  materialCategories: [],
  trades: [],
  validationErrors: {},
  vendor: {
    address: '',
    bank_account_name: null,
    bank_account_number: null,
    bank_id: null,
    business_name: null,
    business_email: null,
    business_phone: null,
    material_category_ids: [],
    rep_name: null,
    tax_identification_number: null,
    trade_ids: [],
    country_code: 'NG',
    state: null
  },
  countries: [],
  states: []
})

export default {
  components: { vSelect, vButton },
  computed: {
    accountInfoRequired() {
      return (
        this.vendor.bank_account_name ||
        this.vendor.bank_account_number ||
        this.vendor.bank_id
      )
    },
    statesByCountry() {
      if (this.vendor.country_code == null) return []
      return this.states.filter(
        state => state.country_code == this.vendor.country_code
      )
    }
  },
  created() {
    this.getMaterialCategories(this)
    this.getTrades(this)
    this.getCountries()
    this.getStates()
    this.getBanks()
  },
  data: () => getInitialData(),
  head: () => ({
    title: 'Create Vendors · Hagul'
  }),
  meta: {
    pageName: 'vendors.store'
  },
  methods: {
    ...mapActions({
      getTrades: 'people/trades/getTrades',
      getMaterialCategories:
        'hagul/inventory/materialCategories/getMaterialCategories'
    }),
    async getBanks(callBack = () => { }) {
      this.banks = this.$store.state.onboarding.banks
      if (this.banks.length > 0) {
        callBack()
        return true
      }

      try {
        const banks = (
          await this.$axios.get('banks', {
            params: { country_code: this.vendor.country_code }
          })
        ).data.data
        this.$store.commit('onboarding/setBanks', banks)
        this.banks = this.$store.state.onboarding.banks
        callBack()
      } catch (error) {
        console.log(error)
      }
    },
    async submitVendor() {
      if (!this.validateForm('register-vendor-form')) return false

      this.disabled = true
      const request = Object.assign(this.vendor, { returnWith: true })

      try {
        const response = await this.$axios.post('vendors', request)
        this.disabled = false
        this.$store.commit('people/vendors/setVendor', response.data.vendor)
        this.$store.commit('people/vendors/toggleRefresh')
        var { banks, trades } = this
        var initialData = Object.assign(getInitialData(), { banks, trades })
        Object.assign(this.$data, initialData)
        this.toast({
          type: 'success',
          title: 'Vendor Registered. Activation pending'
        })
      } catch (error) {
        console.log(error)
        this.disabled = false
        this.toast({
          type: 'danger',
          title: 'Vendor Registeration failed.'
        })
        const response = error.response
        if (!response) return
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText
        } else {
        }
      }
    }
  },
  middleware: ['auth', 'roleGuard'],
  mixins: [authMixin, formMixin, onboardingMixin]
}
</script>
