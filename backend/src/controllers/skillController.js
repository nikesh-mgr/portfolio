import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../services/skillService.js";

import ApiError from "../utils/apiError.js";

import {
  createSkillSchema,
  updateSkillSchema,
} from "../validators/skillValidator.js";

/**
 * POST /api/skills
 */
export const createSkillController = async (req, res) => {
  const result = createSkillSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    throw new ApiError(400, "Validation failed", errors);
  }

  const skill = await createSkill(result.data);

  res.status(201).json({
    success: true,
    message: "Skill created successfully",
    skill,
  });
};

/**
 * GET /api/skills
 */
export const getSkills = async (req, res) => {
  const { category } = req.query;

  const skills = await getAllSkills({
    category,
    activeOnly: !req.admin,
  });

  res.status(200).json({
    success: true,
    count: skills.length,
    skills,
  });
};

/**
 * GET /api/skills/:id
 */
export const getSkill = async (req, res) => {
  const skill = await getSkillById(req.params.id);
  if (!req.admin && !skill.isActive) throw new ApiError(404, "Skill not found");

  res.status(200).json({
    success: true,
    skill,
  });
};

/**
 * PATCH /api/skills/:id
 */
export const updateSkillController = async (req, res) => {
  const result = updateSkillSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    throw new ApiError(400, "Validation failed", errors);
  }

  const skill = await updateSkill(req.params.id, result.data);

  res.status(200).json({
    success: true,
    message: "Skill updated successfully",
    skill,
  });
};

/**
 * DELETE /api/skills/:id
 */
export const deleteSkillController = async (req, res) => {
  await deleteSkill(req.params.id);

  res.status(200).json({
    success: true,
    message: "Skill deleted successfully",
  });
};
