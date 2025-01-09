<template>
  <div>
    <span v-modal-open="'rate-purchase-order-modal'">
      <slot>
        <span class="btn btn-primary bd-0">
          Rate
          <i class="icon ion-ios-star tx-14"></i>
        </span>
      </slot>
    </span>

    <v-modal ref="rate-purchase-order-modal">
      <div class="modal-dialog wd-300 wd-sm-400" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body tx-center pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'rate-purchase-order-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Rate Job</h4>
            <form id="rate-purchase-order-form">
              <div v-for="rating in ratings" :key="rating.parameter.id">
                <h4>Client Satisfaction</h4>
                <star-input class="tx-30 mg-5" :rangeArray="[1, 2, 3, 4, 5]" v-model="rating.rating" />
                <div class="form-group">
                  <label class="form-control-label">Remark</label>
                  <div class="input-group pd-x-20">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="icon ion-ios-chatbubble tx-16 lh-0 op-6"></i>
                      </span>
                    </div>
                    <textarea :name="`remark-${rating.parameter.id}`" v-model="rating.remark"
                      class="form-control"></textarea>
                  </div>
                  <small class="tx-bold tx-danger" v-if="validationErrors[`remark-${rating.parameter.id}`]"
                    v-text="validationErrors[`remark-${rating.parameter.id}`]"></small>
                </div>
              </div>
              <div class="form-layout-footer">
                <v-button type="button" class="btn btn-primary pd-x-25" :disabled="disabled" @click="rate()">
                  <i class="icon ion-ios-checkmark-outline"></i> Confirm
                </v-button>
                <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'rate-purchase-order-modal'"
                  aria-label="Close" :disabled="disabled">
                  <i class="icon ion-ios-close-outline"></i> Cancel
                </button>
              </div>
            </form>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import starInput from "@/components/ui/star-input";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";
import authMixin from "@/mixins/auth";

export default {
  components: { starInput, vButton, vModal },
  created() {
    this.getRatingParameters(this);
  },
  data: () => ({
    entityCodes: ["PUO"],
    ratings: [],
    ratingParameters: [],
    ratingParametersLoading: true,
    disabled: false,
    validationErrors: {}
  }),
  methods: {
    ...mapActions({
      getRatingParameters: "performance/ratingParameters/getRatingParameters"
    }),
    async rate() {
      const ratings = this.ratings;

      if (!this.validateForm("rate-purchase-order-form")) return false;
      this.disabled = true;
      // const vendor_rating = vendor.rating;
      // const vendor_remark = vendor.remark;
      // const vendor_rating_parameter_id = vendor.parameter.id;
      const rating = ratings.map((rating) => rating.rating);
      const remark = ratings.map((rating) => rating.remark);
      const rating_parameter_id = ratings.map((rating) => rating.parameter.id);


      const purchase_order_id = this.purchaseOrder.id;

      try {
        try {
          const response = await this.$axios.post("vendor/rate", {
            rating: rating[0],
            remark: remark[0],
            rating_parameter_id: rating_parameter_id[0],
            user_id: this.authUser.id,
            vendor_id: this.purchaseOrder.vendor.id,
            purchase_order_id: purchase_order_id
          });

          this.toast({
            type: "success",
            title: response.data.message
          });
        } catch (e) {
          console.log(e);
        }

        const response = await this.$axios.post("purchase-orders/rate", {
          rating: [5, 5, 5, 5, 5],
          remark: ["rated", "rated", "rated", "rated", "rated"],
          rating_parameter_id: [1, 2, 3, 4, 5],
          purchase_order_id
        });

        this.disabled = false;
        this.closeModal("rate-purchase-order-modal");
        this.rating = null;
        this.$emit("update");
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
        } else {
          this.toast({
            type: "danger",
            title: "Network Error. Please Contact Support"
          });
        }
      }
    },
    setRatings() {
      this.ratings = [];
      for (const parameter of this.ratingParameters) {
        this.ratings.push({
          rating: null,
          remark: null,
          parameter
        });
      }
    }
  },
  mixins: [formMixin, modalMixin, authMixin],
  props: ["purchaseOrder"],
  watch: {
    ratingParameters(val) {
      this.setRatings();
    }
  }
};
</script>
