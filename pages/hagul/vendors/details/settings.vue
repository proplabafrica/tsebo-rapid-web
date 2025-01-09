<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          :to="`/hagul/vendors/details/settings?id=${vendor.id}`"
          >General</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :vendor="vendor" @update="$emit('update')" />
  </div>
</template>

<script>
export default {
  props: ["vendor"]
};
</script>
