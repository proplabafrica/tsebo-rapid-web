export default {
  state: () => ({
    routes: [
      {
        pageName: "assets.index",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "console.slas.create",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "console.slas.index",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "console.slas.show",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "console.web-hooks.create",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "console.web-hooks.index",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "dashboard.admin",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "dashboard.occupant",
        allowedRoles: ["OCC", "SYS"]
      },
      {
        pageName: "dashboard.org-admin",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "finance.invoices.details",
        allowedRoles: ["FM", "OA", "OCC", "SYS"]
      },
      {
        pageName: "finance.invoices.index",
        allowedRoles: ["FM", "OA", "OCC", "SYS"]
      },
      {
        pageName: "finance.invoices.print",
        allowedRoles: ["FM", "OA", "OCC", "SYS"]
      },
      {
        pageName: "hagul.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.materials.details",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.materials.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.materials.categories",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.materials.create",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.sales-orders.confirm-delivery",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "hagul.inventory.sales-orders.dispatch",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.sales-orders.details",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.sales-orders.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.sales-orders.print-pick-slip",
        allowedRoles: ["FM", "OA", "PM", "PO", "SYS", "TCHN"]
      },
      {
        pageName: "hagul.inventory.services.details",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.services.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.inventory.services.create",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.purchase-orders.create",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.purchase-orders.details",
        allowedRoles: ["OA", "PM", "PO", "SYS", "VND"]
      },
      {
        pageName: "hagul.purchase.purchase-orders.index",
        allowedRoles: ["OA", "PM", "PO", "SYS", "VND"]
      },
      {
        pageName: "hagul.purchase.quotations.index",
        allowedRoles: ["OA", "PM", "PO", "SYS", "VND"]
      },
      {
        pageName: "hagul.purchase.rfqs.index",
        allowedRoles: ["OA", "PM", "PO", "SYS", "VND"]
      },
      {
        pageName: "hagul.purchase.tender-process.details",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.tender-processes.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.temder-processes.select-vendors",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.temder-processes.send-rfq",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.purchase.temder-processes.upload-quotations",
        allowedRoles: ["OA", "PM", "PO", "SYS", "VND"]
      },
      {
        pageName: "hagul.vendors.create",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.vendors.details",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "hagul.vendors.details.settings",
        allowedRoles: ["OA", "PM", "SYS"]
      },
      {
        pageName: "hagul.vendors.index",
        allowedRoles: ["OA", "PM", "PO", "SYS"]
      },
      {
        pageName: "location.units.index",
        allowedRoles: ["FM", "OA", "OCC", "SYS", "TCHN"]
      },
      {
        pageName: "location.units.details",
        allowedRoles: ["FM", "OA", "OCC", "SYS", "TCHN"]
      },
      {
        pageName: "location.units.details.hierarchy",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "location.units.details.settings",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "maintenance.client-requests.approve",
        allowedRoles: ["FM", "OA", "OCC", "SYS"]
      },
      {
        pageName: "maintenance.client-requests.create",
        allowedRoles: ["FM", "OA", "OCC", "SYS"]
      },
      {
        pageName: "maintenance.float-requests.index",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "maintenance.float-requests.create",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "maintenance.float-requests.details",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "maintenance.work-requests.create-invoice",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "maintenance.work-requests.details",
        allowedRoles: ["FM", "OA", "QA", "SYS", "TCHN"]
      },
      {
        pageName: "maintenance.work-requests.index",
        allowedRoles: ["FM", "OA", "OCC", "QA", "SYS", "TCHN"]
      },
      {
        pageName: "maintenance.routines.index",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "maintenance.routines.maintenance-plans",
        allowedRoles: ["FM", "OA", "SYS"]
      },
      {
        pageName: "maintenance.routines.maintenance-plans.create",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "maintenance.work-requests.client-response",
        allowedRoles: ["FM", "SYS"]
      },
      {
        pageName: "manage.index",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "onboarding.organizations.details",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "onboarding.organizations.set-up",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "onboarding.subscription-packages.create",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "onboarding.subscription-packages.details",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "onboarding.subscription-packages.index",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "people.technicians.details",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "people.technicians.index",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "people.users.create",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "people.users.details",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "people.users.index",
        allowedRoles: ["OA", "SYS"]
      },
      {
        pageName: "people.trades.index",
        allowedRoles: ["SYS"]
      },
      {
        pageName: "reports.requests",
        allowedRoles: ["FM", "OA", "OCC", "QA", "SYS", "TCHN"]
      },
      {
        pageName: "iot.index",
        allowedRoles: ["TCHN", "OA", "FM", "SYS"]
      },
      {
        pageName: "generator-metrics.index",
        allowedRoles: ["TCHN", "OA", "FM", "SYS"]
      }
    ]
  })
};
