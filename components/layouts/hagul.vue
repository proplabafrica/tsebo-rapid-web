<template>
  <div v-if="checkAuth">
    <toast />
    <div class="slim-header">
      <div class="container">
        <div class="slim-header-left">
          <h2 class="slim-logo">
            <nuxt-link to="/hagul">
              <img src="/img/tsebo-rapid.png" alt="Hagul logo" />
            </nuxt-link>
          </h2>
          <div class="search-box hide"></div>
        </div>
        <div class="slim-header-right">
          <bell-notifications />
          <div class="dropdown dropdown-c">
            <a
              href="javascript:void(0);"
              class="logged-user"
              @click="showProfileDropDown = !showProfileDropDown"
              @blur="showProfileDropDown = false"
            >
              <img
                :src="
                  authUser.image_path
                    ? authUser.image_path
                    : 'https://via.placeholder.com/500'
                "
                :alt="'image of ' + authUser.name"
                @error="
                  (e) => (e.target.src = 'https://via.placeholder.com/500')
                "
              />
            </a>
            <div
              class="dropdown-menu dropdown-menu-right"
              :class="{ show: showProfileDropDown }"
            >
              <nav class="nav">
                <a
                  href="#"
                  @mousedown="$router.push('/')"
                  class="nav-link"
                  v-action-show="'client-requests.index'"
                >
                  <i class="icon ion-shuffle"></i> Tsebo Rapid
                </a>
                <!-- <a href="#" @mousedown="$router.push('/iot')" class="nav-link" v-if="authorized('vendors.store')">
                  <i class="icon ion-speedometer"></i> IOT
                </a> -->
                <a
                  href="#"
                  @mousedown="$router.push('/account/purchase-orders')"
                  class="nav-link"
                >
                  <i class="icon ion-ios-book-outline"></i> Account
                </a>
                <a
                  href="#"
                  @mousedown="$router.push('/profile')"
                  class="nav-link d-none"
                >
                  <i class="icon ion-ios-person"></i> Profile
                </a>
                <a href="#" @mousedown="logout()" class="nav-link">
                  <i class="icon ion-forward"></i> Log Out
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <slot></slot>

    <div class="slim-footer">
      <div class="container">
        <p>Copyright 2023 &copy; All Rights Reserved. Vampfi</p>
        <p>
          Designed and Developed by:
          <a target="_blank" href="https://vampfi.com/">Vampfi</a>
        </p>
      </div>
      <!-- container -->
    </div>
    <!-- slim-footer -->
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";
export default {
  components: {
    "bell-notifications": () => import("@/components/ui/bell-notifications"),
    toast: () => import("@/components/ui/toast")
  },
  data: () => ({
    showProfileDropDown: false
  }),
  destroyed() {
    document.body.classList.remove("hagul");
  },
  loading: "#808080",
  methods: {
    logout() {
      var context = this;
      this.$store.dispatch("auth/logout", context);
    }
  },
  mixins: [authMixin],
  mounted() {
    document.body.classList.add("hagul");
  }
};
</script>
