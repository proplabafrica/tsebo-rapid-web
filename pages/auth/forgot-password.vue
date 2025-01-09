<template>
  <div class="signin-wrapper" :class="appClass">
    <toast />
    <form method="POST" id="forgot-password-form" aria-label="Reset Password">
      <div class="signin-box">
        <h2 class="slim-logo">
          <nuxt-link to="/">
            <img :src="appLogo" alt="App logo" />
          </nuxt-link>
        </h2>
        <h3 class="signin-title-secondary">Password Reset</h3>
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
        </div>

        <v-button :disabled="disabled" @click="sendResetCode()" class="btn btn-primary btn-block btn-signin">Send
          Password Reset Link</v-button>
        <p class="mg-b-0">
          <nuxt-link to="/auth/login">&lBarr; Back</nuxt-link>
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
      uniq_id: "",
      type: "email"
    },
    validationErrors: {
      uniq_id: null
    }
  }),
  head: () => ({
    title: "Forgot Password · Tsebo-Rapid"
  }),
  layout: "",
  methods: {
    async sendResetCode() {
      if (!this.validateForm("forgot-password-form", "validationErrors")) {
        return false;
      }

      this.disabled = true;

      try {
        const response = await this.$axios.post(
          "password-reset/send-code",
          this.credentials
        );
        this.disabled = false;
        this.$router.push("/auth/verify-reset-code");
        this.toast({ title: "Password reset code sent", type: "success" });
      } catch (error) {
        var response = error.response;
        this.disabled = false;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response.status == 400) {
          this.validationErrors.uniq_id = response.data.message;
        } else {}
      }
    }
  },
  mixins: [authMixin, formMixin]
};
</script>
