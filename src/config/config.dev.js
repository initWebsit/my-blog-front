const { protocol, hostname } = window.location

export default {
  mock: false,
  nodeEnv: 'development',
  useDomain: false,
  host_official: protocol + '//' + hostname + ':6120',
  //   api_help: '/proxyHelp',
  api_help: protocol + '//' + hostname + ':6130',
  api_api: '/proxyApi',
  api_client: '/proxyClient',
}
