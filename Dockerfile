# docker 打包命令如下
# docker build -t otusvmap/web:dev .

FROM nginx:alpine
COPY . /usr/share/nginx/html