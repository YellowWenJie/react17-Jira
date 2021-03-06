# 2021 必修：React + React Hook + TS 最佳实践仿 Jira 企业级使用

## 课程介绍

![image-20220715161308758](https://tva1.sinaimg.cn/large/e6c9d24egy1h47oimn1xjj218y0u0go2.jpg)

![image-20220715162009031](https://tva1.sinaimg.cn/large/e6c9d24egy1h47opvaqpgj212i0q675q.jpg)

![image-20220715162029498](https://tva1.sinaimg.cn/large/e6c9d24egy1h47oq7s7e7j20p20kot93.jpg)

![image-20220715162116038](https://tva1.sinaimg.cn/large/e6c9d24egy1h47or104qnj21hb0u0dht.jpg)

![image-20220715162151250](https://tva1.sinaimg.cn/large/e6c9d24egy1h47ormuhjrj21hb0u0mz2.jpg)

![image-20220715162232973](https://tva1.sinaimg.cn/large/e6c9d24egy1h47osddm7mj21hb0u0tam.jpg)

![image-20220715162253430](https://tva1.sinaimg.cn/large/e6c9d24egy1h47ospzvbdj21hb0u0ta8.jpg)

![image-20220715162356655](https://tva1.sinaimg.cn/large/e6c9d24egy1h47ottoskgj21hb0u00v6.jpg)

## 开始

构建项目：`npx create-react-app jira --template typescript`

### 配置：

- 路径：通过在 tsconfig.json 加

  ```json
  "compilerOptions": {
      "baseUrl": "./src",
      .....
  ```

- prettier 新建俩个文件

  - 安装 `npm install --save-dev --save-exact prettier`

  - `.prettiergnore` 那些文件不需要格式化

  - `.prettierrc.json` 格式化配置文件

  - 安装 `npx mrm@2 lint-staged` 每次代码提交之前格式化

    package.json 添加配置：

    ```json

      "husky": {
        "hooks": {
          "pre-commit": "lint-staged"
        }
      },
      "lint-staged": {
        "*.{js,css,md,ts,tsx}": "prettier --write"
      }
    ```

  - 安装 `yarn add eslint-config-prettier -D`，然后 packge.json 配置：

    ```json
      "eslintConfig": {
        "extends": [
          "react-app",
          "react-app/jest",
          "prettier"
        ]
      },
    ```

### Mock（json-serve）

- 安装： `yarn add json-server -D`
- 项目创建文件夹，然后创建 json 文件
- json-serve - - watch 创建的文件

### env 文件

- 本地会读`.env.development`
- 打包会读`.env`

### 用 Custom Hook 提取并复用组件代码

![image-20220715231037746](https://tva1.sinaimg.cn/large/e6c9d24egy1h480l081e0j20nu06swf2.jpg)

- 定义复用 mont

  写 hook 一定要用 use 开头

  ```ts
  export const useMount = (callback: Function) => {
    useEffect(() => {
      callback();
    }, []);
  };
  ```

- 节流函数

  ```ts
  // 节流
  export const debounce = (func: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () {
        func();
      }, delay);
    };
  };
  ```

- hook 节流函数

  ```ts
  export const useDebounce = (value: Object, delay: number) => {
    // 每次在 value 变化以后，设置一个定时器
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const timeout = setTimeout(() => setDebouncedValue(value), delay);
      // 每次在上一个 useEffect 处理完以后再运行
      return () => clearTimeout(timeout);
    }, [value, delay]);
    return debouncedValue;
  };
  ```

### TypeScript

- `tople` 元祖类型是一种特俗的数据结构，其实元祖就是一个明确元素数量以及每个元素类型的一个数组。

- 这样居然不会报错

  ```ts
  interface Base {
    id: number;
  }
  interface Person extends Base {
    name: string;
  }
  // 鸭子类型（duck typing）：面向接口编程，而不是面向对象
  const sum: Person = { id: 1, name: "11" };
  const test = (arg: Base): Base => {
    return arg;
  };
  test(sum);
  ```

- 自动获取类型

  ```ts
  export const useHttp = () => {
    const { user } = useAuth();
    // 自动获取类型
    return ([endpoint, config]: Parameters<typeof http>) =>
      http(endpoint, { ...config, token: user?.token });
  };
  ```

### 后端管理

- ` npx imooc-jira-tool`

- 配置`index.tsx`：

  ```tsx
  import React from "react";
  import ReactDOM from "react-dom/client";
  import "./index.css";
  import App from "./App";
  import reportWebVitals from "./reportWebVitals";
  import { loadDevTools } from "jira-dev-tool";

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  loadDevTools(() =>
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
  ```

- 运行` npx msw init public`

### 消参

- ```ts
  // .then(setUser); 与 .then((user) => setUser(user)); 一个意思
  ```
