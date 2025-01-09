<template>
  <div class="signin-wrapper" :class="appClass">
    <toast />
    <div class="signin-box">
      <h2 class="slim-logo">
        <nuxt-link to="/">
          <img :src="appLogo" alt="App logo" />
        </nuxt-link>
      </h2>
      <h3 class="signin-title-secondary">Sign in to continue.</h3>

      <form id="login-form" method="post" aria-label="login">
        <div class="form-group">
          <label for="uniq_id" class="text-capitalize">
            {{ credentials.type }}
            <span class="tx-danger">*</span>
          </label>
          <input v-model="credentials.uniq_id" :type="credentials.type" class="form-control" name="uniq_id" required
            autofocus :placeholder="'Enter your ' + credentials.type" />
          <span v-if="validationErrors.uniq_id" class="tx-danger" role="alert">
            <small>
              <strong v-text="validationErrors.uniq_id"></strong>
            </small>
          </span>
          <span v-if="validationErrors.email" class="tx-danger" role="alert">
            <small>
              <strong v-text="validationErrors.email"></strong>
            </small>
          </span>
        </div>

        <div class="form-group">
          <label for="uniq_id">
            Password
            <span class="tx-danger">*</span>
          </label>
          <input v-model="credentials.password" type="password" class="form-control" name="password" required
            placeholder="Enter your password" />
          <span v-if="validationErrors.password" class="tx-danger" role="alert">
            <small>
              <strong v-text="validationErrors.password"></strong>
            </small>
          </span>
        </div>

        <v-button :disabled="disabled" @click="login()" class="btn btn-primary btn-block btn-signin">Sign In</v-button>

        <p class="mg-b-0">
          <nuxt-link to="/auth/forgot-password">Forgot Password?</nuxt-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

export default {
  components: {
    "v-button": () => import("@/components/ui/v-button"),
    toast: () => import("@/components/ui/toast")
  },
  data: () => ({
    credentials: {
      uniq_id: "",
      password: "",
      type: "email"
    },
    disabled: false,
    validationErrors: {
      uniq_id: null,
      password: null
    }
  }),
  head: () => ({
    title: "Login · Tsebo-Rapid"
  }),
  layout: "",
  methods: {
    async login() {
      if (!this.validateForm("login-form", "validationErrors")) return false;
      this.disabled = true;
      const request = Object.assign(
        { returnWith: ["roles.systemFunctions", "organizations"] },
        this.credentials
      );

      try {
        const response = await this.$axios.post("oauth/login", request);
        this.$store.commit("auth/setAuth", response.data);
        this.$axios.setToken(response.data.token, "Bearer");
        this.disabled = false;
        this.$router.replace(this.$store.state.auth.routeAfterLogin);
        this.toast({ type: "success", title: "Login Successful" });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        var response = error.response;
        if (response?.status == 422 || response?.status == 401) {
          for (const error of response.data)
            this.validationErrors[error.field] = error.message;
        } else if (response?.status == 403) {
          this.validationErrors.email = response.data.message;
        } else if (response?.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {}
      }
    }
  },
  mixins: [authMixin, formMixin]
};
</script>
