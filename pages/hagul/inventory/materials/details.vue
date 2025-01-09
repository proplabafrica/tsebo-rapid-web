<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/hagul/inventory/materials">Materials</nuxt-link>
        </li>
        <li
          class="breadcrumb-item active"
          aria-current="page"
          v-text="`${!materialLoading ? material.name : 'Material Details'}`"
        ></li>
      </ol>
      <h6
        class="slim-pagetitle"
        v-text="`${!materialLoading ? material.name : 'Material Details'}`"
      ></h6>
    </div>
    <!-- slim-pageheader -->

    <div class="row row-sm" v-if="!materialLoading">
      <div class="col-md-9">
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link
              :to="`/hagul/inventory/materials/details?id=${material.id}`"
              class="nav-link"
              exact-active-class="active"
              >Usage</nuxt-link
            >
          </li>
          <li class="nav-item">
            <nuxt-link
              class="nav-link"
              active-class="active"
              :to="`/hagul/inventory/materials/details/settings?id=${material.id}`"
              >Settings</nuxt-link
            >
          </li>
        </ul>
        <nuxt-child :material="material" @update="updateMaterial()" />
      </div>

      <div class="col-lg-3 mg-t-20 mg-lg-t-0">
        <div class="card pd-25">
          <div class="media-list">
            <div class="media mg-t-25">
              <div>
                <i class="icon ion-ios-information-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Info</h6>
                <span class="d-block tx-inverse" v-if="material.code"
                  >Code: {{ material.code }}</span
                >
                <span class="d-block tx-inverse">
                  Cost:
                  <span
                    v-html="
                      material.currency.unicode +
                      $options.filters.moneyFormat(material.cost)
                    "
                  ></span>
                </span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25" v-if="material.categories.length > 0">
              <div>
                <i class="icon ion-ios-filing-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">
                  Categor{{ material.categories.length > 1 ? "ies" : "y" }}
                </h6>
                <span class="d-block tx-inverse">
                  <span
                    v-for="(category, index) in material.categories"
                    :key="category.id"
                    >{{ category.name
                    }}{{
                      index + 1 >= material.categories.length ? "" : ", "
                    }}</span
                  >
                </span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25">
              <div>
                <i class="icon ion-stats-bars tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Stock</h6>
                <span class="d-block tx-inverse"
                  >Current Stock: {{ material.stock }}</span
                >
                <span class="d-block tx-inverse" v-if="material.max_stock"
                  >Maximum Stock: {{ material.max_stock }}</span
                >
                <span class="d-block tx-inverse" v-if="material.min_stock"
                  >Minimum Stock: {{ material.min_stock }}</span
                >
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/hagul/auth";

export default {
  components: { loading },
  created() {
    this.setMaterial(this.$route.query.id);
  },
  data: () => ({
    material: null,
    materialLoading: true,
    shouldRefresh: true
  }),
  head: () => ({
    title: "Material Details · Hagul"
  }),
  meta: {
    pageName: "materials.show"
  },
  methods: {
    async setMaterial(id) {
      const {
        detailedAssociations,
        materials
      } = this.$store.state.hagul.inventory.materials;
      this.material = materials.find((material) => material.id == id);
      if (this.material && !this.shouldRefresh)
        return (this.materialLoading = false);

      try {
        const material = (
          await this.$axios.get("materials/" + id, {
            params: { associations: detailedAssociations }
          })
        ).data.material;

        this.$store.commit("hagul/inventory/materials/setMaterial", material);
        this.material = this.material ? Object.assign({}, material) : material;
        this.materialLoading = false;
        this.shouldRefresh = false;
        this.$store.commit("hagul/inventory/materials/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    updateMaterial() {
      this.shouldRefresh = true;
      this.materialLoading = true;
      this.setMaterial(this.material.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setMaterial(to.query.id);
    }
  }
};
</script>
