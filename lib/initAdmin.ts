import User from "@/models/User";
import bcrypt from "bcryptjs";

let adminInitialized = false;

export async function initializeAdmin() {
  // Prevent multiple initializations
  if (adminInitialized) {
    return;
  }

  try {
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_MAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check if admin credentials are provided
    if (!adminName || !adminEmail || !adminPassword) {
      console.log("Admin credentials not provided in .env.local. Skipping admin initialization.");
      adminInitialized = true;
      return;
    }

    // Note: Database connection should already be established when this is called

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin user already exists: ${adminEmail}`);
      adminInitialized = true;
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin user created successfully: ${adminEmail}`);
    adminInitialized = true;
  } catch (error) {
    console.error("Error initializing admin user:", error);
    // Don't throw error to prevent app from crashing
    adminInitialized = true;
  }
}

