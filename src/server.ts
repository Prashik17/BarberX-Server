
import express from "express";
import dotenv from "dotenv";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public.routes";
import customerRoutes from "./routes/customer.routes";
import ownerRoutes from "./routes/owner.routes";
import salonRoutes from "./routes/salon.routes";
import barberRoutes from "./routes/barber.routes";
import customerProfileRoutes from "./routes/customerProfile.routes";
import { authenticateJWT } from "./middlewares/auth.middleware";
import { authorizeRoles } from "./middlewares/role.middleware";
import { logger } from "./config/logger";

dotenv.config({ path: './src/config/.env' });
const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BarberX Server API',
      version: '1.0.0',
      description: 'API documentation for BarberX - A comprehensive salon and barber management system',
      contact: {
        name: 'BarberX Team',
        email: 'support@barberx.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts']
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ✅ Public routes (no auth)
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);

// ✅ Protected routes

// Customer APIs
app.use(
  "/api/customer",
  authenticateJWT,
  authorizeRoles("customer"),
  customerRoutes
);

// Customer Profile APIs (Customer protected)
app.use(
  "/api/customer-profile",
  authenticateJWT,
  authorizeRoles("customer"),
  customerProfileRoutes
);

// Owner APIs
app.use(
  "/api/owner",
  authenticateJWT,
  authorizeRoles("owner"),
  ownerRoutes
);

// Salon APIs (Owner protected)
app.use(
  "/api/salon",
  authenticateJWT,
  authorizeRoles("owner"),
  salonRoutes
);

// Barber APIs - Owner protected routes
app.use(
  "/api/owner/barber",
  authenticateJWT,
  authorizeRoles("owner"),
  barberRoutes
);

// Connect DB
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📖 API Documentation available at: http://localhost:${PORT}/api-docs`);
});
