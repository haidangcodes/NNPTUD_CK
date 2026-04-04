const Application = require('../schemas/applications');
const Job = require('../schemas/jobs');
const Profile = require('../schemas/profiles');

const applyToJob = async (req, res) => {
  try {
    const { jobId, cvUrl } = req.body;

    if (!jobId || !cvUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'jobId and cvUrl are required'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    if (job.status !== 'ACTIVE') {
      return res.status(400).json({
        status: 'error',
        message: 'Job is not active'
      });
    }

    const existingApplication = await Application.findOne({
      jobId,
      candidateId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied to this job'
      });
    }

    const application = new Application({
      jobId,
      candidateId: req.user.id,
      cvUrl,
      status: 'APPLIED'
    });

    await application.save();

    return res.status(201).json({
      status: 'success',
      data: application,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user.id })
      .populate('jobId', 'title salaryRange')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: applications,
      message: 'My applications retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getApplicationsByJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    const company = await require('../schemas/companies').findOne({ userId: req.user.id });
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && (!company || job.companyId.toString() !== company._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: applications,
      message: 'Applications retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    const job = await Job.findById(application.jobId);
    const company = await require('../schemas/companies').findOne({ userId: req.user.id });
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && (!company || job.companyId.toString() !== company._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      status: 'success',
      data: application,
      message: 'Application status updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title description companyId')
      .populate('candidateId', 'email');

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: application,
      message: 'Application retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    const isOwner = application.candidateId.toString() === req.user.id;
    const isRecruiter = req.user.role === 'RECRUITER';
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  getApplicationById,
  deleteApplication
};
