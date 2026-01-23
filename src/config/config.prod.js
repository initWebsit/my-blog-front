const { protocol, hostname } = window.location

export default {
  mock: false,
  nodeEnv: 'production',
  useDomain: false,
  host_official: protocol + '//' + hostname,
  api_help: protocol + '//' + hostname,
  api_api: protocol + '//' + hostname,
  api_client: protocol + '//' + hostname,
}
