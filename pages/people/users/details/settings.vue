<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          :to="`/people/users/details/settings?id=${user.id}`"
          >General</nuxt-link
        >
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          v-if="user.technician"
          :to="`/people/users/details/settings/technician?id=${user.id}`"
          >Technician</nuxt-link
        >
      </nav>
    </div>
    <!-- nav-statistics-wrapper -->
    <nuxt-child :user="user" @update="$emit('update')" />
  </div>
</template>

<script>
export default {
  props: ["user"]
};
</script>
