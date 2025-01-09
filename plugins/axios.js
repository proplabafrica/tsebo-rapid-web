export default function({ $axios, store }) {
  $axios.onRequest(config => {
    $axios.setHeader("Accept", "application/json");
    $axios.setToken(store.state.auth.jwt, "Bearer");
  });

  $axios.setHeader("Accept", "application/json");

  $axios.setToken(store.state.auth.jwt, "Bearer");
}
