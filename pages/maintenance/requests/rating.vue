<template>
  <div class="page-error-wrapper">
    <div>
      <h1>Thanks for your feedback</h1>
      <p class="tx-sm-24 tx-normal">
        We deeply value your feedback as we strive to make our services even
        better
      </p>
      <p class="mg-b-50">
        <a href="https://vampfi.com" class="btn btn-error"
          >Visit Our Website &rarr;</a
        >
      </p>
      <p class="error-footer">
        &copy; Copyright 2023 &copy; All Rights Reserved.
        <a href="https://vampfi.com">Vampfi </a>.
      </p>
    </div>
  </div>
  <!-- page-error-wrapper -->
</template>

<script>
export default {
  created() {
    this.submitRating();

    // const messaging = firebase.messaging();
    // messaging
    //   .requestPermission()
    //   .then(() => {
    //     "Notification permission granted.");
    //     return messaging.getToken();
    //   })
    //   .then(token => {
    //     // You update this token for server by call api
    //     "The token is: ", token);
    //   })
    //   .catch(function(err) {
    //     "Unable to get permission to notify.", err);
    //   });

    // messaging.onMessage(function(payload) {
    //   "Message received. ", payload);
    // });
  },
  head: () => ({ title: "Thank You For Your Feedback" }),
  methods: {
    submitRating() {
      const work_request_id = this.$route.query.id,
        rating = this.$route.query.rating,
        user_id = this.$route.query.user_id;
      if (!(work_request_id && rating && user_id)) return false;
      this.$axios.post("work-requests/rate-job", {
        rating,
        user_id,
        work_request_id
      });
    }
  }
};
</script>
