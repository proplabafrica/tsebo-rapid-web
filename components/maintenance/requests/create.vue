<template>
  <form id="create-client-request-form" class="pd-20" v-if="!orgLoading">
    <h3 class="slim-card-title">Create Request</h3>
    <fieldset :disabled="formDisabled">
      <div class="form-group">
        <label class="form-control-label">
          Short Description
          <span class="tx-danger">*</span>
        </label>
        <input type="text" max="60" class="form-control" required v-model="clientRequest.name" name="name"
          placeholder="Short Description" />
        <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
      </div>
      <div class="form-group">
        <label class="form-control-label">Additional Information</label>
        <textarea class="form-control" v-model="clientRequest.description" name="name" maxlength="320"
          placeholder="Additional Information"></textarea>
        <small class="tx-bold tx-danger" v-text="validationErrors.description"></small>
      </div>
      <div class="form-group">
        <label class="form-control-label">
          Requested By
          <span class="tx-danger">*</span>
        </label>
        <v-select class="form-control" label="name" placeholder="Pick User" selectOnTab :options="org.users"
          v-model="clientRequest.requester" :disabled="orgLoading"></v-select>
        <input type="text" class="d-none" name="requested_by" v-if="clientRequest.requester"
          :value="clientRequest.requester.id" required />
        <small class="tx-bold tx-danger" v-text="validationErrors.requested_by"></small>
      </div>
      <!-- Hierarchy Selector -->
      <div v-for="(level, index) in unitHierarchy.levels" :key="level.id">
        <div class="form-group" v-if="level.hierarchies.length > 1">
          <label class="form-control-label">
            Select Level
            <span class="d-none" v-for="(hierarchy, index) in level.hierarchies" :key="hierarchy.id">{{ hierarchy.name
            }}{{ index + 1 >= level.hierarchies.length ? "" : ", " }}</span>
            <span class="tx-danger">*</span>
          </label>
          <select class="form-control" :name="`hierarchy-${level.id}`" v-model="level.hierarchy">
            <option :value="null">Select One</option>
            <option v-for="hierarchy in level.hierarchies" :key="hierarchy.id" :value="hierarchy"
              v-text="hierarchy.name"></option>
          </select>
        </div>
        <div class="form-group" v-if="level.hierarchy != null">
          <label class="form-control-label">
            Select
            <span v-text="level.hierarchy.name"></span>
            <span class="tx-danger" v-if="index == 0">*</span>
          </label>
          <select class="form-control" :name="`unit-${level.id}`" v-model="level.unit"
            :required="clientRequest.equipment_ids.length < 1 && index == 0" @change="sortHierarchies(level)">
            <option :value="null">Select One</option>
            <option v-for="unit in level.hierarchy.units" :key="unit.id" :value="unit" v-text="unit.name"></option>
          </select>
          <small class="tx-bold tx-danger" v-if="validationErrors[`unit-${level.id}`]"
            v-text="validationErrors[`unit-${level.id}`]"></small>
        </div>
      </div>
      <!-- Hierarchy Selector -->
      <div class="form-group" v-show="false">
        <label class="ckbox">
          <input type="checkbox" :value="false" v-model="attachEquipment" />
          <span>Attach Equipment</span>
        </label>
      </div>
      <div class="form-group" v-if="attachEquipment">
        <label class="form-control-label">Select Equipment</label>
        <v-select aria-multiselectable class="form-control" label="name" multiple placeholder="Select Equipment"
          selectOnTab :resetOnOptionsChange="true" :options="unitEquipmentList" v-model="clientRequest.equipment_ids"
          :reduce="equipment => equipment.id"></v-select>
        <input name="equipment_ids" hidden :value="clientRequest.equipment_ids.length < 1 ? null : 'set'" />
        <small class="tx-bold tx-danger" v-text="validationErrors.equipment_ids"></small>
      </div>
      <div class="form-group">
        <label class="form-control-label">Attachment (Max 2MB)</label>
        <div class="custom-file image-input">
          <input type="file" accept="image/*" @change="
            convertToBase64($event).then(data => {
              clientRequest.file = data.file;
              clientRequest.file_name = data.file_name;
            })
          " class="custom-file-input" title="Select an image 1MB or less" name="file" />
          <label class="custom-file-label" for="customFile" v-text="clientRequest.file_name"></label>
        </div>
        <!-- custom-file -->
        <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
      </div>
      <div class="tx-center mg-t-20 form-layout-footer">
        <v-button class="btn btn-primary" :disabled="disabled" @click="submitClientRequest()">SUBMIT</v-button>
      </div>
    </fieldset>
  </form>
  <loading v-else />
</template>

<script>
const storePath = "maintenance/createRequest";
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import slaMixin from "@/mixins/performance/sla";
import formMixin from "@/mixins/forms";
import { findIndex } from "lodash";
import io from "socket.io-client";

