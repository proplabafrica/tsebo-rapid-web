import Vue from "vue";
import { mapActions } from "vuex";
import XLSX from "xlsx/dist/xlsx.full.min.js";


Vue.mixin({
  computed: {
    dateToday() {
      const today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; // January is 01
      const yyyy = today.getFullYear();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      return yyyy + "-" + mm + "-" + dd;
    }
  },
  data: () => ({
    priorityClasses: {
      P1: "danger",
      P2: "warning",
      P3: "info"
    }
  }),
  filters: {
    twoDP(value) {
      return parseFloat(value).toFixed(2);
    },
    dateFormat(date) {
      if (!date) return "-";
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      const goodDate = new Date(date);
      return goodDate.toLocaleDateString("en-US", options);
    },
    gapFormat(gap){
      if(!gap)return "-";
      return gap.name
    },
    ellipse(text, length=20) {
      const ellipseText = text.length > length ? "..." : "";
      return text.substring(0, length + 1) + ellipseText;
    },
    money(value, currency = "NGN") {
      if (!value) return null;
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        currencyDisplay: "symbol"
      }).format(value);
    },
    moneyFormat(value) {
      value = value || 0;
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    timeFormat(dateTime) {
      const goodTime = new Date(dateTime);
      return goodTime.toLocaleTimeString("en-US");
    },
    toMoney({ value, currency = { code: "NGN" } }) {
      // if (!value) return null;
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: currency.code,
        currencyDisplay: "symbol"
      }).format(value);
    }
  },
  methods: {
    ...mapActions({
      toast: "toast/addToast"
    }),
    downloadCSV(data, csvName) {
      const date = Date.parse(new Date());
      const keys = Object.keys(data[0]);
      const header = keys.join(",") + "\n";
      const csv =
        header +
        data
          .map((row) => {
            return keys
              .map((key) => {
                return row[key];
              })
              .join(",");
          })
          .join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${date}-${csvName}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    xlsxHelper(data, sheetName, sheetFooter) {
      const date = Date.parse(new Date());
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetFooter);
      const buffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${date}-${sheetName}.xlsx`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    money(value, currency = "NGN") {
      if (!value) return null;
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency,
        currencyDisplay: "symbol"
      }).format(value);
    },
    currentYear() {
      return new Date().getFullYear();
    },
    debounce(callBack = () => {}, timeOut = 500) {
      if (this.debouncer) clearTimeout(this.debouncer);
      this.debouncer = setTimeout(callBack, timeOut);
    },
    ellipse(text, length=20) {
      const ellipseText = text.length > length ? "..." : "";
      return text.substring(0, length + 1) + ellipseText;
    },
    thisOrThat(item, testAttributes) {
      var result = null;
      for (const attribute of testAttributes)
        result = item[attribute] || result;
      return result;
    }
  }
});

// Write a function that contains an if statement which states that until a particular number is greater than the other number keep looping.. until the condition is satisfied in javascript