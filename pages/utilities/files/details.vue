<template>
  <div class="hagul" style="background-color: transparent; display: flex; flex-direction: column">
    <img :src="file.file_path" :alt="file.client_name" v-if="!loading && isImage" />
    <img class="image-viewer" :src="file.file_path" :alt="file.client_name" v-if="!loading && isImage" />

    <iframe v-else-if="!loading && !file.file_path.includes('cloudinary')" class="doc-viewer"
      :src="`https://docs.google.com/gview?url=${file.file_path}&embedded=true`"></iframe>
    <iframe v-else-if="!loading && file.file_path.includes('cloudinary')" class="doc-viewer"
      :src="`${file.file_path}&embedded=true`"></iframe>

    <a v-if="!loading" class="btn btn-primary" style="position: absolute; top: 20px; right: 20px"
      :href="file.file_path">Download</a>

    <loading v-else />
  </div>
</template>

<script>
import loading from "@/components/ui/loading";

export default {
  components: { loading },
  computed: {
    isImage() {
      if (!this.file.file_type) return false;

      console.log(this.file.file_type, "FILE TYPE")
      return this.file.file_type.includes('png') || this.file.file_type.includes('image') || this.file.file_type.includes('jpeg') || this.file.file_type.includes('jpg');
    }
  },
  created() {
    this.setFile(this.$route.query.id);

  },
  data: () => ({
    file: null,
    loading: true,
    shouldRefresh: true
  }),
  head: () => ({
    title: "File Display · Tsebo-Rapid"
  }),
  meta: {
    pageName: "files.show"
  },
  methods: {
    download() {
      window.print();
    },
    setFile(id) {
      const { detailedAssociations, files } = this.$store.state.utility.files;
      this.file = files.find((file) => file.id == id);
      if (this.file && !this.shouldRefresh) return (this.loading = false);

      this.$axios
        .get("files/" + id)
        .then((response) => {
          this.$store.commit("utility/files/setFile", response.data.file);

          console.log(response.data.file, "OUR FILE")

          this.file = this.file
            ? Object.assign({}, response.data.file)
            : response.data.file;

          if (this.file?.file_path?.includes('cloudinary')) {
            let formatted = this.file.file_path?.split('https').pop()

            console.log(formatted, "FORMATTED")
            this.file = { ...this.file, file_path: `https${formatted}` }
          }


          console.log(this.file, "FILE OO")
          this.loading = false;
          this.shouldRefresh = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  watch: {
    $route(to, from) {
      this.setFile(to.query.id);
    }
  }
};
</script>
