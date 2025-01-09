<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          :to="`/assets/equipment/details?id=${equipment.id}`"
          class="nav-link"
          exact-active-class="active"
          >Reactive Jobs</nuxt-link
        >
        <nuxt-link
          :to="`/assets/equipment/details/schedule?id=${equipment.id}`"
          class="nav-link"
          active-class="active"
          >Schedule</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :equipment="equipment" @update="$emit('update')" />
  </div>
</template>

<script>
export default {
  props: ["equipment"]
};
</script>
