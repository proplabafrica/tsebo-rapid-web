<template>
  <div class="bd-t-0 pd-t-10">
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/onboarding/organizations/details/settings?id=${organization.id}`"
          class="nav-link"
          exact-active-class="active"
          >General</nuxt-link
        >
        <nuxt-link
          v-if="!isFM"
          :to="`/onboarding/organizations/details/settings/roles?id=${organization.id}`"
          class="nav-link"
          active-class="active"
          >Roles</nuxt-link
        >
      </nav>
      <!-- {{authUser.roles}} -->
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :organization="organization" @update="$emit('update')" />
  </div>
  <!-- section-wrapper -->
</template>

<script>
import loading from "@/components/ui/loading";
import authMixin from "@/mixins/auth";

export default {
  components: { loading },
  // async created() {
  //   this.getFMUnits;
  // },
  mounted() {
    this.getIsFM;
  },
  data: () => ({
    isFM: false,
    fmUnits: [],
    loading: false
  }),
  computed: {

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
  mixins: [authMixin],
  props: ["organization"],
};
</script>
