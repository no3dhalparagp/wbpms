import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create demo Gram Panchayats
  const gramPanchayats = await Promise.all([
    prisma.gramPanchayat.upsert({
      where: { code: "GP001" },
      update: {},
      create: {
        name: "Dhalpara Gram Panchayat",
        code: "GP001",
        state: "West Bengal",
        district: "Purba Medinipur",
        block: "Tamluk",
        address: "Dhalpara, Tamluk, Purba Medinipur, West Bengal",
        population: 15000,
        area: 25.5,
        sarpanchName: "Ramesh Kumar Mondal",
        secretaryName: "Priya Das",
        phoneNumber: "9876543210",
        email: "dhalpara.gp@example.com",
        isActive: true,
      },
    }),
    prisma.gramPanchayat.upsert({
      where: { code: "GP002" },
      update: {},
      create: {
        name: "Krishnanagar Gram Panchayat",
        code: "GP002",
        state: "West Bengal",
        district: "Nadia",
        block: "Krishnanagar",
        address: "Krishnanagar, Nadia, West Bengal",
        population: 22000,
        area: 30.2,
        sarpanchName: "Anita Roy",
        secretaryName: "Sourav Ghosh",
        phoneNumber: "9876543211",
        email: "krishnanagar.gp@example.com",
        isActive: true,
      },
    }),
    prisma.gramPanchayat.upsert({
      where: { code: "GP003" },
      update: {},
      create: {
        name: "Bardhaman Gram Panchayat",
        code: "GP003",
        state: "West Bengal",
        district: "Purba Bardhaman",
        block: "Bardhaman",
        address: "Bardhaman, Purba Bardhaman, West Bengal",
        population: 18000,
        area: 28.7,
        sarpanchName: "Manoj Kumar Singh",
        secretaryName: "Rita Banerjee",
        phoneNumber: "9876543212",
        email: "bardhaman.gp@example.com",
        isActive: true,
      },
    }),
  ])

  console.log("✅ Created Gram Panchayats:", gramPanchayats.length)

  // Hash passwords
  const superAdminPassword = await bcrypt.hash("superadmin123", 12)
  const adminPassword = await bcrypt.hash("admin123", 12)
  const staffPassword = await bcrypt.hash("staff123", 12)

  // Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@example.com",
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
      emailVerified: new Date(),
      designation: "System Administrator",
      employeeId: "SA001",
      phoneNumber: "9876543200",
    },
  })

  console.log("✅ Created Super Admin:", superAdmin.email)

  // Create Admin users for each GP
  const admins = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin1@dhalpara.gp" },
      update: {},
      create: {
        name: "Rajesh Kumar",
        email: "admin1@dhalpara.gp",
        password: adminPassword,
        role: Role.ADMIN,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[0].id,
        designation: "GP Administrator",
        employeeId: "AD001",
        phoneNumber: "9876543201",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin2@krishnanagar.gp" },
      update: {},
      create: {
        name: "Sunita Das",
        email: "admin2@krishnanagar.gp",
        password: adminPassword,
        role: Role.ADMIN,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[1].id,
        designation: "GP Administrator",
        employeeId: "AD002",
        phoneNumber: "9876543202",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin3@bardhaman.gp" },
      update: {},
      create: {
        name: "Amit Kumar",
        email: "admin3@bardhaman.gp",
        password: adminPassword,
        role: Role.ADMIN,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[2].id,
        designation: "GP Administrator",
        employeeId: "AD003",
        phoneNumber: "9876543203",
      },
    }),
  ])

  console.log("✅ Created Admin users:", admins.length)

  // Create Staff users for each GP
  const staffUsers = await Promise.all([
    // Dhalpara GP Staff
    prisma.user.upsert({
      where: { email: "staff1@dhalpara.gp" },
      update: {},
      create: {
        name: "Priya Mondal",
        email: "staff1@dhalpara.gp",
        password: staffPassword,
        role: Role.STAFF,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[0].id,
        designation: "Clerk",
        employeeId: "ST001",
        phoneNumber: "9876543210",
      },
    }),
    prisma.user.upsert({
      where: { email: "staff2@dhalpara.gp" },
      update: {},
      create: {
        name: "Suresh Roy",
        email: "staff2@dhalpara.gp",
        password: staffPassword,
        role: Role.STAFF,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[0].id,
        designation: "Data Entry Operator",
        employeeId: "ST002",
        phoneNumber: "9876543211",
      },
    }),
    // Krishnanagar GP Staff
    prisma.user.upsert({
      where: { email: "staff3@krishnanagar.gp" },
      update: {},
      create: {
        name: "Mita Ghosh",
        email: "staff3@krishnanagar.gp",
        password: staffPassword,
        role: Role.STAFF,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[1].id,
        designation: "Clerk",
        employeeId: "ST003",
        phoneNumber: "9876543212",
      },
    }),
    prisma.user.upsert({
      where: { email: "staff4@krishnanagar.gp" },
      update: {},
      create: {
        name: "Arun Banerjee",
        email: "staff4@krishnanagar.gp",
        password: staffPassword,
        role: Role.STAFF,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[1].id,
        designation: "Field Worker",
        employeeId: "ST004",
        phoneNumber: "9876543213",
      },
    }),
    // Bardhaman GP Staff
    prisma.user.upsert({
      where: { email: "staff5@bardhaman.gp" },
      update: {},
      create: {
        name: "Rina Singh",
        email: "staff5@bardhaman.gp",
        password: staffPassword,
        role: Role.STAFF,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[2].id,
        designation: "Clerk",
        employeeId: "ST005",
        phoneNumber: "9876543214",
      },
    }),
    prisma.user.upsert({
      where: { email: "staff6@bardhaman.gp" },
      update: {},
      create: {
        name: "Vikram Kumar",
        email: "staff6@bardhaman.gp",
        password: staffPassword,
        role: Role.STAFF,
        isActive: true,
        emailVerified: new Date(),
        gramPanchayatId: gramPanchayats[2].id,
        designation: "Accountant",
        employeeId: "ST006",
        phoneNumber: "9876543215",
      },
    }),
  ])

  console.log("✅ Created Staff users:", staffUsers.length)

  // Create some demo villages for each GP
  const villages = await Promise.all([
    // Dhalpara GP Villages
    prisma.village.create({
      data: {
        name: "Dhalpara Village",
        gramPanchayatId: gramPanchayats[0].id,
        population: 5000,
        area: 8.5,
        isActive: true,
      },
    }),
    prisma.village.create({
      data: {
        name: "Chakdighi Village",
        gramPanchayatId: gramPanchayats[0].id,
        population: 3000,
        area: 6.2,
        isActive: true,
      },
    }),
    // Krishnanagar GP Villages
    prisma.village.create({
      data: {
        name: "Krishnanagar Village",
        gramPanchayatId: gramPanchayats[1].id,
        population: 8000,
        area: 12.3,
        isActive: true,
      },
    }),
    prisma.village.create({
      data: {
        name: "Nabadwip Village",
        gramPanchayatId: gramPanchayats[1].id,
        population: 6000,
        area: 9.8,
        isActive: true,
      },
    }),
    // Bardhaman GP Villages
    prisma.village.create({
      data: {
        name: "Bardhaman Village",
        gramPanchayatId: gramPanchayats[2].id,
        population: 7000,
        area: 11.5,
        isActive: true,
      },
    }),
    prisma.village.create({
      data: {
        name: "Kalna Village",
        gramPanchayatId: gramPanchayats[2].id,
        population: 4000,
        area: 7.2,
        isActive: true,
      },
    }),
  ])

  console.log("✅ Created Villages:", villages.length)

  // Create some demo wards for each GP
  const wards = await Promise.all([
    // Dhalpara GP Wards
    prisma.ward.create({
      data: {
        name: "Ward 1",
        gramPanchayatId: gramPanchayats[0].id,
        number: 1,
        population: 2500,
        isActive: true,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ward 2",
        gramPanchayatId: gramPanchayats[0].id,
        number: 2,
        population: 2000,
        isActive: true,
      },
    }),
    // Krishnanagar GP Wards
    prisma.ward.create({
      data: {
        name: "Ward 1",
        gramPanchayatId: gramPanchayats[1].id,
        number: 1,
        population: 4000,
        isActive: true,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ward 2",
        gramPanchayatId: gramPanchayats[1].id,
        number: 2,
        population: 3500,
        isActive: true,
      },
    }),
    // Bardhaman GP Wards
    prisma.ward.create({
      data: {
        name: "Ward 1",
        gramPanchayatId: gramPanchayats[2].id,
        number: 1,
        population: 3000,
        isActive: true,
      },
    }),
    prisma.ward.create({
      data: {
        name: "Ward 2",
        gramPanchayatId: gramPanchayats[2].id,
        number: 2,
        population: 2500,
        isActive: true,
      },
    }),
  ])

  console.log("✅ Created Wards:", wards.length)

  console.log("🎉 Database seeding completed successfully!")
  console.log("\n📋 Demo Login Credentials:")
  console.log("=".repeat(50))
  console.log("🔑 Super Admin:")
  console.log("   Email: superadmin@example.com")
  console.log("   Password: superadmin123")
  console.log("\n👨‍💼 Admin Users:")
  console.log("   Email: admin1@dhalpara.gp | Password: admin123")
  console.log("   Email: admin2@krishnanagar.gp | Password: admin123")
  console.log("   Email: admin3@bardhaman.gp | Password: admin123")
  console.log("\n👥 Staff Users:")
  console.log("   Email: staff1@dhalpara.gp | Password: staff123")
  console.log("   Email: staff2@dhalpara.gp | Password: staff123")
  console.log("   Email: staff3@krishnanagar.gp | Password: staff123")
  console.log("   Email: staff4@krishnanagar.gp | Password: staff123")
  console.log("   Email: staff5@bardhaman.gp | Password: staff123")
  console.log("   Email: staff6@bardhaman.gp | Password: staff123")
  
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
