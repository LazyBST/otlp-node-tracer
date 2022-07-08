# Otlp-node-tracer
A wrapper implementation to auto instrument a distributed Node JS application using Opentelemetry.


# How to start tracing
Edit the script in package json which is used to start the application, in most cases it will a start script something like below

```
"start": "node index.js"
```

Replace the above with

```
"start": "node -r ./node_modules/otlp-node-tracer/OTLP_TRACER.js index.js"
```

The above will automatically start tracing the node js application using OTLP trace exporter.


# Analyze the traces
In order to collect the traces and analyze them, it requires a collector to be running and sending the trace to tracing backed of our choice. Tested the above with grafana agent and jaeger collector using grafana tempo as the tracing backend.


