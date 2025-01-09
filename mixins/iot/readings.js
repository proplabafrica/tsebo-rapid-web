export default {
  methods: {
    pairReadings(readings) {
      let data = [];
      let arr = [];
      let temp;

      readings.reduce((p, curr, i, a) => {
        let obj = {};
        let month = curr.month;
        let timestamp = new Date(curr.timestamp * 1000)
          .toDateString()
          .slice(4, 15);

        if (temp == month) {
          let value = curr.value;
          arr.push(value);
          if (i == a.length - 1) {
            obj.data = arr[0] - arr[arr.length - 1];
            obj.timestamp = timestamp;
            data.push(obj);
          }
        } else {
          if (arr.length > 0) {
            obj.data = arr[0] - arr[arr.length - 1];
            obj.timestamp = timestamp;
            data.push(obj);
            arr = [];
          }
          temp = month;
          arr.push(curr.value);
        }
      }, []);

      return data;
    },
    maxGroupReading(readings) {
      let data = [];
      let arr = [];
      let temp;

      readings.reduce((p, curr, i, a) => {
        let obj = {};
        let month = curr.month;
        let timestamp = new Date(curr.timestamp * 1000)
          .toDateString()
          .slice(4, 15);

        if (temp == month) {
          let value = curr.value;
          arr.push(value);
          if (i == a.length - 1) {
            obj.data = Math.max(...arr);
            obj.timestamp = timestamp;
            data.push(obj);
          }
        } else {
          if (arr.length > 0) {
            obj.data = Math.max(...arr);
            obj.timestamp = timestamp;
            data.push(obj);

            arr = [];
          }
          temp = month;
          arr.push(curr.value);
        }
      }, []);

      return data;
    },
    averageGroupReading(readings) {
      let data = [];
      let arr = [];
      let temp;

      readings.reduce((p, curr, i, a) => {
        let obj = {};
        let month = curr.month;
        let timestamp = new Date(curr.timestamp * 1000)
          .toDateString()
          .slice(4, 15);

        if (temp == month) {
          let value = curr.value;
          arr.push(value);
          if (i == a.length - 1) {
            obj.data = arr.reduce((p, c) => p + c, 0) / arr.length;
            obj.timestamp = timestamp;
            data.push(obj);
          }
        } else {
          if (arr.length > 0) {
            obj.data = arr.reduce((p, c) => p + c, 0) / arr.length;
            obj.timestamp = timestamp;
            data.push(obj);

            arr = [];
          }
          temp = month;
          arr.push(curr.value);
        }
      }, []);

      return data;
    },
    groupReadings(readings) {
      let result = [];
      for (let i = readings.length - 1; i > 0; i--) {
        let readingObj = {};
        let dateMonth = "";

        let readingDate = readings[i].created_at;
        readingDate = new Date(readingDate);
        dateMonth = readingDate.getMonth();
        dateMonth = this.parseDateMonth(dateMonth);

        if (dateMonth) {
          readingObj.month = `${readingDate.getDate()} ${dateMonth}`;
          readingObj.created_at = readings[i].created_at;
          readingObj.value = readings[i].value;
          readingObj.timestamp = readings[i].recorded_at;
        }

        result.push(readingObj);
      }
      return result;
    },
    async getQfaTankReadings({
      associations = [],
      page = 1,
      perPage = 10000,
      byUnitId = null,
      rangeBy = null,
      rangeFrom = null,
      rangeTo = null,
    }) {
      const response = await this.$axios.get("iot/qfa-overhead-readings", {
        params: {
          associations,
          page,
          perPage,
          byUnitId,
          rangeBy,
          rangeFrom,
          rangeTo,
        },
      });
      return response.data;
    },
    parseDateMonth(index) {
      let dateIndexMap = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "June",
        6: "July",
        7: "Aug",
        8: "Sept",
        9: "Oct",
        10: "Nov",
        11: "Dec",
      };
      return dateIndexMap[index];
    },
  },
};
