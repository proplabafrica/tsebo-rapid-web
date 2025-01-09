<template>
  <div class="section-wrapper" v-if="technician">
    <div class="form-layout">
      <form id="edit-technician-form">
        <div class="form-group">
          <label class="form-control-label">
            Trades
            <span class="tx-danger">*</span>
          </label>
          <div class="row" v-if="!tradesLoading">
            <div class="col-lg-4" v-for="trade in trades" :key="trade.id">
              <label class="ckbox">
                <input type="checkbox" :value="trade.id" v-model="trade_ids" />
                <span v-text="trade.name"></span>
              </label>
            </div>
            <!-- col-4 -->
          </div>
          <!-- row -->
          <loading v-else />
        </div>

        <div class="form-layout-footer tx-center" v-if="trade_ids.length > 0">
          <v-button :disabled="disabled" @click="updateTechnician()" class="btn btn-primary bd-0">UPDATE</v-button>
        </div>
        <!-- form-layout-footer -->
      </form>
    </div>
    <!-- form-layout -->
  </div>
  <!-- section-wrapper -->
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton },
  created() {
    this.setTechnician();
    this.getTrades(this);
  },
  data: () => ({
    disabled: false,
    technician: null,
    trade_ids: [],
    trades: [],
    tradesLoading: true,
    validationErrors: {}
  }),
  head: () => ({
    title: "Edit Technician · Tsebo-Rapid"
  }),
  methods: {
    ...mapActions({
      getTrades: "people/trades/getTrades"
    }),
    setTechnician() {
      this.technician = Object.assign({}, this.user.technician);
      this.trade_ids = this.technician.trades.map((trade) => trade.id);
    },
    async updateTechnician() {
      if (!this.validateForm("edit-technician-form")) return false;
      this.disabled = true;
      this.technician.trade_ids = this.trade_ids;

      try {
        const response = await this.$axios.put(
          `/technicians/${this.technician.id}`,
          { ...this.technician }
        );
        this.disabled = false;
        this.$emit("update");
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
        }
      }
    }
  },
  middleware: ["auth"],
  mixins: [authMixin, formMixin],
  props: ["user"]
};
</script>
