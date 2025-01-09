<template>
  <div class="col-12 col-md mg-b-10 mg-md-b-0">
    <div class="container-lg">
      <div class="row row-lg mg-t-10 mg-t-10 d-flex flex-column">
        <div class="float-right mg-b-10">
          <div class="card-header" :style="{ backgroundColor: '#e3e7f2' }">
            <h6 class="slim-card-title">Materials Chart</h6>
          </div>

          <div v-if="!materialsOrderItemsLoading">
            <div>
              <div class="card card-status card-height col col-12">
                <div class="form-group w-50">
                  <!-- <label for="name">
                    Select Month and Year

                  </label> -->
                  <select name="country_code" class="form-control" required v-model="monthOfYearItem.name"
                    @change="getMaterialElement()">
                    <!-- <option :value="firstMonth">Select Month and Year</option> -->

                    <!-- <option v-for="month in monthAndYear" :key="`role-code-${month}`" :value="month" v-text="month">
                    </option> -->

                    <option v-for="month in monthArrayItem" :key="`role-code-${month}`" :value="month" v-text="month">
                    </option>
                  </select>
                </div>

                <div>
                  <div v-if="!materialLoading" id="hagul-services"></div>
                  <div v-else>NO MATERIAL PURCHASED</div>
                </div>
              </div>
            </div>
          </div>
          <loading v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApexCharts from "apexcharts";
import moment from "moment";
import loading from "@/components/ui/loading";

