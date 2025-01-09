export default async ({ $axios, redirect, route, store }) => {
  const roleQuery = route.query?.roles;

  // "............");
  if (!roleQuery) {
    store.commit("auth/setAppClass", "Tsebo-Rapid");
  } else {
    const roleCodes = roleQuery.split(",");
    if (roleCodes.filter((code) => ["PM", "PO"].includes(code)).length > 0) {
      store.commit("auth/setAppClass", "hagul");
    } else {
      store.commit("auth/setAppClass", "Tsebo-Rapid");
    }
  }

  if (store.state.auth.isAuthenticated == true) {
    return true;
  }
  let user = localStorage.getItem("user");
  let authUser;

  let units;
  let metro;
  let isFM;

  if (user) {
    authUser = JSON.parse(user);
    isFM = authUser?.roles.find((r) => r.code == "FM");

    if (isFM && localStorage.getItem("jwt")) {
      const res = await $axios.get("/units", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt")
        }
      });
      units = res.data.data;
    }

    if (isFM && units && units.length > 0) {
      metro = units.find((o) => o.name.toLowerCase().includes("metro garden"));
    }
  }

  // units, "units....");
  // authUser, "auth  insdie  user...");
  // isFM, "auth  insdie is FM user...");
  // metro, "auth  insdie is  metro FM user...");

  // metro, "metro................");
  if (
    authUser &&
    route.fullPath.includes("/metrogardensiotsensors/metrogardens/fmview") &&
    isFM &&
    metro
  ) {
    return redirect("/iot/power-systems/diesel-tanks");
  }
  if (
    authUser &&
    route.fullPath.includes("/metrogardensiotsensors/metrogardens/fmview") &&
    !metro
  ) {
    return redirect("/");
  }

  if (!authUser && route.fullPath.includes("/iot/power-systems/diesel-tanks")) {
    return true;
  }
  if (localStorage.getItem("isAuthenticated") != "true") {
    store.commit("auth/setRouteAfterLogin", route.fullPath);
    return redirect("/auth/login");
  }

  store.commit("auth/setAuth", {
    user: JSON.parse(localStorage.getItem("user")),
    token: localStorage.getItem("jwt")
  });

  if ($axios) {
    $axios.setToken(store.state.auth.jwt, "Bearer");
    if (store.state.auth.isAuthenticated == true)
      store.dispatch("auth/getCurrentUser", { $axios });
  }

  return true;
};
