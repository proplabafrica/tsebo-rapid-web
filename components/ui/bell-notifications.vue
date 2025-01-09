<template>
  <div>
    <div
      class="dropdown dropdown-b"
      :class="{ show: showNotifications && notifications.length > 0 }"
    >
      <a
        href
        class="header-notification"
        @click.prevent="showNotifications = !showNotifications"
      >
        <i class="icon ion-ios-bell-outline"></i>
        <span class="indicator" v-if="notifications.length > 0"></span>
      </a>
      <div
        class="dropdown-menu"
        x-placement="bottom-start"
        v-if="notifications.length > 0"
        :class="{ show: showNotifications }"
      >
        <div class="dropdown-menu-header">
          <h6 class="dropdown-menu-title">Notifications</h6>
          <div>
            <a href @click.prevent="markAllAsSeen()">
              <span v-if="!markingAsSeen">Mark All as Seen</span>
              <span v-else>Marking as seen...</span>
            </a>
          </div>
        </div>
        <!-- dropdown-menu-header -->
        <div class="dropdown-list">
          <!-- loop starts here -->
          <a
            class="dropdown-link"
            v-for="notification in notifications"
            :key="notification.id"
            :href="redirect(notification)"
          >
            <div class="media">
              <!-- <img src="http://via.placeholder.com/500x500" alt /> -->
              <div class="media-body">
                <p>
                  <strong class="d-block">{{
                    notification.comment.title
                  }}</strong>
                  {{ notification.comment.text }}
                </p>

                <span
                  >{{ notification.created_at | dateFormat }}
                  {{ notification.created_at | timeFormat }}</span
                >
              </div>
            </div>

            <!-- media -->
          </a>
          <!-- loop ends here -->
        </div>
        <!-- dropdown-list -->
      </div>
      <!-- dropdown-menu-right -->
    </div>

    <!-- <div
      class="desk_notification"
      v-if="!closeNotification && desktopNotification"
    >
      <div>
        <h5 class="desk_title">{{ desktopNotification }}</h5>
        <p>{{ desktopNotification }}</p>
      </div>
      <button v-on:click="closeDeskNotification">x</button>
    </div> -->
    <!-- <div
      class="desk_notification"
      v-if="!closeNotification && desktopNotification.title"
    >
      <a :href="redirect(notification)">
        <h5 class="desk_title">{{ desktopNotification.comment.title }}</h5>
        <p>{{ desktopNotification.comment.text }}</p>
      </a>
      <button v-on:click="closeDeskNotification">x</button>
    </div> -->
  </div>
</template>
<script>
import { mapActions } from "vuex";
// import firebaseMixin from '@/mixins/firebase'

export default {
  created() {
    this.getNotifications(this);
  },
  mounted() {
    if (Notification.permission == "granted") {
      if (this.notifications.length > 0) {
        for (i = 0; i < this.notification.length; i++) {
          new Notification(this.notifications[i].comment.title, {
            body: this.notifications[0].comment.text
          });
        }
      }
    }
  },
  data: () => ({
    markingAsSeen: false,
    notifications: [],
    notificationsChannel: null,
    showNotifications: false,
    connection: null,
    socket: null,
    desktopNotification: {},
    closeNotification: false
  }),
  updated() {
    // this.connectToWS();
  },
  methods: {
    // connectToWS() {
    //   this.socket = io.connect("ws://localhost:3333", { secure: true }); //connect to server
    //   this.socket.on("notify", notification => {
    //     if (notification) {
    //       console.log(notification, "notification");
    //       this.desktopNotification = notification;
    //     }
    //   });
    //   // this.socket.emit("notification", this.notifications[0]);
    // },
    closeDeskNotification() {
      this.closeNotification = true;
    },
    ...mapActions({
      getNotifications: "utility/notifications/getNotifications"
    }),
    async markAllAsSeen() {
      this.markingAsSeen = true;
      const notification_ids = this.notifications.map(
        (notification) => notification.id
      );

      try {
        const response = await this.$axios.post("notifications/mark-as-seen", {
          notification_ids
        });
        this.$store.commit("utility/notifications/toggleRefresh");
        await this.getNotifications(this);
        this.markingAsSeen = false;
      } catch (error) {
        this.markingAsSeen = false;
      }
    },
    redirect(notification) {
      if (notification.comment.title.toLowerCase().includes("client")) {
        return `/maintenance/requests/approval?id=${notification.notifiable_id}`;
      } else if (
        notification.comment.title.toLowerCase().includes("tender process")
      ) {
        return `/hagul/purchase/tender-processes/`;
      } else if (
        notification.comment.title.toLowerCase().includes("pending work")
      ) {
        return `/maintenance/requests/by-scope/?scope=work%20request/`;
      } else if (
        notification.comment.title.toLowerCase().includes("incident")
      ) {
        return `/reports/incident-reports/`;
      } else {
        return `/maintenance/requests/details?id=${notification.notifiable_id}`;
      }
    }
  },
  // mixins: [firebaseMixin],
  watch: {
    latestNotification(val) {
      if (val == null) return;
      this.notifications.unshift(val);

      this.latestNotification = null;
    }
  }
};
</script>

<style scoped>
.dropdown-menu.show {
  position: absolute;
  transform: translate3d(-38px, 40px, 0px);
  top: 0px;
  left: 0px;
  will-change: transform;
  max-height: 400px;
}

.desk_notification {
  position: absolute;
  top: 100px;
  min-height: 100px;
  min-width: 300px;
  max-width: 400px;
  right: 20px;
  padding: 10px;
  background-color: rgb(203, 241, 247);
  z-index: 1000;
  display: flex;
}

.desk_title {
  font-size: 15px;
}
.desk_notification > button {
  justify-self: flex-end;
  align-self: flex-start;
  background-color: rgb(113, 181, 238);
  border: none;
  color: rgb(203, 241, 247);
  border-radius: 50%;
}
.desk_notification > button:focus {
  outline: none;
}
</style>
