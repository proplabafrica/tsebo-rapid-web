<template>
  <div id="layout-app" v-if="checkAuth">
    <toast />
    <div class="slim-header">
      <div class="container">
        <div class="slim-header-left">
          <h2 class="slim-logo">
            <nuxt-link to="/">
              <img src="/img/tsebo-rapid.png" alt="Tsebo-Rapid logo" />
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
                  @mousedown="$router.push('/profile')"
                  class="nav-link"
                >
                  <i class="icon ion-ios-person"></i> Profile
                </a>
                <a
                  href="#"
                  @mousedown="$router.push('/hagul')"
                  class="nav-link"
                  v-if="authorized('vendors.store')"
                >
                  <i class="icon ion-shuffle"></i> Hagul
                </a>
                <a
                  href="#"
                  @mousedown="
                    $router.push('/metrogardensiotsensors/metrogardens/fmview')
                  "
                  class="nav-link"
                  v-if="isFMOfMetro"
                >
                  <i class="icon ion-speedometer"></i> IoT
                </a>
                <a
                  href="#"
                  @mousedown="$router.push('/iot')"
                  class="nav-link"
                  v-if="authorized('vendors.store')"
                >
                  <i class="icon ion-speedometer"></i> IoT
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
        <p>
          Copyright {{ currentYear() }} &copy; All Rights Reserved. Proplab
          Africa
        </p>
        <p>
          Designed and Developed by:
          <a
            style="color: #1caf9a"
            target="_blank"
            href="https://proplab.africa/"
            >PropLab Africa</a
          >
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
  async created() {
    const res = await this.$axios.get("/units", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    });
    let user = localStorage.getItem("user");
    let authUser;
    let units;
    let metro;
    let isFM;
    if (user) {
      authUser = JSON.parse(user);
    }

    units = res.data.data;
    if (units.length > 0) {
      let unitsArray = []
      // "name is the full...", units);
      metro =
      units
        .filter((o) => o.name !== null)
        .find((o) => o.name.toLowerCase().includes("metro garden"));
      isFM = authUser.roles.find((r) => r.code == "FM");

      if (isFM && metro) {
        this.isFMOfMetro = true;
      }
    }
  },
  data: () => ({
    isFMOfMetro: false,
    showProfileDropDown: false
  }),
  methods: {
    logout() {
      this.$store.dispatch("auth/logout", this);
    }
  },
  // middleware: ["auth"],
  mixins: [authMixin]
};
</script>
