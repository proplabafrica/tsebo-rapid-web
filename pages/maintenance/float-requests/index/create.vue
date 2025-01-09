<template>
  <form id="create-float-request-form" class="row mg-x-0 mg-t-5" v-if="!orgLoading">
    <div class="col-md-4 pd-0">
      <fieldset class="card pd-20" :disabled="formDisabled">
        <div class="form-group">
          <label class="form-control-label">
            Short Description
            <span class="tx-danger">*</span>
          </label>
          <input type="text" max="60" class="form-control" required v-model="floatRequest.name" name="name"
            placeholder="Short Description" />
          <small class="tx-bold tx-danger" v-text="validationErrors.name"></small>
        </div>
        <div class="form-group">
          <label class="form-control-label">Additional Information</label>
          <textarea class="form-control" v-model="floatRequest.description" name="name" maxlength="320"
            placeholder="Additional Information"></textarea>
          <small class="tx-bold tx-danger" v-text="validationErrors.description"></small>
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
              @change="sortHierarchies(level)">
              <option :value="null">Select One</option>
              <option v-for="unit in level.hierarchy.units" :key="unit.id" :value="unit" v-text="unit.name"></option>
            </select>
            <small class="tx-bold tx-danger" v-if="validationErrors[`unit-${level.id}`]"
              v-text="validationErrors[`unit-${level.id}`]"></small>
          </div>
        </div>
        <!-- Hierarchy Selector -->
        <div class="form-group">
          <label class="form-control-label">
            Attachment (Max 2MB)
            <span class="tx-danger">*</span>
          </label>
          <div class="custom-file">
            <input type="file" @change="
              convertToBase64($event).then((data) => {
                floatRequest.file = data.file;
                floatRequest.file_name = data.file_name;
              })
            " class="custom-file-input" title="Select an image 1MB or less" name="file" required />
            <label class="custom-file-label" for="customFile" v-text="floatRequest.file_name"></label>
          </div>
          <!-- custom-file -->
          <small class="tx-bold tx-danger" v-if="validationErrors.file" v-text="validationErrors.file"></small>
        </div>
      </fieldset>
    </div>
    <div class="col pd-0 pd-l-5">
      <div class="card pd-10">
        <div class="slim-card-title">ITEMS</div>
        <table class="table table-striped mg-t-10">
          <thead>
            <tr>
              <th>Description</th>
              <th width="20%">Quantity</th>
              <th width="25%">Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in floatRequest.items" :key="`item-${index}`">
              <td>
                <textarea type="text" class="form-control" v-model="item.description"
                  :name="`item-description-${index}`" required rows="1" placeholder="Description"></textarea>
                <small class="tx-bold tx-danger" v-text="validationErrors[`item-description-${index}`]"></small>
              </td>
              <td>
                <input type="number" step="any" class="form-control" v-model="item.quantity"
                  :name="`item-quantity-${index}`" required placeholder="Quantity" />
                <small class="tx-bold tx-danger" v-text="validationErrors[`item-quantity-${index}`]"></small>
              </td>
              <td>
                <div class="form-group">
                  <input type="number" step="any" class="form-control" v-model="item.cost" :name="`item-cost-${index}`"
                    required placeholder="Cost" />
                  <small class="tx-bold tx-danger" v-text="validationErrors[`item-cost-${index}`]"></small>
                </div>
              </td>
              <td>
                <span class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10" @click="add1Item()">
                  <div class="tx-20">+</div>
                </span>
                <span class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10"
                  v-if="index != 0 || floatRequest.items.length > 1" @click="deleteItem(index)">
                  <div>
                    <i class="icon ion-trash-a"></i>
                  </div>
                </span>
              </td>
            </tr>
            <tr v-if="floatRequest.items.length > 0">
              <td colspan="2" rowspan="4" class="valign-middle"></td>
              <td class="tx-right tx-uppercase tx-bold tx-inverse" colspan="1">
                Total
              </td>
              <td colspan="1" class="tx-right">
                <h4 class="tx-primary tx-bold tx-lato">
                  {{ { value: total } | toMoney }}
                </h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-12 tx-center mg-t-20 form-layout-footer">
      <v-button class="btn btn-primary" :disabled="disabled" @click="submitFloatRequest()">SUBMIT</v-button>
    </div>
  </form>
  <loading v-else />
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";
import { findIndex } from "lodash";
import { mapActions } from "vuex";

