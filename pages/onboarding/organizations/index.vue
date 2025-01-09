<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">Organizations</li>
      </ol>
      <h6 class="slim-pagetitle">Organizations</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="mg-t-0">
      <div class="card card-table">
        <div class="card-header">
          <span class="slim-card-title">Organizations</span>
          <!-- {{ thing }} -->
          <nuxt-link to="/onboarding/organizations/set-up" class="float-right tx-12" v-if="!isFM">
            <i class="icon ion-ios-plus-empty mg-r-5"></i>Setup Organization
          </nuxt-link>
        </div>
        <!-- card-header -->
        <v-paginate :list="organizations" perPage="30" v-if="!organizationsLoading">
          <template v-slot="paginate">
            <div class="table-responsive">
              <table class="table mg-b-0 tx-13">
                <thead>
                  <tr class="tx-10">
                    <th class="pd-y-5">Organization</th>
                    <th class="pd-y-5">Contact Information</th>
                    <th class="pd-y-5">Subscription</th>
                    <th class="pd-y-5">Structure</th>
                    <th class="pd-y-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="organization in paginate.list" :key="organization.id">
                    <td>
                      <nuxt-link :to="`/onboarding/organizations/details?id=${organization.id}`"
                        class="tx-inverse tx-14 tx-medium d-block" v-text="organization.name"></nuxt-link>
                      <span class="tx-11 d-block" v-for="type in organization.types" :key="type.id"
                        v-text="type.name"></span>
                    </td>
                    <td>
                      <span v-for="contact in organization.contacts" :key="contact.id">
                        <span class="d-block">{{ contact.name }}</span>
                        <span class="d-block">{{ contact.email }}</span>
                      </span>
                    </td>
                    <td>
                      <span class="d-block" v-for="subscription in organization.subscriptions" :key="subscription.id"
                        v-text="subscription.package.name"></span>
                    </td>
                    <td class="valign-middle">
                      <span class="d-block" v-for="hierarchy in organization.baseHierarchies" :key="hierarchy.id" v-text="
                        `${hierarchy.name} count: ${hierarchy.units.length}`
                      "></span>
                    </td>
                    <td>
                      <span v-modal-open="'delete-modal'" @click="organizationToDelete = organization" v-if="!isFM">
                        <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <v-modal ref="delete-modal">
                <div class="modal-dialog wd-300 wd-sm-400" role="document">
                  <div class="modal-content tx-size-sm">
                    <div class="modal-body tx-center pd-y-20 pd-x-20">
                      <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <h4 style="font-size: 16px" class="mg-b-20">
                        Are you sure you want to delete this organization?
                      </h4>
                      <div class="form-layout-footer">
                        <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4"
                          :disabled="disabled" @click="deleteOrganization">
                          <i class="icon ion-ios-checkmark-outline"></i>
                          Confirm
                        </v-button>
                        <button style="border-radius: 8px" type="button" class="btn btn-danger pd-x-4"
                          v-modal-close="'delete-modal'" aria-label="Close" :disabled="disabled">
                          <i class="icon ion-ios-close-outline"></i> Cancel
                        </button>
                      </div>
                    </div>
                    <!-- modal-body -->
                  </div>
                  <!-- modal-content -->
                </div>
                <!-- modal-dialog -->
              </v-modal>
            </div>
          </template>
          <!-- table-responsive -->
          <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
          <!-- card-footer -->
        </v-paginate>
        <loading v-else />
      </div>
      <!-- card -->
    </div>
    <!-- mg-t-0 -->
  </div>
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import onboardingMixin from "@/mixins/onboarding";

export default {
  components: {
    loading,
    vPaginate,
    vButton,
    vModal
  },
  created() {
    this.getOrganizations(this);
    // this.getRoles();
  },
  data: () => ({
    organizations: [],
    organizationsLoading: true,
    disabled: null,
    organizationToDelete: [],
    isFM: false,
    roles: [],
    rolesLoading: true,
    thing: []
  }),
  head: () => ({
    title: "Manage · Tsebo-Rapid"
  }),
  meta: {
    pageName: "organizations.index"
  },
  mounted() {
    this.getIsFM()
    this.getRoles();
  },
  methods: {
    ...mapActions({
      getOrganizations: "onboarding/organizations/getOrganizations"
    }),
    async getRoles() {
      this.rolesLoading = true;
      if (this.roles.length > 0) {
        this.rolesLoading = false;
        return true;
      }

      try {
        const roles = (await this.$axios.get("roles", {
          params: { associations: ["users"] }
        })).data.data;

        let top = roles;



        let emptyArray = [];


        let copied = []
        for (let i = 0; i < top.length; i++) {
          if (top[i].name) {
            emptyArray.push(top[i])
          }
          else {
            copied.push(top[i])
          }

        }

        this.thing = emptyArray;



        this.roles = roles;
        this.rolesLoading = false;
      } catch (error) {
        console.log(error);
      }

    },
    getIsFM() {
      if (this.authUser.roles) {
        for (const i in this.authUser.roles) {
          if (this.authUser.roles[i].code === 'FM') {
            this.isFM = true;

            break;
          }
        }
      }
    },
    async deleteOrganization() {
      let organization = this.organizationToDelete;
      this.disabled = true;
      const {
        types,
        addresses,
        subscriptions,
        files,
        industries,
        contacts
      } = organization;
      const organization_type_ids = types.map((type) => type.id);
      const subscription_id = subscriptions.map(
        (subscription) => subscription.id
      );
      const industry_ids = industries.map((industry) => industry.id);

      try {
        const response = await this.$axios.delete(
          `organizations/${organization.id}`,
          {
            industry_ids,
            organization_type_ids,
            subscription_id
          }
        );
        this.disabled = false;
        this.$router.go();
        this.$store.commit("onboarding/organizations/toggleRefresh");
        this.toast({ type: "info", title: "Organization Deleted" });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Organization"
        });
      }
    }
  },

  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, onboardingMixin, modalMixin]
};
</script>
