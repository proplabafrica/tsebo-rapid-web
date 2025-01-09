<template>
  <form id="update-role-form" class="pd-10 card" v-if="editedRole">
    <div class="form-layout" v-if="!systemFunctionsLoading && !roleSystemFunctionsLoading">
      <div class="row">
        <div class="form-group col-md-6">
          <label for="name">
            Name
            <span class="tx-danger">*</span>
          </label>
          <input type="text" name="name" v-model="editedRole.name" required class="form-control" />
          <small class="tx-danger tx-bold" v-if="validationErrors.name" v-text="validationErrors.name"></small>
        </div>
        <div class="form-group col-md-6">
          <label for="name">
            Codes
            <span class="tx-danger">*</span>
          </label>
          <select name="country_code" class="form-control" required v-model="editedRole.code">
            <option :value="null">Select a Code</option>
            <option v-for="code in roleCodes" :key="`role-code-${code}`" :value="code" v-text="code"></option>
          </select>
          <small class="tx-danger tx-bold" v-if="validationErrors.code" v-text="validationErrors.code"></small>
        </div>
      </div>
      <div class="slim-card-title">
        SYSTEM FUNCTIONS
        <input type="text" v-model="search" class="form-control wd-200" placeholder="Type here to search" />
      </div>
      <div v-if="filteredSystemFuntions.length > 0">
        <v-paginate class="mg-t-10" :list="filteredSystemFuntions" perPage="80">
          <template v-slot="paginate">
            <div class="row mg-0">
              <div class="col-md-6 pd-md-0" v-for="systemFunction in paginate.list" :key="systemFunction.id">
                <ul class="list-group">
                  <li class="list-group-item vertical-align-center ht-60">
                    <p class="mg-b-0">
                      <span class="tx-inverse">
                        <strong class="tx-medium" v-text="systemFunction.name"></strong>
                      </span>
                      <label class="ckbox float-right">
                        <input type="checkbox" :value="systemFunction.id" v-model="editedRole.system_function_ids" />
                        <span>
                          <span class="d-none">ok</span>
                        </span>
                      </label>
                    </p>
                  </li>
                </ul>
              </div>
              <!-- col-4 -->
            </div>
            <!-- row -->
          </template>
          <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
        </v-paginate>
      </div>
      <div class="form-layout-footer tx-center mg-t-20">
        <v-button :disabled="disabled" @click="updateRole()" class="btn btn-primary">SAVE</v-button>
      </div>
    </div>
    <loading v-else />
  </form>
</template>

<script>
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import formMixin from "@/mixins/forms";

export default {
  components: { loading, vButton, vPaginate },
  computed: {
    filteredSystemFuntions() {
      if (!this.search) return this.systemFunctions;

      return this.systemFunctions.filter((systemFunction) =>
        systemFunction.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  async created() {
    await this.getSystemFunctions();
    await this.getSystemFunctionsByRoleId(this.$route.query["role-id"]);
    this.setEditedRole(this.$route.query["role-id"]);
  },
  data: () => ({
    disabled: false,
    editedRole: null,
    role: null,
    roleCodes: ["FM", "OA", "OCC", "PM", "PO", "SYS", "TCHN", "VND"],
    roleSystemFunctions: [],
    roleSystemFunctionsLoading: true,
    search: null,
    systemFunctions: [],
    systemFunctionsLoading: true,
    validationErrors: {}
  }),
  methods: {
    async getSystemFunctions() {
      this.systemFunctionsLoading = true;

      try {
        const response = await this.$axios.get("system-functions", {
          params: {
            perPage: 1000,
            sortBy: "system_entity_id",
            sortOrder: "asc"
          }
        });
        this.systemFunctions = response.data.data;
        this.systemFunctionsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    async getSystemFunctionsByRoleId(roleId) {
      this.roleSystemFunctionsLoading = true;

      try {
        const response = await this.$axios.get("system-functions", {
          params: { byRoleIds: [roleId], perPage: 1000 }
        });

        this.roleSystemFunctions = response.data.data;
        this.roleSystemFunctionsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    setEditedRole(roleId) {
      this.role = this.organization.roles?.find((role) => role.id == roleId);
      if (!this.role) return;
      const { name, code } = this.role;
      const system_function_ids = this.roleSystemFunctions.map(
        (systemFunction) => systemFunction.id
      );
      this.editedRole = Object.assign({}, { name, code, system_function_ids });
    },
    async updateRole() {
      if (!this.validateForm("update-role-form")) return false;
      this.disabled = true;

      const { name, code, system_function_ids } = this.editedRole;
      const new_system_function_ids = system_function_ids.filter(
        (systemFunctionId) =>
          !this.roleSystemFunctions?.find(
            (systemFunction) => systemFunction.id == systemFunctionId
          )
      );
      const detached_system_function_ids = this.roleSystemFunctions
        .filter(
          (systemFunction) =>
            !system_function_ids?.find(
              (systemFunctionId) => systemFunctionId == systemFunction.id
            )
        )
        .map((systemFunction) => systemFunction.id);

      try {
        await this.$axios.put(`roles/${this.role.id}`, {
          name,
          code,
          detached_system_function_ids,
          new_system_function_ids
        });
        this.disabled = false;
        this.toast({ type: "info", title: "Role Updated" });
        this.$emit("update");
      } catch (error) {
        this.toast({ type: "warning", title: "Error Updating Role" });
        this.disabled = false;
        var response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        }
      }
    }
  },
  mixins: [formMixin],
  props: ["organization"],
  watch: {
    async $route(to, from) {
      await this.getSystemFunctionsByRoleId(to.query["role-id"]);
      this.setEditedRole(to.query["role-id"]);
    }
  }
};
</script>
