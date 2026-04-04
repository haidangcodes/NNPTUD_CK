const Blog = require('../schemas/blogs');

const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const blogs = await Blog.find()
      .populate('authorId', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments();

    return res.status(200).json({
      status: 'success',
      data: {
        blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      message: 'Blogs retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('authorId', 'email');

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: blog,
      message: 'Blog retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, thumbnailUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        status: 'error',
        message: 'title and content are required'
      });
    }

    const blog = new Blog({
      authorId: req.user.id,
      title,
      content,
      thumbnailUrl
    });

    await blog.save();

    return res.status(201).json({
      status: 'success',
      data: blog,
      message: 'Blog created successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }

    if (blog.authorId.toString() !== req.user.id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const { title, content, thumbnailUrl } = req.body;

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (thumbnailUrl !== undefined) blog.thumbnailUrl = thumbnailUrl;

    await blog.save();

    return res.status(200).json({
      status: 'success',
      data: blog,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        status: 'error',
        message: 'Blog not found'
      });
    }

    if (blog.authorId.toString() !== req.user.id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
