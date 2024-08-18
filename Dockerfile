FROM backblazeit/b2:4.1.0
WORKDIR /app
COPY . .
RUN apt-get update -y \
    && apt-get install -y nodejs npm \
    && npm install
CMD ["start"]
ENTRYPOINT [ "npm" ]
