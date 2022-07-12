"use strict";

require("dotenv").config();
const {
  BasicTracerProvider,
  BatchSpanProcessor,
} = require("@opentelemetry/sdk-trace-base");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-grpc");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");

const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const SERVICE_NAME = process.env.SERVICE_TRACING_NAME;
const COLLECTOR_ENDPOINT = process.env.TRACE_COLLECTOR_ENDPOINT;

if (!SERVICE_NAME) {
  throw new Error(
    "No service name specified in environment, Please pass SERVICE_TRACING_NAME as env"
  );
}

if (!COLLECTOR_ENDPOINT) {
  throw new Error(
    "No collector endpoint specified in environment, Please pass TRACE_COLLECTOR_ENDPOINT as env"
  );
}

const exporter = new OTLPTraceExporter({
  url: COLLECTOR_ENDPOINT,
});

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register();
const sdk = new opentelemetry.NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk
  .start()
  .then(() => {
    console.log("Tracing initialized");
  })
  .catch((error) => console.log("Error initializing tracing", error));

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
