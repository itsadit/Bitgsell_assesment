const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const { getCookie, notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('dev'));

// Optional: Token middleware (attach to specific routes if needed)
// app.use(getCookie); // Uncomment if every route needs the token

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);

// Handle 404 - route not found
app.use(notFound);

// Handle all other errors
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`✅ Backend running on http://localhost:${port}`);
});
