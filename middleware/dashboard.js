export default ({ store, redirect }) => {
  if (!store.state.auth.user) {
    store.dispatch("auth/logout", {
      successHandler() {
        redirect("/auth/login");
        $axios.post("logout");
      }
    });
    return;
  }

  const roleCodes = store.state.auth.user.roles.map(role => role.code);

  if (roleCodes.includes("SYS")) return redirect("/dashboard/admin");

  if (roleCodes.includes("OA")) return redirect("/dashboard/operation-manager");

  if (roleCodes.includes("FM")) return redirect("/dashboard/facility-manager");

  if (roleCodes.includes("OCC")) return redirect("/dashboard/occupant/track");

  if (roleCodes.includes("PO") || roleCodes.includes("PM"))
    return redirect("/hagul");

  if (roleCodes.includes("VND")) return redirect("/hagul/purchase/rfqs");

  if (roleCodes.includes("TCHN")) return redirect("/dashboard/technician");

  if (roleCodes.includes("QA")) return redirect("/maintenance/requests");

  return redirect("/profile");
};
