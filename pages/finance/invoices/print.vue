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
        <div class="card card-invoice" style="
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
                Invoice
              </h1>
              <div class="billed-from" style="box-sizing: border-box; margin-top: 0">
                <img
                  src="https://res.cloudinary.com/diils/image/upload/v1683037506/tsebo-rapid_voh5bx-removebg-preview_c2amvp.png"
                  @load="imageLoaded()" alt="Tsebo Rapid Logo" height="45" />
                <p style="
                    box-sizing: border-box;
                    margin-top: 0;
                    margin-bottom: 20px;
                    line-height: 1.7;
                  ">
                  8A Ogunyemi Road, Oniru, Victoria Island, Lagos, Nigeria
                  <br style="box-sizing: border-box" />Tel No: +2348100276566
                  <br style="box-sizing: border-box" />Email:
                  procurement@tseborapid.com
                </p>
              </div>
              <!-- billed-from -->
            </div>
            <!-- invoice-header -->

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
                <label class="section-label-sm tx-gray-500" style="
                    box-sizing: border-box;
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 700;
                    color: #adb5bd;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 11px;
                  ">
                  Invoice Information
                </label>
                <p class="invoice-info-row" style="
                    box-sizing: border-box;
                    margin-top: 0;
                    margin-bottom: 0;
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                  ">
                  <span style="box-sizing: border-box">Invoice Number:</span>
                  <span style="box-sizing: border-box">#{{ invoice.code }}</span>
                </p>
                <div v-for="workRequest in invoice.workRequests" :key="workRequest.id">
                  <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                    <span style="box-sizing: border-box">Work Request:</span>
                    <span style="box-sizing: border-box">{{
    workRequest.name
  }}</span>
                  </p>
                  <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                    <span style="box-sizing: border-box">Work Request Code:</span>
                    <span style="box-sizing: border-box">#{{ workRequest.code }}</span>
                  </p>
                  <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                    <span style="box-sizing: border-box">Unit:</span>
                    <span style="box-sizing: border-box">{{
    workRequest.unit.name
  }}</span>
                  </p>
                </div>
                <div v-for="floatRequest in invoice.floatRequests" :key="floatRequest.id">
                  <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                    <span style="box-sizing: border-box">Float Request:</span>
                    <span style="box-sizing: border-box">{{
    floatRequest.name
  }}</span>
                  </p>
                  <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                    <span style="box-sizing: border-box">Float Request Code:</span>
                    <span style="box-sizing: border-box">#{{ floatRequest.code }}</span>
                  </p>
                  <p class="invoice-info-row" style="
                      box-sizing: border-box;
                      margin-top: 0;
                      margin-bottom: 0;
                      display: flex;
                      justify-content: space-between;
                      padding: 5px 0;
                      border-top: 1px dashed rgb(192, 0, 0);
                    ">
                    <span style="box-sizing: border-box">Unit:</span>
                    <span style="box-sizing: border-box">{{
    floatRequest.unit.name
  }}</span>
                  </p>
                </div>
                <p class="invoice-info-row" style="
                    box-sizing: border-box;
                    margin-top: 0;
                    margin-bottom: 0;
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-top: 1px dashed rgb(192, 0, 0);
                  ">
                  <span style="box-sizing: border-box">Issue Date:</span>
                  <span style="box-sizing: border-box">{{
    invoice.created_at | dateFormat
  }}</span>
                </p>
              </div>
              <!-- col -->
            </div>
            <!-- row -->

            <div class="table-responsive mg-t-40" style="
                box-sizing: border-box;
                display: block;
                width: 100%;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                -ms-overflow-style: -ms-autohiding-scrollbar;
                margin-top: 40px;
              ">
              <table class="table table-invoice" style="
                  box-sizing: border-box;
                  border-collapse: collapse;
                  width: 100%;
                  max-width: 100%;
                  margin-bottom: 0;
                  background-color: transparent;
                ">
                <thead style="box-sizing: border-box">
                  <tr style="box-sizing: border-box">
                    <th class="wd-20p" style="
                        box-sizing: border-box;
                        text-align: inherit;
                        padding: 0.75rem;
                        vertical-align: bottom;
                        border-top: 0;
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        width: 20%;
                        border-bottom: 0;
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                        background-color: rgb(192, 0, 0);
                        letter-spacing: 0.5px;
                      ">
                      #
                    </th>
                    <th class="wd-40p" style="
                        box-sizing: border-box;
                        text-align: inherit;
                        padding: 0.75rem;
                        vertical-align: bottom;
                        border-top: 0;
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        width: 40%;
                        border-bottom: 0;
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                        background-color: rgb(192, 0, 0);
                        letter-spacing: 0.5px;
                      ">
                      Item
                    </th>
                    <th class="tx-center" style="
                        box-sizing: border-box;
                        text-align: center;
                        padding: 0.75rem;
                        vertical-align: bottom;
                        border-top: 0;
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        border-bottom: 0;
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                        background-color: rgb(192, 0, 0);
                        letter-spacing: 0.5px;
                      ">
                      Quantity
                    </th>
                    <th class="tx-right" style="
                        box-sizing: border-box;
                        text-align: right;
                        padding: 0.75rem;
                        vertical-align: bottom;
                        border-top: 0;
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        border-bottom: 0;
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                        background-color: rgb(192, 0, 0);
                        letter-spacing: 0.5px;
                      ">
                      Unit Price
                    </th>
                    <th class="tx-right" style="
                        box-sizing: border-box;
                        text-align: right;
                        padding: 0.75rem;
                        vertical-align: bottom;
                        border-top: 0;
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        border-bottom: 0;
                        font-weight: 700;
                        font-size: 12px;
                        text-transform: uppercase;
                        background-color: rgb(192, 0, 0);
                        letter-spacing: 0.5px;
                      ">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody style="box-sizing: border-box" v-if="invoice.workRequests.length > 0">
                  <tr style="box-sizing: border-box" v-for="(item, index) in invoice.items" :key="item.id">
                    <td style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                      ">
                      {{ index + 1 }}
                    </td>
                    <td v-if="item.material" class="tx-12" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        font-size: 12px;
                      ">
                      {{ item.material.name }}
                    </td>
                    <td v-if="item.service" class="tx-12" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        font-size: 12px;
                      ">
                      {{ item.service.name }}
                    </td>
                    <td class="tx-center" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: center;
                      ">
                      {{ item.quantity }}
                      <!-- {{ item.management_fee }}
                      {{ item.vat }}
                      {{ item.item_total }} -->
                    </td>
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      " v-html="thisOrThat(item, ['material', 'service']).currency
    .unicode + $options.filters.moneyFormat(item.amount)
    "></td>
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      " v-html="thisOrThat(item, ['material', 'service']).currency
    .unicode +
    $options.filters.moneyFormat(
      item.amount * parseFloat(item.quantity)
    )
    "></td>
                  </tr>
                  <tr style="box-sizing: border-box" v-if="invoice.items.length > 0">
                    <td colspan="2" rowspan="4" class="valign-middle" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: middle;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                      ">
                      <div class="invoice-notes" style="box-sizing: border-box">
                        <!-- <span>{{ { value: invoice.items[0].management_fee } | toMoney }}</span> -->
                        <label class="section-label-sm tx-gray-500" style="
                            box-sizing: border-box;
                            display: block;
                            margin-bottom: 0.5rem;
                            font-weight: 700;
                            color: #adb5bd;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            font-size: 11px;
                          ">Notes</label>
                        <p style="
                            box-sizing: border-box;
                            margin-top: 0;
                            margin-bottom: 20px;
                          "></p>
                      </div>
                      <!-- invoice-notes -->
                    </td>
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      Management Fee
                    </td>
                    <td colspan="2" class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      {{ { value: invoice.items[0].management_fee } | toMoney }}
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box">
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      VAT
                    </td>
                    <td colspan="2" class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      {{ { value: invoice.items[0].vat } | toMoney }}
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box">
                    <td class="tx-right tx-uppercase tx-bold tx-inverse" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        font-weight: 700;
                        text-transform: uppercase;
                        text-align: right;
                      ">
                      Total Due
                    </td>
                    <td colspan="2" class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      <h4 class="tx-primary tx-bold tx-lato" style="
                          box-sizing: border-box;
                          margin-top: 0;
                          margin-bottom: 0.5rem;
                          font-family: 'Lato', 'Helvetica Neue', Arial,
                            sans-serif;
                          font-weight: 700;
                          line-height: 1.2;
                          color: rgb(192, 0, 0);
                          font-size: 1.3125rem;
                        ">
                        {{ { value: invoice.items[0].item_total } | toMoney }}
                      </h4>
                    </td>
                  </tr>
                </tbody>
                <tbody style="box-sizing: border-box" v-if="invoice.floatRequests.length > 0">
                  <tr style="box-sizing: border-box" v-for="(item, index) in invoice.items" :key="item.id">
                    <td style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                      ">
                      {{ index + 1 }}
                    </td>
                    <td class="tx-12" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        font-size: 12px;
                      ">
                      {{ item.name }}
                    </td>
                    <td class="tx-center" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: center;
                      ">
                      {{ item.quantity }}
                    </td>
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      {{ { value: item.amount } | toMoney }}
                    </td>
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      {{
    { value: item.amount * parseFloat(item.quantity) }
    | toMoney
  }}
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box" v-if="invoice.items.length > 0">
                    <td colspan="2" rowspan="4" class="valign-middle" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: middle;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                      ">
                      <div class="invoice-notes" style="box-sizing: border-box">
                        <label class="section-label-sm tx-gray-500" style="
                            box-sizing: border-box;
                            display: block;
                            margin-bottom: 0.5rem;
                            font-weight: 700;
                            color: #adb5bd;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            font-size: 11px;
                          ">Notes</label>
                        <p style="
                            box-sizing: border-box;
                            margin-top: 0;
                            margin-bottom: 20px;
                          "></p>
                      </div>
                      <!-- invoice-notes -->
                    </td>
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      Management Fee
                    </td>
                    <td colspan="2" class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      {{ { value: invoice.items[0].management_fee } | toMoney }}
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box">
                    <td class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      VAT
                    </td>
                    <td colspan="2" class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      {{ { value: invoice.items[0].vat } | toMoney }}
                    </td>
                  </tr>
                  <tr style="box-sizing: border-box">
                    <td class="tx-right tx-uppercase tx-bold tx-inverse" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #343a40;
                        font-weight: 700;
                        text-transform: uppercase;
                        text-align: right;
                      ">
                      Total Due
                    </td>
                    <td colspan="2" class="tx-right" style="
                        box-sizing: border-box;
                        padding: 0.75rem;
                        vertical-align: top;
                        border-top: 1px solid rgb(192, 0, 0);
                        border-top-color: rgb(192, 0, 0);
                        color: #5b636a;
                        text-align: right;
                      ">
                      <h4 class="tx-primary tx-bold tx-lato" style="
                          box-sizing: border-box;
                          margin-top: 0;
                          margin-bottom: 0.5rem;
                          font-family: 'Lato', 'Helvetica Neue', Arial,
                            sans-serif;
                          font-weight: 700;
                          line-height: 1.2;
                          color: rgb(192, 0, 0);
                          font-size: 1.3125rem;
                        ">
                        {{ { value: invoice.items[0].item_total } | toMoney }}
                      </h4>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- table-responsive -->
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
import loading from "@/components/ui/loading";

