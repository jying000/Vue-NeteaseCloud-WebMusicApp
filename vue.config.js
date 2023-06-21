module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    "devServer": {  
      "port": 9999,
      proxy: {
        '/files': {
          target: 'http://localhost:3000', // 代理目标地址
          changeOrigin: false, // 是否改变请求头中的 origin 字段
          pathRewrite: {
            '^/files': '' // 重写请求地址，去掉 /files 前缀
          }
        }
      }
    },
    resolve: {
      alias: {
        'components': '@/components',
        'content': '@/components/content',
        'common': '@/components/common',
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
        'layout':'@/layout',
        'mixin' : '@/mixin',
        'utils' : '@/utils',
        'player' : '@/player'
      }
    }
  },
}