# Optimus-sdk2

## install
```bash
npm i front-optimus-sdk
or
yarn add front-optimus-sdk

```

## use
```js
import optimus from 'front-optimus-sdk'
Vue.use(optimus)
```

## vue
````vue
export default {
  mounted () {
    this.$op.close() // 关闭webview
  }
}
````
