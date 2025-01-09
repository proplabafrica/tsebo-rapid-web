<template>
  <div>
    <div class="nav-statistics-wrapper">
      <nav class="nav">
        <nuxt-link
          class="nav-link"
          exact-active-class="active"
          :to="`/people/users/details?id=${user.id}`"
          >Requests</nuxt-link
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
