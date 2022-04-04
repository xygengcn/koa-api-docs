# Koa-api-docs

> 支持koa-api插件自动生成doc文档


## 操作

```cmd

yarn run dev
```


```js
import Api from '@xygengcn/koa-api';
import path from 'path';
import Doc from '@xygengcn/koa-api-docs';
const api = new Api({
    controllerPath: path.join(__dirname, '../node_modules/@xygengcn/koa-api/dist/controller'),
    error: {
        message: {
            notFound: 'hahah'
        }
    }
});
api.run(Doc({ path: path.join(__dirname, '../docs'), docsify: true }));

```

