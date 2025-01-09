<template>
  <form id="create-web-hook-form" class="bg-white pd-20" v-if="!systemEntitiesLoading">
    <div class="row">
      <div class="col-md-4 form-group">
        <label for="system_entity" class="form-control-label">
          Entity
          <span class="text-danger">*</span>
        </label>
        <select name="system_entity" v-model="systemEntity" class="form-control" required>
          <option :value="{}">Select One</option>
          <option v-for="entity in systemEntities" :key="entity.id" :value="entity" v-text="entity.name"></option>
        </select>
        <input type="text" name="system_entity_id" :value="systemEntity.id" class="d-none" required />
        <small class="tx-bold tx-danger" v-text="validationErrors['system_entity_id']"></small>
      </div>
      <div class="col-md-4 form-group">
        <label for="system_event_trigger_id" class="form-control-label">
          Event Trigger
          <span class="text-danger">*</span>
        </label>
        <select name="system_event_trigger_id" v-model="webHook.system_event_trigger_id" class="form-control" required>
          <option :value="null">Select One</option>
          <option v-for="trigger in systemEntity.eventTriggers" :key="trigger.id" :value="trigger.id"
            v-text="trigger.name"></option>
        </select>
        <small class="tx-bold tx-danger" v-text="validationErrors['system_event_trigger_id']"></small>
      </div>
      <div class="col-md-4 form-group">
        <label for="web_hook_verb_id" class="form-control-label">
          Request Method
          <span class="text-danger">*</span>
        </label>
        <select name="web_hook_verb_id" v-model="webHook.web_hook_verb_id" class="form-control" required>
          <option :value="null">Select One</option>
          <option v-for="verb in webHookVerbs" :key="verb.id" :value="verb.id" v-text="verb.name"></option>
        </select>
        <small class="tx-bold tx-danger" v-text="validationErrors['web_hook_verb_id']"></small>
      </div>
      <div class="col-md-4 form-group">
        <label for="url" class="form-control-label">
          Url
          <span class="text-danger">*</span>
        </label>
        <input type="text" name="url" v-model="webHook.url" class="form-control" required placeholder="Web Hook URL" />
        <small class="tx-bold tx-danger" v-text="validationErrors['url']"></small>
      </div>
      <div class="col-md-4 form-group">
        <label for="url" class="form-control-label">
          Basic Auth Username
          <span class="text-danger" v-if="webHook.basic_auth_password">*</span>
        </label>
        <input type="text" name="basic_auth_username" v-model="webHook.basic_auth_username" class="form-control"
          placeholder="Basic Auth Username" :required="webHook.basic_auth_password" />
        <small class="tx-bold tx-danger" v-text="validationErrors['basic_auth_username']"></small>
      </div>
      <div class="col-md-4 form-group" v-if="webHook.basic_auth_username">
        <label for="url" class="form-control-label">
          Basic Auth Password
          <span class="text-danger" v-if="webHook.basic_auth_username">*</span>
        </label>
        <input type="password" name="basic_auth_password" v-model="webHook.basic_auth_password" class="form-control"
          placeholder="Web Hook Password" :required="webHook.basic_auth_usename" />
        <small class="tx-bold tx-danger" v-text="validationErrors['basic_auth_password']"></small>
      </div>
    </div>

    <div class="slim-card-title mg-t-20">Headers</div>
    <span class="mg-t-10 btn btn-sm btn-primary" v-if="webHook.headers.length < 1" @click="add1Header()">ADD
      HEADERS</span>

    <div class="row mg-t-20" v-for="(header, index) in webHook.headers" :key="`header-${index}`">
      <div class="form-group col-md-5">
        <label class="form-control-label">
          Header Name
          <span class="tx-danger">*</span>
        </label>
        <input type="text" class="form-control" :name="`header_name${index}`" v-model="header.name" required
          placeholder="Header Name e.g Authorization" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`header_name${index}`]"></small>
      </div>

      <div class="form-group col-md-5">
        <label class="form-control-label">
          Header Value
          <span class="tx-danger">*</span>
        </label>
        <textarea type="text" class="form-control" rows="1" :name="`header_value${index}`" v-model="header.value"
          required placeholder="Header Value e.g Bearer [token]"></textarea>
        <small class="tx-bold tx-danger" v-text="validationErrors[`header_value${index}`]"></small>
      </div>

      <div class="col-12 tx-center">
        <span @click="add1Header()" class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10">
          <div class="tx-20">+</div>
        </span>
        <span @click="deleteHeader(index)" class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
      </div>
    </div>

    <div class="slim-card-title mg-t-20">Parameters</div>
    <span class="mg-t-10 btn btn-sm btn-primary" v-if="webHook.params.length < 1" @click="add1Param()">ADD PARAMS</span>

    <div class="row mg-t-20" v-for="(param, index) in webHook.params" :key="`param-${index}`">
      <div class="form-group col-md-5">
        <label :for="`param_id`" class="form-control-label">
          Parameter
          <span class="tx-danger">*</span>
        </label>
        <select :name="`id${index}`" v-model="param.id" class="form-control" required>
          <option :value="null">Select One</option>
          <option v-for="entityParam in systemEntity.params" :key="entityParam.id" :value="entityParam.id"
            v-text="entityParam.name"></option>
        </select>
        <small class="tx-bold tx-danger" v-text="validationErrors[`id${index}`]"></small>
      </div>

      <div class="form-group col-md-5">
        <label class="form-control-label">
          Param Name
          <span class="tx-danger">*</span>
        </label>
        <input type="text" class="form-control" v-model="param.name" :name="`name${index}`" required
          placeholder="Send parameter as" />
        <small class="tx-bold tx-danger" v-text="validationErrors[`name${index}`]"></small>
      </div>

      <div class="col-12 tx-center">
        <span @click="add1Param()" class="btn btn-outline-info btn-icon rounded-circle cursor-pointer mg-10">
          <div class="tx-20">+</div>
        </span>
        <span @click="deleteParam(index)" class="btn btn-outline-danger btn-icon rounded-circle cursor-pointer mg-10">
          <div>
            <i class="icon ion-trash-a"></i>
          </div>
        </span>
      </div>
    </div>

    <div class="form-layout-footer tx-center mg-t-20">
      <v-button class="btn btn-primary bd-0" :disabled="disabled" @click="submitWebHook()">SUBMIT</v-button>
    </div>
  </form>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import authMixin from "@/mixins/auth";
