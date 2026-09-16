import mongoose from "mongoose";

import Skill from "../models/Skill.js";
import ApiError from "../utils/apiError.js";

export const createSkill = async (skillData) => {
  const name = skillData.name.trim();
  const category = skillData.category.toLowerCase();

  const existingSkill = await Skill.findOne({
    name,
    category,
  });

  if (existingSkill) {
    throw new ApiError(409, "This skill already exists in this category");
  }

  const skill = await Skill.create({
    ...skillData,
    name,
    category,
  });

  return skill;
};

export const getAllSkills = async ({ category, activeOnly = false } = {}) => {
  const filter = {};

  if (category) {
    filter.category = category.toLowerCase();
  }

  if (activeOnly) {
    filter.isActive = true;
  }

  const skills = await Skill.find(filter).sort({
    category: 1,
    featured: -1,
    order: 1,
    name: 1,
  });

  return skills;
};

export const getSkillById = async (skillId) => {
  if (!mongoose.Types.ObjectId.isValid(skillId)) {
    throw new ApiError(400, "Invalid skill ID");
  }

  const skill = await Skill.findById(skillId);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  return skill;
};

export const updateSkill = async (skillId, skillData) => {
  if (!mongoose.Types.ObjectId.isValid(skillId)) {
    throw new ApiError(400, "Invalid skill ID");
  }

  const skill = await Skill.findById(skillId);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  const name =
    skillData.name !== undefined ? skillData.name.trim() : skill.name;

  const category =
    skillData.category !== undefined
      ? skillData.category.toLowerCase()
      : skill.category;

  const duplicateSkill = await Skill.findOne({
    name,
    category,
    _id: {
      $ne: skillId,
    },
  });

  if (duplicateSkill) {
    throw new ApiError(409, "This skill already exists in this category");
  }

  Object.assign(skill, {
    ...skillData,
    name,
    category,
  });

  await skill.save();

  return skill;
};

export const deleteSkill = async (skillId) => {
  if (!mongoose.Types.ObjectId.isValid(skillId)) {
    throw new ApiError(400, "Invalid skill ID");
  }

  const skill = await Skill.findById(skillId);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  await skill.deleteOne();

  return skill;
};
