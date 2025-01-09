export default ({ store, redirect }) => {
  if (store.state.auth.isAuthenticated != false) {
    redirect("/");
  }
};
