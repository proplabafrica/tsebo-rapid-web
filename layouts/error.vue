<template>
  <div class="page-error-wrapper">
    <div>
      <h1 class="error-title" v-text="error.statusCode"></h1>
      <h5 class="tx-sm-24 tx-normal" v-text="error.message"></h5>
      <p class="mg-b-50" v-if="defaults[error.statusCode]" v-text="defaults[error.statusCode].description"></p>
      <p class="mg-b-50">
        <nuxt-link :to="backRoute" class="btn btn-error">&larr; Go Home</nuxt-link>
      </p>
      <p class="error-footer">
        &copy; Copyright 2023 &copy; All Rights Reserved.
        <a href="https://www.vampfi.com">Vampfi</a>.
      </p>
    </div>
  </div>
  <!-- page-error-wrapper -->
</template>

<script>
import authMixin from "@/mixins/auth";
export default {
  computed: {
    backRoute() {
      return this.$route.fullPath.includes("/hagul") ? "/hagul" : "/";
    }
  },
  created() {
    if (this.error.description) {
      if (this.defaults[this.error.statusCode]) {
        this.defaults[
          this.error.statusCode
        ].description = this.error.description;
      }
    }


    if (this.error.statusCode == "401") {
      localStorage.clear()
      this.$router.replace("/auth/login")
    }
  },
  data: () => ({
    defaults: {
      "404": {
        description:
          "You may have mistyped the address or the page may have moved. This could also happen if you attempted an invalid action."
      },
      "401": {
        description:
          "You are trying to access a feature without the required authorization or your account has been deactivated. Please contact your System Administrator."
      }
    }
  }),
  head() {
    var context = this;
    return {
      title: context.error.message
    };
  },
  mixins: [authMixin],
  mounted() {
    if (this.$route.fullPath.includes("/hagul")) {
      document.body.classList.add("hagul");
    }
  },
  props: ["error"],
  watch: {
    $route(to, from) {
      if (!to.fullPath.includes("/hagul")) {
        document.body.classList.remove("hagul");
      }
    }
  }
};
</script>