export default {
  components: { loading },
  computed: {
    total() {
      var total = 0;
      for (const item of this.invoice.items) {
        total += item.amount * parseFloat(item.quantity);
      }
      return total;
    },
    vat() {
      return this.total * 0.075;
    }
  },
  created() {
    this.setInvoice(this.$route.query.id);
  },
  data: () => ({
    invoice: null,
    loading: true,
    logoLoading: true,
    shouldRefresh: true
  }),
  head() {
    var title = "Print Invoice · Tsebo-Rapid";
    if (this.invoice) {
      const request = this.invoice.workRequests[0]
        ? this.invoice.workRequests[0]
        : this.invoice.floatRequests[0]
          ? this.invoice.floatRequests[0]
          : null;
      if (request) {
        title = `Invoice for ${request.name} · Tsebo Rapid`;
      }
    }

    return { title };
  },
  meta: {
    pageName: "invoices.show"
  },
  methods: {
    imageLoaded() {
      this.logoLoading = false;
      if (this.loading == false) window.print();
    },
    setInvoice(id) {
      const { detailedAssociations, invoices } =
        this.$store.state.finance.invoices;
      this.invoice = invoices.find((invoice) => invoice.id == id);
      if (this.invoice && !this.shouldRefresh) {
        if (Array.isArray(this.invoice.items)) {
          return (this.loading = false);
        }
      }

      this.$axios
        .get("invoices/" + id, {
          params: {
            associations: [
              "items.material.currency",
              "items.service.currency",
              "workRequests.unit",
              "floatRequests.unit",
              "currency"
            ]
          }
        })
        .then((response) => {
          this.$store.commit(
            "finance/invoices/setInvoice",
            response.data.invoice
          );
          this.invoice = this.invoice
            ? Object.assign({}, response.data.invoice)
            : response.data.invoice;
          this.loading = false;
          this.shouldRefresh = false;
          this.$store.commit("finance/invoices/toggleRefresh");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  middleware: ["auth", "roleGuard"],
  updated() {
    if (this.loading == false && this.logoLoading == false) window.print();
  },
  watch: {
    $route(to, from) {
      this.setInvoice(to.query.id);
    }
  }
};
</script>
