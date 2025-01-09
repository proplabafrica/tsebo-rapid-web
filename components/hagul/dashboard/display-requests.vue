<template>
  <div>
    <div v-for="workRequest in workRequests" :key="workRequest.id">
      <span class="tx-inverse">{{ workRequest.name }}</span>
      <span class="tx-11 d-block" v-if="workRequest.priority">
        <span
          class="square-8 mg-r-5 rounded-circle"
          :class="[`bg-${classByPriority(workRequest.priority)}`]"
        ></span>
        <span>{{ workRequest.priority.name }}</span>
      </span>
      <span class="tx-11 d-block" v-if="workRequest.procurementSlaInfo">
        <span
          class="d-block"
          :class="[
            `tx-${
              workRequest.procurementSlaInfo.timeExpended <
              workRequest.procurementSlaInfo.expectedDuration
                ? 'success'
                : 'danger'
            }`
          ]"
          >{{ workRequest.procurementSlaInfo.timeExpended | shortReadableTime }}
          /
          {{
            workRequest.procurementSlaInfo.expectedDuration | shortReadableTime
          }}</span
        >
        <span
          class="square-8 mg-r-5 rounded-circle"
          :class="[`bg-${priorityClasses[workRequest.sla.priority.code]}`]"
        ></span>
        <span>{{ workRequest.sla.name }}</span>
      </span>
      <nuxt-link
        class="tx-inverse d-block"
        :to="`/location/units/details?id=${workRequest.unit.id}`"
        >{{ workRequest.unit ? workRequest.unit.name : "" }}</nuxt-link
      >
    </div>
  </div>
</template>

<script>
import timeFunctions from "@/mixins/timeFunctions";

export default {
  mixins: [timeFunctions],
  props: { workRequests: Array }
};
</script>

<style>
</style>