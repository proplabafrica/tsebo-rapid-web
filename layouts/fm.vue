<template>
  <app-layout>
    <div class="slim-navbar">
      <div class="container">
        <ul class="nav">
          <nuxt-link
            tag="li"
            exact-active-class="active"
            class="nav-item"
            to="/dashboard/facility-manager"
          >
            <a class="nav-link">
              <i class="icon ion-ios-briefcase-outline"></i>
              <span>Dashboard</span>
            </a>
          </nuxt-link>
          <li
            class="nav-item with-sub"
            :class="{
              active:
                $route.fullPath.includes('maintenance') 
            }"
          >
            <a class="nav-link" href="#">
              <i class="icon ion-ios-cog-outline"></i>
              <span>Work</span>
            </a>
            <div class="sub-item">
              <ul>
                <li>
                  <nuxt-link to="/maintenance/requests">Activity</nuxt-link>
                </li>

                <li>
                  <nuxt-link to="/maintenance/routines">Scheduler</nuxt-link>

                </li>
              </ul>
            </div>
          </li>

          <li
            class="nav-item with-sub"
            :class="{ active: currentActiveRoutes.includes('manage') }"
          >
            <a class="nav-link" href="#">
              <i class="icon ion-ios-grid-view-outline"></i>
              <span>MANAGE</span>
            </a>
            <div class="sub-item">
              <ul>
                <li>
                  <nuxt-link to="/onboarding/organizations"
                    >Organizations</nuxt-link
                  >
                </li>
                <li>
                  <nuxt-link to="/maintenance/float-requests"
                    >Float Requests</nuxt-link
                  >
                </li>

                <li>
                  <nuxt-link to="/reports/incident-reports"
                    >Incident Reports</nuxt-link
                  >
                </li>
              </ul>
            </div>
          </li>
          

        </ul>
      </div>
      <!-- container -->
    </div>
    <!-- slim-navbar -->
    <div class="slim-mainpanel">
      <nuxt />
    </div>
  </app-layout>
</template>

<script>
import authMixin from "@/mixins/auth";
import layoutMixin from "@/mixins/layout";

export default {
  components: {
    "app-layout": () => import("@/components/layouts/app")
  },
  head: () => ({
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: process.env.APP_URL + "/favicon.ico"
      }
    ]
  }),
  mixins: [authMixin, layoutMixin]
};
</script>
