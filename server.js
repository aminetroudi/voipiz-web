const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Add security headers with custom CSP for Google Analytics
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", // Allow inline scripts for Google Analytics
        "https://www.googletagmanager.com", // Allow Google Tag Manager
        "https://www.google-analytics.com", // Allow Google Analytics
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'", 
        "https://www.google-analytics.com", // Allow GA connections
        "https://analytics.google.com", // Allow GA4 connections
        "https://*.google-analytics.com", // Allow regional GA endpoints
        "https://region1.google-analytics.com", // Specific regional endpoint
        "https://stats.g.doubleclick.net", // Google Analytics data collection
      ],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Vous avez atteint la limite d'envois. Veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(express.static(__dirname + "/public")); // Serve static files from the 'public' folder
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply the rate limiter to the contact form route
app.use("/contact", limiter);

// Contact form route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Tous les champs sont requis." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Voipiz Contact" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: `Nouveau message de ${name}`,
      text: `Nom: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ 
        success: true, 
        message: "Message envoyé avec succès ! Merci de nous avoir contactés. Nous reviendrons vers vous par email sous peu." 
      });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre message.",
      });
  }
});

// Catch-all route to serve index.html for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur started on port ${PORT} in ${NODE_ENV} mode`);
  console.log(`Visit http://localhost:${PORT} to access the site locally`);
});
