<template>
  <div>
    <i class="icon ion-android-create tx-16 tx-info cursor-pointer float-right"
      v-modal-open="'edit-web-hook-modal'"></i>
    <v-modal ref="edit-web-hook-modal">
      <div class="modal-dialog" role="document">
        <div class="modal-content tx-size-sm">
          <div class="modal-body pd-y-20 pd-x-20">
            <button type="button" class="close" v-modal-close="'edit-web-hook-modal'" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="mg-b-20">Edit Web Hook</h4>
            <form id="edit-web-hook-form">
              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="system_entity" class="form-control-label">
                    Entity
                    <span class="text-danger">*</span>
                  </label>
                  <select name="system_entity" v-model="systemEntity" class="form-control" required>
                    <option :value="{}">Select One</option>
                    <option v-for="entity in systemEntities" :key="entity.id" :value="entity" v-text="entity.name">
                    </option>
                  </select>
                  <input type="text" name="system_entity_id" :value="systemEntity.id" class="d-none" required />
                  <small class="tx-bold tx-danger" v-text="validationErrors['system_entity_id']"></small>
                </div>
                <div class="col-md-6 form-group">
                  <label for="system_event_trigger_id" class="form-control-label">
                    Event Trigger
                    <span class="text-danger">*</span>
                  </label>
                  <select name="system_event_trigger_id" v-model="editedWebHook.system_event_trigger_id"
                    class="form-control" required>
                    <option :value="null">Select One</option>
                    <option v-for="trigger in systemEntity.eventTriggers" :key="trigger.id" :value="trigger.id"
                      v-text="trigger.name"></option>
                  </select>
                  <small class="tx-bold tx-danger" v-text="validationErrors['system_event_trigger_id']"></small>
                </div>
                <div class="col-md-6 form-group">
                  <label for="web_hook_verb_id" class="form-control-label">
                    Request Method
                    <span class="text-danger">*</span>
                  </label>
                  <select name="web_hook_verb_id" v-model="editedWebHook.web_hook_verb_id" class="form-control"
                    required>
                    <option :value="null">Select One</option>
                    <option v-for="verb in webHookVerbs" :key="verb.id" :value="verb.id" v-text="verb.name"></option>
                  </select>
                  <small class="tx-bold tx-danger" v-text="validationErrors['web_hook_verb_id']"></small>
                </div>
                <div class="col-md-6 form-group">
                  <label for="url" class="form-control-label">
                    Url
                    <span class="text-danger">*</span>
                  </label>
                  <input type="text" name="url" v-model="editedWebHook.url" class="form-control" required
                    placeholder="Web Hook URL" />
                  <small class="tx-bold tx-danger" v-text="validationErrors['url']"></small>
                </div>
                <div class="col-md-6 form-group">
                  <label for="url" class="form-control-label">
                    Basic Auth Username
                    <span class="text-danger" v-if="editedWebHook.basic_auth_password">*</span>
                  </label>
                  <input type="text" name="basic_auth_username" v-model="editedWebHook.basic_auth_username"
                    class="form-control" placeholder="Basic Auth Username"
                    :required="editedWebHook.basic_auth_password" />
                  <small class="tx-bold tx-danger" v-text="validationErrors['basic_auth_username']"></small>
                </div>
                <div class="col-md-6 form-group" v-if="editedWebHook.basic_auth_username">
                  <label for="url" class="form-control-label">
                    Basic Auth Password
                    <span class="text-danger" v-if="editedWebHook.basic_auth_username">*</span>
                  </label>
                  <input type="password" name="basic_auth_password" v-model="editedWebHook.basic_auth_password"
                    class="form-control" placeholder="Web Hook Password" :required="editedWebHook.basic_auth_usename" />
                  <small class="tx-bold tx-danger" v-text="validationErrors['basic_auth_password']"></small>
                </div>
              </div>

              <div class="slim-card-title mg-t-20">Headers</div>
              <span class="mg-t-10 btn btn-sm btn-primary" v-if="editedWebHook.headers.length < 1"
                @click="add1Header()">ADD HEADERS</span>

              <div class="row mg-t-20" v-for="(header, index) in editedWebHook.headers" :key="`header-${index}`">
                <div class="form-group col-md-6">
                  <label class="form-control-label">
                    Header Name
                    <span class="tx-danger">*</span>
                  </label>
                  <input type="text" class="form-control" :name="`header_name${index}`" v-model="header.name" required
                    placeholder="Header Name e.g Authorization" />
                  <small class="tx-bold tx-danger" v-text="validationErrors[`header_name${index}`]"></small>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-control-label">
                    Header Value
                    <span class="tx-danger">*</span>
                  </label>
                  <textarea type="text" class="form-control" rows="1" :name="`header_value${index}`"
                    v-model="header.value" required placeholder="Header Value e.g Bearer [token]"></textarea>
                  <small class="tx-bold tx-danger" v-text="validationErrors[`header_value${index}`]"></small>
                </div>

                <div class="col-12 tx-center">
                  <span @click="add1Header()" class="
                      btn btn-outline-info btn-icon
                      rounded-circle
                      cursor-pointer
                      mg-10
                    ">
                    <div class="tx-20">+</div>
                  </span>
                  <delete-header :webHook="editedWebHook" :index="index" @deleteHeader="deleteHeader" />
                </div>
              </div>

              <div class="slim-card-title mg-t-20">Parameters</div>
              <span class="mg-t-10 btn btn-sm btn-primary" v-if="editedWebHook.params.length < 1"
                @click="add1Param()">ADD PARAMS</span>

              <div class="row mg-t-20" v-for="(param, index) in editedWebHook.params" :key="`param-${index}`">
                <div class="form-group col-md-6">
                  <label :for="`param_id`" class="form-control-label">
                    Parameter
                    <span class="tx-danger">*</span>
                  </label>
                  <select :name="`id${index}`" v-model="param.system_entity_param_id" class="form-control" required>
                    <option :value="null">Select One</option>
                    <option v-for="entityParam in systemEntity.params" :key="entityParam.id" :value="entityParam.id"
                      v-text="entityParam.name"></option>
                  </select>
                  <small class="tx-bold tx-danger" v-text="validationErrors[`id${index}`]"></small>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-control-label">
                    Param Name
                    <span class="tx-danger">*</span>
                  </label>
                  <input type="text" class="form-control" v-model="param.name" :name="`name${index}`" required
                    placeholder="Send parameter as" />
                  <small class="tx-bold tx-danger" v-text="validationErrors[`name${index}`]"></small>
                </div>

                <div class="col-12 tx-center">
                  <span @click="add1Param()" class="
                      btn btn-outline-info btn-icon
                      rounded-circle
                      cursor-pointer
                      mg-10
                    ">
                    <div class="tx-20">+</div>
                  </span>
                  <delete-param :webHook="editedWebHook" :index="index" @deleteParam="deleteParam" />
                </div>
              </div>

              <div class="form-layout-footer tx-center mg-t-20">
                <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="updateWebHook()">SUBMIT</v-button>
              </div>
            </form>
          </div>
          <!-- modal-body -->
        </div>
        <!-- modal-content -->
      </div>
      <!-- modal-dialog -->
    </v-modal>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import deleteHeader from "@/components/console/web-hooks/delete-header";
