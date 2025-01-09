<template>
  <div class="manager-wrapper mg-t-10">
    <div class="manager-right">
      <nuxt-child :organization="organization" @update="$emit('update')" />
    </div>
    <!-- manager-right -->
    <div class="manager-left">
      <create-role :organization="organization" @update="$emit('update')" />
      <nav class="nav">
        <nuxt-link v-for="role in roles" :key="role.id"
          :to="`/onboarding/organizations/details/settings/roles?id=${organization.id}&role-id=${role.id}`"
          class="nav-link" exact-active-class="active">
          <span v-text="role.name"></span>
        </nuxt-link>
      </nav>
    </div>
    <!-- manager-left -->
  </div>
  <!-- manager-wrapper -->
</template>

<script>
import createRole from "@/components/people/roles/create";

export default {
  components: { createRole },
  data() {
    return {
      roles: []
    }
  },
  created() {
    if (this.organization?.roles?.length > 0) {
      const filteredRoles = [];
      const uniqueNames = new Set();

      for (const obj of this.organization.roles) {
        const name = obj.name;
        if (!uniqueNames.has(name)) {
          uniqueNames.add(name);
          filteredRoles.push(obj);
        }
      }

      this.roles = filteredRoles
      const rolePath = `/onboarding/organizations/details/settings/roles?id=${this.organization.id}&role-id=${this.roles[0].id}`;
      if (this.$route.fullPath != rolePath) this.$router.push(rolePath);
    }
  },
  props: ["organization"]
};
</script>
