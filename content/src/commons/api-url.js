export function getApiURL(endpoint) {
  let config = {
    graphqlApiUrl: 'https://ui-api.kyma.local/graphql' //"http://localhost:3000/graphql"
  };
  const clusterConfig = window["clusterConfig"];
  config = { ...config, ...clusterConfig };
  return config[endpoint];
}
