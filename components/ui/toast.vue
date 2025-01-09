<template>
  <!-- Position it -->
  <div class="toast-holder">
    <!-- Then put toasts within -->
    <transition-group
      enter-active-class="animated bounceInRight"
      leave-active-class="animated slideOutRight"
    >
      <div
        class="toast fade show tx-white"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        v-for="toast in toasts"
        :key="toast.id"
        :class="classList(toast)"
      >
        <div class="toast-header">
          <!-- <img src="..." class="rounded mr-2" alt="..." /> -->
          <span class="mr-3 tx-20">
            <i
              v-if="toast.type == 'info'"
              class="icon ion-ios-information-outline"
            ></i>
            <i
              v-else-if="toast.type == 'success'"
              class="icon ion-checkmark-circled"
            ></i>
            <i
              v-else-if="toast.type == 'danger' || toast.type == 'warning'"
              class="icon ion-android-warning"
            ></i>
          </span>
          <strong class="mr-auto" v-text="toast.title"></strong>
          <!-- <small>{{ toast.at | dateFormat }}</small> -->
          <span
            class="ml-3 mb-1 tx-20 cursor-pointer"
            aria-hidden="true"
            @click="$store.commit('toast/removeToast', toast.id)"
            >&times;</span
          >
        </div>
        <div class="toast-body" v-if="toast.body" v-html="toast.body"></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  computed: {
    toasts() {
      return this.$store.state.toast.toasts;
    }
  },
  methods: { classList: toast => [`bg-${toast.type}`] }
};
</script>

<style src="@/assets/css/animate.min.css"></style>
