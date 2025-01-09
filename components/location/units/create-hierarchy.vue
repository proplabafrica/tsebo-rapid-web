<template>
  <form :id="'create-hierarchies-form' + parentHierarchy.id">
    <div class="form-layout">
      <div class="row mg-b-25">
        <div class="col-12 col-md-8" v-for="(hierarchy, index) in hierarchyArray" :key="`hierarchy-${index}`">
          <div class="form-group">
            <div class="input-group">
              <input :name="'name' + index" v-model="hierarchies[index].name" class="form-control" required
                placeholder="Name" />
              <div class="input-group-append cursor-pointer" v-if="index != 0" @click="deleteHierarchy(index)">
                <span class="input-group-text bg-danger tx-white">
                  <i class="icon ion-trash-a tx-16 lh-0"></i>
                </span>
              </div>
              <div class="input-group-append cursor-pointer" @click="add1Hierarchy()">
                <span class="input-group-text">+</span>
              </div>
            </div>
            <small class="tx-bold tx-danger" v-text="validationErrors['name' + index]"></small>
          </div>
        </div>
      </div>
      <!-- row -->

      <div class="form-layout-footer tx-center">
        <v-button class="btn btn-primary bd-0" @click="submitHierarchies()" :disabled="disabled">SUBMIT</v-button>
      </div>
      <!-- form-layout-footer -->
    </div>
    <!-- form-layout -->
  </form>
</template>

<script>
import vButton from "@/components/ui/v-button";
import formMixin from "@/mixins/forms";
export default {
  created() {
    this.add1Hierarchy();
  },
  components: { vButton },
  data: () => ({
    disabled: false,
    hierarchyArray: [],
    hierarchies: [],
    validationErrors: {}
  }),
  methods: {
    add1Hierarchy() {
      this.hierarchyArray.push({});
      this.hierarchies.push({ name: "" });
      this.validationErrors["name" + (this.hierarchies.length - 1)] = null;
    },
    deleteHierarchy(index) {
      this.hierarchyArray.splice(index, 1);
      this.hierarchies.splice(index, 1);
      delete this.validationErrors["name" + index];
    },
    submitHierarchies() {
      if (
        !this.validateForm("create-hierarchies-form" + this.parentHierarchy.id)
      ) {
        return false;
      }
      this.disabled = true;
      var name = [],
        organization_id = [],
        parent_hierarchy_id = [],
        unit_id = [];

      for (const hierarchy of this.hierarchies) {
        name.push(hierarchy.name);
        organization_id.push(this.organization.id);
        parent_hierarchy_id.push(this.parentHierarchy.id);
        if (this.parentUnit) unit_id.push(this.parentUnit.id);
        else unit_id.push(null);
      }

      this.$axios
        .post("unit-hierarchies/store-many", {
          name,
          organization_id,
          parent_hierarchy_id,
          unit_id
        })
        .then((response) => {
          this.disabled = false;
          this.$emit("update");
          this.hierarchyArray = [];
          this.hierarchies = [];
          this.add1Hierarchy();
        })
        .catch((error) => {
          console.log(error);
          this.disabled = false;
          var response = error.response;
          if (response && response.status && response.status == 422) {
            for (const error of response.data) {
              this.validationErrors[error.field] = error.message;
            }
          } else {
            this.toast({
              type: "danger",
              title: "Network Error. Please Contact Support"
            });
          }
        });
    }
  },
  mixins: [formMixin],
  props: ["organization", "parentHierarchy", "parentUnit"]
};
</script>
