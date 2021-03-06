/**
 * API Endpoint Tests for User Sign In and Sign Up
 */
import supertest from 'supertest';
import chai from 'chai';
import app from '../app';
import data from './testData/user.data';

export const request = supertest(app);
export const { expect } = chai;
export const wrongToken = 'ThisIsAWrongToken';

const userOneToken = { token: null };

describe('test cases for user sign up and sign in operations', () => {
  describe('sign up positive test cases', () => {
    it('should be able to create a new user account successfully', (done) => {
      request.post('/api/v1/users/signup')
        .send(data.validData1)
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect(response.body).to.haveOwnProperty('token');
          expect('Successfully created account').to.equal(response.body.message);
          expect(response.body.user).deep.equal({
            id: 1,
            username: 'chyke',
            email: 'hyginuschinwoke@gmail.com'
          });
          if (error) done(error);
          done();
        });
    });
    it(
      'should be able to create another new user account successfully',
      (done) => {
        request.post('/api/v1/users/signup')
          .set('Content-Type', 'application/json')
          .send(data.validData2)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect(response.body).to.haveOwnProperty('token');
            expect('Successfully created account').to.equal(response.body.message);
            expect(response.body.user).deep.equal({
              id: 2,
              username: 'annie',
              email: 'annie@yahoo.com'
            });
            if (error) done(error);
            done();
          });
      }
    );
  });
  describe('sign up negative test cases', () => {
    it('should not be able to create a new account when one or more' +
      'field(s) is(are) undefined(missing)', (done) => {
      request.post('/api/v1/users/signup')
        .send(data.incompleteData)
        .end((error, response) => {
          expect(response.status).to.equal(422);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'All or some fields are not defined'
          });
          if (error) done(error);
          done();
        });
    });
    it(
      'should not be able to create a new account with empty input fields',
      (done) => {
        request.post('/api/v1/users/signup')
          .send(data.emptyData)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect('Full name is required').to.equal(response.body.errors.fullName);
            expect('Username is required').to.equal(response.body.errors.username);
            if (error) done(error);
            done();
          });
      }
    );
    it('should not be able to create a new account when fullname field' +
      'contains number(s), username field starts with a number, email field' +
      'is invalid and password length is not between 8 and 30', (done) => {
      request.post('/api/v1/users/signup')
        .send(data.improperData)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect('Full name must contain only alphabets')
            .to.equal(response.body.errors.fullName);
          expect('Username must not start with number(s)')
            .to.equal(response.body.errors.username);
          expect('Email is invalid').to.equal(response.body.errors.email);
          expect('Password length must be between 8 and 30')
            .to.equal(response.body.errors.password);
          if (error) done(error);
          done();
        });
    });
    it(`should not be able to create a new account with short username and mismatching
      password and confirm password fields`, (done) => {
        request.post('/api/v1/users/signup')
          .send(data.improperData2)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect('Username must be atleast 3 to 25 characters')
              .to.equal(response.body.errors.username);
            expect('Passwords does not matched')
              .to.equal(response.body.errors.repassword);
            if (error) done(error);
            done();
          });
      });
    it('should not be able to create a new account with existing' +
      'username record', (done) => {
      request.post('/api/v1/users/signup')
        .send(data.existingUsername)
        .end((error, response) => {
          expect(response.status).to.equal(409);
          expect(response.body).deep.equal({
            status: 'Failed',
            errors: {
              username: 'Username already exist'
            }
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to create a new account with existing' +
      'email record', (done) => {
      request.post('/api/v1/users/signup')
        .send(data.existingEmail)
        .end((error, response) => {
          expect(response.status).to.equal(409);
          expect(response.body).deep.equal({
            status: 'Failed',
            errors: {
              email: 'Email already exist'
            }
          });
          if (error) done(error);
          done();
        });
    });
  });

  describe('sign in negative test cases', () => {
    it('should not be able to login the user when one or more field(s)' +
      'is(are) undefined(missing)', (done) => {
      request.post('/api/v1/users/signin')
        .send({ password: 'ilovecoding' })
        .end((error, response) => {
          expect(response.status).to.equal(422);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Username or(and) password field(s) is(are) not defined'
          });
          if (error) done(error);
          done();
        });
    });
    it(
      'should not be able to login the user with empty input fields',
      (done) => {
        request.post('/api/v1/users/signin')
          .send(data.emptyLoginData)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect('Username is required')
              .to.equal(response.body.errors.username);
            expect('Password is required')
              .to.equal(response.body.errors.password);
            if (error) done(error);
            done();
          });
      }
    );
    it('should not be able to login the user with wrong username', (done) => {
      request.post('/api/v1/users/signin')
        .send(data.invalidUsername)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          expect(response.body).deep.equal({
            status: 'Failed',
            errors: {
              form: 'Invalid username or password'
            }
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to login with wrong password', (done) => {
      request.post('/api/v1/users/signin')
        .send(data.invalidPassword)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          expect(response.body).deep.equal({
            status: 'Failed',
            errors: {
              form: 'Invalid username or password'
            }
          });
          if (error) done(error);
          done();
        });
    });
  });
  describe('sign in positive test case', () => {
    it('should be able to login to the application' +
      'with valid credentials', (done) => {
      request.post('/api/v1/users/signin')
        .send(data.userOneLogin)
        .end((error, response) => {
          userOneToken.token = response.body.token;
          expect(response.status).to.equal(200);
          expect(response.body).to.haveOwnProperty('token');
          expect(response.body.user).deep.equal({
            id: 1,
            username: 'chyke',
            email: 'hyginuschinwoke@gmail.com'
          });
          expect('You are now logged In').to.equal(response.body.message);
          done();
        });
    });
  });
  describe('get user profile details test cases', () => {
    it('should not be able to access the profile page when security' +
      'token is undefined(not set)', (done) => {
      request.get('/api/v1/user/profile')
        .end((error, response) => {
          expect(response.status).to.equal(403);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Access denied. You are not logged in'
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to access the profile page with a wrong' +
      'security token', (done) => {
      request.get('/api/v1/user/profile')
        .set('x-access-token', wrongToken)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Authentication failed. Token is invalid or expired'
          });
          if (error) done(error);
          done();
        });
    });
    it('should be able to get all user\'s current information', (done) => {
      request.get('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body.user).deep.equal({
            id: 1,
            fullName: 'Hyginus Chinwoke',
            username: 'chyke',
            email: 'hyginuschinwoke@gmail.com',
            profileImage: null,
            location: null,
            aboutMe: null
          });
          expect('User found').to.equal(response.body.message);
          done();
        });
    });
  });
  describe('update user profile details test cases', () => {
    it('should not be able to update user profile when one or more' +
      'field(s) is(are) undefined(missing)', (done) => {
      request.put('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .send(data.incompleteData)
        .end((error, response) => {
          expect(response.status).to.equal(422);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'All or some fields are not defined'
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to update user profile when required' +
      'fields are empty', (done) => {
      request.put('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .send(data.improperUpdateData1)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          if (error) done(error);
          done();
        });
    });
    it('should not be able to update user profile when full name contains' +
      'number(s), username starts with number(s), email is invalid, his/her' +
      'location contains number(2) and his/her about me details is too' +
      'short', (done) => {
      request.put('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .send(data.improperUpdateData2)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect('Full name must contain only alphabets')
            .to.equal(response.body.errors.fullName);
          expect('Username must not start with number(s)')
            .to.equal(response.body.errors.username);
          expect('Email is invalid').to.equal(response.body.errors.email);
          expect('Provided location must contain only alphabets')
            .to.equal(response.body.errors.location);
          expect('Provided description must be atleast 4 characters')
            .to.equal(response.body.errors.aboutMe);
          if (error) done(error);
          done();
        });
    });
    it('should not be able to update user profile when username is too' +
      'short and email is invalid', (done) => {
      request.put('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .send(data.improperUpdateData3)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.errors).deep.equal({
            username: 'Username must be atleast 3 to 25 characters',
            email: 'Email is invalid'
          });
          if (error) done(error);
          done();
        });
    });
    it('should be able to update user profile with valid information', (done) => {
      request.put('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .send(data.validUpdateData1)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect('Successfully updated profile')
            .to.equal(response.body.message);
          expect(response.body.updatedUser).deep.equal({
            id: 1,
            fullName: 'Hyginus Chinwoke',
            username: 'chyke',
            email: 'chyke@gmail.com',
            profileImage: null,
            location: 'lagos',
            aboutMe: 'I am just a cool dude'
          });
          if (error) done(error);
          done();
        });
    });
  });
});

export default userOneToken;
