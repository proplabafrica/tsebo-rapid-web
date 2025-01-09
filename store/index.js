export default {
  state: () => ({
    activeRoutes: {
      manage: [
        "/assets",
        "/console",
        "/location",
        "/manage",
        "/onboarding",
        "/people",
        "/performance",
        "/reports"
      ],
      "unit-details-index": [
        "/location/units/details/schedules",
        "/location/units/details/create-schedule"
      ],
      "purchase-order-details-index": [
        "/hagul/purchase/purchase-orders/details/log"
      ],
      "organization-details-index": [
        "/onboarding/organizations/details/create-hierarchy",
        "/onboarding/organizations/details/create-unit"
      ],
      "assets-equipment-details-index": [
        "/assets/equipment/details/schedule",
        "/onboarding/organizations/details/create-unit"
      ]
    },
    firstLoad: true
  }),
  mutations: {
    toggleFirstLoad(state, firstLoad = true) {
      state.firstLoad = firstLoad;
    }
  }
};