import deleteParam from "@/components/console/web-hooks/delete-param";
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";

export default {
  components: { deleteHeader, deleteParam, vButton, vModal },
  async created() {
    this.systemEntity = this.systemEntities.find(
      (entity) => entity.id == this.webHook.events[0].trigger.system_entity_id
    );
    this.setEditedWebHook();
  },
  data: () => ({
    disabled: false,
    editedWebHook: {
      name: null,
      url: null,
      basic_auth_usename: null,
      basic_auth_password: null,
      system_event_trigger_id: null,
      web_hook_verb_id: null,
      headers: [],
      params: []
    },
    headerToDeleteIndex: null,
    paramToDeleteIndex: null,
    systemEntity: {},
    validationErrors: {}
  }),
  methods: {
    add1Header() {
      this.editedWebHook.headers.push({
        name: null,
        value: null
      });
    },
    add1Param() {
      this.editedWebHook.params.push({
        id: null,
        name: null
      });
    },
    deleteHeader(index) {
      this.editedWebHook.headers.splice(index, 1);
      delete this.validationErrors["header_name" + index];
      delete this.validationErrors["header_value" + index];
    },
    deleteParam(index) {
      this.editedWebHook.params.splice(index, 1);
      delete this.validationErrors["id" + index];
      delete this.validationErrors["value" + index];
    },
    setEditedWebHook() {
      const {
        name,
        url,
        basic_auth_username,
        basic_auth_password,
        web_hook_verb_id
      } = this.webHook;
      const system_event_trigger_id =
        this.webHook.events[0].system_event_trigger_id;
      const headers = this.webHook.headers.map((header) =>
        Object.assign({}, header)
      );
      const params = this.webHook.params.map((param) =>
        Object.assign({}, param)
      );
      this.editedWebHook = Object.assign(
        {},
        {
          name,
          url,
          basic_auth_username,
          basic_auth_password,
          system_event_trigger_id,
          web_hook_verb_id,
          headers,
          params
        }
      );
    },
    async updateWebHook() {
      if (!this.validateForm("edit-web-hook-form")) return false;
      this.disabled = true;

      const header_name = this.editedWebHook.headers.map(
        (header) => header.name
      );
      const header_value = this.editedWebHook.headers.map(
        (header) => header.value
      );
      const param_name = this.editedWebHook.params.map((param) => param.name);
      const system_entity_param_id = this.editedWebHook.params.map(
        (param) => param.system_entity_param_id
      );

      try {
        const response = await this.$axios.put(`web-hooks/${this.webHook.id}`, {
          ...this.editedWebHook,
          header_name,
          header_value,
          param_name,
          system_entity_param_id
        });
        this.disabled = false;
        this.$store.commit("console/webHooks/toggleRefresh");
        this.$emit("updated", this);
        this.closeModal("edit-web-hook-modal");
        this.toast({ title: "Web hook updated", type: "success" });
      } catch (error) {
        this.disabled = false;
        console.log(error);
        this.toast({ title: "Could not update web hook", type: "danger" });
        const response = error.response;
        if (!response) return false;
        if (response && response.status && response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
          // response);
        }
      }
    }
  },
  mixins: [formMixin, modalMixin],
  props: ["systemEntities", "webHook", "webHookVerbs"]
};
</script>
