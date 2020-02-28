## 一、项目介绍

这是一个 小程序开发框架，亮点如下

- 提供统一的开发规范、基础配置和初始代码

- 支持小程序 分包、分包预下载

- 封装 一些列基础 utils脚本

- 扩展 computed、watch API

- 定义 https 配置规范、封装请求API（避免回调地域）

- 引入 mobx-miniprogram 进行状态管理，基于 mobx


## 二、目录结构

- 根目录

    ```
    ├── /.vscode             # vscode 编辑器配置
    │   ├── /pluginList.md   # vscode 插件列表
    │   ├── /settings.json   # vscode 基础配置
    │   │
    ├── /docs                # 项目文档
    ├── /miniprogram_npm     # 构建打包后的 npm包
    ├── /node_modules        # 项目依赖
    ├── /src                 # 项目路径
    ├── .csscomb.json        # csscomb 配置
    ├── .editorconfig        # editorconfig 配置
    ├── .eslintignore        # eslint 忽略的文件
    ├── .eslintrc            # eslint 配置
    ├── .gitignore           # git 忽略的文件
    ├── app.js               # 小程序逻辑
    ├── app.json             # 小程序公共配置
    ├── app.wxss             # 小程序公共样式
    ├── package.json         # 项目组 npm 配置
    ├── project.config.json  # 微信开发者工具配置
    ├── sitemap.json         # 微信搜索收录配置
    ```

- 项目目录

    ```
    ├── /src                       
    │   ├── /common                 # 主包
    │       ├── /$config            # 通用 配置
    │       ├── /$dict              # 通用 字典表
    │       ├── /$font              # 通用 字体
    │       ├── /$http              # 通用 请求配置、API
    │       ├── /$icon              # 通用 图标
    │       ├── /$store             # 通用 状态管理
    │       ├── /$util              # 通用 工具脚本
    │       ├── /behaviors          # 通用 behaviors
    │       ├── /pages              # 主包 页面
    │       ├── /components         # 主包 组件
    │       │
    │   ├── /module1                # module1 分包
    │       ├── /pages              # module1 页面
    │       ├── /components         # module1 组件
    ```


## 三、开发约束

- 页面构造器统一使用 Components（应对复杂页面更加灵活）

- 使用 mobx-miniprogram 时，以 behaviors 形式

- wxml 事件绑定统一以 `bind:eventType` 形式


## 四、优化建议

- 为加快首屏打开速度，将首页、tabBar、通用代码置于 小程序主包，其他均放在小程序分包

- 为减少加载分包白屏时间，配置小程序分包预下载

- 为减少代码体积，字体图标建议按需引入，在此 iconfont 是一个不错的选择

- 为减少代码体积，小程序发布时，建议将 vant-weapp 组件源码拷贝到项目中，需要删除没使用的组件

- 背景等大图片 上传至服务器，图标图除外

- 标签高频显示隐藏，不建议使用 `wx:if`，可以使用 CSS属性 `display` 

## 五、文档参考


- 扩展 computed、watch [参考](https://developers.weixin.qq.com/miniprogram/dev/extended/utils/computed.html)

- 状态管理 mobx-miniprogram  [参考](https://developers.weixin.qq.com/miniprogram/dev/extended/utils/mobx.html)

- 使用分包 [参考](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/basic.html)

- 分包预下载 [参考](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)

