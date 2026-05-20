# Chinavibe 项目架构分析

## 1. 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.2.6 | React 全栈框架，支持服务端渲染、App Router |
| **React** | 19.2.6 | UI 框架 |
| **TypeScript** | 5.7.3 | 类型安全 |
| **Tailwind CSS** | 4.1.18 | CSS 框架 |
| **Radix UI** | ^1.0.x | 基础 UI 组件库 |
| **Lucide React** | 0.563.0 | 图标库 |
| **Geist** | ^1.3.0 | 字体库 |

### 前端目录结构

```
src/app/(frontend)/
├── (sitemaps)/           # 站点地图
├── [...slug]/            # 动态页面路由
├── posts/                # 文章列表与详情
├── search/               # 搜索页面
├── globals.css           # 全局样式
├── layout.tsx            # 布局组件
├── not-found.tsx         # 404页面
└── page.tsx              # 首页
```

---

## 2. 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Payload CMS** | 3.84.1 | Headless CMS，提供完整的后端管理和 API |
| **@payloadcms/next** | 3.84.1 | Payload 与 Next.js 集成 |
| **Node.js** | ^18.20.2 \|\| >=20.9.0 | 运行时 |

### 核心特点

- Payload CMS 提供自动生成的 REST API 和 GraphQL API
- 后端逻辑通过 Payload 的 collection 配置和 hooks 实现
- API 路由由 Payload 自动生成

---

## 3. 数据库配置

### 数据库类型

**PostgreSQL**

### 连接方式

在 `src/payload.config.ts` 中配置：

```typescript
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
  },
})
```

### 环境变量配置

```env
# .env 文件
DATABASE_URL=postgresql://127.0.0.1:5432/your-database-name
PAYLOAD_SECRET=YOUR_SECRET_HERE
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 集合定义

| 集合 | 用途 | 文件路径 |
|------|------|----------|
| Pages | 页面内容 | `src/collections/Pages/index.ts` |
| Posts | 文章内容 | `src/collections/Posts/index.ts` |
| Categories | 分类管理 | `src/collections/Categories.ts` |
| Media | 媒体文件 | `src/collections/Media.ts` |
| Users | 用户管理 | `src/collections/Users/index.ts` |

---

## 4. 前端新建页面及对接接口

### 页面创建流程

1. 在 `src/app/(frontend)/` 下创建新目录，例如 `about/`
2. 创建 `page.tsx` 文件，使用服务端组件模式

### 示例代码

```typescript
// src/app/(frontend)/about/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const queryData = async () => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'about' } },
  })
  return result.docs[0]
}

export default async function AboutPage() {
  const page = await queryData()
  return (
    <div>
      <h1>{page?.title}</h1>
    </div>
  )
}
```

### 数据获取方式

- 使用 `getPayload()` 获取 Payload 实例
- 通过 `payload.find()`、`payload.findByID()` 等方法查询数据
- 支持 draft mode（预览模式）

---

## 5. 后端开发接口

### 方式一：通过 Payload Collection 自动生成 API

1. **创建集合配置文件**

```typescript
// src/collections/Products.ts
import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'price', type: 'number', required: true },
  ],
}
```

2. **在 payload.config.ts 中注册**

```typescript
collections: [Pages, Posts, Media, Categories, Users, Products],
```

3. **自动生成的 API 端点**

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/products` | 获取列表 |
| GET | `/api/products/:id` | 获取单个 |
| POST | `/api/products` | 创建 |
| PUT | `/api/products/:id` | 更新 |
| DELETE | `/api/products/:id` | 删除 |

### 方式二：自定义 API 路由

```typescript
// src/app/api/custom/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  const payload = await getPayload({ config: configPromise })
  const data = await payload.find({ collection: 'products' })
  return NextResponse.json(data)
}
```

---

## 项目架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  app/(frontend) │  │   Components    │  │     Blocks      │ │
│  │  (Pages/Routes) │  │  (UI Elements)  │  │ (Dynamic CMS    │ │
│  └────────┬────────┘  └────────┬────────┘  │   Components)   │ │
│           │                    │            └────────┬────────┘ │
│           └────────────────────┼─────────────────────┘          │
│                                │                                │
│                                ▼                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Payload CMS API Client                      │    │
│  │    getPayload() → payload.find() / payload.findByID()   │    │
│  └─────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ API Requests
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (Payload CMS)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  Collections    │  │    Hooks        │  │    Plugins      │ │
│  │ (Pages/Posts/   │  │ (revalidate/   │  │ (SEO/Search/    │ │
│  │  Users/Cats)    │  │  populate)      │  │   Redirects)    │ │
│  └────────┬────────┘  └─────────────────┘  └─────────────────┘ │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL Database                   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 关键配置文件

| 文件 | 作用 |
|------|------|
| `src/payload.config.ts` | Payload CMS 主配置 |
| `next.config.ts` | Next.js 配置，集成 Payload |
| `src/app/(payload)/api/[...slug]/route.ts` | Payload API 入口 |
| `.env` | 环境变量（数据库连接、密钥等） |
| `tailwind.config.mjs` | Tailwind CSS 配置 |
| `postcss.config.js` | PostCSS 配置 |

---

## 开发命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 |
| `pnpm payload generate:types` | 生成 TypeScript 类型 |
| `pnpm test` | 运行测试 |