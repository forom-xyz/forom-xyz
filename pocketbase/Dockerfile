# Use alpine:latest as requested
FROM alpine:latest

# Install ca-certificates, wget, and unzip to download and extract PocketBase
RUN apk add --no-cache ca-certificates wget unzip

# Define PocketBase version
ENV PB_VERSION=0.22.12

# Set the working directory for PocketBase
WORKDIR /pb

# Download the specific linux_arm64 zip binary of PocketBase (v0.22.12)
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_arm64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_arm64.zip \
    && rm pocketbase_${PB_VERSION}_linux_arm64.zip \
    && chmod +x /pb/pocketbase

# Expose the default PocketBase port
EXPOSE 8090

# Start pocketbase, binding to 0.0.0.0 so it is accessible outside the container
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
