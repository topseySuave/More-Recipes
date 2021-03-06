/**
 * API Endpoint Tests for providing Rewiews for Recipes
 */
import userOneToken, { request, expect } from './1_users.test';
import userData from './testData/user.data';
import data from './testData/review.data';


describe('test cases for reviewing a recipe', () => {
  describe('test cases for reviewing a recipe negative operations', () => {
    it('should not be able to create a review when review body' +
      'is missing(undefined)', (done) => {
      request.post('/api/v1/recipes/3/reviews')
        .set('x-access-token', userOneToken.token)
        .end((error, response) => {
          expect(response.status).to.equal(422);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Review for recipe is not defined or is missing'
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to create a review when the recipe id' +
      'is not a number', (done) => {
      request.post('/api/v1/recipes/yes/reviews')
        .set('x-access-token', userOneToken.token)
        .send(data.validData)
        .end((error, response) => {
          expect(response.status).to.equal(406);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Recipe ID must be a number'
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to create a review when the' +
      'review body is empty', (done) => {
      request.post('/api/v1/recipes/3/reviews')
        .set('x-access-token', userOneToken.token)
        .send(data.invalidData1)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect('Review for recipe is required')
            .to.equal(response.body.errors.reviewBody);
          if (error) done(error);
          done();
        });
    });
    it('should not be able to create a review when the review body' +
      'is empty', (done) => {
      request.post('/api/v1/recipes/3/reviews')
        .set('x-access-token', userOneToken.token)
        .send(data.invalidData2)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect('Review provided must be atleast 3 characters')
            .to.equal(response.body.errors.reviewBody);
          if (error) done(error);
          done();
        });
    });
    it('should not be able to create a review when the recipe has been' +
      'delete or does not exist', (done) => {
      request.post('/api/v1/recipes/5/reviews')
        .set('x-access-token', userOneToken.token)
        .send(data.validData)
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Recipe not found or has been deleted'
          });
          if (error) done(error);
          done();
        });
    });
  });
  describe('test cases for reviewing a recipe postive operations', () => {
    it('should be able to create a review with valid information' +
      'and token', (done) => {
      request.post('/api/v1/recipes/3/reviews')
        .set('x-access-token', userOneToken.token)
        .send(data.validData)
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect('Successfully posted review').to.equal(response.body.message);
          expect(response.body.postedReview).deep.equal({
            id: 1,
            reviewBody: data.validData.reviewBody,
            username: 'chyke',
            profileImage: null,
            userId: 1,
            recipeId: 3,
            updatedAt: response.body.postedReview.updatedAt,
            createdAt: response.body.postedReview.createdAt
          });
          if (error) done(error);
          done();
        });
    });
    it('should be able to update user profile with valid information', (done) => {
      request.put('/api/v1/user/profile')
        .set('x-access-token', userOneToken.token)
        .send(userData.validUpdateData1)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect('Successfully updated profile')
            .to.equal(response.body.message);
          if (error) done(error);
          done();
        });
    });
  });
});