export default {
  components: {
    loading
  },
  created() {
    this.getAllMaterials();
    this.getMaterials();
    this.getRenderMaterials();
    this.getMaterialElement();

    // this.renderMaterialCount();
  },
  mounted() {
    this.getMaterialElement();
    // this.getRenderMaterials();
    this.renderMaterialCount();
  },
  data: () => ({
    materailsRangeFrom: null,
    materailsRangeTo: null,
    materialsOrderItems: [],
    materialsOrderItemsLoading: false,
    isMaterialsLoading: true,
    plottedMaterials: [],
    firstMaterials: [],
    gottenMaterialsItem: [],
    formattedMaterialsItem: [],
    materialsCatorgory: [],
    dateFormatMaterial: [],
    totalMaterials: [],
    monthlyMaterialDate: [],
    materialCatergoryPrice: [],
    totalCharts: [],
    materialCategories: [],
    chartData: [],
    range: "",
    allMaterailsRangeFrom: null,
    allMaterailsRangeTo: null,
    allMaterialItem: [],

    materialChart: [],
    materialsItem: [],
    formatMaterialItem: [],

    monthAndYear: [],
    monthOfYearItem: {
      name: ""
    },
    newLineArray: null,
    materialNames: [],
    materialCounts: [],
    firstMonth: null,
    renderChart: null,
    monthArrayItem: null,
    materialLoading: false,

  }),

  methods: {
    async getMaterials() {
      var currentDate = new Date();
      const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
        currentDate
      );
      try {
        const response = await this.$axios("material-categories", {
          params: {
            associations: ["materials"]
          }
        });
        this.materialsOrderItems = response.data.data;
        this.materialCategories = response.data.data;
        this.prepareChartData(response.data.data);
        this.materialsOrderItemsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },

    monthStartAndEnd(date) {
      const rangeTo = moment(
        new Date(date.getFullYear(), date.getMonth(), 1)
      ).format("YYYY-MM-DD h:mm:ss");

      // Calculate rangeTo based on rangeFrom with 6 months difference
      const rangeFrom = moment(new Date(date.getFullYear(), date.getMonth(), 1))
        .subtract(6, "months")
        .format("YYYY-MM-DD h:mm:ss");

      return {
        name: moment(date).format("YYYY-MM-DD h:mm:ss"),
        rangeTo: rangeTo,
        rangeFrom: rangeFrom
      };
    },

    async getAllMaterials() {
      var currentDate = new Date();
      const { name, rangeFrom, rangeTo } = await this.monthStartAndEnd(
        currentDate
      );

      this.materialsOrderItemsLoading = true;

      this.allMaterailsRangeFrom = this.range ? this.range.start : rangeFrom;
      this.allMaterailsRangeTo = this.range ? this.range.end : rangeTo;

      try {
        const response = await this.$axios("sales-orders", {
          params: {
            associations: [
              "createdBy.roles",
              "requesters",
              "status",
              "type",
              "items.material"
            ],
            rangeBy: "updated_at",
            rangeFrom: rangeFrom,
            rangeTo: name
          }
        });

        this.allMaterialItem = response.data.data;

        this.getChartMaterial();
        this.getMaterialElement();
        this.materialsOrderItemsLoading = false;
      } catch (error) {
        console.log(error);
      }
    },

    allFormattedDate(dateString) {
      const date = new Date(dateString);
      const options = { day: "numeric", month: "long", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },

    restructureMaterialArray(material) {
      const restructuredData = {};

      material.forEach((item) => {
        const { created_at, name } = item;
        const date = new Date(created_at);
        const monthYear = `${date.toLocaleString("default", {
          month: "long"
        })} ${date.getFullYear()}`;

        if (!restructuredData[monthYear]) {
          restructuredData[monthYear] = {};
        }

        if (!restructuredData[monthYear][name]) {
          restructuredData[monthYear][name] = 1;
        } else {
          restructuredData[monthYear][name]++;
        }
      });

      return restructuredData;
    },

    restructureNewMaterial(material) {
      const restructuredData = {};

      material.forEach((monthData) => {
        for (const monthYear in monthData) {
          const items = monthData[monthYear];
          const sortedItems = Object.entries(items)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
          const sortedItemsObj = Object.fromEntries(sortedItems);

          restructuredData[monthYear] = sortedItemsObj;
        }
      });

      return restructuredData;
    },

    extractTopSixItems(material) {
      const restructuredData = {};

      // Iterate over each month in the material object
      for (const monthYear in material) {
        const items = material[monthYear];

        // Sort the items by count in descending order
        const sortedItems = Object.entries(items).sort((a, b) => b[1] - a[1]);

        // Select the top six items
        const topSixItems = sortedItems.slice(0, 7);

        // Restructure the month and year to be displayed in an orderly manner
        const [month, year] = monthYear.split(" ");
        const formattedMonthYear = `${month} ${year}`;

        restructuredData[formattedMonthYear] = Object.fromEntries(topSixItems);
      }

      return restructuredData;
    },

    extractMonthsYear(data) {

      for (const key in data) {
        this.monthAndYear.push(key);
      }

      return this.monthAndYear;
    },

    rearrangeMaterialByMonthYear(material) {
      const sortedMonths = Object.keys(material).sort((a, b) => {
        const [monthA, yearA] = a.split(" ");
        const [monthB, yearB] = b.split(" ");

        const monthsOrder = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];

        if (yearA !== yearB) {
          return yearB - yearA;
        } else {
          return monthsOrder.indexOf(monthB) - monthsOrder.indexOf(monthA);
        }
      });

      const rearrangedMaterial = {};
      sortedMonths.forEach((month) => {
        rearrangedMaterial[month] = material[month];
      });

      return rearrangedMaterial;
    },

    getMonthName(monthNumber) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return months[monthNumber - 1]; // Subtract 1 because month numbers are 0-based
    },

    generateDateRange() {
      var currentDate = new Date();
      var datesArray = [];

      for (var i = 0; i < 9; i++) {
        var date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);


        datesArray.push({
          month: this.getMonthName(date.getMonth() + 1), // Convert month number to full month name
          year: date.getFullYear(),

        });
      }

      return datesArray;
    },

    getChartMaterial() {
      for (let i = 0; i < this.allMaterialItem.length; i++) {
        for (let materialList of this.allMaterialItem[i].items) {
          if (this.allMaterialItem[i].items) {
            let name = materialList?.material?.name;
            if (name && name.length > 14) {
              name = name.slice(0, 24) + "...";
            }
            this.materialChart.push({
              name: name,
              created_at: materialList.created_at.slice(0, 10)
            });
          }
        }
      }
      const formattedData = this.materialChart.map((item) => ({
        created_at: this.allFormattedDate(item?.created_at),
        name: item?.name
      }));

      // formattedData, "FORMATTED");
      const newArrayMaterial = this.restructureMaterialArray(formattedData);

      const restructuredData = this.extractTopSixItems(newArrayMaterial);

      const monthsYearArray = this.extractMonthsYear(restructuredData);

      this.monthAndYear = monthsYearArray;

      this.newLineArray = restructuredData;

      const rearrangedMaterial = this.rearrangeMaterialByMonthYear(restructuredData);

      // this.firstMonth = this.monthAndYear[0]
      this.monthOfYearItem.name = this.monthAndYear[0];

      this.firstMonth = this.monthAndYear[0];

      var dateRange = this.generateDateRange();

      var formattedDateRange = dateRange.map(date => `${date.month} ${date.year}`);

      this.monthArrayItem = formattedDateRange;

      // "this is the range amount...", dateRange);
      // "related month..", formattedDateRange);

      // "object item...", this.monthArrayItem);
    },

    async getMaterialElement() {
      const materialNames = [];
      const materialCounts = [];
      let materialArray = this.newLineArray;

      let materialDateAndYear = this.monthOfYearItem.name;
      const [targetMonth, targetYear] = materialDateAndYear.split(" ");

      if (!materialDateAndYear) {
        return;
      }

      for (const key in materialArray) {
        const [month, year] = key.split(" ");

        if (month === targetMonth && year === targetYear) {
          const items = materialArray[key];

          for (const itemName in items) {
            materialNames.push(itemName);
            materialCounts.push(items[itemName]);
          }
        }
      }

      this.materialNames = materialNames;
      this.materialCounts = materialCounts;

      if (this.materialNames.length === 0 && this.materialCounts.length === 0) {


        this.materialLoading = true;
        this.renderMaterialCount();
        // "negtive item..", this.materialNames, this.materialCounts, this.materialLoading)
      }
      
      if (this.materialNames.length > 0 && this.materialCounts.length > 0)  {
        this.materialLoading = false;
        this.renderMaterialCount();
        // "hello world..", this.materialNames, this.materialCounts, this.materialLoading)
      }

      this.renderMaterialCount();

      

    },

    renderMaterialCount() {
      var options = {
        series: [{ data: this.materialCounts }],
        chart: { type: "bar", height: 300 },
        plotOptions: {
          bar: {
            distributed: true,

            borderRadius: 4,
            horizontal: true
          }
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: this.materialNames,

          labels: {
            formatter: (value) => {
              return value;
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return value;
            }
          }
        },
        colors: [
          "#9a0101", 
          "#00e396",
          "#008ffb",
          // "#c00000",
          "#69d2e7",
          "#8c95a7",
          "#feb019",
          "#775dd0",
          "#FF1493",
          "#FF4500",
          "#BC8F8F",
          "#4169E1",
          "#A0522D",
          "#33b2df",
          "#546E7A",
          "#d4526e",
          "#13d8aa",
          "#A5978B",
          "#2b908f",
          "#f9a3a4",
          "#90ee7e",
          "#f48024",
          "#ff4560"
        ],
        tooltip: {
          y: [
            {
              title: {
                formatter: function (val) {
                  return "Count";
                }
              },
              formatter: function (val) {
                return parseInt(val);
              }
            }
          ]
        }
      };

      const id = document.querySelector("#hagul-services");

      if (id) {
        if (window.myChart) window.myChart.destroy();
        window.myChart = new ApexCharts(
          document.querySelector("#hagul-services"),
          options
        );
        
        window.myChart.render();
      }



      // "all the render...", this.materialNames, "young..", this.materialCounts);
    },

    // THIS IS THE OLD CODE FOR THE USER GRAPH
    getMaterialDate() {
      this.isMaterialsLoading = true;
      let initialMaterialsList = [];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      for (let i = 0; i < this.materialsOrderItems.length; i++) {
        for (let materialList of this.materialsOrderItems[i].materials) {
          if (this.materialsOrderItems[i].materials.length > 0) {
            initialMaterialsList.push(materialList.created_at.slice(0, 10));
          }
        }
      }

      this.firstMaterials = initialMaterialsList;
      for (let i = 0; i < this.firstMaterials.length; i++) {
        if (this.firstMaterials.length > 0) {
          this.gottenMaterialsItem.push(
            months[this.firstMaterials[i].split("-")[1] - 1],
            this.firstMaterials[i].split("-")[2] + "th",
            this.firstMaterials[i].split("-")[0]
          );
        }
      }
      for (let i = 0; i < this.gottenMaterialsItem.length; i++) {
        if (i % 3 === 0) {
          this.formattedMaterialsItem.push(
            this.gottenMaterialsItem[i + 1] +
            " " +
            this.gottenMaterialsItem[i] +
            " " +
            this.gottenMaterialsItem[i + 2]
          );
        }
        this.formattedMaterialsItem;
      }

      const currentDate = new Date();
      let all = [];

      if (currentDate.getMonth() + 1 <= 13) {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            all.push({ month: i + 13, year: currentDate.getFullYear() - 1 });
          } else {
            all.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      } else {
        for (
          var i = currentDate.getMonth();
          i > currentDate.getMonth() - 9;
          i--
        ) {
          if (i < 0) {
            all.push({ month: i + 13, year: currentDate.getFullYear() - 1 });
          } else {
            all.push({ month: i + 1, year: currentDate.getFullYear() });
          }
        }
      }

      let theDate = [];

      for (var i = 0; i < all.length; i++) {
        theDate.push({ ...all[i], month: months[all[i].month - 1] });
      }

      this.dateFormatMaterial = theDate;

      const filteredCurrent = theDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear())
      );

      const filteredB4 = theDate.filter((req) =>
        req.year.toString().includes(currentDate.getFullYear() - 1)
      );

      let filteredCurrentCount = [];
      for (var i = 0; i < this.formattedMaterialsItem.length; i++) {
        for (var j = 0; j < filteredCurrent.length; j++) {
          if (
            this.formattedMaterialsItem[i].split(" ")[2] ==
            currentDate.getFullYear() &&
            this.formattedMaterialsItem[i]
              .toString()
              .includes(filteredCurrent[j].month)
          ) {
            filteredCurrentCount.push(filteredCurrent[j].month);
          }
        }
      }

      let filteredCurrentBefore = [];
      for (var i = 0; i < this.formattedMaterialsItem.length; i++) {
        for (var j = 0; j < filteredB4.length; j++) {
          if (
            this.formattedMaterialsItem[i].split(" ")[2] ==
            currentDate.getFullYear() - 1 &&
            this.formattedMaterialsItem[i]
              .toString()
              .includes(filteredB4[j].month)
          ) {
            filteredCurrentBefore.push(filteredB4[j].month);
          }
        }
      }

      let itemArrayCount = new Array(months.length).fill(0);

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredCurrentCount.length; j++) {
          if (filteredCurrentCount[j].includes(months[i])) {
            itemArrayCount[i]++;
          }
        }
      }

      let itemArrayB4 = new Array(months.length).fill(0);

      for (var i = 0; i < months.length; i++) {
        for (var j = 0; j < filteredCurrentBefore.length; j++) {
          if (filteredCurrentBefore[j].includes(months[i])) {
            itemArrayB4[i]++;
          }
        }
      }

      let patternBefore = [];
      for (var i = 0; i < itemArrayB4.length; i++) {
        if (itemArrayB4[i]) {
          patternBefore.push(itemArrayB4[i]);
        }
      }

      let sliceArrayBefore = [];
      if (itemArrayB4) {
        sliceArrayBefore = itemArrayB4.slice(6, 12);
      }

      let patternCurrent = [];
      for (var i = 0; i < itemArrayCount.length; i++) {
        if (itemArrayB4[i]) {
          patternCurrent.push(itemArrayCount[i]);
        }
      }

      let sliceArrayCurrent = [];
      if (itemArrayCount) {
        sliceArrayCurrent = itemArrayCount.slice(0, 3);
        sliceArrayCurrent.reverse();
        // this.PendingOrderMade = sliceArrayBefore;
      }

      let dateArrayMonth = [];

      for (let i = 0; i < theDate.length; i++) {
        if (theDate.length > 0) {
          dateArrayMonth.push(
            theDate[i].month.slice(0, 3) + " " + theDate[i].year
          );
        }
      }
      if (!this.monthlyMaterialDate.length) {
        this.monthlyMaterialDate = dateArrayMonth.slice(0, 7).reverse();
      }

      this.isMaterialsLoading = false;
    },
    formatDate(dateTime) {
      let day = dateTime.split("-")[2];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let month = months[parseInt(dateTime.split("-")[1]) - 1];
      let year = dateTime.split("-")[0];

      return `${month} ${year}`;
    },

    async renderMaterialChart(materials) {
      var orderChartOptions = {
        chart: {
          id: "hagul-orders",
          width: "100%",
          type: "bar",
          // height: 280,
          height: 280,
          stacked: true
        },
        dataLabels: {
          enabled: false
        },
        colors: [
          "#00e396",
          "#008ffb",
          "#c00000",
          "#69d2e7",
          "grey",
          "#feb019",
          "#775dd0",
          "#FF1493",
          "#FF4500",
          "#BC8F8F",
          "#4169E1",
          "#A0522D",
          "#33b2df",
          "#546E7A",
          "#d4526e",
          "#13d8aa",
          "#A5978B",
          "#2b908f",
          "#f9a3a4",
          "#90ee7e",
          "#f48024",
          "#ff4560"
        ],
        // series: materials,
        series: this.chartData,

        //   // {
        //   //   data: [23, 11, 2, 3, 16, 12, 4],
        //   //   name: 'Plumbing',
        //   // },
        //   // {
        //   //   data: [12, 11, 19, 6, 11, 1, 24],
        //   //   name: 'Water Chemicals',
        //   // },
        // ],
        stroke: {
          width: [0, 0]
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        // title: {
        //   text: 'Materials'
        // },
        xaxis: {
          categories: this.monthlyMaterialDate.reverse(),
          labels: {
            formatter: function (val) {
              return val;
            }
          },
          // title: {
          //   text: 'Material Value',

          // },
          colors: ["#00e396"]
        },
        yaxis: {
          // title: {
          //   text: 'Material Date'
          // },
          colors: ["#ff4560"]
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: 100
        }
      };
      // var renderChartOptions = new ApexCharts(
      //   document.querySelector("#hagul-services"),
      //   orderChartOptions
      // );
      // renderChartOptions.render();
    },

    async getRenderMaterials() {
      let series = [];

      this.isMaterialsLoading = true;
      // await this.getChartMaterial();

      // await this.getMaterials();
      // await this.getMaterialDate();

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let initialMaterials = [];
      let initialDate = [];
      try {
        for (let i = 0; i < this.materialsOrderItems.length; i++) {
          let mat = {
            name: "",
            // list:[],
            // data:[],
            date: []
            // count:[],
          };
          if (this.materialsOrderItems.length > 0) {
            mat.name = this.materialsOrderItems[i].name;

            initialMaterials.push(this.materialsOrderItems[i].name);
            initialDate.push(
              this.materialsOrderItems[i].created_at.slice(0, 10)
            );
          }
          let matList = [];
          for (const k in this.materialsOrderItems[i].materials) {
            mat.date.push(
              this.formatDate(
                this.materialsOrderItems[i].materials[k].created_at.slice(0, 10)
              )
            );
          }
          // mat.data = mat.list.length;
          this.plottedMaterials.push(mat);
        }
        for (let i = 0; i < this.plottedMaterials.length; i++) {
          for (let k of this.plottedMaterials[i].date) {
            this.materialsCatorgory.push(
              months[k.split("-")[1] - 1],
              k.split("-")[2] + "th",
              k.split("-")[0]
            );
          }
        }
        let style = [];
        for (let i = 0; i < this.materialsCatorgory.length; i++) {
          if (i % 3 === 0) {
            style.push(
              this.materialsCatorgory[i] + " " + this.materialsCatorgory[i + 2]
            );
          }
          this.formattedMaterialsItem;
        }

        let monthArray = this.dateFormatMaterial;
        let categoryArray = this.plottedMaterials;

        let banger = [];
        for (const i in this.plottedMaterials) {
          let solidDate = new Array(months.length).fill(0);

          for (const k in this.plottedMaterials[i].date) {
            for (const j in monthArray) {
              if (
                `${monthArray[j].month} ${monthArray[j].year}` ==
                this.plottedMaterials[i].date[k]
              )
                solidDate[months.indexOf(monthArray[j].month)]++;
            }
            if (k == this.plottedMaterials[i].date.length - 1)
              banger.push({
                name: this.plottedMaterials[i].name,
                data: solidDate
              });
          }
        }

        let allData = [];
        let formmattedDate = [];
        for (const i in this.plottedMaterials) {
          let itemArray = new Array(months.length).fill(0);

          for (const k in this.plottedMaterials[i].date) {
            for (const j in monthArray) {
              if (
                `${monthArray[j].month} ${monthArray[j].year}` ==
                this.plottedMaterials[i].date[k]
              )
                itemArray[months.indexOf(monthArray[j].month)]++;
            }
            if (k == this.plottedMaterials[i].date.length - 1)
              series.push({
                name: this.plottedMaterials[i].name,
                data: itemArray
              });
          }
        }
        function removeDuplicateItems(items) {
          return items.reduce((acc, item) => {
            const hasItem = !!acc.find(
              (uniqueItem) => uniqueItem.name === item.name
            );

            if (!hasItem) {
              return [...acc, item];
            }

            return acc;
          }, []);
        }
        // let newData = [...datata, datata.others ="another stuff"]
        let setsss = removeDuplicateItems(series);
        let removeArray = removeDuplicateItems(banger);

        let arrayFiles = [];

        for (let i = 0; i < removeArray.length; i++) {
          let dataFiles;
          for (let j of removeArray[i].data) {
            if (removeArray[i].data) {
              dataFiles = removeArray[i].data.map((data) => (j += data));
            }
          }
          arrayFiles.push({
            name: removeArray[i].name,
            data: dataFiles
          });
        }

        this.totalCharts = arrayFiles;
        this.totalMaterials = setsss;

        this.renderMaterialChart(this.totalCharts);
        this.isMaterialsLoading = false;
      } catch (error) {
        console.log(error.message);
      }
    },

    prepareChartData(materialCategories) {
      const categories = materialCategories.map((category) => {
        return {
          x: new Date(category.created_at),
          y: category.materials.length,
          name: category.name
        };
      });

      // Get the range of dates
      const maxDate = new Date();
      const minDate = new Date();
      minDate.setMonth(maxDate.getMonth() - 11);
      // const minDate = new Date(maxDate.getMonth - )

      // Generate the array of months and years between the range
      const months = this.getMonthsBetween(minDate, maxDate);

      // Create an empty series for each category
      const catWithMaterials = materialCategories.filter(
        (cat) => cat.materials.length > 0
      );
      const series = catWithMaterials.map((category) => {
        return {
          name: category.name,
          data: []
        };
      });

      // Populate the series with data
      for (const month of months.reverse()) {
        for (const category of series) {
          const foundCategory = categories.find(
            (cat) =>
              cat.name === category.name &&
              cat.x.getMonth() === month.getMonth() &&
              cat.x.getFullYear() === month.getFullYear()
          );
          if (foundCategory) {
            category.data.push(foundCategory.y);
          } else {
            category.data.push(0);
          }
        }
      }

      this.chartData = series;
    },
    getMonthsBetween(startDate, endDate) {
      const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      const end = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
      const months = [];

      let currentDate = start;
      while (currentDate <= end) {
        months.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return months;
    }
  }, 
  watch: {
  materialLoading: function(newVal, oldVal) {
    this.$nextTick(() => {
      this.renderMaterialCount();
    });
  }
}
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto);

body {
  font-family: Roboto, sans-serif;
}

#chart {
  /* max-width: 650px;
  margin: 35px auto; */
  font-weight: bold;
}

#material-chart {
  /* max-width: 650px;
  margin: 35px auto; */
  font-weight: bold;
}
</style>
