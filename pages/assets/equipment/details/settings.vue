<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/assets/equipment/details/settings?id=${equipment.id}`"
          class="nav-link"
          exact-active-class="active"
          >General</nuxt-link
        >
        <nuxt-link
          :to="`/assets/equipment/details/settings/files?id=${equipment.id}`"
          class="nav-link"
          exact-active-class="active"
          >Files</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :equipment="equipment" @update="$emit('update')" />
  </div>
  <!-- section-wrapper -->
</template>

<script>
export default {
  meta: {
    pageName: "equipment.show"
  },
  middleware: ["auth", "roleGuard"],
  props: ["equipment"]
};
</script>
