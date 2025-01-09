<template>

  <body v-if="!loading" style="
          box-sizing: border-box;
          margin: 0;
          font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5;
          color: #868ba1;
          text-align: left;
          background-color: #f0f2f7;
        ">
    <div class="slim-mainpanel" style="
            box-sizing: border-box;
            transition: none;
            min-height: calc(100vh - 263px);
          ">
      <div class style="box-sizing: border-box">
        <div class="card card-incident" style="
                box-sizing: border-box;
                position: relative;
                display: flex;
                flex-direction: column;
                min-width: 0;
                word-wrap: break-word;
                background-color: #fff;
                background-clip: border-box;
                border: 1px solid #ced4da;
                border-radius: 0;
              ">
          <div class="card-body" style="box-sizing: border-box; flex: 1 1 auto; padding: 60px">
            <div class="invoice-header" style="
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    flex-direction: row-reverse;
                  ">
              <h1 class="invoice-title" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif;
                      font-weight: 700;
                      line-height: 1.2;
                      color: #ced4da;
                      font-size: 1.5875rem;
                      text-transform: uppercase;
                    ">
                incident Report Form
              </h1>
              <div class="billed-from" style="box-sizing: border-box; margin-top: 0">
                <img src="https://res.cloudinary.com/diils/image/upload/v1682171434/overcomers/bt5dcfilslfxsprztdty.png"
                  @load="imageLoaded()" alt="Tsebo Logo" height="45" />
                <p style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 20px;
                        line-height: 1.7;
                      ">
                  8A Ogunyemi Road, Oniru, Victoria Island, Lagos, Nigeria
                  <br style="box-sizing: border-box" />Tel No: +2348100276566
                  <br style="box-sizing: border-box" />Email:

                  matanda@tseborapid.com
                </p>
              </div>
              <!-- billed-from -->
            </div>
            <!-- incident-header -->

            <div class="row mg-t-20" style="
                    box-sizing: border-box;
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                    margin-top: 20px;
                  ">
              <!-- col -->
              <div class="col-md" style="
                      box-sizing: border-box;
                      position: relative;
                      width: 100%;
                      min-height: 1px;
                      padding-right: 15px;
                      padding-left: 15px;
                      flex-basis: 0;
                      flex-grow: 1;
                      max-width: 100%;
                    ">
                <label class="section-label-sm tx-white tx-center" style="
                        box-sizing: border-box;
                        display: block;
                        margin-bottom: 1.5rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 14px;
                        background-color: gray;
                        height: 2rem;
                        align-self: center;
                        padding-top: 0.381rem;
                      ">
                  Incident
                </label>
                <p class="incident-info-row" style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                      ">
                  <span class="col-4" style="box-sizing: border-box">incident Name:</span>
                  <span class="col-7 text-right" style="box-sizing: border-box">{{ incidentReport.name }}</span>
                </p>
                <p class="incident-info-row" style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                        border-top: 1px solid rgb(192, 0, 0);
                      ">
                  <span class="col-4" style="box-sizing: border-box">Date Reported:</span>
                  <span class="col-7 text-right" style="box-sizing: border-box">{{ incidentReport.created_at |
    dateFormat }}</span>
                </p>

                <p class="incident-info-row" style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                        border-top: 1px solid rgb(192, 0, 0);
                      ">
                  <span class="col-4" style="box-sizing: border-box">Location:</span>
                  <span class="col-7 text-right" style="box-sizing: border-box">{{ incidentReport.unit.name }}</span>
                </p>

                <p class="incident-info-row" style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                        border-top: 1px solid rgb(192, 0, 0);
                      ">
                  <span class="col-4" style="box-sizing: border-box">Description:</span>
                  <span class="col-7 text-right" style="box-sizing: border-box">{{ incidentReport.description }}</span>
                </p>
              </div>
              <!-- col -->
            </div>

            <div class="row mg-t-20" style="
                    box-sizing: border-box;
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                    margin-top: 20px;
                  ">
              <!-- col -->
              <div class="col-md" style="
                      box-sizing: border-box;
                      position: relative;
                      width: 100%;
                      min-height: 1px;
                      padding-right: 15px;
                      padding-left: 15px;
                      flex-basis: 0;
                      flex-grow: 1;
                      max-width: 100%;
                    ">
                <label class="section-label-sm tx-white tx-center" style="
                        box-sizing: border-box;
                        display: block;
                        margin-bottom: 1.5rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        font-size: 14px;
                        background-color: gray;
                        height: 2rem;
                        align-self: center;
                        padding-top: 0.381rem;
                      ">
                  Corrective Maintenance
                </label>
                <p class="incident-info-row" style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                      ">
                  <span class="col-4" style="box-sizing: border-box">
                    <span> Recommended </span>
                    <span> Corrective Action: </span>
                  </span>
                  <span class="col-7 text-right" style="box-sizing: border-box">{{
    incidentReport.reportForm.action_taken }}</span>
                </p>
                <p class="incident-info-row" style="
                        box-sizing: border-box;
                        margin-top: 0;
                        margin-bottom: 0;
                        display: flex;
                        justify-content: space-between;
                        padding: 5px 0;
                        border-top: 1px solid rgb(192, 0, 0);
                      ">
                  <span class="col-4" style="box-sizing: border-box">Description:</span>
                  <span class="col-7 text-right" style="box-sizing: border-box">{{
    incidentReport.reportForm.action_description }}</span>
                </p>
              </div>
              <!-- col -->
            </div>
            <!-- row -->
          </div>
          <!-- card-body -->
        </div>
        <!-- card -->
      </div>
      <!-- container -->
    </div>
    <!-- slim-mainpanel -->

    <div class="slim-footer" style="
            box-sizing: border-box;
            border-top: 1px solid #ced4da;
            background-color: #e3e7eb;
            margin-top: 50px;
            padding: 0;
          ">
      <div class="container" style="
              box-sizing: border-box;
              width: 100%;
              padding-right: 15px;
              padding-left: 15px;
              margin-right: auto;
              margin-left: auto;
              max-width: 1140px;
              font-size: 13px;
              text-align: left;
              height: 60px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            ">
        <p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0">
          Copyright 2023 &copy; All Rights Reserved. Vampfi
        </p>
        <p style="box-sizing: border-box; margin-top: 0; margin-bottom: 0">
          Designed by:
          <a href="https://vampfi.com/" style="
                  box-sizing: border-box;
                  color: rgb(192, 0, 0);
                  text-decoration: none;
                  background-color: transparent;
                  -webkit-text-decoration-skip: objects;
                  transition: none;
                ">Vampfi</a>
        </p>
      </div>
      <!-- container -->
    </div>
    <!-- slim-footer -->
  </body>
  <loading v-else />
