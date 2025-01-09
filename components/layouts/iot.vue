<template>
  <div id="layout-app" v-if="checkAuth">
    <!-- sidebar -->
    <div class="d-flex flex-row">
      <nav class="n-bar" @mouseleave="mouseLeaveNav">
        <ul class="n-bar-nav">
          <li class="logo">
            <a class="n-link">
              <svg
                width="32"
                height="37"
                viewBox="0 0 32 37"
                fill="#4ECB71"
                xmlns="http://www.w3.org/2000/svg"
                class="svg-green"
              >
                <path
                  d="M16.0216 19.7285L6.30735 29.5567C5.63592 30.236 4.55021 30.236 3.88592 29.5567L2.27164 27.9235C1.60021 27.2442 1.60021 26.1457 2.27164 25.4736L9.15735 18.5072L2.27164 11.5408C1.60021 10.8615 1.60021 9.7631 2.27164 9.09103L3.87878 7.44337C4.55021 6.76407 5.63592 6.76407 6.30021 7.44337L16.0145 17.2715C16.6931 17.9508 16.6931 19.0492 16.0216 19.7285V19.7285ZM29.7359 17.2715L20.0216 7.44337C19.3502 6.76407 18.2645 6.76407 17.6002 7.44337L15.9859 9.07658C15.3145 9.75587 15.3145 10.8543 15.9859 11.5264L22.8716 18.4928L15.9859 25.4592C15.3145 26.1385 15.3145 27.2369 15.9859 27.909L17.6002 29.5422C18.2716 30.2215 19.3574 30.2215 20.0216 29.5422L29.7359 19.7141C30.4074 19.0492 30.4074 17.9508 29.7359 17.2715Z"
                  fill="#4ECB71"
                />
              </svg>

              <span class="link-text logo-text"> IOT Dashboard </span>
            </a>
          </li>

          <li class="n-item mg-t-10" @mouseover="mouseOver((index = 0))">
            <a class="n-link" @click="dropdown($event)">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.9998 2.59L15.2798 3.28L2.27979 16.28L3.71979 17.72L4.99979 16.44V28H13.8298L15.9998 22H12.3798L16.0098 15.79L15.9998 20H19.5498L17.9398 28H26.9998V16.44L28.2798 17.72L29.7198 16.28L16.7198 3.28L15.9998 2.59V2.59ZM15.9998 5.44L24.9998 14.44V26H20.3798L21.9998 18H17.9998V12H15.8998L9.99979 22.11V24H13.1498L12.4298 26H6.99979V14.44L15.9998 5.44Z"
                  fill="white"
                />
              </svg>
              <span class="link-text"> Power & utility systems </span>
            </a>
            <div class="sidebar-submenu">
              <ul>
                <li>
                  <nuxt-link to="#"
                    >Generator Metrics
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="/iot">Diesel Tanks</nuxt-link>
                </li>
                <li>
                  <nuxt-link to="#"
                    >Vend Power
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="#">
                    Water Consumption
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </li>
          <li class="n-item" @mouseover="mouseOver((index = 1))">
            <a class="n-link" @click="dropdown($event)">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.6708 17.5173V24.6667H3.3335"
                  stroke="white"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M28.4134 14.1433L25.8381 13.4533L23.1694 18.26L27.0334 19.2953L28.4134 14.1433V14.1433Z"
                  stroke="white"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M25.8382 13.4533L23.1695 18.26L22.0082 20.0193L3.3335 15.0153L5.74883 6L27.0002 11.694L25.8388 13.4533H25.8382Z"
                  stroke="white"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span class="link-text"> Safety & surveillance </span>
            </a>
            <div class="sidebar-submenu">
              <ul>
                <li>
                  <nuxt-link class="bg-red" to="#">
                    Fire Alarm Feed
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link class="bg-red" to="#"
                    >Sprinkler Panic Trigger
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link class="bg-red" to="#">
                    Link to CCTV Live
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </li>
          <li class="n-item" @mouseover="mouseOver((index = 2))">
            <a class="n-link" @click="dropdown($event)">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 19H6V17C6.00079 16.2046 6.31712 15.442 6.87956 14.8796C7.44199 14.3171 8.20459 14.0008 9 14H14V16H9C8.73486 16.0003 8.48066 16.1057 8.29319 16.2932C8.10571 16.4807 8.00026 16.7349 8 17V19Z"
                  fill="white"
                />
                <path
                  d="M12 13C11.2089 13 10.4355 12.7654 9.77772 12.3259C9.11993 11.8864 8.60723 11.2616 8.30448 10.5307C8.00173 9.79983 7.92252 8.99556 8.07686 8.21964C8.2312 7.44372 8.61216 6.73098 9.17157 6.17157C9.73098 5.61216 10.4437 5.2312 11.2196 5.07686C11.9956 4.92252 12.7998 5.00173 13.5307 5.30448C14.2616 5.60723 14.8864 6.11992 15.3259 6.77772C15.7654 7.43552 16 8.20888 16 9C15.9987 10.0605 15.5768 11.0771 14.827 11.827C14.0771 12.5768 13.0605 12.9987 12 13ZM12 7C11.6044 7 11.2178 7.1173 10.8889 7.33706C10.56 7.55683 10.3036 7.86918 10.1522 8.23464C10.0009 8.60009 9.96126 9.00222 10.0384 9.39018C10.1156 9.77814 10.3061 10.1345 10.5858 10.4142C10.8655 10.6939 11.2219 10.8844 11.6098 10.9616C11.9978 11.0387 12.3999 10.9991 12.7654 10.8478C13.1308 10.6964 13.4432 10.44 13.6629 10.1111C13.8827 9.78224 14 9.39556 14 9C13.9995 8.46973 13.7886 7.96133 13.4136 7.58637C13.0387 7.21142 12.5303 7.00053 12 7V7Z"
                  fill="white"
                />
                <path
                  d="M20 20C19.2089 20 18.4355 19.7654 17.7777 19.3259C17.1199 18.8864 16.6072 18.2616 16.3045 17.5307C16.0017 16.7998 15.9225 15.9956 16.0769 15.2196C16.2312 14.4437 16.6122 13.731 17.1716 13.1716C17.731 12.6122 18.4437 12.2312 19.2196 12.0769C19.9956 11.9225 20.7998 12.0017 21.5307 12.3045C22.2616 12.6072 22.8864 13.1199 23.3259 13.7777C23.7654 14.4355 24 15.2089 24 16C23.9987 17.0605 23.5768 18.0771 22.827 18.827C22.0771 19.5768 21.0605 19.9987 20 20V20ZM20 14C19.6044 14 19.2178 14.1173 18.8889 14.3371C18.56 14.5568 18.3036 14.8692 18.1522 15.2346C18.0009 15.6001 17.9613 16.0022 18.0384 16.3902C18.1156 16.7781 18.3061 17.1345 18.5858 17.4142C18.8655 17.6939 19.2219 17.8844 19.6098 17.9616C19.9978 18.0387 20.3999 17.9991 20.7654 17.8478C21.1308 17.6964 21.4432 17.44 21.6629 17.1111C21.8827 16.7822 22 16.3956 22 16C21.9995 15.4697 21.7886 14.9613 21.4136 14.5864C21.0387 14.2114 20.5303 14.0005 20 14Z"
                  fill="white"
                />
                <path
                  d="M26 26H24V24C23.9997 23.7349 23.8943 23.4807 23.7068 23.2932C23.5193 23.1057 23.2651 23.0003 23 23H17C16.7349 23.0003 16.4807 23.1057 16.2932 23.2932C16.1057 23.4807 16.0003 23.7349 16 24V26H14V24C14.0008 23.2046 14.3171 22.442 14.8796 21.8796C15.442 21.3171 16.2046 21.0008 17 21H23C23.7954 21.0008 24.558 21.3171 25.1204 21.8796C25.6829 22.442 25.9992 23.2046 26 24V26Z"
                  fill="white"
                />
                <path
                  d="M8 30H4C3.46973 29.9995 2.96133 29.7886 2.58637 29.4136C2.21141 29.0387 2.00053 28.5303 2 28V4C2.00053 3.46973 2.21141 2.96133 2.58637 2.58637C2.96133 2.21141 3.46973 2.00053 4 2H8V4H4V28H8V30Z"
                  fill="white"
                />
                <path
                  d="M28 30H24V28H28V4H24V2H28C28.5303 2.00053 29.0387 2.21141 29.4136 2.58637C29.7886 2.96133 29.9995 3.46973 30 4V28C29.9995 28.5303 29.7886 29.0387 29.4136 29.4136C29.0387 29.7886 28.5303 29.9995 28 30Z"
                  fill="white"
                />
              </svg>
              <span class="link-text"> Access control </span>
            </a>
            <div class="sidebar-submenu">
              <ul>
                <li>
                  <nuxt-link to="#">
                    Motion Detection
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
                <li>
                  <nuxt-link to="#">
                    People Counter
                    <span class="coming_soon" style="color: red; font-size: 8px"
                      >Coming soon</span
                    >
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </li>
          <li class="n-item" @mouseover="mouseOver((index = 2))">
            <a class="n-link" @click="dropdown($event)">
              <i class="ion-ios-settings-strong"></i>
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex-grow-1">
        <toast />
        <div class="slim-header">
          <div class="container">
            <div class="slim-header-left">
              <h2 class="slim-logo">
                <nuxt-link to="/">
                  <img src="/img/Tsebo-Rapid.jpg" alt="Hagul logo" />
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
                      @mousedown="$router.push('/account/purchase-orders')"
                      class="nav-link"
                    >
                      <i class="icon ion-ios-book-outline"></i> Account
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
              Copyright {{ currentYear() }} &copy; All Rights Reserved. Vampfi
            </p>
            <p>
              Designed and Developed by:
              <a
                style="color: #1caf9a"
                target="_blank"
                href="https://vampfi.com/"
                >Vampfi</a
              >
            </p>
          </div>
          <!-- container -->
        </div>
        <!-- slim-footer -->
      </div>
    </div>
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
    showProfileDropDown: false,
    expanded: false,
    hovering: false,
    topMenuItem: null,
    topMenuHover: false,
    index: null
  }),
  methods: {
    mouseOver(index) {
      this.topMenuItem = index;
    },
    mouseOverNav() {
      this.topMenuHover = true;
    },
    mouseLeaveNav() {
      this.topMenuHover = false;
      const submenuElements =
        document.getElementsByClassName("sidebar-submenu");
      for (var el of submenuElements) {
        el.style.display = "none";
      }
    },
    dropdown(event) {
      event.preventDefault();
      const submenuElements =
        document.getElementsByClassName("sidebar-submenu");
      const ele = submenuElements[this.index];
      const submenuStyle = getComputedStyle(ele);
      const navEle = document.querySelector(".n-bar");
      const navStyle = getComputedStyle(navEle);

      for (var el of submenuElements) {
        if (ele === el) {
          if (submenuStyle.display == "none" && navEle.matches(":hover")) {
            ele.style.display = "block";
            this.expanded = true;
          } else if (
            submenuStyle.display == "block" &&
            navEle.matches(":hover")
          ) {
            ele.style.display = "none";
            this.expanded = false;
          }
        } else {
          el.style.display = "none";
        }
      }
    },
    logout() {
      this.$store.dispatch("auth/logout", this);
    }
  },
  mixins: [authMixin],
  mounted() {
    document.body.classList.add("iot");
  },
  destroyed() {
    document.body.classList.remove("iot");
  }
};
</script>
