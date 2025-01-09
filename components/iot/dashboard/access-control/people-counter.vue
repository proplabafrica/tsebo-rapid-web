<template>
  <div>
    <div class="row">
      <div class="col-12 col-lg-8">
        <div class="row mg-b-10">
          <div class="col-12 col-md mg-b-10 mg-md-b-0">
            <div class="card card-status card-height shadow-sm">
              <div class="media">
                <div class="icon-container" id="incoming-bg">
                  <img src="/img/incoming.svg" class="icon" />
                </div>

                <div class="mg-l-10">
                  <h6 class="level">8</h6>
                  <p>Incoming Visitors</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md mg-b-20">
            <div class="card card-status card-height shadow-sm">
              <div class="media">
                <div class="icon-container" id="outgoing-bg">
                  <img src="/img/outgoing.svg" class="icon" />
                </div>

                <div class="mg-l-10">
                  <h6 class="level">5</h6>
                  <p>Outgoing Visitors</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md mg-b-10 mg-md-b-0">
            <div class="card card-status card-height shadow-sm">
              <div class="media">
                <div class="icon-container" id="current-bg">
                  <img src="/img/current.svg" class="icon" />
                </div>

                <div class="mg-l-10">
                  <h6 class="level">5</h6>
                  <p>Current Visitors</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md mg-b-10 mg-md-b-0">
            <div class="card card-status card-height shadow-sm">
              <div class="media">
                <div class="icon-container" id="light-bg">
                  <img src="/img/light_on.png" class="icon" />
                </div>

                <div class="mg-l-10">
                  <h6 class="level">On</h6>
                  <p>Light Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md">
            <div class="row mg-b-10">
              <div class="col-12 col-lg-4">
                <div class="card">
                  <h5>Incoming Visitors</h5>

                  <div class="card-values">
                    <h6>Last value</h6>
                    <h1 id="incoming">11:00</h1>
                    <h6>Last Updated: March 20 2021 10:59</h6>
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-4 mg-t-10">
                <div class="card">
                  <h5>Outgoing Visitors</h5>

                  <div class="card-values">
                    <h6>Last value</h6>
                    <h1 id="outgoing">11:00</h1>
                    <h6>Last Updated: March 20 2021 10:59</h6>
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-4 mg-t-10">
                <div class="card">
                  <h5>Light Status</h5>

                  <div class="card-values">
                    <h6>Light status</h6>
                    <img
                      src="/img/light_on.png"
                      :style="{ width: '60px', height: '70px' }"
                    />
                    <h6>On</h6>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-lg-4">
                <div class="card">
                  <h5>Current Visitors</h5>

                  <div class="card-values">
                    <h6>Last value</h6>
                    <h1 id="current">11:00</h1>
                    <h6>Last Updated: March 20 2021 10:59</h6>
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-8 mg-t-10">
                <div class="card">
                  <h5>Visitors Frequency</h5>

                  <div :style="{ display: 'flex', justifyContent: 'center' }">
                    <chart
                      :xAxis="chartOptionsV"
                      :series="seriesV"
                      :yAxis="yAxisV"
                      charttype="line"
                      chartHeight="200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 mg-t-10">
        <div
          class="col-12 col-lg pd-0"
          :style="{
            minHeight: '300px !important'
          }"
        >
          <div
            class="card bg-light pd-20"
            :style="{
              height: '536px !important'
            }"
          >
            <h5>Activity</h5>

            <ul
              class="list-group"
              :style="{
                width: '100% !important',
                color: '#fff'
              }"
            >
              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(90, 219, 241, 0.493)'
                }"
              >
                <span>Incoming </span>
                <span>20</span>
                <span>16:12:30</span>
              </li>
              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing </span>
                <span>10</span>
                <span>15:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(90, 219, 241, 0.493)'
                }"
              >
                <span>Incoming </span>
                <span>13</span>
                <span>13:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing </span>
                <span>10</span>
                <span>15:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(90, 219, 241, 0.493)'
                }"
              >
                <span>Incoming </span>
                <span>13</span>
                <span>13:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing </span>
                <span>10</span>
                <span>15:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing </span>
                <span>10</span>
                <span>15:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(90, 219, 241, 0.493)'
                }"
              >
                <span>Incoming </span>
                <span>13</span>
                <span>13:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(90, 219, 241, 0.493)'
                }"
              >
                <span>Incoming </span>
                <span>5</span>
                <span>12:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing </span>
                <span>10</span>
                <span>09:12:30</span>
              </li>

              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing </span>
                <span>5</span>
                <span>08:12:30</span>
              </li>
              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(90, 219, 241, 0.493)'
                }"
              >
                <span>Incoming </span>
                <span>3</span>
                <span>05:12:30</span>
              </li>
              <li
                class="list-group-item"
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(241, 198, 103, 0.493)'
                }"
              >
                <span>Outgoing</span>
                <span>6</span>
                <span>01:12:30</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from "@/components/ui/chart";

export default {
  components: {
    chart
  },
  data() {
    return {
      chartOptionsV: {
        xaxis: {
          categories: [1994, 1995, 1996, 1997, 1998]
        },
        colors: ["#f55959bd"]
      },
      seriesV: [
        {
          name: "visitors frequency",
          data: [5000, 10000, 15000, 20000, 30000]
        }
      ],
      yAxisV: [
        {
          title: {
            text: "Visitors Frequency"
          }
        }
      ]
    };
  }
};
</script>
<style scoped>
.wrapper {
  padding: 30px !important;
}
.card {
  padding: 6px !important;
  padding-left: 15px !important;
}

.card > h5 {
  margin-bottom: 15px;
}

.card-values {
  margin-top: 50px;
  margin-bottom: 40px;
  text-align: center;
}

h1 {
  font-weight: 900;
  font-size: 50px;
}
#incoming {
  color: rgb(90, 218, 241);
}
#incoming-bg {
  background-color: rgb(90, 218, 241);
}

#outgoing {
  color: rgb(241, 197, 103);
}
#outgoing-bg {
  background-color: rgb(241, 197, 103);
}

#current {
  color: rgb(103, 241, 103);
}
#current-bg {
  background-color: rgb(103, 241, 103);
}

#light-bg {
  background-color: burlywood;
}
.card-height {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 96px !important;
  /* justify-content: center; */
}

.icon {
  height: 30px;
  width: 30px;
}
.icon-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 52px;
  width: 52px;
  /* padding: 5px; */
  background: rgba(241, 198, 103);
}

.level {
  font-weight: 600;
  font-size: 22px;
  margin-bottom: -7px;
  color: black;
}
</style>
