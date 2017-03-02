FROM node:6.9.0
RUN apt-get update && apt-get install -y -q openjdk-7-jdk libcairo2-dev libjpeg-dev libgif-dev && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY ./client /usr/src/app/client
COPY ./server /usr/src/app/server
RUN mkdir /usr/src/app/PdfAnnotationsWriter
COPY ./src /usr/src/app/PdfAnnotationsWriter/src
COPY ./package.json /usr/src/app/
COPY ./gulpfile.js /usr/src/app/
COPY ./docker/config.sh /usr/src/app/
COPY ./docker/startup.sh /usr/src/app/
EXPOSE 8080
CMD ["/usr/src/app/startup.sh"]