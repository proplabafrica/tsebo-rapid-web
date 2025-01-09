<template>
  <form id="add-features-to-subscription-package-form" class="pd-t-5 pd-lg-t-0 pd-lg-l-10">
    <div class="form-layout">
      <div class="row mg-b-25">
        <div class="col-12 col-md-8" v-for="(feature, index) in featureArray" :key="`feature-${index}`">
          <div class="form-group">
            <div class="input-group">
              <v-select placeholder="Feature Name" class="form-control" label="name" selectOnTab
                :options="featureOptions" v-model="features[index].name" taggable :reduce="(feature) => feature.name">
              </v-select>
              <input class="d-none" :name="'name' + index" v-model="features[index].name" required />
              <div class="input-group-append cursor-pointer" v-if="index != 0" @click="deleteFeature(index)">
                <span class="input-group-text bg-danger tx-white">
                  <i class="icon ion-trash-a tx-16 lh-0"></i>
                </span>
              </div>
              <div class="input-group-append cursor-pointer" @click="add1Feature()">
                <span class="input-group-text">+</span>
              </div>
            </div>
            <small class="tx-bold tx-danger" v-text="validationErrors['name' + index]"></small>
          </div>
        </div>
      </div>
      <!-- row -->

      <div class="form-layout-footer">
        <v-button class="btn btn-primary bd-0 float-right" @click="submitFeatures()" :disabled="disabled">Finish &rarr;
        </v-button>
      </div>
      <!-- form-layout-footer -->
    </div>
    <!-- form-layout -->
  </form>
</template>

<script>
import formMixin from "@/mixins/forms";
import vButton from "@/components/ui/v-button";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
  created() {
    this.add1Feature();
    this.getFeatures();
  },
  components: {
    vButton,
    vSelect
  },
  computed: {
    featureOptions() {
      return this.subscriptionFeatures.filter((subscriptionFeature) => {
        const feature = this.features.find((feature) => {
          return subscriptionFeature.id == feature.id;
        });
        return !feature;
      });
    }
  },
  data: () => ({
    disabled: false,
    features: [],
    featureArray: [],
    subscriptionFeatures: [],
    validationErrors: {}
  }),
  methods: {
    add1Feature() {
      this.featureArray.push({});
      this.features.push({ name: "", id: null });
      this.validationErrors["name" + (this.features.length - 1)] = null;
    },
    deleteFeature(index) {
      this.featureArray.splice(index, 1);
      this.features.splice(index, 1);
      delete this.validationErrors["name" + index];
    },
    getFeatures() {
      this.subscriptionFeatures =
        this.$store.state.onboarding.subscriptionPackages.features;
      if (this.subscriptionFeatures.length > 0) {
        return true; //TODO:: Show loading option and remove return
      }
      this.$axios
        .get("subscription-features")
        .then((response) => {
          this.$store.commit(
            "onboarding/subscriptionPackages/setFeatures",
            response.data.data
          );
          this.subscriptionFeatures =
            this.$store.state.onboarding.subscriptionPackages.features;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitFeatures() {
      if (!this.validateForm("add-features-to-subscription-package-form")) {
        return false;
      }
      this.disabled = true;
      var id = [],
        name = [],
        subscription_package_id = [];
      for (const feature of this.features) {
        id.push(feature.id),
          name.push(feature.name),
          subscription_package_id.push(this.subscriptionPackage.id);
      }

      this.$axios
        .post("subscription-packages/add-features", {
          name,
          id,
          subscription_package_id
        })
        .then((response) => {
          this.disabled = false;
          this.$emit("featuresAdded", response.data.subscriptionPackage);
          this.toast({ type: "info", title: "Features Added" });
        })
        .catch((error) => {
          this.disabled = false;
          var response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else {
            // response);
            this.toast({
              type: "danger",
              title: "Network Error. Please Contact Support"
            });
          }
        });
    }
  },
  mixins: [formMixin],
  props: ["subscriptionPackage"]
};
</script>
