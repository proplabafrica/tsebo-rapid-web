export default ({ error, route, store }) => {
  const pageNames = route.meta.reduce((names, meta) => {
    names.push(meta.pageName);
    return names;
  }, []);

  const user = store.state.auth.user;

  const systemFunctionCodes = user.roles
    .reduce((functions, role) => functions.concat(role.systemFunctions), [])
    .map((systemFunction) => systemFunction.code);

  // if (
  //   pageNames.filter((pageName) => systemFunctionCodes.includes(pageName))
  //     .length < 1
  // ) {
  //   return error({
  //     statusCode: 403,
  //     message: "You do not have permission to view this page"
  //   });
  // }

  return true;
};
