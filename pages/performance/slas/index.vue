<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item" v-for="link in links">
          <nuxt-link :to="link.link" v-if="link.link">{{ link.label }}</nuxt-link>
          <span v-else aria-current="page" class="active">{{ link.label }}</span>
        </li>

      </ol>
      <h6 class="slim-pagetitle">{{ pageTitle }}</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper" v-if="showNavStats">
      <nav class="nav">
        <nuxt-link to="/performance/slas" class="nav-link" exact-active-class="active"
          v-action-show="'slas.store'">SLAs</nuxt-link>
        <nuxt-link to="/performance/slas/performance-by-month" class="nav-link" exact-active-class="active">By
          Month</nuxt-link>
        <nuxt-link to="/performance/slas/facility-managers" class="nav-link" exact-active-class="active"
          v-show="false">Facility Managers</nuxt-link>
        <nuxt-link to="/performance/slas/fm-rankings" class="nav-link" exact-active-class="active" v-show="false">FM
          Rankings</nuxt-link>
        <nuxt-link to="/performance/slas/trade-rankings" class="nav-link" exact-active-class="active"
          v-show="false">Trade Rankings</nuxt-link>
        <nuxt-link to="/performance/slas/technician-rankings" class="nav-link" exact-active-class="active"
          v-show="false">Technician Rankings</nuxt-link>
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child @updateVals="updateVals" />

  </div>
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  data: () => ({
    links: [
      {
        label: 'Home',
        link: '/hagul'
      },
      {
        label: 'Performance',
        link: '/performance/slas'
      },
      {
        label: 'SLAs',
      },
    ],
    pageTitle: 'Performance',
    showNavStats: true
  }),
  methods: {
    updateVals(links, pageTitle, showNavStats) {

      this.links = links;
      this.pageTitle = pageTitle;
      this.showNavStats = showNavStats;
    }
  },
  meta: {
    pageName: "slas.index"
  },
  mixins: [authMixin]
};
</script>
