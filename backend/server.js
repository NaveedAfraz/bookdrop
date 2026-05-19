const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://bookdrop-delta.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ""));
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                        allowedOrigins.some(o => origin.startsWith(o));
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Warning] Origin "${origin}" not allowed by CORS`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const addressRoutes = require("./routes/addresses");
const bookRoutes = require("./routes/books");
const chapterRoutes = require("./routes/chapters");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const wishlistRoutes = require("./routes/wishlist");
const swipeRoutes = require("./routes/swipes");
const secondHandRoutes = require("./routes/secondHand");
const journeyRoutes = require("./routes/journey");
const challengeRoutes = require("./routes/challenges");
const bundleRoutes = require("./routes/bundles");
const roomRoutes = require("./routes/rooms");
const discoveryRoutes = require("./routes/discovery");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");
const refundRoutes = require("./routes/refunds");
const courseRoutes = require("./routes/courses");

// Health check routes
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.get('/', (_req, res) => res.json({ status: 'ok', message: 'Bookdrop API is running successfully!' }));

app.use("/api/auth", authRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/swipes", swipeRoutes);
app.use("/api/secondHand", secondHandRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/bundles", bundleRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