export default {
  components: { loading, vButton, vPaginate, vSelect },

  created() {
    this.setUserOrg();
    this.clientRequest.requester = this.authUser;
  },
  data: () => ({
    attachEquipment: true,
    baseHierarchies: [],
    baseHierarchiesLoading: true,
    disabled: false,
    formDisabled: false,
    hierarchies: [],
    hierarchiesLoading: true,
    loading: true,
    org: { users: [], units: [] },
    orgLoading: true,
    unitEquipmentList: [],
    validationErrors: {},
    clientRequest: {
      description: "",
      equipment_ids: [],
      file: "",
      file_name: "Add Picture",
      name: "",
      requester: null,
      unit_id: ""
    },
    unitHierarchy: {
      levels: []
    },
    units: [],
    unitsLoading: true,
    users: [],
    usersLoading: []
  }),
  head: () => ({
    title: "Create Request · Tsebo-Rapid"
  }),
  meta: {
    pageName: "client-requests.store"
  },
  methods: {
    ...mapActions({
      getBaseHierarchies: `${storePath}/getBaseHierarchies`,
      getHierarchies: `${storePath}/getHierarchies`,
      getUnits: `${storePath}/getUnits`,
      getUsers: `${storePath}/getUsers`
    }),
    setDefaultHierarchy(level) {
      if (level.hierarchies > 1) return true;
      level.hierarchy = level.hierarchies[0];
      return false;
    },
    setEquipmentNames() {
      for (const unit of this.units) {
        unit.equipment = unit.equipment.map(equipment => {
          if (!equipment.specification) return equipment;
          var name = equipment.name;
          if (equipment.name != equipment.specification.name)
            name = equipment.specification.name;
          equipment.name = `${name} (${equipment.code})`;
          return equipment;
        });
      }
    },
    async setUserOrg() {
      await Promise.all([
        this.getBaseHierarchies(this),
        this.getHierarchies(this),
        this.getUnits(this),
        this.getUsers(this)
      ]);

      // this.setEquipmentNames();

      const hierarchies = this.baseHierarchies.map(hierarchy => {
        hierarchy.units = this.units.filter(
          unit => unit.unit_hierarchy_id == hierarchy.id
        );
        return hierarchy;
      });

      const level = {
        equipment: [],
        hierarchies,
        hierarchy: null,
        id: "base-level",
        unit: null
      };
      this.unitHierarchy.levels.push(level);
      this.setDefaultHierarchy(level);
      this.orgLoading = false;
    },
    sortHierarchies(level) {
      const levelIndex = findIndex(this.unitHierarchy.levels, ["id", level.id]);
      this.unitHierarchy.levels.splice(levelIndex + 1);
      if (!level.unit) return false;
      this.clientRequest.equipment_ids = [];
      this.clientRequest.unit_id = level.unit.id;

      this.unitEquipmentList = level.unit.equipment.filter(
        unitEquipment => unitEquipment.active == 1
      );

      this.unitEquipmentList.push({ name: "No Equipment", id: 0 });

      if (level.unit.children.length < 1) return false;

      var hierarchies = level.unit.hierarchies.filter(unitHierarchy =>
        this.hierarchies.find(hierarchy => hierarchy.id == unitHierarchy.id)
      );

      hierarchies = hierarchies.map(hierarchy => {
        hierarchy.units = this.units.filter(
          unit => unit.unit_hierarchy_id == hierarchy.id
        );
        return hierarchy;
      });

      var nextLevel = {
        equipment: [],
        hierarchies,
        hierarchy: null,
        id: `unit-${level.unit.id}`,
        unit: null
      };
      if (this.unitHierarchy.levels.find(level => level.id == nextLevel.id))
        return false;

      this.unitHierarchy.levels.push(nextLevel);
      this.setDefaultHierarchy(nextLevel);
    },
    connectToWS() {
      this.socket = io.connect("ws://localhost:3333", { secure: true }); //connect to server

      this.socket.emit(
        "notification",
        "Your request has been created successfully!"
      );
    },
    async submitClientRequest() {
      if (!this.validateForm("create-client-request-form")) return false;

      this.disabled = true;
      const {
        description,
        equipment_ids,
        file,
        file_name,
        name,
        requester,
        unit_id
      } = this.clientRequest;
      const requested_by = requester.id;

      try {
        const response = await this.$axios.post("client-requests", {
          description,
          equipment_ids: equipment_ids.filter(id => id !== 0),
          file,
          file_name,
          name,
          requested_by,
          unit_id
        });
        // this.connectToWS();
        this.disabled = false;
        this.$store.commit(
          "maintenance/clientRequests/setClientRequest",
          response.data.clientRequest
        );
        this.$store.commit("maintenance/clientRequests/toggleRefresh");
        this.$router.push(
          `/maintenance/requests/approval?id=${response.data.clientRequest.id}`
        );
      } catch (error) {
        this.disabled = false;
        const response = error.response;
        if (response && response?.status && response?.status == 422) {
          for (const error of response?.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response?.status == 413) {
          this.validationErrors.file = response.statusText;
        } else if (response && response?.status && response?.status == 429) {
          this.validationErrors.email = response?.statusText;
        } else {}
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, slaMixin, formMixin]
};
</script>
