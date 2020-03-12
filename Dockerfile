# docker 打包命令如下
# docker build -t guyinsoft-web:latest .

FROM dockerhub.azk8s.cn/library/nginx:1.15.0-alpine
COPY . /usr/share/nginx/html

EXPOSE 80
