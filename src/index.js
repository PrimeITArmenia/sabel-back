

const { logger, app, mongoose, vars } = require("./configs");

const { port, env } = vars;

// open mongoose connection
mongoose.connect();

// listen to requests
app.listen(port, () => logger.info(`server started on port ${port} (${env})`));

/**
 * Exports express
 * @public
 */
module.exports = app;
