FROM envoyproxy/envoy:v1.26-latest
COPY ./envoy.yaml /etc/envoy/envoy.yaml
# expose ports specified in envoy config
EXPOSE 8080 9901
CMD ["/usr/local/bin/envoy", "-c", "/etc/envoy/envoy.yaml"]
