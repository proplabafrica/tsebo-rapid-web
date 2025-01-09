<template>
  <div class="media-list">
    <div class="media" v-for="user in peopleTrail" :key="user.id">
      <img
        :src="
          user.image_path ?
          user.image_path : 'https://via.placeholder.com/500'
          "
        @error="e => (e.target.src = 'https://via.placeholder.com/500')"
        :alt="user.name"
      />
      <div class="media-body">
        <nuxt-link
          class="tx-inverse"
          :to="`/people/users/details?id=${user.id}`"
          v-text="user.name"
          v-if="authorized('people.users.details')"
        ></nuxt-link>
        <span class="tx-inverse" v-else v-text="user.name"></span>
        <!-- <p>Software Engineer</p> -->
      </div>
      <!-- media-body -->
    </div>
    <!-- media -->
  </div>
  <!-- media-list -->
</template>

<script>
import authMixin from "@/mixins/auth";
export default {
  computed: {
    peopleTrail() {
      var peopleTrail = [];
      for (const log of this.logs.filter(log => log.createdBy)) {
        var lastPerson = peopleTrail.slice(-1).pop();
        lastPerson = lastPerson ? lastPerson : { id: null };
        if (lastPerson.id != log.createdBy.id) {
          peopleTrail.push(log.createdBy);
        }
      }
      return peopleTrail;
    }
  },
  mixins: [authMixin],
  props: ["logs"]
};
</script>
