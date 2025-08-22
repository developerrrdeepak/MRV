import { RequestHandler } from "express";
import { Farmer, IFarmer } from "../models/Farmer";
import { CarbonProject } from "../models/CarbonProject";

// Get all farmers with pagination and filtering
export const getFarmers: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filtering options
    const filter: any = {};
    if (req.query.state) filter["location.state"] = req.query.state;
    if (req.query.district) filter["location.district"] = req.query.district;
    if (req.query.isActive !== undefined)
      filter.isActive = req.query.isActive === "true";

    // Search by name or farmer ID
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, "i");
      filter.$or = [
        { name: { $regex: searchRegex } },
        { farmerId: { $regex: searchRegex } },
      ];
    }

    const farmers = await Farmer.find(filter)
      .populate("carbonProjects", "projectId name status")
      .sort({ registrationDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Farmer.countDocuments(filter);

    res.json({
      farmers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching farmers:", error);
    res.status(500).json({ error: "Failed to fetch farmers" });
  }
};

// Get single farmer by ID
export const getFarmerById: RequestHandler = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id)
      .populate("carbonProjects")
      .lean();

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json(farmer);
  } catch (error) {
    console.error("Error fetching farmer:", error);
    res.status(500).json({ error: "Failed to fetch farmer" });
  }
};

// Get farmer by farmer ID
export const getFarmerByFarmerId: RequestHandler = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({
      farmerId: req.params.farmerId.toUpperCase(),
    })
      .populate("carbonProjects")
      .lean();

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json(farmer);
  } catch (error) {
    console.error("Error fetching farmer:", error);
    res.status(500).json({ error: "Failed to fetch farmer" });
  }
};

// Create new farmer
export const createFarmer: RequestHandler = async (req, res) => {
  try {
    // Generate farmer ID if not provided
    if (!req.body.farmerId) {
      const count = await Farmer.countDocuments();
      req.body.farmerId = `FMR${String(count + 1).padStart(6, "0")}`;
    }

    const farmer = new Farmer(req.body);
    await farmer.save();

    res.status(201).json(farmer);
  } catch (error: any) {
    console.error("Error creating farmer:", error);

    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        error: `Farmer with this ${field} already exists`,
        field,
        value: error.keyValue[field],
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    res.status(500).json({ error: "Failed to create farmer" });
  }
};

// Update farmer
export const updateFarmer: RequestHandler = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true },
    ).populate("carbonProjects");

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json(farmer);
  } catch (error: any) {
    console.error("Error updating farmer:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res
        .status(400)
        .json({ error: "Validation failed", details: errors });
    }

    res.status(500).json({ error: "Failed to update farmer" });
  }
};

// Delete farmer (soft delete - set isActive to false)
export const deleteFarmer: RequestHandler = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { isActive: false, lastUpdated: new Date() },
      { new: true },
    );

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    res.json({ message: "Farmer deactivated successfully", farmer });
  } catch (error) {
    console.error("Error deleting farmer:", error);
    res.status(500).json({ error: "Failed to delete farmer" });
  }
};

// Add farmer to carbon project
export const addFarmerToProject: RequestHandler = async (req, res) => {
  try {
    const { farmerId, projectId } = req.body;

    // Check if project exists
    const project = await CarbonProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Carbon project not found" });
    }

    // Update farmer to add project reference
    const farmer = await Farmer.findByIdAndUpdate(
      farmerId,
      {
        $addToSet: { carbonProjects: projectId },
        lastUpdated: new Date(),
      },
      { new: true },
    ).populate("carbonProjects");

    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    // Update project to add farmer reference
    await CarbonProject.findByIdAndUpdate(projectId, {
      $addToSet: { "participants.farmers": farmerId },
    });

    res.json(farmer);
  } catch (error) {
    console.error("Error adding farmer to project:", error);
    res.status(500).json({ error: "Failed to add farmer to project" });
  }
};

// Get farmers by location (within radius)
export const getFarmersByLocation: RequestHandler = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const farmers = await Farmer.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude as string),
              parseFloat(latitude as string),
            ],
          },
          $maxDistance: parseFloat(radius as string) * 1000, // Convert km to meters
        },
      },
      isActive: true,
    }).populate("carbonProjects", "projectId name status");

    res.json(farmers);
  } catch (error) {
    console.error("Error fetching farmers by location:", error);
    res.status(500).json({ error: "Failed to fetch farmers by location" });
  }
};

// Get farmer statistics
export const getFarmerStats: RequestHandler = async (req, res) => {
  try {
    const stats = await Farmer.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { isActive: true } }, { $count: "count" }],
          byState: [
            { $match: { isActive: true } },
            { $group: { _id: "$location.state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byGender: [
            { $match: { isActive: true, "profile.gender": { $ne: null } } },
            { $group: { _id: "$profile.gender", count: { $sum: 1 } } },
          ],
          totalFarmArea: [
            { $match: { isActive: true } },
            {
              $group: { _id: null, total: { $sum: "$farmDetails.totalArea" } },
            },
          ],
          recentRegistrations: [
            {
              $match: {
                registrationDate: {
                  $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const result = stats[0];

    res.json({
      totalFarmers: result.total[0]?.count || 0,
      activeFarmers: result.active[0]?.count || 0,
      totalFarmArea: result.totalFarmArea[0]?.total || 0,
      recentRegistrations: result.recentRegistrations[0]?.count || 0,
      farmersByState: result.byState,
      farmersByGender: result.byGender,
    });
  } catch (error) {
    console.error("Error fetching farmer statistics:", error);
    res.status(500).json({ error: "Failed to fetch farmer statistics" });
  }
};
