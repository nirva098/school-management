const request = require('supertest');
const express = require('express');
const Student = require('../../models/student.model');
const studentController = require('../student.controller');

const app = express();
app.use(express.json());
app.post('/students', studentController.enrollStudent);
app.get('/students', studentController.getStudentsByClassroom);
app.put('/students/:id', studentController.updateStudentDetails);
app.delete('/students/:id', studentController.deleteStudent);
app.put('/students/:id/transfer', studentController.transferStudent);

jest.mock('../../models/student.model');

describe('Student Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enrollStudent', () => {
    it('should enroll a new student successfully', async () => {
      Student.prototype.save = jest.fn().mockResolvedValue({ name: 'Student A' });

      const res = await request(app)
        .post('/students')
        .send({ name: 'Student A', age: 10, classroomId: 'classroomId' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Student A');
    });

    it('should return 500 if there is an error during enrollment', async () => {
      Student.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/students')
        .send({ name: 'Student A', age: 10, classroomId: 'classroomId' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('getStudentsByClassroom', () => {
    it('should get students by classroom successfully', async () => {
      Student.find = jest.fn().mockResolvedValue([{ name: 'Student A' }]);

      const res = await request(app).get('/students').query({ classroomId: 'classroomId' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(expect.arrayContaining([{ name: 'Student A' }]));
    });

    it('should return 500 if there is an error during fetching', async () => {
      Student.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/students').query({ classroomId: 'classroomId' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('updateStudentDetails', () => {
    it('should update student details successfully', async () => {
      Student.findByIdAndUpdate = jest.fn().mockResolvedValue({ name: 'Student A Updated' });

      const res = await request(app)
        .put('/students/studentId')
        .send({ name: 'Student A Updated' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Student A Updated');
    });

    it('should return 404 if student not found', async () => {
      Student.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put('/students/studentId')
        .send({ name: 'Student A Updated' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });

    it('should return 500 if there is an error during update', async () => {
      Student.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/students/studentId')
        .send({ name: 'Student A Updated' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student successfully', async () => {
      Student.findByIdAndDelete = jest.fn().mockResolvedValue({ name: 'Student A' });

      const res = await request(app).delete('/students/studentId');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Student deleted successfully');
    });

    it('should return 404 if student not found', async () => {
      Student.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete('/students/studentId');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });

    it('should return 500 if there is an error during deletion', async () => {
      Student.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/students/studentId');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('transferStudent', () => {
    it('should transfer a student successfully', async () => {
      Student.findByIdAndUpdate = jest.fn().mockResolvedValue({
        name: 'Student A',
        classroomId: 'newClassroomId',
      });

      const res = await request(app)
        .put('/students/studentId/transfer')
        .send({ classroomId: 'newClassroomId' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('classroomId', 'newClassroomId');
    });

    it('should return 404 if student not found', async () => {
      Student.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put('/students/studentId/transfer')
        .send({ classroomId: 'newClassroomId' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Student not found');
    });

    it('should return 500 if there is an error during transfer', async () => {
      Student.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/students/studentId/transfer')
        .send({ classroomId: 'newClassroomId' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });
});
