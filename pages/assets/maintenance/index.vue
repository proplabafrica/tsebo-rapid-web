<template>
  <div class="container">
    <div class="slim-pageheader">
      <ol class="breadcrumb slim-breadcrumb">
        <li class="breadcrumb-item">
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li class="breadcrumb-item">
          <nuxt-link to="/assets/maintenance/hospital-list">Facilities</nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          Asset Registry
        </li>
      </ol>
      <h6 class="slim-pagetitle">Activity</h6>
    </div>
    <!-- slim-pageheader -->

    <div class="mg-y-10">
      <span class="btn btn-primary" v-modal-open="'add-maintenance-modal'">NEW ACTIVITY</span>
      <v-modal ref="add-maintenance-modal">
        <div class="modal-dialog wd-300 wd-sm-400" role="document">
          <div class="modal-content tx-size-sm">
            <div class="modal-body tx-center pd-y-20 pd-x-20">
              <button type="button" class="close" v-modal-close="'add-maintenance-modal'" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h3 class="pd-t-60 pd-b-40">Add Maintenance</h3>
              <form id="add-maintenace-form">
                <div class="form-group">
                  <label for class="form-control-label">
                    Service Type
                    <span class="tx-danger">*</span>
                  </label>
                  <select name="service_type" class="form-control" v-model="maintenance.serviceType">
                    <option :value="null">Select One</option>
                    <option value="corrective">Corrective</option>
                    <option value="preventive">Preventive</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for class="form-control-label">
                    Facility
                    <span class="tx-danger">*</span>
                  </label>
                  <select name="facility" class="form-control" v-model="maintenance.facility">
                    <option :value="null">Select One</option>
                    <option>Sura Primary Health Care Center</option>
                    <option>Oke Olomi Primary Health Care Center</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for class="form-control-label">
                    Room
                    <span class="tx-danger">*</span>
                  </label>
                  <select name="room" class="form-control" v-model="maintenance.room">
                    <option :value="null">Select One</option>
                    <option>Doctor's Office</option>
                    <option>Pharmacy</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for class="form-control-label">
                    Asset
                    <span class="tx-danger">*</span>
                  </label>
                  <select name="room" class="form-control" v-model="maintenance.assetCode">
                    <option :value="null">Select One</option>
                    <option>Mistibushi Air COnditioner (LASG/001)</option>
                    <option>Samsung A.C. (LASG/002)</option>
                    <option>Carrier A.C. (LASG/003)</option>
                    <option>Sharp A.C. (LASG/004)</option>
                    <option>Haieir A.C. (LASG/005)</option>
                    <option>Panansonic A.C. (LASG/006)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for class="form-control-label">
                    Description
                    <span class="tx-danger">*</span>
                  </label>
                  <textarea name="descritption" v-model="maintenance.activity" class="form-control"></textarea>
                </div>
                <div class="form-layout-footer">
                  <v-button class="btn btn-success bd-0 pd-x-25 mg-x-10" @click="addMaintenance()">
                    <i class="icon ion-ios-checkmark-outline"></i> CONFIRM
                  </v-button>
                  <button type="button" class="btn btn-danger pd-x-25" v-modal-close="'add-maintenance-modal'"
                    aria-label="Close">
                    <i class="icon ion-ios-close-outline"></i> CANCEL
                  </button>
                </div>
              </form>
            </div>
            <!-- modal-body -->
          </div>
          <!-- modal-content -->
        </div>
        <!-- modal-dialog -->
      </v-modal>

      <input type="text" placeholder="Search Facilities" class="form-control float-right search mg-l-10" />
      <select class="form-control float-right search wd-200">
        <option value>Search By</option>
        <option value>Work Code</option>
        <option value>Asset</option>
        <option value>Activity</option>
        <option value>Room</option>
        <option value>User</option>
      </select>
    </div>

    <v-paginate class="bg-white" :list="maintenances" perPage="30" v-if="!maintenancesLoading">
      <template v-slot="paginate">
        <div class="table-responsive">
          <table class="table table-striped mg-b-0 tx-13">
            <thead>
              <tr class="tx-10">
                <th class="pd-y-5">Code #</th>
                <th class="pd-y-5">Date Executed</th>
                <th class="pd-y-5">Asset</th>
                <th class="pd-y-5">Activity</th>
                <th class="pd-y-5">Room</th>
                <th class="pd-y-5">Faciltiy</th>
                <th class="pd-y-5">User</th>
                <th class="pd-y-5">Date Logged</th>
              </tr>
            </thead>
            <tbody v-if="paginate.list.length > 0">
              <tr v-for="maintenance in paginate.list" :key="maintenance.id">
                <td>
                  <span>{{ maintenance.code }}</span>
                </td>
                <td>
                  <span>{{ maintenance.dateExecuted | dateFormat }}</span>
                </td>
                <td class="tx-14">
                  <nuxt-link class="d-block tx-inverse" v-text="maintenance.assetCode"
                    :to="`/assets/maintenance/details`"></nuxt-link>
                </td>
                <td class="tx-14">
                  <nuxt-link class="d-block tx-inverse" v-text="maintenance.activity"
                    :to="`/assets/maintenance/details`"></nuxt-link>
                </td>
                <td>
                  <span v-text="maintenance.room"></span>
                </td>
                <td>
                  <span v-text="maintenance.facility"></span>
                </td>
                <td>
                  <span v-text="maintenance.user"></span>
                </td>
                <td>
                  <span>{{ maintenance.dateLogged | dateFormat }}</span>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="12">
                  <h5>No data to display</h5>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <!-- table-responsive -->
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
      <!-- card-footer -->
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vModal from "@/components/ui/v-modal";
import authMixin from "@/mixins/auth";
import modalMixin from "@/mixins/modal";

export default {
  components: { loading, vButton, vPaginate, vModal },
  data: () => ({
    maintenance: {
      serviceType: null,
      code: null,
      dateExecuted: null,
      activity: null,
      assetCode: null,
      room: null,
      facility: null,
      user: null,
      dateLogged: null
    },
    maintenances: [
      {
        code: "001",
        dateExecuted: 1569219942366 - 24 * 3600000 * 5,
        activity: "Changing of Air Conditioner Air Filter",
        assetCode: "Mistibushi Air COnditioner (LASG/001)",
        room: "Governor's Office",
        facility: "Lagos House",
        user: "Afeez Olakunle",
        dateLogged: 1569219942366
      }
    ],
    maintenancesLoading: false
  }),
  head: () => ({
    title: "Activity · Tsebo-Rapid"
  }),
  meta: {
    pageName: "hagul.purchase.purchase-orders.index"
  },
  methods: {
    addMaintenance() {
      this.maintenance.dateLogged = Date.now();
      this.maintenance.dateExecuted = Date.now() - 24 * 3600000 * 3;
      this.maintenance.user = "Oladimeji Ojo";
      this.maintenance.code = `00${this.maintenances.length + 1}`;
      this.maintenances.unshift(this.maintenance);
      this.maintenance = {
        serviceType: null,
        code: null,
        dateExecuted: null,
        activity: null,
        assetCode: null,
        room: null,
        facility: null,
        user: null,
        dateLogged: null
      };
      this.closeModal("add-maintenance-modal");
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, modalMixin]
};
</script>
