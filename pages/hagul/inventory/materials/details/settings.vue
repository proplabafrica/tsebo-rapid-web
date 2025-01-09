<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/hagul/inventory/materials/details/settings?id=${material.id}`"
          class="nav-link"
          exact-active-class="active"
          >General</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :material="material" @update="$emit('update')" />
  </div>
</template>

<script>
export default {
  meta: {
    pageName: "materials.update"
  },
  middleware: ["auth", "roleGuard"],
  props: ["material"]
};
</script>
