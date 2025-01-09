<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Float Requests
        </li>
      </ol>
      <h6 class="slim-pagetitle">Float Requests</h6>
    </div>
    <!-- slim-pageheader -->
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/maintenance/float-requests/create"
          class="nav-link"
          exact-active-class="active"
        >
          <i class="icon ion-compose"></i> Create
        </nuxt-link>
        <nuxt-link
          v-show="false"
          to="/maintenance/float-requests"
          class="nav-link"
          exact-active-class="active"
          >All</nuxt-link
        >
        <nuxt-link
          v-show="false"
          class="nav-link"
          exact-active-class="active"
          v-for="(statuses, scope) in floatRequestScopeStatuses"
          :key="scope"
          :to="`/maintenance/float-requests?scope=${scope}`"
          >{{scope}}</nuxt-link
        >
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          to="/maintenance/float-requests/pending"
          >Pending</nuxt-link
        >
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          to="/maintenance/float-requests/approved"
          >Approved</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :floatRequestScopeStatuses="floatRequestScopeStatuses" />
  </div>
</template>

<script>
import authMixin from "@/mixins/auth";

export default {
  data: () => ({
    floatRequestScopeStatuses: {
      pending: ["pending"],
      approved: ["approved"]
    },
    range: {
      start: new Date(),
      end: new Date(),
    },
  }),
  meta: {
    pageName: "float-requests.index"
  },
  middleware: ["auth"],
  mixins: [authMixin]
};
</script>

<style scoped>
.calender {
  transition-property: display;
  transition-duration: 1000ms;
  transition-delay: 500ms;
  box-shadow: 10px 60px 100px 0px rgba(15, 14, 14, 0.1);
  position: absolute;
  left: 25px;
  top: 70px;
  z-index: 300;
  display: none;
}
.show {
  transition-property: display;
  transition-duration: 1s;
  transition-delay: 1s;
  display: block;
}
.wrapper {
  position: fixed;
  background-color: rgba(29, 28, 28, 0.438);
  z-index: 10;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  height: 100%;
  width: 100%;
}
.container {
  overflow-y: scroll;
  margin-top: 20px;
  min-height: 30%;
  width: 95%;
  margin-bottom: 20px;
  background-color: white;
}
.select-month {
  width: 300px;
  margin: 20px 5px;
}
.no-data {
  font-size: 20px;
}

</style>

