const request = require('supertest');
const express = require('express');
const Classroom = require('../../models/classroom.model');
const classroomController = require('../classroom.controller');

const app = express();
app.use(express.json());
app.post('/classrooms', classroomController.createClassroom);
app.get('/classrooms', classroomController.getClassrooms);
app.put('/classrooms/:id', classroomController.updateClassroom);
app.delete('/classrooms/:id', classroomController.deleteClassroom);

jest.mock('../../models/classroom.model');

describe('Classroom Controller', () => {
  describe('createClassroom', () => {
    it('should create a new classroom successfully', async () => {
      Classroom.prototype.save = jest.fn().mockResolvedValue({ name: 'Class A' });

      const res = await request(app)
        .post('/classrooms')
        .send({ name: 'Class A', schoolId: 'schoolId', capacity: 30, resources: [] });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Class A');
    });

    it('should return 500 if there is an error during creation', async () => {
      Classroom.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/classrooms')
        .send({ name: 'Class A', schoolId: 'schoolId', capacity: 30, resources: [] });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('getClassrooms', () => {
    it('should get classrooms successfully', async () => {
      Classroom.find = jest.fn().mockResolvedValue([{ name: 'Class A' }]);

      const res = await request(app).get('/classrooms').query({ schoolId: 'schoolId' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(expect.arrayContaining([{ name: 'Class A' }]));
    });

    it('should return 500 if there is an error during fetching', async () => {
      Classroom.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/classrooms').query({ schoolId: 'schoolId' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('updateClassroom', () => {
    it('should update a classroom successfully', async () => {
      Classroom.findByIdAndUpdate = jest.fn().mockResolvedValue({ name: 'Class A Updated' });

      const res = await request(app)
        .put('/classrooms/classroomId')
        .send({ name: 'Class A Updated' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Class A Updated');
    });

    it('should return 404 if classroom not found', async () => {
      Classroom.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put('/classrooms/classroomId')
        .send({ name: 'Class A Updated' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Classroom not found');
    });

    it('should return 500 if there is an error during update', async () => {
      Classroom.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/classrooms/classroomId')
        .send({ name: 'Class A Updated' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('deleteClassroom', () => {
    it('should delete a classroom successfully', async () => {
      Classroom.findByIdAndDelete = jest.fn().mockResolvedValue({ name: 'Class A' });

      const res = await request(app).delete('/classrooms/classroomId');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Classroom deleted successfully');
    });

    it('should return 404 if classroom not found', async () => {
      Classroom.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete('/classrooms/classroomId');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Classroom not found');
    });

    it('should return 500 if there is an error during deletion', async () => {
      Classroom.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/classrooms/classroomId');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });
});