import formMixin from "@/mixins/forms";

const getInitialData = () => ({
  disabled: false,
  systemEntity: {},
  systemEntities: [],
  systemEntitiesLoading: true,
  validationErrors: {},
  webHook: {
    name: null,
    url: null,
    basic_auth_usename: null,
    basic_auth_password: null,
    system_event_trigger_id: null,
    web_hook_verb_id: null,
    headers: [],
    params: []
  },
  webHookVerbs: []
});

export default {
  components: { loading, vButton },
  created() {
    this.getSystemEntities(this);
    this.getWebHookVerbs(this);
  },
  data: () => getInitialData(),
  head: () => ({
    title: "Create Web Hook · Tsebo-Rapid"
  }),
  meta: {
    pageName: "web-hooks.store"
  },
  methods: {
    ...mapActions({
      getSystemEntities: "console/systemEntities/getSystemEntities",
      getWebHookVerbs: "console/webHookVerbs/getWebHookVerbs"
    }),
    add1Header() {
      this.webHook.headers.push({
        name: null,
        value: null
      });
    },
    deleteHeader(index) {
      this.webHook.headers.splice(index, 1);
      delete this.validationErrors["header_name" + index];
      delete this.validationErrors["header_value" + index];
      return true;
    },
    add1Param() {
      this.webHook.params.push({
        id: null,
        name: null
      });
    },
    deleteParam(index) {
      this.webHook.params.splice(index, 1);
      delete this.validationErrors["id" + index];
      delete this.validationErrors["value" + index];
      return true;
    },
    async submitWebHook() {
      if (!this.validateForm("create-web-hook-form")) return false;
      this.disabled = true;

      const header_name = this.webHook.headers.map((header) => header.name);
      const header_value = this.webHook.headers.map((header) => header.value);
      const param_name = this.webHook.params.map((param) => param.name);
      const system_entity_param_id = this.webHook.params.map(
        (param) => param.id
      );

      try {
        const response = await this.$axios.post("web-hooks", {
          ...this.webHook,
          header_name,
          header_value,
          param_name,
          system_entity_param_id
        });
        var { systemEntities, systemEntitiesLoading, webHookVerbs } = this;
        var initialData = Object.assign(getInitialData(), {
          systemEntities,
          systemEntitiesLoading,
          webHookVerbs
        });
        Object.assign(this.$data, initialData);
        this.$store.commit("console/webHooks/toggleRefresh");
        this.toast({ title: "Web hook created", type: "success" });
      } catch (error) {
        this.disabled = false;
        console.log(error);
        this.toast({ title: "Could not submit web hook", type: "danger" });
        const response = error.response;
        if (!response) return false;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
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
