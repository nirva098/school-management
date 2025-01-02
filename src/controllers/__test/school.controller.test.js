const request = require('supertest');
const express = require('express');
const School = require('../../models/school.model');
const schoolController = require('../school.controller');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = { id: 'userId' }; // Mock req.user for all routes
  next();
});
app.post('/schools', schoolController.createSchool);
app.get('/schools', schoolController.getSchools);
app.put('/schools/:id', schoolController.updateSchool);
app.delete('/schools/:id', schoolController.deleteSchool);

jest.mock('../../models/school.model');

describe('School Controller', () => {
  describe('createSchool', () => {
    it('should create a new school successfully', async () => {
      School.prototype.save = jest.fn().mockResolvedValue({
        name: 'School A',
        address: '123 Street',
        contact: '1234567890',
        createdBy: 'userId'
      });

      const res = await request(app)
        .post('/schools')
        .send({ name: 'School A', address: '123 Street', contact: '1234567890' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'School A');
    });

    it('should return 500 if there is an error during creation', async () => {
      School.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/schools')
        .send({ name: 'School A', address: '123 Street', contact: '1234567890' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('getSchools', () => {
    it('should get schools successfully', async () => {
      School.find = jest.fn().mockResolvedValue([{ name: 'School A' }]);

      const res = await request(app).get('/schools');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(expect.arrayContaining([{ name: 'School A' }]));
    });

    it('should return 500 if there is an error during fetching', async () => {
      School.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/schools');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('updateSchool', () => {
    it('should update a school successfully', async () => {
      School.findByIdAndUpdate = jest.fn().mockResolvedValue({ name: 'School A Updated' });

      const res = await request(app)
        .put('/schools/schoolId')
        .send({ name: 'School A Updated' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'School A Updated');
    });

    it('should return 404 if school not found', async () => {
      School.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put('/schools/schoolId')
        .send({ name: 'School A Updated' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'School not found');
    });

    it('should return 500 if there is an error during update', async () => {
      School.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/schools/schoolId')
        .send({ name: 'School A Updated' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });

  describe('deleteSchool', () => {
    it('should delete a school successfully', async () => {
      School.findByIdAndDelete = jest.fn().mockResolvedValue({ name: 'School A' });

      const res = await request(app).delete('/schools/schoolId');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'School deleted successfully');
    });

    it('should return 404 if school not found', async () => {
      School.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete('/schools/schoolId');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'School not found');
    });

    it('should return 500 if there is an error during deletion', async () => {
      School.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/schools/schoolId');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Database error');
    });
  });
});
