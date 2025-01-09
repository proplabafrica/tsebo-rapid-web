<template>
  <v-paginate :list="units" :perPage="pagination.perPage">
    <template v-slot="paginate">
      <div class="row" v-if="paginate.list.length">
        <div class="col-md-6">
          <ul class="list-group">
            <li class="list-group-item" v-for="unit in paginate.list.slice(0, (pagination.perPage / 2))" :key="unit.id">
              <!-- <div>{{authUser.roles}}</div> -->
              <div class="mg-b-2 d-flex justify-content-between" v-if="
                authUser.roles[0].code == 'SYS' ||
                authUser.roles[0].code == 'OA' ||
                authUser.roles[0].code == 'FM'
              ">
                <nuxt-link class="tx-inverse" :to="`/location/units/details?id=${unit.id}`">
                  <strong class="tx-medium" v-text="unit.name"></strong>
                </nuxt-link>
                <span v-modal-open="'delete-modal'" @click="unitToDelete = unit">
                  <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                </span>
              </div>
              <div class="mg-b-2 d-flex justify-content-between" v-if="authUser.roles[0].code == 'PM'">
                <nuxt-link class="tx-inverse" :to="`/location/units/details/settings/people?id=${unit.id}`">
                  <strong class="tx-medium" v-text="unit.name"></strong>
                </nuxt-link>
              </div>
            </li>
          </ul>
        </div>
        <!-- col-6 -->
        <div class="col-md-6" v-if="
          paginate.list.slice(pagination.perPage / 2, pagination.perPage - 1)
            .length > 0
        ">
          <ul class="list-group">
            <li class="list-group-item" v-for="unit in paginate.list.slice(
              pagination.perPage / 2,
              pagination.perPage - 1
            )" :key="unit.id">
              <div class="mg-b-2 d-flex justify-content-between" v-if="
                authUser.roles[0].code == 'SYS' ||
                authUser.roles[0].code == 'OA' ||
                authUser.roles[0].code == 'FM'
              ">

                <nuxt-link class="tx-inverse" :to="`/location/units/details?id=${unit.id}`">
                  <strong class="tx-medium" v-text="unit.name"></strong>
                </nuxt-link>
                <span v-modal-open="'delete-modal'" @click="unitToDelete = unit">
                  <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                </span>
              </div>
              <!-- <p class="mg-b-0">
                <nuxt-link class="tx-inverse" :to="`/location/units/details?id=${unit.id}`">
                  <strong class="tx-medium" v-text="unit.name"></strong>
                </nuxt-link>
              </p> -->
            </li>
          </ul>
        </div>
        <!-- col-6 -->
      </div>
      <!-- row -->
      <h6 v-else>No Units to display</h6>
      <v-modal ref="delete-modal">
        <div class="modal-dialog wd-300 wd-sm-400" role="document">
          <div class="modal-content tx-size-sm">
            <div class="modal-body tx-center pd-y-20 pd-x-20">
              <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 style="font-size: 16px" class="mg-b-20">
                Are you sure you want to delete
                <span v-text="unitToDelete.name"></span>
              </h4>
              <div class="form-layout-footer">
                <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                  @click="deleteUnit()">
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
    </template>
    <!-- table-responsive -->
    <template v-slot:linksWrapper class="tx-13 pd-y-15 bg-transparent"></template>
    <!-- card-footer -->
  </v-paginate>
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import authMixin from "@/mixins/auth";

import vPaginate from "@/components/ui/paginate";
export default {
  components: { vPaginate, vModal, vButton },
  created() {
    this.facilityManagerUnits();
    // this.facilityManagerUser(this.$route.query.id);
    this.setUser();
  },
  data: () => ({
    pagination: { perPage: 30 },
    unitToDelete: [],
    disabled: null,
    facilityManagers: [],
    facilityManagersLoading: true,
    user: null,
    userLoading: true,
    shouldRefresh: true
  }),
  methods: {
    async deleteUnit() {
      let unit = this.unitToDelete;

      try {
        const response = await this.$axios.delete(`units/${unit.id}`, {});
        this.disabled = false;
        this.$router.go();
        this.$store.commit("location/units/toggleRefresh");
        this.toast({
          type: "info",
          title: "Unit Deleted"
        });
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable to Delete Unit"
        });
      }
    },
    async facilityManagerUnits() {
      this.facilityManagersLoading = true;
      // const byOrganizationId = this.unit.organization.id;
      try {
        const facilityManager = (
          await this.$axios.get("facility-managers", {
            params: { associations: ["units", "user"] }
          })
        ).data.data;
        this.facilityManagers = facilityManager.filter((fm) => fm.id === 14)[0];
        // "first loading", this.facilityManagers)
        this.facilityManagersLoading = false;
        // "jack sparrow",this.facilityManagers);
      } catch (error) {
        console.log(error);
      }
    },
    async setUser() {
      const { users } = this.$store.state.people.users;
      this.user = users.find((user) => user.id == id);
      if (this.user && !this.shouldRefresh) return (this.userLoading = false);

      try {
        const user = (
          await this.$axios.get("users/" + id, {
            params: { associations: ["facilityManagers.user"] }
          })
        ).data.user;

        // this.$store.commit("people/users/setUser", user);
        this.user = this.user ? Object.assign({}, user) : user;
        this.userLoading = false;
        this.shouldRefresh = false;
        this.$store.commit("people/users/toggleRefresh");
      } catch (error) {
        console.log(error);
      }
    }
  },
  props: ["units", "columns"],
  mixins: [modalMixin, authMixin]
}
</script>
