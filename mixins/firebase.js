import { firebase } from "@firebase/app";
import "firebase/messaging";

export default {
  computed: {
    fireBaseInitialized() {
      return this.$store.state.utility.notifications.fireBaseInitialized;
    }
  },
  created() {
    this.initializeFireBase();
  },
  data: () => ({
    firebaseMessaging: null,
    firebaseToken: null,
    latestNotification: null
  }),
  methods: {
    fireBaseOnMessage(payload) {
      if (payload.data.comment)
        payload.data.comment = JSON.parse(payload.data.comment);
      if (payload.data.entity)
        payload.data.entity = JSON.parse(payload.data.entity);

      const redirectLink = this.redirectLink(payload.data);

      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: process.env.APP_URL,
        click_action: redirectLink
      });
      this.latestNotification = payload.data;
    },
    async getToken() {
      try {
        this.firebaseToken = await this.firebaseMessaging.getToken();
        this.saveFirebaseToken();
      } catch (error) {
        console.log(error);
      }
    },
    initializeFireBase() {
      if (this.fireBaseInitialized == false) {
        firebase.initializeApp({
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          databaseURL: process.env.FIREBASE_DB_URL,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
          measurementId: process.env.FIREBASE_MEASUREMENT_ID
        });
        this.$store.commit(
          "utility/notifications/toggleFireBaseInitialized",
          true
        );
      }

      this.firebaseMessaging = firebase.messaging();
      this.firebaseMessaging
        .requestPermission()
        .then(() => this.getToken())
        .catch(err => console.log(err));

      this.firebaseMessaging.onTokenRefresh(() => this.getToken());

      this.firebaseMessaging.onMessage(payload =>
        this.fireBaseOnMessage(payload)
      );
    },
    redirectLink(notification) {
      if (!notification.entity) return this.$route.fullPath;
      const linkMap = {
        CLR: `/maintenance/requests/approval?id=${notification.notifiable_id}`,
        INV: `/finance/invoices/details?id=${notification.notifiable_id}`,
        PUO: `/hagul/purchase/purchase-orders/details?id=${notification.notifiable_id
          }`,
        SLO: `/hagul/inventory/sales-orders/details?id=${notification.notifiable_id
          }`,
        FLR: `/maintenance/float-requests/details?id=${notification.notifiable_id
          }`,
        WKR: `/maintenance/requests/details?id=${notification.notifiable_id}`
      };
      return linkMap[notification.entity.code]
        ? linkMap[notification.entity.code]
        : this.$route.fullPath;
    },
    async saveFirebaseToken() {
      const token = this.firebaseToken;
      try {
        await this.$axios.post("firebase-tokens", { token, app: "Tsebo-Rapid" });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
