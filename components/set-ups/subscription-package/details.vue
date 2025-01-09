<template>
  <form id="subscription-package-details-form" class="pd-t-5 pd-lg-t-0 pd-lg-l-10">
    <div class="form-layout">
      <div class="row mg-b-25">
        <div class="col-lg-6">
          <div class="form-group">
            <label class="form-control-label">
              Name:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="icon ion-document-text tx-16 lh-0 op-6"></i>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="Name" v-model="pkg.name" name="name" required />
            </div>
            <!-- input-group -->
            <small class="tx-bold tx-danger" v-if="validationErrors.name" v-text="validationErrors.name"></small>
          </div>
        </div>
        <!-- col-4 -->
        <div class="col-lg-6">
          <div class="form-group">
            <label class="form-control-label">
              Base Price:
              <span class="tx-danger">*</span>
              <span>&#8358;{{ pkg.base_price | moneyFormat }}</span>
            </label>
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">&#8358;</span>
              </div>
              <input type="number" step="any" class="form-control" placeholder="Base Price" v-model="pkg.base_price"
                name="base_price" required />
            </div>
            <!-- input-group -->
            <small class="tx-bold tx-danger" v-if="validationErrors.base_price"
              v-text="validationErrors.base_price"></small>
          </div>
        </div>
        <!-- col-6 -->
        <div class="col-lg-5">
          <div class="form-group mg-b-10-force">
            <label class="form-control-label">
              Duration:
              <span class="tx-danger">*</span>
            </label>
            <div class="input-group">
              <input name="duration" type="number" step="any" v-model="pkg.duration" placeholder="Duration"
                class="form-control" required />
              <div class="input-group-append">
                <select name="duration_unit" v-model="pkg.duration_unit" class="form-control">
                  <option v-for="timeUnit in getTimeUnits(['week', 'year'])" :key="timeUnit.id" :value="timeUnit.value"
                    v-text="timeUnit.name + '(s)'"></option>
                </select>
              </div>
            </div>
            <small class="tx-bold tx-danger" v-if="validationErrors.description"
              v-text="validationErrors.description"></small>
          </div>
        </div>
        <!-- col-5 -->
        <div class="col-lg-7">
          <div class="form-group">
            <label class="form-control-label">
              Description:
              <span class="tx-danger">*</span>
            </label>
            <textarea name="description" class="form-control" v-model="pkg.description" required></textarea>
            <small class="tx-bold tx-danger" v-if="validationErrors.description"
              v-text="validationErrors.description"></small>
          </div>
        </div>
        <!-- col-7 -->
      </div>
      <!-- row -->

      <div class="form-layout-footer">
        <v-button class="btn btn-primary bd-0 float-right" :disabled="disabled" @click="submitPackageDetails()">Next
          &rarr;</v-button>
      </div>
      <!-- form-layout-footer -->
    </div>
    <!-- form-layout -->
  </form>
</template>

<script>
import formMixin from "@/mixins/forms";
import timeFunctions from "@/mixins/timeFunctions";
import vButton from "@/components/ui/v-button";

export default {
  components: {
    vButton
  },
  data: () => ({
    disabled: false,
    pkg: {
      name: "",
      base_price: null,
      description: "",
      duration: "",
      duration_unit: 24 * 7
    },
    validationErrors: {
      name: null,
      base_price: null,
      description: null,
      duration: null
    }
  }),
  methods: {
    submitPackageDetails() {
      if (!this.validateForm("subscription-package-details-form")) {
        return false;
      }
      this.disabled = true;
      this.pkg.duration_in_seconds =
        this.pkg.duration * this.pkg.duration_unit * 3600;
      this.$axios
        .post("subscription-packages", this.pkg)
        .then(response => {
          this.disabled = false;
          this.$store.commit(
            "onboarding/subscriptionPackages/setSubscriptionPackage",
            response.data.subscriptionPackage
          );
          this.$emit("detailsDone", response.data.subscriptionPackage);
          this.toast({ type: "info", title: "Organization Details Complete" });
        })
        .catch(error => {
          this.disabled = false;
          var response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else {
            this.toast({
              type: "danger",
              title: "Network Error. Please Contact Support"
            });
          }
        });
    }
  },
  mixins: [formMixin, timeFunctions]
};
</script>
