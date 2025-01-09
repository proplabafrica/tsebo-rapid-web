import timeFunctions from "@/mixins/timeFunctions";
// import timeFunctions from '../timeFunctions';

export default {
  computed: {
    slaData() {
      const {
        allStatusCodes,
        slaStatusCodes
      } = this.$store.state.maintenance.workRequests;
      return this.slaDataByStatusCodes(this.workRequest, {
        allStatusCodes,
        slaStatusCodes
      });
    }
  },
  methods: {
    cumulativeSlaPerformance(workRequests = []) {
      var count = workRequests.length;
      const timelyRequests = workRequests.reduce((total, workRequest) => {
        if (!workRequest.sla) {
          count--;
          return total;
        }
        const { timeExpended, timeLeft } = this.slaTotalData(workRequest);
        if (timeExpended < timeLeft) return total + 1;
        return total;
      }, 0);

      return { count, timelyRequests };
    },
    async getSlaPerformance({
      allotedPercentageTime = 100,
      rangeBy = "updated_at",
      rangeFrom,
      rangeTo,
      slaStatusCodes = ["01", "05", "20", "105", "60", "65"],
      maintenanceTypeCodes = ["corrective", "preventive", "project"]
    }) {
      const {
        workRequestStatusCodes = [],
        unitId = null,
        equipmentId = null,
      } = this;

      try {
        const response = await this.$axios.get("reporting/work-requests/sla", {
          params: {
            allotedPercentageTime,
            byStatusCodes: workRequestStatusCodes,
            slaStatusCodes,
            equipmentId,
            unitId,
            rangeBy,
            rangeFrom,
            rangeTo,
            maintenanceTypeCodes
          }
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    slaDataByStatusCodes(
      { sla, logs },
      { slaStatusCodes = [], allStatusCodes = [] }
    ) {
      const createdAt = Date.parse(logs[0].created_at);
      const expectedDuration = this.slaDuration(sla);
      const dueAt = createdAt + expectedDuration;
      const timeLeft = dueAt - Date.now();
      var timeExpended = 0;
      var lastLog = { status: {} };

      for (const code of allStatusCodes) {
        const index = allStatusCodes.indexOf(code);

        const log = logs.find(log => log.status.code == code);
        const previousLog = logs.find(
          log => log.status.code == allStatusCodes[index - 1]
        );

        if (log && previousLog) {
          const timeBetween =
            Date.parse(log.created_at) - Date.parse(previousLog.created_at);
          if (slaStatusCodes.includes(code)) {
            timeExpended += timeBetween;
            lastLog = log;
          } else {
            timeExpended -= timeBetween;
          }
        }
      }

      if (lastLog.status.code != slaStatusCodes[slaStatusCodes.length - 1])
        timeExpended += Date.now() - Date.parse(lastLog.created_at);

      return { createdAt, expectedDuration, dueAt, timeExpended, timeLeft };
    },
    slaDuration(sla) {
      const timeUnits = this.getTimeUnitsInSeconds([
        "minutes",
        "hour",
        "day",
        "week",
        "year"
      ]);
      if (!sla.measurement) return 0;
      return (
        parseFloat(sla.expected_time) *
        timeUnits.find(unit => unit.name == sla.measurement.code.slice(0, -1))
          .value *
        1000
      );
    },
    slaTotalData(workRequest) {
      const createdAt = Date.parse(workRequest.created_at);
      const expectedDuration = this.slaDuration(workRequest.sla);
      const dueAt = createdAt + expectedDuration;
      const timeExpended = Date.now() - createdAt;
      const timeLeft = dueAt - Date.now();

      return { createdAt, expectedDuration, dueAt, timeExpended, timeLeft };
    }
  },
  mixins: [timeFunctions]
};
