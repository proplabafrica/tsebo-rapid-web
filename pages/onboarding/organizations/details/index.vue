<template>
  <div class="bd-t-0 pd-t-10" v-if="loading == false">
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link :to="`/onboarding/organizations/details?id=${organization.id}`" class="nav-link"
          exact-active-class="active">Levels</nuxt-link>
        <nuxt-link v-if="!isFM" :to="`/onboarding/organizations/details/create-hierarchy?id=${organization.id}`"
          class="nav-link" exact-active-class="active">
          <i class="icon ion-compose"></i> Create Level
        </nuxt-link>
        <nuxt-link v-if="organization.baseHierarchies.length > 0 && !isFM"
          :to="`/onboarding/organizations/details/create-unit?id=${organization.id}`" class="d-none nav-link"
          exact-active-class="active">
          <i class="icon ion-compose"></i> Create Unit
        </nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child v-if="isFM && organization.baseHierarchies" :hierarchies="
      organization.baseHierarchies.filter(
        (hierarchies) => hierarchies.name
      )
    " :organization="organization" :parentHierarchy="{}" :parentUnit="{}" @update="$emit('update')" />
    <nuxt-child v-else :hierarchies="organization.baseHierarchies" :organization="organization" :parentHierarchy="{}"
      :parentUnit="{}" @update="$emit('update')" />
  </div>
  <!-- section-wrapper -->

  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";

export default {
  data: () => ({
    isFM: false,
    fmUnits: [],
    loading: false
  }),
  async created() {
    this.getFMUnits();
  },
  mounted() {
    this.getIsFM();
  },
  methods: {
    async getFMUnits() {
      try {
        this.loading = true;
        const res = await this.$axios.get("/units", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt")
          }
        });


        this.fmUnits = res.data.data.filter(
          (unit) => unit.parent_unit_id == null
        );


        this.loading = false;

        let units = this.organization.baseHierarchies.filter(
          (hierarchies) => hierarchies.name.toLowerCase() == "estate"
        )[0]?.units;


        for (const i in this.fmUnits) {
          for (const j in units) {
            // units, this.fmUnits[i].name, "dfjrfdis");
            if (this.fmUnits[i].name == units[j].name) {
            }
          }
        }

      } catch (error) {
        this.loading = false;

        console.log(error);
      }

    },
    getIsFM() {
      if (this.authUser.roles) {
        for (const i in this.authUser.roles) {
          if (this.authUser.roles[i].code === "FM") {
            this.isFM = true;

            break;
          }
        }
      }
    }
  },
  components: { loading },
  mixins: [authMixin],
  props: ["organization"]
};
</script>
