// MongoDB initialization script for CarbonMRV database

// Switch to the carbonmrv database
db = db.getSiblingDB("carbonmrv");

// Create collections with validation
db.createCollection("farmers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "phone", "farmerId", "location", "farmDetails"],
      properties: {
        name: { bsonType: "string", maxLength: 100 },
        phone: { bsonType: "string", pattern: "^[6-9][0-9]{9}$" },
        farmerId: { bsonType: "string" },
        location: {
          bsonType: "object",
          required: ["state", "district", "village"],
          properties: {
            state: { bsonType: "string" },
            district: { bsonType: "string" },
            village: { bsonType: "string" },
          },
        },
        farmDetails: {
          bsonType: "object",
          required: ["totalArea"],
          properties: {
            totalArea: { bsonType: "number", minimum: 0 },
          },
        },
      },
    },
  },
});

db.createCollection("carbonprojects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["projectId", "name", "projectType", "status"],
      properties: {
        projectId: { bsonType: "string" },
        name: { bsonType: "string", maxLength: 200 },
        projectType: {
          bsonType: "string",
          enum: [
            "agroforestry",
            "rice_cultivation",
            "soil_carbon",
            "biomass",
            "renewable_energy",
            "other",
          ],
        },
        status: {
          bsonType: "string",
          enum: [
            "planning",
            "implementation",
            "monitoring",
            "verification",
            "completed",
            "cancelled",
          ],
        },
      },
    },
  },
});

db.createCollection("fieldmeasurements");
db.createCollection("verifications");

// Create indexes for better performance
// Farmer indexes
db.farmers.createIndex({ farmerId: 1 }, { unique: true });
db.farmers.createIndex({ phone: 1 }, { unique: true });
db.farmers.createIndex({ "location.state": 1, "location.district": 1 });
db.farmers.createIndex({ "location.coordinates": "2dsphere" });

// Carbon Project indexes
db.carbonprojects.createIndex({ projectId: 1 }, { unique: true });
db.carbonprojects.createIndex({ projectType: 1, status: 1 });
db.carbonprojects.createIndex({ "location.state": 1, "location.district": 1 });
db.carbonprojects.createIndex({ "location.coordinates": "2dsphere" });

// Field Measurement indexes
db.fieldmeasurements.createIndex({ measurementId: 1 }, { unique: true });
db.fieldmeasurements.createIndex({ farmer: 1, project: 1 });
db.fieldmeasurements.createIndex({ measurementType: 1, measurementDate: 1 });
db.fieldmeasurements.createIndex({ "location.coordinates": "2dsphere" });

// Verification indexes
db.verifications.createIndex({ verificationId: 1 }, { unique: true });
db.verifications.createIndex({ project: 1, status: 1 });

// Insert sample data
print("Inserting sample farmers...");
db.farmers.insertMany([
  {
    name: "Rajesh Kumar",
    phone: "9876543210",
    farmerId: "FMR000001",
    location: {
      state: "Punjab",
      district: "Ludhiana",
      village: "Khanna",
      coordinates: {
        latitude: 30.7046,
        longitude: 76.2187,
      },
    },
    farmDetails: {
      totalArea: 2.5,
      croppingPattern: ["Rice", "Wheat"],
      soilType: "Alluvial",
      irrigationType: "Irrigated",
    },
    profile: {
      age: 45,
      gender: "male",
      education: "High School",
      experience: 20,
    },
    carbonProjects: [],
    isActive: true,
    registrationDate: new Date(),
    lastUpdated: new Date(),
  },
  {
    name: "Priya Sharma",
    phone: "8765432109",
    farmerId: "FMR000002",
    location: {
      state: "Haryana",
      district: "Karnal",
      village: "Assandh",
      coordinates: {
        latitude: 29.5219,
        longitude: 76.8739,
      },
    },
    farmDetails: {
      totalArea: 1.8,
      croppingPattern: ["Rice", "Sugarcane"],
      soilType: "Alluvial",
      irrigationType: "Drip",
    },
    profile: {
      age: 38,
      gender: "female",
      education: "Graduate",
      experience: 15,
    },
    carbonProjects: [],
    isActive: true,
    registrationDate: new Date(),
    lastUpdated: new Date(),
  },
]);

print("Inserting sample carbon project...");
db.carbonprojects.insertMany([
  {
    projectId: "AGR0001",
    name: "Punjab Agroforestry Carbon Project",
    description:
      "Large-scale agroforestry project for carbon sequestration in Punjab",
    projectType: "agroforestry",
    methodology: "VCS VM0042",
    status: "implementation",
    location: {
      state: "Punjab",
      district: "Ludhiana",
      villages: ["Khanna", "Samrala"],
      coordinates: {
        latitude: 30.7046,
        longitude: 76.2187,
      },
    },
    timeline: {
      startDate: new Date("2024-01-01"),
      endDate: new Date("2034-12-31"),
      monitoringPeriod: 6,
      credittingPeriod: 10,
    },
    carbonMetrics: {
      baselineEmissions: 1000,
      projectedReductions: 50000,
      actualReductions: 0,
      creditsIssued: 0,
      creditsTraded: 0,
    },
    participants: {
      farmers: [],
      coordinator: "Green Future Foundation",
      verifier: "SCS Global Services",
    },
    activities: [
      {
        activityType: "Tree Planting",
        description: "Plant indigenous tree species on farm boundaries",
        targetArea: 500,
        completedArea: 120,
        timeline: {
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-12-31"),
        },
      },
    ],
    monitoring: {
      frequency: "quarterly",
      parameters: ["Tree survival", "Biomass growth", "Soil carbon"],
      lastMonitoring: new Date("2024-03-01"),
      nextMonitoring: new Date("2024-06-01"),
    },
    verification: {
      standard: "VCS",
      frequency: "annual",
      verificationReports: [],
    },
    financials: {
      totalBudget: 5000000,
      spentAmount: 1250000,
      carbonPrice: 15,
      paymentSchedule: [
        {
          milestone: "Project Implementation",
          amount: 2500000,
          dueDate: new Date("2024-06-01"),
          paid: true,
        },
      ],
    },
    documents: {
      projectDocument: "",
      monitoringReports: [],
      verificationReports: [],
      certificates: [],
    },
    isActive: true,
    createdDate: new Date(),
    lastUpdated: new Date(),
  },
]);

// Create user for the application
db.createUser({
  user: "carbonmrv_user",
  pwd: "carbonmrv_password",
  roles: [
    {
      role: "readWrite",
      db: "carbonmrv",
    },
  ],
});

print("CarbonMRV database initialized successfully!");
print("Sample data inserted:");
print("- 2 farmers");
print("- 1 carbon project");
print("Database user created: carbonmrv_user");
