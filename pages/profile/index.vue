<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="#">My Profile</nuxt-link>
        </li>
      </ol>
    </div>
    <!-- slim-pageheader -->
    <!-- <div>{{user}}</div> -->
    <div class="row row-sm" v-if="!userLoading">
      <div class="col-lg-3">
        <!-- <div class="d-flex" :user="user"></div> -->
        <div v-if="!facilityManagerSlasLoading">
          <div class="card-contact" v-for="facilityManager in facilityManagerSlas"
            :key="`facility-manager-${facilityManager.id}`">
            <div class="tx-center">
              <nuxt-link :to="`/people/users/details?id=${facilityManager.user.id}`">
                <img :src="
                  facilityManager.user.image_path
                    ? facilityManager.user.image_path
                    : 'https://via.placeholder.com/500'
                " @error="
                  (e) =>
                    (e.target.src = 'https://via.placeholder.com/500')
                " class="card-img" :alt="facilityManager.user.name" />
              </nuxt-link>
              <h5 class="mg-t-10 mg-b-5">
                <nuxt-link :to="`/people/users/details?id=${facilityManager.user.id}`" class="contact-name">{{
                facilityManager.user.name }}</nuxt-link>
              </h5>
            </div>
            <!-- tx-center -->

            <p class="contact-item">
              <span>Reaction Time::</span>
              <span>{{
              ((facilityManager.sla_reaction_time.timelyRequests /
              facilityManager.sla.count) *
              100)
              | twoDP
              }}%</span>
            </p>
            <!-- contact-item -->

            <p class="contact-item">
              <span>Response Time::</span>
              <span>{{
              ((facilityManager.sla_response_time.timelyRequests /
              facilityManager.sla.count) *
              100)
              | twoDP
              }}%</span>
            </p>
            <!-- contact-item -->
            <p class="contact-item">
              <span>Completion Time:</span>
              <span>{{
              ((facilityManager.sla_completion_time.timelyRequests /
              facilityManager.sla.count) *
              100)
              | twoDP
              }}%</span>
            </p>
            <!-- contact-item -->
          </div>
          <!-- card -->
        </div>
        <loading v-else />
        <div class="section-wrapper mg-t-10 pd-20">
          <label class="section-title">Change Password</label>
          <form class="text-center" id="changePasswordForm">
            <input type="hidden" name="_token" value="RDfruNURLekMXE8I0M1hBdxLb6M3UBWjUYF6SXQZ" />
            <div class="form-group text-left">
              <input type="password" v-model="current_password" name="current_password" placeholder="Current Password"
                required class="form-control" />
              <small class="tx-bold tx-danger" v-if="validationErrors.current_password"
                v-text="validationErrors.current_password"></small>
            </div>
            <div class="form-group text-left">
              <input type="password" v-model="password" name="password" placeholder="New Password" required
                class="form-control" />
              <small class="tx-bold tx-danger" v-if="validationErrors.password"
                v-text="validationErrors.password"></small>
            </div>
            <div class="form-group text-left">
              <input type="password" v-model="password_confirmation" name="password_confirmation"
                placeholder="Confirm New Password" required class="form-control" />
              <small class="tx-bold tx-danger" v-if="validationErrors.password_confirmation"
                v-text="validationErrors.password_confirmation"></small>
            </div>
            <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="changePassword()">CHANGE PASSWORD
            </v-button>
          </form>
        </div>
      </div>
      <div class="col">
        <div class="nav-statistics-wrapper">
          <nav class="nav">
            <nuxt-link class="nav-link" exact-active-class="active" :to="`/profile`">Requests</nuxt-link>
          </nav>
        </div>
        <user-requests :user="user" />
      </div>

      <!-- col-4 -->
    </div>
    <!-- row -->
    <loading v-else />
  </div>
</template>

<script>
import moment from "moment";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import onboardingMixin from "@/mixins/onboarding";
import userRequests from "@/pages/people/users/details/index/index.vue";
import { mapActions } from "vuex";


