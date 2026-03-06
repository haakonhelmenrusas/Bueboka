import { OperationHandler, syncManager } from '@/services/offline/syncManager';
import { arrowsRepository } from '@/services/repositories/arrowsRepository';
import { bowRepository } from '@/services/repositories/bowRepository';
import { practiceRepository } from '@/services/repositories/practiceRepository';
import { sightMarksRepository } from '@/services/repositories/sightMarksRepository';
import { userRepository } from '@/services/repositories/userRepository';

/**
 * Register all offline operation handlers
 */
export function registerOfflineHandlers() {
  // Bow handlers
  syncManager.registerHandler('bows/create', handleCreateBow);
  syncManager.registerHandler('bows/update', handleUpdateBow);
  syncManager.registerHandler('bows/delete', handleDeleteBow);
  syncManager.registerHandler('bows/toggleFavorite', handleToggleFavoriteBow);

  // Arrows handlers
  syncManager.registerHandler('arrows/create', handleCreateArrows);
  syncManager.registerHandler('arrows/update', handleUpdateArrows);
  syncManager.registerHandler('arrows/delete', handleDeleteArrows);
  syncManager.registerHandler('arrows/toggleFavorite', handleToggleFavoriteArrows);

  // Practice handlers
  syncManager.registerHandler('practices/create', handleCreatePractice);
  syncManager.registerHandler('practices/update', handleUpdatePractice);
  syncManager.registerHandler('practices/delete', handleDeletePractice);
  syncManager.registerHandler('practices/addEnd', handleAddEnd);
  syncManager.registerHandler('practices/updateEnd', handleUpdateEnd);
  syncManager.registerHandler('practices/deleteEnd', handleDeleteEnd);

  // SightMarks handlers
  syncManager.registerHandler('sightMarks/createMark', handleCreateSightMark);
  syncManager.registerHandler('sightMarks/updateMark', handleUpdateSightMark);
  syncManager.registerHandler('sightMarks/deleteMark', handleDeleteSightMark);
  syncManager.registerHandler('sightMarks/createResult', handleCreateSightMarkResult);
  syncManager.registerHandler('sightMarks/deleteResult', handleDeleteSightMarkResult);
  syncManager.registerHandler('sightMarks/createSpec', handleCreateBowSpecification);

  // User handlers
  syncManager.registerHandler('user/update', handleUpdateUser);
}

// Bow handlers
const handleCreateBow: OperationHandler = async (op) => {
  await bowRepository.create(op.payload);
};

const handleUpdateBow: OperationHandler = async (op) => {
  const { id, ...data } = op.payload;
  await bowRepository.update(id, data);
};

const handleDeleteBow: OperationHandler = async (op) => {
  await bowRepository.delete(op.payload.id);
};

const handleToggleFavoriteBow: OperationHandler = async (op) => {
  const { id, isFavorite } = op.payload;
  await bowRepository.toggleFavorite(id, isFavorite);
};

// Arrows handlers
const handleCreateArrows: OperationHandler = async (op) => {
  await arrowsRepository.create(op.payload);
};

const handleUpdateArrows: OperationHandler = async (op) => {
  const { id, ...data } = op.payload;
  await arrowsRepository.update(id, data);
};

const handleDeleteArrows: OperationHandler = async (op) => {
  await arrowsRepository.delete(op.payload.id);
};

const handleToggleFavoriteArrows: OperationHandler = async (op) => {
  const { id, isFavorite } = op.payload;
  await arrowsRepository.toggleFavorite(id, isFavorite);
};

// Practice handlers
const handleCreatePractice: OperationHandler = async (op) => {
  await practiceRepository.create(op.payload);
};

const handleUpdatePractice: OperationHandler = async (op) => {
  const { id, ...data } = op.payload;
  await practiceRepository.update(id, data);
};

const handleDeletePractice: OperationHandler = async (op) => {
  await practiceRepository.delete(op.payload.id);
};

const handleAddEnd: OperationHandler = async (op) => {
  const { practiceId, ...endData } = op.payload;
  await practiceRepository.addEnd(practiceId, endData);
};

const handleUpdateEnd: OperationHandler = async (op) => {
  const { practiceId, endId, ...endData } = op.payload;
  await practiceRepository.updateEnd(practiceId, endId, endData);
};

const handleDeleteEnd: OperationHandler = async (op) => {
  const { practiceId, endId } = op.payload;
  await practiceRepository.deleteEnd(practiceId, endId);
};

// SightMarks handlers
const handleCreateSightMark: OperationHandler = async (op) => {
  await sightMarksRepository.create(op.payload);
};

const handleUpdateSightMark: OperationHandler = async (op) => {
  const { id, ...data } = op.payload;
  await sightMarksRepository.update(id, data);
};

const handleDeleteSightMark: OperationHandler = async (op) => {
  await sightMarksRepository.delete(op.payload.id);
};

const handleCreateSightMarkResult: OperationHandler = async (op) => {
  const { sightMarkId, ...data } = op.payload;
  await sightMarksRepository.createResult(sightMarkId, data);
};

const handleDeleteSightMarkResult: OperationHandler = async (op) => {
  await sightMarksRepository.deleteResult(op.payload.id);
};

const handleCreateBowSpecification: OperationHandler = async (op) => {
  await sightMarksRepository.createSpecification(op.payload);
};

// User handlers
const handleUpdateUser: OperationHandler = async (op) => {
  await userRepository.updateProfile(op.payload);
};
