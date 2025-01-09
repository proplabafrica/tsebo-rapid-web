<template>
  <div class="col-12 col-md pd-0 mg-t-20 mg-md-t-0-force">
    <ul class="list-group">
      <div v-for="cycle in cycles" :key="cycle.id">
        <li
          class="list-group-item"
          v-if="
            cycle &&
            showCycle(cycle).isDue &&
            showCycle(cycle).workRequestGenerated &&
            showCycle(cycle).status != 4
          "
        >
          <nuxt-link
            :to="`/maintenance/routines/job-schedules/approval?id=${cycle.schedule.id}`"
            class="tx-inverse tx-14 tx-medium d-block"
            style="
              max-width: 200px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            "
            v-if="cycle.schedule"
            v-text="cycle.schedule.plan.name"
          ></nuxt-link>
          <span class="tx-11 d-block tx-uppercase" v-if="cycle.schedule.unit">
            <nuxt-link
              v-if="cycle.schedule.unit"
              :to="`/location/units/details?id=${cycle.schedule.unit.id}`"
              class="tx-inverse d-block"
              >{{ cycle.schedule.unit.name }}</nuxt-link
            >
            <nuxt-link
              v-if="cycle.schedule.unit.parent"
              :to="`/location/units/details?id=${cycle.schedule.unit.parent.id}`"
              class="tx-inverse d-block"
              >({{ cycle.schedule.unit.parent.name }})</nuxt-link
            >
          </span>

          <span
            class="tx-inverse d-block"
            v-if="cycle.schedule"
            v-text="
              `freq: ${cycle.schedule.plan.frequency} ${cycle.schedule.plan.frequencyMeasurement.name}`
            "
          ></span>
          <span class="tx-11 d-block tx-success"
            >{{ (cycle.schedule.started_at * 1000) | dateFormat }} -
            {{ (cycle.due_at * 1000) | dateFormat }}</span
          >
          <!-- <span class="tx-11 d-block tx-danger"
              ><b><span style="color: gray">DUE: </span></b
              >{{ (nextDueDate(cycle)) | dateFormat }}</span
            > -->
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import loading from "@/components/ui/loading";
export default {
  components: { loading },
  created() {},
  methods: {
    showCycle(cy) {
      const date = new Date();
      const time = date.getTime();
      let isWorkRequest;

      if (cy.schedule && cy.schedule.workRequests)
        isWorkRequest = cy.schedule.workRequests.length === 0;

      const status = cy.schedule ? cy.schedule.job_schedule_status_id : null;

      const render = {
        isDue: cy.schedule.started_at * 1000 < time,
        workRequestGenerated: isWorkRequest,
        status
      };
      return render;
    },
    nextDueDate(cycle) {
      let freq = cycle.schedule.plan.frequency;
      let freqMeas = cycle.schedule.plan.frequencyMeasurement.code;
      let nextDueDate = cycle.due_at + this.timeToSeconds(freq, freqMeas);
      return nextDueDate * 1000;
    },
    timeToSeconds(value, unit) {
      const timeValues = {
        seconds: 1,
        minutes: 60,
        hours: 60 * 60,
        days: 60 * 60 * 24,
        weeks: 60 * 60 * 24 * 7,
        years: 60 * 60 * 24 * 365.25
      };

      return parseFloat(value) * timeValues[unit];
    }
  },
  props: ["cycles", "cyclesLoading"]
};
</script>
