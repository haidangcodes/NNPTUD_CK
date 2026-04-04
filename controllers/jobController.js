const Job = require('../schemas/jobs');
const Company = require('../schemas/companies');

const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, title, status } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'ACTIVE';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(filter)
      .populate('companyId', 'name logoUrl address')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    return res.status(200).json({
      status: 'success',
      data: {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      message: 'Jobs retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'name logoUrl address description website')
      .populate('categoryId', 'name');

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: job,
      message: 'Job retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    const { categoryId, title, description, requirements, salaryRange, status } = req.body;

    if (!categoryId || !title || !description || !requirements) {
      return res.status(400).json({
        status: 'error',
        message: 'categoryId, title, description, and requirements are required'
      });
    }

    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(400).json({
        status: 'error',
        message: 'Company profile not found'
      });
    }

    if (company.status !== 'APPROVED') {
      return res.status(403).json({
        status: 'error',
        message: 'Your company must be approved to post jobs'
      });
    }

    const job = new Job({
      companyId: company._id,
      categoryId,
      title,
      description,
      requirements,
      salaryRange,
      status: status || 'DRAFT'
    });

    await job.save();

    return res.status(201).json({
      status: 'success',
      data: job,
      message: 'Job created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    const company = await Company.findOne({ userId: req.user.id });
    if (!company || job.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update your own jobs'
      });
    }

    const { categoryId, title, description, requirements, salaryRange, status } = req.body;

    if (categoryId !== undefined) job.categoryId = categoryId;
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;
    if (salaryRange !== undefined) job.salaryRange = salaryRange;
    if (status !== undefined) job.status = status;

    await job.save();

    return res.status(200).json({
      status: 'success',
      data: job,
      message: 'Job updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    const company = await Company.findOne({ userId: req.user.id });
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && (!company || job.companyId.toString() !== company._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own jobs'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(400).json({
        status: 'error',
        message: 'Company profile not found'
      });
    }

    const jobs = await Job.find({ companyId: company._id })
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: jobs,
      message: 'My jobs retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};
