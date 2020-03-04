module.exports = {
  configureWebpack:{
    resolve:{
      alias:{
        'assets': '@/assets', 
        'store': '@/store',
        'components': '@/components',
        'network': '@/network',
        'pages': '@/pages'
      }
    }
  },
    runtimeCompiler: true
}