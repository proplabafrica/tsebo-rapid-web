<template>
  <v-paginate class="mg-t-10" :list="webHooks" perPage="60" v-if="!webHooksLoading">
    <template v-slot="paginate">
      <div class="row mg-0" v-if="paginate.list.length > 0">
        <div class="col-md-6 col-lg-4 pd-md-0" v-for="webHook in paginate.list" :key="webHook.id">
          <ul class="list-group">
            <li class="list-group-item ht-100" style="min-height:130px">
              <p class="mg-b-0">
                <edit-web-hook v-if="!systemEntitiesLoading" :systemEntities="systemEntities" :webHook="webHook"
                  :webHookVerbs="webHookVerbs" @updated="updateList()" />
                <span class="d-block">
                  <strong>EVENT:</strong>
                  <span v-for="event in webHook.events" :key="event.id" v-text="event.trigger.name"></span>
                </span>
                <span class="d-block">
                  <strong>URL:</strong>
                  {{ webHook.url }}
                </span>
                <span class="d-block">
                  <strong>METHOD:</strong>
                  {{ webHook.verb.name }}
                </span>
                <span class="d-block" style="text-align:right" v-modal-open="'delete-modal'"
                  @click="webHookToDelete = webHook">
                  <i class="icon ion-trash-a tx-danger tx-16 cursor-pointer"></i>
                </span>
              </p>
            </li>
          </ul>
        </div>
        <!-- col-4 -->
      </div>
      <h4 v-else>No data to display</h4>
      <!-- row -->
      <v-modal ref="delete-modal">
        <div class="modal-dialog wd-300 wd-sm-400" role="document">
          <div class="modal-content tx-size-sm">
            <div class="modal-body tx-center pd-y-20 pd-x-20">
              <button type="button" class="close" v-modal-close="'delete-modal'" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 style="font-size: 16px" class="mg-b-20">
                Are you sure you want to delete this web hook?
              </h4>
              <div class="form-layout-footer">
                <v-button type="button" style="border-radius: 8px" class="btn btn-primary pd-x-4" :disabled="disabled"
                  @click="deleteWebHook()">
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
    <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
  </v-paginate>
  <loading v-else />
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vPaginate from "@/components/ui/paginate";
import authMixin from "@/mixins/auth";
import vModal from "@/components/ui/v-modal";
import modalMixin from "@/mixins/modal";
import vButton from "@/components/ui/v-button";

export default {
  components: {
    "edit-web-hook": () => import("@/components/console/web-hooks/edit"),
    loading,
    vPaginate,
    vModal,
    vButton
  },
  created() {
    this.getWebHooks(this);
    this.getWebHookVerbs(this);
    this.getSystemEntities(this);
  },
  data: () => ({
    systemEntities: [],
    systemEntitiesLoading: true,
    webHooks: [],
    webHooksLoading: true,
    webHookVerbs: [],
    webHookToDelete: {},
    disabled: false
  }),
  head: () => ({
    title: "Web Hooks · Tsebo-Rapid"
  }),
  meta: {
    pageName: "web-hooks.index"
  },
  methods: {
    ...mapActions({
      getSystemEntities: "console/systemEntities/getSystemEntities",
      getWebHooks: "console/webHooks/getWebHooks",
      getWebHookVerbs: "console/webHookVerbs/getWebHookVerbs"
    }),
    updateList() {
      this.getWebHooks(this);
    },
    async deleteWebHook() {
      let webHook = this.webHookToDelete;

      const header_name = this.webHookToDelete.headers.map(header => header.name);
      const header_value = this.webHookToDelete.headers.map(header => header.value);
      const param_name = this.webHookToDelete.params.map(param => param.name);
      const system_entity_param_id = this.webHookToDelete.params.map(
        param => param.id
      );

      try {
        const response = await this.$axios.delete(`web-hooks/${webHook.id}`, {
          ...webHook,
          header_name,
          header_value,
          param_name,
          system_entity_param_id
        });
        this.disabled = false;
        this.toast({
          type: "info",
          title: "Web Hook Deleted"
        });
        this.$router.go();
        this.$store.commit("console/webHooks/toggleRefresh");
      } catch (error) {
        console.log(error);
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Unable To Delete Web Hook"
        });
      }
    }
  },
  middleware: ["auth", "roleGuard"],
  mixins: [authMixin, modalMixin]
};
</script>
