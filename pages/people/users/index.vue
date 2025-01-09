<template>
  <div class="container">
    <div class="manager-header">
      <div class="slim-pageheader">
        <ol class="breadcrumb slim-breadcrumb">
          <li class="breadcrumb-item">
            <nuxt-link to="/">Dashboard</nuxt-link>
          </li>
          <li class="breadcrumb-item">Users</li>
        </ol>
        <h6 class="slim-pagetitle">Users</h6>
      </div>
      <!-- slim-pageheader -->
      <a @click="togglePanelDisplay()" id="contactNavicon" class="contact-navicon">
        <i class="icon ion-navicon-round"></i>
      </a>
    </div>
    <!-- manager-header -->

    <div class="manager-wrapper" v-if="!rolesLoading && windowWidth > 1200">
      <nuxt-child :roles="filteredRoles" ref="childComponentRef" />
      <div class="manager-left" ref="managerLeft">
        <!-- {{ roles }} -->
        <nuxt-link to="/people/users/create" class="btn btn-contact-new">ADD NEW USER</nuxt-link>
        <nav class="nav">
          <nuxt-link v-for="role in filteredRoles" :key="role.id" :to="`/people/users?role-id=${role.id}`"
            class="nav-link" exact-active-class="active">
            <span v-text="role.name"></span>
            <span v-text="role.__meta__.users_count"></span>
          </nuxt-link>
          <nuxt-link to="/people/users" class="nav-link" exact-active-class="active">
            <span>All Users</span>
            <span v-text="usersTotal"></span>
          </nuxt-link>
        </nav>
      </div>
      <!-- manager-left -->
    </div>
    <!-- manager-wrapper -->
    <div class="manager-wrapper" v-else-if="!rolesLoading">
      <div class="manager-left" ref="managerLeft">
        <!-- {{ roles }} -->
        <nuxt-link to="/people/users/create" class="btn btn-contact-new">ADD NEW USER</nuxt-link>
        <nav class="nav">
          <nuxt-link v-for="role in filteredRoles" :key="role.id" :to="`/people/users?role-id=${role.id}`"
            class="nav-link" exact-active-class="active" @click.native="handleClick">
            <span v-text="role.name"></span>
            <span v-text="role.__meta__.users_count"></span>
          </nuxt-link>
          <nuxt-link to="/people/users" class="nav-link" exact-active-class="active" @click.native="handleClick">
            <span>All Users</span>
            <span v-text="usersTotal"></span>
          </nuxt-link>
        </nav>
      </div>
      <!-- manager-left -->
      <nuxt-child :roles="filteredRoles" ref="childComponentRef" />
    </div>
    <!-- manager-wrapper -->
    <loading v-else />
  </div>
  <!-- container -->
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import onboardingMixin from "@/mixins/onboarding";

export default {
  components: { loading, vPaginate },
  async created() {
    await this.getRoles({
      byOrganizationIds: this.authUser.organizations.map((org) => org.id)
    });

    this.filteredRoles = this.filterRoles(this.roles)

    const fmRole = this.roles.find((role) => role.code == "FM");
    if (fmRole && !this.$route.query["role-id"])
      this.$router.push(`/people/users?role-id=${fmRole.id}`);



  },
  methods: {
    handleClick() {
      this.togglePanelDisplay();
    },
    togglePanelDisplay() {
      if (!this.panelDisplayed) {
        this.$refs.managerLeft.style.display = "block";

        const childComponentInstance = this.$refs.childComponentRef;
        if (childComponentInstance) {
          const managerRightRef = childComponentInstance.$refs.managerRightRef;
          if (managerRightRef) {
            managerRightRef.style.display = "none";
          }
        }

        this.panelDisplayed = true;
      } else {
        let managerLeftRef = this.$refs.managerLeft;
        managerLeftRef.style.display = "none";

        const childComponentInstance = this.$refs.childComponentRef;
        if (childComponentInstance) {
          const managerRightRef = childComponentInstance.$refs.managerRightRef;
          if (managerRightRef) {
            managerRightRef.style.display = "block";
          }
        }
        this.panelDisplayed = false;
      }
    },
    filterRoles(data) {
      const filteredRoles = data;
      const uniqueNames = new Set();

      // for (const obj of data) {
      //   const name = obj.name;
      //   if (!uniqueNames.has(name) && obj.__meta__.users_count !== 0) {
      //     uniqueNames.add(name);
      //     filteredRoles.push(obj);
      //   }
      // }

      return filteredRoles;
    },
  },
  data: () => ({
    roles: [],
    filteredRoles: [],
    rolesLoading: true,
    usersTotal: null,
    panelDisplayed: false,
    windowWidth: window.innerWidth,
  }),
  head: () => ({
    title: "Users · Tsebo-Rapid"
  }),
  meta: {
    pageName: "users.index"
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, onboardingMixin]
};
</script>
