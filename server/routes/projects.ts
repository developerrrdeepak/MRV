import { RequestHandler } from "express";
import { CarbonProject, ICarbonProject } from "../models/CarbonProject";
import { Farmer } from "../models/Farmer";
import { FieldMeasurement } from "../models/FieldMeasurement";
import { Verification } from "../models/Verification";

// Get all carbon projects with pagination and filtering
export const getProjects: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Filtering options
    const filter: any = {};
    if (req.query.projectType) filter.projectType = req.query.projectType;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.state) filter['location.state'] = req.query.state;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    // Search by name or project ID
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      filter.$or = [
        { name: { $regex: searchRegex } },
        { projectId: { $regex: searchRegex } }
      ];
    }

    const projects = await CarbonProject.find(filter)
      .populate('participants.farmers', 'name farmerId location.state location.district')
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await CarbonProject.countDocuments(filter);

    res.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get single project by ID
export const getProjectById: RequestHandler = async (req, res) => {
  try {
    const project = await CarbonProject.findById(req.params.id)
      .populate('participants.farmers', 'name farmerId phone location farmDetails')
      .lean();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get additional project statistics
    const measurementCount = await FieldMeasurement.countDocuments({ project: project._id });
    const verificationCount = await Verification.countDocuments({ project: project._id });
    
    res.json({
      ...project,
      statistics: {
        totalMeasurements: measurementCount,
        totalVerifications: verificationCount,
        participantCount: project.participants.farmers.length
      }
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Get project by project ID
export const getProjectByProjectId: RequestHandler = async (req, res) => {
  try {
    const project = await CarbonProject.findOne({ projectId: req.params.projectId.toUpperCase() })
      .populate('participants.farmers', 'name farmerId phone location')
      .lean();

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create new carbon project
export const createProject: RequestHandler = async (req, res) => {
  try {
    // Generate project ID if not provided
    if (!req.body.projectId) {
      const count = await CarbonProject.countDocuments();
      const typePrefix = req.body.projectType?.substring(0, 3).toUpperCase() || 'CRB';
      req.body.projectId = `${typePrefix}${String(count + 1).padStart(4, '0')}`;
    }

    const project = new CarbonProject(req.body);
    await project.save();

    res.status(201).json(project);
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        error: `Project with this ${field} already exists`,
        field,
        value: error.keyValue[field]
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Update project
export const updateProject: RequestHandler = async (req, res) => {
  try {
    const project = await CarbonProject.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    ).populate('participants.farmers');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error: any) {
    console.error('Error updating project:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete project (soft delete)
export const deleteProject: RequestHandler = async (req, res) => {
  try {
    const project = await CarbonProject.findByIdAndUpdate(
      req.params.id,
      { isActive: false, lastUpdated: new Date() },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deactivated successfully', project });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Add farmers to project
export const addFarmersToProject: RequestHandler = async (req, res) => {
  try {
    const { farmerIds } = req.body;
    const projectId = req.params.id;

    if (!Array.isArray(farmerIds) || farmerIds.length === 0) {
      return res.status(400).json({ error: 'farmerIds must be a non-empty array' });
    }

    // Verify farmers exist
    const farmers = await Farmer.find({ _id: { $in: farmerIds } });
    if (farmers.length !== farmerIds.length) {
      return res.status(400).json({ error: 'One or more farmers not found' });
    }

    // Update project
    const project = await CarbonProject.findByIdAndUpdate(
      projectId,
      { 
        $addToSet: { 'participants.farmers': { $each: farmerIds } },
        lastUpdated: new Date()
      },
      { new: true }
    ).populate('participants.farmers');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update farmers to reference this project
    await Farmer.updateMany(
      { _id: { $in: farmerIds } },
      { 
        $addToSet: { carbonProjects: projectId },
        lastUpdated: new Date()
      }
    );

    res.json(project);
  } catch (error) {
    console.error('Error adding farmers to project:', error);
    res.status(500).json({ error: 'Failed to add farmers to project' });
  }
};

// Remove farmer from project
export const removeFarmerFromProject: RequestHandler = async (req, res) => {
  try {
    const { projectId, farmerId } = req.params;

    // Update project
    const project = await CarbonProject.findByIdAndUpdate(
      projectId,
      { 
        $pull: { 'participants.farmers': farmerId },
        lastUpdated: new Date()
      },
      { new: true }
    ).populate('participants.farmers');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update farmer
    await Farmer.findByIdAndUpdate(
      farmerId,
      { 
        $pull: { carbonProjects: projectId },
        lastUpdated: new Date()
      }
    );

    res.json(project);
  } catch (error) {
    console.error('Error removing farmer from project:', error);
    res.status(500).json({ error: 'Failed to remove farmer from project' });
  }
};

// Get project carbon metrics and progress
export const getProjectMetrics: RequestHandler = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await CarbonProject.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get measurements for carbon calculation
    const measurements = await FieldMeasurement.find({ project: projectId })
      .populate('farmer', 'name farmerId')
      .sort({ measurementDate: -1 });

    // Get latest verification
    const latestVerification = await Verification.findOne({ project: projectId })
      .sort({ 'timeline.contractDate': -1 });

    // Calculate current carbon metrics
    let totalCarbonStored = 0;
    let totalCarbonEmitted = 0;
    
    measurements.forEach(measurement => {
      if (measurement.carbonCalculation) {
        totalCarbonStored += measurement.carbonCalculation.carbonStored;
        totalCarbonEmitted += measurement.carbonCalculation.carbonEmitted || 0;
      }
    });

    const netCarbonReduction = totalCarbonStored - totalCarbonEmitted;

    // Calculate project progress
    const totalActivities = project.activities.length;
    const completedActivities = project.activities.filter(activity => 
      activity.completedArea && activity.completedArea >= activity.targetArea
    ).length;

    const progressPercentage = totalActivities > 0 ? 
      (completedActivities / totalActivities) * 100 : 0;

    res.json({
      project: {
        projectId: project.projectId,
        name: project.name,
        status: project.status,
        projectType: project.projectType
      },
      carbonMetrics: {
        baseline: project.carbonMetrics.baselineEmissions,
        projected: project.carbonMetrics.projectedReductions,
        actual: netCarbonReduction,
        verified: latestVerification?.findings.carbonReductions.verified || 0,
        efficiency: netCarbonReduction / project.financials.totalBudget
      },
      progress: {
        percentage: progressPercentage,
        completedActivities,
        totalActivities,
        participantCount: project.participants.farmers.length,
        measurementCount: measurements.length
      },
      timeline: {
        startDate: project.timeline.startDate,
        endDate: project.timeline.endDate,
        daysRemaining: Math.ceil(
          (new Date(project.timeline.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      },
      financials: {
        totalBudget: project.financials.totalBudget,
        spentAmount: project.financials.spentAmount || 0,
        carbonPrice: project.financials.carbonPrice,
        potentialRevenue: netCarbonReduction * project.financials.carbonPrice
      }
    });
  } catch (error) {
    console.error('Error fetching project metrics:', error);
    res.status(500).json({ error: 'Failed to fetch project metrics' });
  }
};

// Get project statistics
export const getProjectStats: RequestHandler = async (req, res) => {
  try {
    const stats = await CarbonProject.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [{ $match: { isActive: true } }, { $count: "count" }],
          byType: [
            { $match: { isActive: true } },
            { $group: { _id: "$projectType", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
          ],
          byStatus: [
            { $match: { isActive: true } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          totalBudget: [
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$financials.totalBudget" } } }
          ],
          totalProjectedReductions: [
            { $match: { isActive: true } },
            { $group: { _id: null, total: { $sum: "$carbonMetrics.projectedReductions" } } }
          ],
          recentProjects: [
            { 
              $match: { 
                createdDate: { 
                  $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                } 
              } 
            },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = stats[0];
    
    res.json({
      totalProjects: result.total[0]?.count || 0,
      activeProjects: result.active[0]?.count || 0,
      totalBudget: result.totalBudget[0]?.total || 0,
      totalProjectedReductions: result.totalProjectedReductions[0]?.total || 0,
      recentProjects: result.recentProjects[0]?.count || 0,
      projectsByType: result.byType,
      projectsByStatus: result.byStatus
    });
  } catch (error) {
    console.error('Error fetching project statistics:', error);
    res.status(500).json({ error: 'Failed to fetch project statistics' });
  }
};
