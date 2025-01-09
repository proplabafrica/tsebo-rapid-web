<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/people/users">Users</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page" v-text="`${user ? user.name : 'User Details'}`"></li>
      </ol>
      <h6 class="slim-pagetitle" v-text="`${user ? user.name : 'User Details'}`"></h6>
    </div>
    <!-- slim-pageheader -->


    <div class="row row-sm" v-if="!userLoading">
      <div class="col-lg-9">
        <ul class="nav nav-activity-profile bd-t-0">
          <li class="nav-item">
            <nuxt-link :to="`/people/users/details?id=${user.id}`" class="nav-link" exact-active-class="active">Actvity
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" active-class="active" :to="`/people/users/details/settings?id=${user.id}`">
              Settings</nuxt-link>
          </li>
        </ul>
        <nuxt-child :user="user" @update="updateUser()" />
      </div>

      <div class="col-lg-3 mg-t-20 mg-lg-t-0">
        <div class="card pd-25">
          <img class="wd-90 bd rounded-circle d-inline" :src="
            user.image_path
              ? user.image_path
              : 'https://via.placeholder.com/500'
          " :alt="user.name" @error="(e) => (e.target.src = 'https://via.placeholder.com/500')" />
          <div class="media-list">
            <div class="media mg-t-25">
              <div>
                <i class="icon ion-ios-telephone-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Phone Number</h6>
                <span class="d-block">{{ user.phone }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25">
              <div>
                <i class="icon ion-ios-email-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">Email Address</h6>
                <span class="d-block">{{ user.email }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25" v-for="(address, index) in user.addresses" :key="address.id">
              <div>
                <i class="icon ion-ios-navigate-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">
                  Address
                  <span v-if="user.addresses.length > 1" v-text="index + 1"></span>
                </h6>
                <span class="d-block">{{ address.address }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25" v-for="(organization, index) in user.organizations" :key="organization.id">
              <div>
                <i class="icon ion-ios-home-outline tx-24 lh-0"></i>
              </div>
              <div class="media-body mg-l-15 mg-t-4">
                <h6 class="tx-14 tx-gray-700">
                  Organization
                  <span v-if="user.organizations.length > 1" v-text="index + 1"></span>
                </h6>
                <span class="d-block">{{ organization.name }}</span>
              </div>
              <!-- media-body -->
            </div>
            <!-- media -->

            <div class="media mg-t-25">
              <v-button :disabled="disabled" @click="switchStatus()" class="d-block wd-100p btn"
                :class="[`btn-${statusDisplay.class}`]">
                <i class="icon ion-power mg-r-5"></i>
                {{ statusDisplay.text }}
              </v-button>
            </div>
          </div>
          <!-- media-list -->
        </div>
        <!-- card -->
      </div>
      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";

export default {
  components: {
    loading,
    vButton,
  },
  computed: {
    statusDisplay() {
      if (this.userLoading || !this.user) return {};
      if (this.user.active == 0) return { class: "success", text: "ACTIVATE" };

      return { class: "warning", text: "DEACTIVATE" };
    }
  },
  created() {
    this.setUser(this.$route.query.id);
  },
  data: () => ({
    disabled: false,
    user: null,
    userLoading: true,
    shouldRefresh: true
  }),
  head: () => ({
    title: "User Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "users.show"
  },
  methods: {
    async setUser(id) {
      const { detailedAssociations, users } = this.$store.state.people.users;
      this.user = users.find((user) => user.id == id);
      if (this.user && !this.shouldRefresh) return (this.userLoading = false);

      try {
        const user = (
          await this.$axios.get("users/" + id, {
            params: { associations: detailedAssociations }
          })
        ).data.user;

        this.$store.commit("people/users/setUser", user);
        this.user = this.user ? Object.assign({}, user) : user;
        this.userLoading = false;
        this.shouldRefresh = false;
        this.$store.commit("people/users/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    },
    async switchStatus() {
      var active = 0,
        user_id = this.user.id;
      if (this.user.active == 0) active = 1;
      this.disabled = true;

      try {
        await this.$axios.post("users/account-switch", {
          active,
          user_id
        });
        this.disabled = false;
        this.updateUser();
      } catch (error) {
        console.log(error);
        this.disabled = false;
      }
    },
    updateUser() {
      this.shouldRefresh = true;
      this.userLoading = true;
      this.setUser(this.user.id);
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setUser(to.query.id);
    }
  }
};
</script>
