<template>
  <div class="timeline-group pd-10 bg-white">
    <div
      class="timeline-item"
      v-for="(log, index) in clientRequest.logs"
      :key="log.id"
      :class="{ 'timeline-day': clientRequest.logs.length == index + 1 }"
    >
      <div class="timeline-time">{{ log.created_at | dateFormat }}</div>
      <div class="timeline-body">
        <p class="timeline-title">
          <a href v-text="log.comment.title"></a>
        </p>
        <p class="timeline-author">
          <a href="#">{{ log.created_at | timeFormat }}</a>
          <nuxt-link
            :to="`/people/users/details?id=${log.createdBy.id}`"
            class="tx-inverse"
            v-text="log.createdBy.name"
          ></nuxt-link>
        </p>
        <p class="timeline-text" v-text="log.comment.text"></p>
      </div>
      <!-- timeline-body -->
    </div>
    <!-- timeline-item -->
  </div>
  <!-- timeline-group -->
</template>

<script>
export default {
  props: ["clientRequest"]
};
</script>
