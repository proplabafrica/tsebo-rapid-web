<template>
  <div>
    <form id="create-equipment-file" class="wd-400 pd-t-5">
      <div class="d-flex">
        <div class="input-group wd-250">
          <div class="custom-file">
            <input type="file" @change="
              convertToBase64($event).then((data) => {
                file.file = data.file;
                file.file_name = data.file_name;
              })
            " class="custom-file-input" name="file" title="Select a file 1MB or less" required />
            <label class="custom-file-label" for="customFile" v-text="file.file_name"></label>
          </div>
          <!-- custom-file -->
        </div>
        <v-button type="button" class="btn btn-primary mg-l-5 pd-x-25" :disabled="disabled" @click="submitFile()">
          SUBMIT
        </v-button>
      </div>
    </form>
    <v-paginate :list="files" perPage="60" v-if="!filesLoading" class="mg-t-10">
      <template v-slot="paginate">
        <div class="row mg-0" v-if="paginate.list.length > 0">
          <div class="col-md-6 col-lg-4 pd-md-0" v-for="file in paginate.list" :key="file.id">
            <ul class="list-group">
              <li class="list-group-item ht-100">
                <p class="mg-b-0">
                  <nuxt-link class="tx-inverse" :to="`/utilities/files/details?id=${file.id}`">
                    <strong class="tx-medium" v-text="file.client_name"></strong>
                  </nuxt-link>
                  <delete-file :file="file" @update="updateFiles()" />
                </p>
              </li>
            </ul>
          </div>
          <!-- col-4 -->
        </div>
        <!-- row -->
        <div v-else>
          <h4>No data to display</h4>
        </div>
      </template>
      <template v-slot:linksWrapper class="card-footer tx-13 pd-y-15 bg-transparent"></template>
    </v-paginate>
    <loading v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/ui/loading";
import vButton from "@/components/ui/v-button";
import vPaginate from "@/components/ui/paginate";
import formMixin from "@/mixins/forms";

export default {
  components: {
    "delete-file": () => import("@/components/utility/files/delete"),
    loading,
    vButton,
    vPaginate
  },
  created() {
    this.fileEquipmentIds = [this.equipment.id];
    this.getFiles(this);
  },
  data: () => ({
    disabled: false,
    file: { file: null, file_name: "Select File (Max 2MB)" },
    files: [],
    fileEquipmentIds: [],
    filesLoading: true,
    validationErrors: {}
  }),
  head() {
    return {
      title: this.equipment
        ? `Files · ${this.equipment.name} · Tsebo-Rapid`
        : "Equipment Files · Tsebo-Rapid"
    };
  },
  methods: {
    ...mapActions({
      getFiles: "utility/files/getFiles"
    }),
    async submitFile() {
      if (!this.validateForm("create-equipment-file")) {
        this.toast({ type: "warning", title: "Please select a file" });
        return false;
      }
      this.disabled = true;

      try {
        const response = await this.$axios.put(
          `equipment/${this.equipment.id}`,
          this.file
        );
        this.disabled = false;
        this.toast({ type: "info", title: "File Added" });
        this.updateFiles();
      } catch (error) {
        this.disabled = false;
        this.toast({
          type: "danger",
          title: "Network Error. Please contact support"
        });
      }
    },
    updateFiles() {
      this.filesLoading = true;
      this.$store.commit("utility/files/toggleRefresh");
      this.getFiles(this);
    }
  },
  mixins: [formMixin],
  props: ["equipment"]
};
</script>
