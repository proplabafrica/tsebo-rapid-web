<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/assets/maintenance">Asset Registry</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/assets/maintenance/hospital-list"
            >Facilities</nuxt-link
          >
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Gbagada General Hospital
        </li>
      </ol>
      <h6 class="slim-pagetitle">Gbagada General Hospital</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          to="/assets/maintenance/details"
          class="nav-link"
          exact-active-class="active"
          >Assets</nuxt-link
        >
        <nuxt-link
          to="/assets/maintenance/details/activity"
          class="nav-link"
          exact-active-class="active"
          >Activity</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child />
  </div>
</template>