export default {
  components: {
    loading,
    vButton,
    userRequests,
    "fm-user": () => ({
      component: import("@/components/location/units/fm-user")
    })
  },
  toast: () => import("@/components/ui/toast"),
  computed: {
    statusDisplay() {
      if (this.userLoading || !this.user) return {};
      if (this.user.active == 0) return { class: "success", text: "ACTIVATE" };

      return { class: "warning", text: "DEACTIVATE" };
    }
  },
  async created() {
    await this.setUser(this.$store.state.auth.user.id);
    this.getFacilityManagerSlas();
  },
  data: () => ({
    disabled: false,
    facilityManagerSlas: [],
    facilityManagerSlasLoading: true,
    user: null,
    userLoading: true,
    shouldRefresh: true,
    current_password: "",
    password: "",
    password_confirmation: "",
    disabled: false,
    validationErrors: {}
  }),
  head: () => ({
    title: "User Details · Tsebo-Rapid"
  }),
  meta: {
    pageName: "users.show"
  },
  methods: {
    async changePassword() {
      if (!this.validateForm("changePasswordForm")) return false;
      this.disabled = true;

      if (this.password !== this.password_confirmation) {
        this.toast({ type: "danger", title: "Password Mismatch" });
        this.disabled = false;
      } else {
        var request = {
          userId: this.user.id,
          password: this.current_password,
          newPassword: this.password,
          email: this.user.email
        };
        try {
          const response = await this.$axios.post(
            "password-change/change",
            request
          );
          this.$store.commit("auth/setAuth", response.data);
          this.toast({ type: "success", title: "Password changed" });
          this.current_password = "";
          this.password = "";
          this.password_confirmation = "";
          this.disabled = false;
        } catch (error) {
          console.log(error);
          this.toast({ type: "danger", title: "Invalid password" });
          this.disabled = false;
        }
      }
    },
    dateToAYearAgo(date) {
      const aYearAgo = new Date(date.setFullYear(date.getFullYear() - 1));
      date = new Date(date.setFullYear(date.getFullYear() + 1));

      return {
        rangeFrom: moment(
          new Date(aYearAgo.getFullYear(), aYearAgo.getMonth(), 1)
        ).format("YYYY-MM-DD"),
        rangeTo: moment(
          new Date(date.getFullYear(), date.getMonth() + 1, 0)
        ).format("YYYY-MM-DD")
      };
    },
    async getFacilityManagerSlas() {
      if (this.user.facilityManagers.length < 1) {
        this.facilityManagerSlasLoading = false;
        return;
      }
      const facilityManagerIds = this.user.facilityManagers.map(
        (facilityManager) => facilityManager.id
      );
      const dateRange = this.dateToAYearAgo(new Date());

      try {
        const response = await this.$axios.get(
          "reporting/facility-managers/work-request-sla",
          {
            params: {
              facilityManagerAssociations: ["units", "user"],
              facilityManagerIds,
              facilityManagerPerPage: 300,
              workRequestRangeBy: "created_at",
              workRequestRangeFrom: dateRange.rangeFrom,
              workRequestRangeTo: dateRange.rangeTo
            }
          }
        );
        this.facilityManagerSlas = response.data.data;
        this.facilityManagerSlasLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async setUser(id) {
      const { detailedAssociations, users } = this.$store.state.people.users;
      this.user = users.find((user) => user.id == id);
      if (this.user && !this.shouldRefresh) return (this.userLoading = false);

      try {
        const response = await this.$axios.get("users/" + id, {
          params: { associations: detailedAssociations }
        });
        this.$store.commit("people/users/setUser", response.data.user);
        this.user = this.user
          ? Object.assign({}, response.data.user)
          : response.data.user;

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
  mixins: [authMixin, formMixin, onboardingMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) return this.setUser(to.query.id);
    }
  }
};
</script>
