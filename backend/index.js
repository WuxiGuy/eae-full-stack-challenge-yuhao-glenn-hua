const serverlessExpress = require('@vendia/serverless-express');
const { app } = require('./dist/server');

// Create a single instance of VehicleSimulator to be shared across requests
const { VehicleSimulator } = require('./dist/simulator/VehicleSimulator');
const simulator = new VehicleSimulator();

// Add simulator instance to app for use in routes
app.set('simulator', simulator);

// Export the handler for Lambda
exports.handler = serverlessExpress({ app }); 