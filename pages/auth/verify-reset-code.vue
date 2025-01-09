<template>
  <div class="signin-wrapper" :class="appClass">
    <toast />
    <form id="verify-reset-code-form" aria-label="Verify Reset Code">
      <div class="signin-box">
        <h2 class="slim-logo">
          <nuxt-link to="/">
            <img :src="appLogo" alt="Hagul logo" />
          </nuxt-link>
        </h2>
        <h3 class="signin-title-secondary">Verify Code & Change Password</h3>

        <div class="form-group">
          <label for="reset_code">
            Password Reset Code
            <span class="tx-danger">*</span>
          </label>
          <input v-model="credentials.reset_code" type="text" class="form-control" name="reset_code" required autofocus
            placeholder="Enter your reset code" />
          <span v-if="validationErrors.reset_code" class="tx-danger" role="alert">
            <small>
              <strong v-text="validationErrors.reset_code"></strong>
            </small>
          </span>
        </div>

        <div class="form-group">
          <label for="reset_code">
            New Password
            <span class="tx-danger">*</span>
          </label>
          <input v-model="credentials.password" type="password" class="form-control" name="password" required autofocus
            placeholder="Enter new password" />
          <span v-if="validationErrors.password" class="tx-danger" role="alert">
            <small>
              <strong v-text="validationErrors.password"></strong>
            </small>
          </span>
        </div>

        <div class="form-group">
          <label for="reset_code">
            Confirm New Password
            <span class="tx-danger">*</span>
          </label>
          <input v-model="credentials.c_password" type="password" class="form-control" name="c_password" required
            autofocus placeholder="Confirm new password" />
          <span v-if="validationErrors.c_password" class="tx-danger" role="alert">
            <small>
              <strong v-text="validationErrors.c_password"></strong>
            </small>
          </span>
        </div>

        <v-button :disabled="disabled" @click="verifyResetCode()" class="btn btn-primary btn-block btn-signin">Submit
        </v-button>
        <p class="mg-b-0">
          <nuxt-link to="/auth/forgot-password">&lBarr; Back</nuxt-link>
        </p>
      </div>
    </form>
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
    disabled: false,
    credentials: {
      reset_code: "",
      password: "",
      c_password: ""
    },
    validationErrors: {
      reset_code: null,
      password: null,
      c_password: null
    }
  }),
  head: () => ({
    title: "Verify Code & Change Password · Tsebo-Rapid"
  }),
  layout: "",
  methods: {
    verifyResetCode() {
      if (!this.validateForm("verify-reset-code-form", "validationErrors")) {
        return false;
      }
      if (this.credentials.password !== this.credentials.c_password) {
        this.validationErrors.password = "Passwords do not match";
        return false;
      }

      this.disabled = true;
      const request = Object.assign(
        { returnWith: ["roles.systemFunctions", "organizations"] },
        this.credentials
      );
      this.$axios
        .post("password-reset/reset", request)
        .then((response) => {
          this.$store.commit("auth/setAuth", response.data);
          this.$axios.setToken(response.data.token, "Bearer");
          this.disabled = false;
          this.$router.replace(this.$store.state.auth.routeAfterLogin);
        })
        .catch((error) => {
          console.log(error);
          var response = error.response;
          this.disabled = false;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else if (response.status == 400) {
            this.validationErrors.reset_code = response.data.message;
          } else {}
        });
    }
  },
  mixins: [authMixin, formMixin]
};
</script>
