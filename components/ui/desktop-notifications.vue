<template>
  <div class="container">
    <p>
      {{ notification }}
    </p>
  </div>
</template>

<script>
import Pusher from "pusher-js";
export default {
  data: () => ({
    notification: null
  }),
  created() {
    this.subscribe();
  },
  methods: {
    subscribe() {
      let pusher = new Pusher("e6b9a9d56ca7669f3e34", {
        cluster: "eu"
      });
      pusher.subscribe("notification-channel");
      pusher.bind("new-notification", data => {
        this.notification = data;
      });
    }
  }
};
</script>

<style scoped>
.container {
  min-height: 50px;
  min-width: 100px;
  background-color: rgb(79, 158, 163);
}
</style>
