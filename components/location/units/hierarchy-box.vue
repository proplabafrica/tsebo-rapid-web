<template>
  <div class="col-12 mg-t-10">
    <div class="card">
      <div class="card-header bg-primary">
        <span class="slim-card-title tx-white" v-text="hierarchy.name"></span>

        <ul class="nav nav-tabs nav-tabs-for-dark card-header-tabs float-right">
          <li class="nav-item">
            <a
              class="nav-link"
              href
              title="Locations"
              @click.prevent="currentTab = 'units-list'"
              :class="{ active: currentTab == 'units-list' }"
            >
              <i class="icon ion-home d-md-none"></i>
              <span
                class="d-none d-md-inline tx-bold tx-upper"
                v-text="`${hierarchy.name} List`"
              ></span>

            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href
              title="Child Hierarchies"
              :class="{ active: currentTab == 'create-unit' }"
              v-action-show="'units.store'"
              @click.prevent="currentTab = 'create-unit'"
            >
              <i class="icon ion-grid d-md-none"></i>
              <span class="d-none d-md-inline tx-bold"
                >Create {{ hierarchy.name }}</span
              >
            </a>
          </li>
          <span
            v-modal-open="'delete-modal'"
            @click="hierarchyToDelete = hierarchy"
          >
            <i
              class="icon ion-trash-a tx-danger tx-20 cursor-pointer"
              style="margin:20px"
            ></i>
          </span>
        </ul>

        <!-- =============================  -->
        <v-modal ref="delete-modal">
          <div class="modal-dialog wd-300 wd-sm-400" role="document">
            <div class="modal-content tx-size-sm">
              <div class="modal-body tx-center pd-y-20 pd-x-20">
                <button
                  type="button"
                  class="close"
                  v-modal-close="'delete-modal'"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 style="font-size: 16px" class="mg-b-20">
                  Are you sure you want to delete
                  <span v-text="hierarchyToDelete.name"></span>
                </h4>
                <div class="form-layout-footer">
                  <v-button
                    type="button"
                    style="border-radius: 8px"
                    class="btn btn-primary pd-x-4"
                    :disabled="disabled"
                    @click="deleteHierarchy(hierarchyToDelete)"
                  >
                    <i class="icon ion-ios-checkmark-outline"></i>
                    Confirm
                  </v-button>
                  <button
                    style="border-radius: 8px"
                    type="button"
                    class="btn btn-danger pd-x-4"
                    v-modal-close="'delete-modal'"
                    aria-label="Close"
                    :disabled="disabled"
                  >
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
        <!-- =============================  -->



      </div>
      <!-- card-header -->
      <div class="card-body">
        <div class="tab-content">
          <div class="tab-pane" :class="{ active: currentTab == 'units-list' }">
            <fm-user
              class="d-flex tab-pane"
              v-if="authUser.roles[0].code == 'FM'"
              :hierarchy ="hierarchy"
              :parentUnit="parentUnit"
            ></fm-user>
            <div v-else class="tab-pane" :class="{ active: currentTab == 'units-list' }">
              <input
                type="text"
                v-model="search"
                v-if="hierarchy.units.length > 10"
                class="form-control wd-200 mg-b-5"
                placeholder="Type here to search"
              />
              <units-list :units="filteredUnits"></units-list>
            </div>
          </div>

          <!-- tab-pane -->
          <div
            class="tab-pane"
            :class="{ active: currentTab == 'hierarchy-list' }"
          >
            <v-paginate
              :list="hierarchy.children"
              :perPage="pagination.perPage.perPage"
            >
              <template v-slot="paginate">
                <div class="row" v-if="paginate.list.length > 0">
                  <div class="col-md-6">
                    <ul class="list-group">
                      <li
                        class="list-group-item"
                        v-for="child in paginate.list.slice(
                          0,
                          pagination.perPage / 2
                        )"
                        :key="child.id"
                      >
                        <p class="mg-b-0">
                          <nuxt-link
                            class="tx-inverse"
                            :to="`/location/unit-hierarchies/details?id=${child.id}`"
                          >
                            <strong
                              class="tx-medium"
                              v-text="child.name"
                            ></strong>
                          </nuxt-link>
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div
                    class="col-md-6"
                    v-if="
                      paginate.list.slice(
                        pagination.perPage / 2,
                        pagination.perPage - 1
                      ).length > 0
                    "
                  >
                    <ul class="list-group">
                      <li
                        class="list-group-item"
                        v-for="child in paginate.list.slice(
                          pagination.perPage / 2,
                          pagination.perPage - 1
                        )"
                        :key="child.id"
                      >
                        <p class="mg-b-0">
                          <nuxt-link
                            class="tx-inverse"
                            :to="`/location/unit-hierarchies/details?id=${child.id}`"
                          >
                            <strong
                              class="tx-medium"
                              v-text="child.name"
                            >
                            </strong>
                          </nuxt-link>
                        </p>
                      </li>
                    </ul>
                  </div>
                  <!-- col-6 -->
                </div>
                <!-- row -->
                <h6 v-else>No Hierarchies to display</h6>
              </template>
              <!-- table-responsive -->
              <template
                v-slot:linksWrapper
                class="tx-13 pd-y-15 bg-transparent"
              ></template>
              <!-- card-footer -->
            </v-paginate>
          </div>
          <!-- tab-pane -->
          <div
            class="tab-pane"
            :class="{ active: currentTab == 'create-unit' }"
          >
            <create-unit
              :organization="hierarchy.organization"
              :hierarchy="hierarchy"
              :parentUnit="parentUnit"
              @update="$emit('update')"
            />
          </div>
          <!-- tab-pane -->
        </div>
        <!-- tab-content -->
      </div>
      <!-- card-body -->
    </div>
    <!-- card -->
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import vButton from "@/components/ui/v-button";

export default {
  components: {
    "create-unit": () => ({
      component: import("@/components/location/units/create-unit"),
      loading
    }),
    "units-list": () => ({
      component: import("@/components/location/units/units-list"),
      loading
    }),
    "fm-user": () => ({
      component: import("@/components/location/units/fm-user"),
      loading
    }),
    vPaginate,
    vModal,
    vButton
  },
  computed: {
    filteredUnits() {
      if (!this.search) return this.hierarchy.units;

      return this.hierarchy.units.filter(
        (unit) =>
          unit.name.toLowerCase().includes(this.search.toLowerCase()) ||
          unit.code.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  data: () => ({
    currentTab: "units-list",
    pagination: { perPage: 30 },
    hierarchyToDelete: {},
    search: null,
    disabled: false

  }),
  methods: {
    async deleteHierarchy() {
      let hierarchy = this.hierarchyToDelete;
      try {
        const response = await this.$axios.delete(
          `unit-hierarchies/${hierarchy.id}`, {}
        );
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Level Deleted"
        });
        this.$router.go();
        this.$store.commit("onboarding/organizations/toggleRefresh");
      } catch (error) {
        console.log("error message..", error.message);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Level"
        });
      }
    }
  },


  props: ["hierarchy", "parentUnit"],
  mixins: [authMixin, modalMixin],
};
</script>