export default {
  components: { loading, vButton, vPaginate, vSelect },
  computed: {
    total() {
      return this.floatRequest.items.reduce(
        (total, item) => total + item.cost * item.quantity,
        0
      );
    }
  },
  created() {
    this.getFloatRequests(this);
    this.setUserOrg();
    this.add1Item();
  },
  data: () => ({
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
    floatRequest: {
      name: null,
      description: null,
      file: null,
      file_name: "Select File",
      unit_id: null,
      items: []
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
    title: "Create Float Request · Tsebo-Rapid"
  }),
  meta: {
    pageName: "float-requests.store"
  },
  methods: {
    ...mapActions({
      getFloatRequests: "maintenance/floatRequests/getFloatRequests"
    }),
    add1Item() {
      this.floatRequest.items.push({
        description: null,
        quantity: null,
        cost: null
      });
    },
    deleteItem(index) {
      this.floatRequest.items.splice(index, 1);
    },
    setDefaultHierarchy(level) {
      if (level.hierarchies > 1) return true;
      level.hierarchy = level.hierarchies[0];
      return false;
    },
    async getBaseHierarchies() {
      try {
        const response = await this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent"], baseUnitHierarchies: true }
        });
        this.baseHierarchies = response.data.data;
        this.baseHierarchiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getHierarchies() {
      try {
        const response = await this.$axios.get("unit-hierarchies", {
          params: { associations: ["parent"] }
        });
        this.hierarchies = response.data.data;
        this.hierarchiesLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getUnits() {
      this.unitsLoading = true;
      try {
        const response = await this.$axios.get("units", {
          params: {
            associations: ["children", "hierarchies"]
          }
        });
        this.units = response.data.data;
        this.unitsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getUsers() {
      this.usersLoading = true;
      try {
        const response = await this.$axios.get("users");
        this.users = response.data.data;
        this.usersLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async setUserOrg() {
      await this.getBaseHierarchies();
      await this.getHierarchies();
      await this.getUnits();
      await this.getUsers();

      const hierarchies = this.baseHierarchies.map((hierarchy) => {
        hierarchy.units = this.units.filter(
          (unit) => unit.unit_hierarchy_id == hierarchy.id
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
      this.floatRequest.unit_id = level.unit.id;

      if (level.unit.children.length < 1) return false;

      var hierarchies = level.unit.hierarchies.filter((unitHierarchy) =>
        this.hierarchies.find((hierarchy) => hierarchy.id == unitHierarchy.id)
      );

      hierarchies = hierarchies.map((hierarchy) => {
        hierarchy.units = this.units.filter(
          (unit) => unit.unit_hierarchy_id == hierarchy.id
        );
        return hierarchy;
      });

      var nextLevel = {
        hierarchies,
        hierarchy: null,
        id: `unit-${level.unit.id}`,
        unit: null
      };
      if (this.unitHierarchy.levels.find((level) => level.id == nextLevel.id))
        return false;
      this.unitHierarchy.levels.push(nextLevel);
      this.setDefaultHierarchy(nextLevel);
    },
    async submitFloatRequest() {
      if (!this.validateForm("create-float-request-form")) return false;

      this.disabled = true;

      const item_description = this.floatRequest.items.map(
        (item) => item.description
      );
      const item_quantity = this.floatRequest.items.map(
        (item) => item.quantity
      );
      const item_cost = this.floatRequest.items.map((item) => item.cost);

      try {
        const response = await this.$axios.post("float-requests", {
          ...this.floatRequest,
          item_description,
          item_quantity,
          item_cost
        });

        this.disabled = false;
        this.$store.commit(
          "maintenance/floatRequests/setFloatRequest",
          response.data.floatRequest
        );
        this.$store.commit("maintenance/floatRequests/toggleRefresh");
        this.$router.push(
          `/maintenance/float-requests/details?id=${response.data.floatRequest.id}`
        );
      } catch (error) {
        console.log(error);
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response.status == 413) {
          this.validationErrors.file = response.statusText;
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {}
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, formMixin]
};
</script>