</template>

<script>
import vButton from "@/components/ui/v-button";
import vModal from "@/components/ui/v-modal";
import starInput from "@/components/ui/star-input";
import formMixin from "@/mixins/forms";
import modalMixin from "@/mixins/modal";
import authMixin from "@/mixins/auth";

export default {
  components: {
    starInput,
    vButton,
    vModal,
    toast: () => import("@/components/ui/toast")
  },
  data: () => ({
    status: "closed",
    disabled: false,
    validationErrors: {},
    incidentReportForm: {
      actionTitle: "",
      actionDescription: ""
    },
    incidentReport: {},
    loading: false
  }),
  created() {
    this.setIncidentReport(this.$route.query.id);
  },
  methods: {
    imageLoaded() {
      this.logoLoading = false;
      if (this.loading == false) window.print();
    },
    async setIncidentReport(id) {
      this.disabled = true;

      const { incidentReports, refresh } =
        this.$store.state.maintenance.incidentReports;
      this.incidentReport = incidentReports.find(
        (incidentReport) => incidentReport.id == id
      );
      if (this.incidentReport && !refresh) {
        if (Array.isArray(this.incidentReports.items)) {
          return (this.loading = false);
        }
      }
      this.loading = true;

      try {
        const response = await this.$axios.get(`incident-reports/${id}`, {
          params: { associations: ["reportForm", "unit"] }
        });

        this.incidentReport = response.data.incidentReport;

        this.disabled = false;
        this.loading = false;

        this.$emit("update");
      } catch (error) {
        this.toast({ type: "danger", title: "Cannot get incident report" });
        this.disabled = false;
        const response = error.response;
        if (response && response.status && response.status == 422) {
          for (const error of response.data) {
            this.validationErrors[error.field] = error.message;
          }
        } else if (response && response.status && response.status == 429) {
          this.validationErrors.email = response.statusText;
        } else {
          // response);
        }
      }
    }
  },
  mixins: [authMixin, formMixin, modalMixin],
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) this.setIncidentReport(to.query.id);
    }
  }
};
</script>
