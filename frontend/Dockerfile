# 选择 Node 版本（要支持 React Router 7.x 的要求）
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目代码
COPY . .

# 构建 React 项目
RUN npm run build

# 使用一个轻量 Web 服务器（serve）来运行前端
RUN npm install -g serve

# 启动静态服务器
CMD ["serve", "-s", "build", "-l", "8080"]
