/**
 * API Endpoint Tests for Creating, Editing and Deleting Recipes
 */
import userOneToken, { request, expect, wrongToken } from './1_users.test';
import data from './testData/recipe.data';
import userData from './testData/user.data';

const userTwoToken = { token: null };


describe('test cases for creating, updating, deleting and retrieving' +
  'all or user recipes operations', () => {
  describe('test cases for creating recipe positive operations', () => {
    it('should be able to create recipe when all validations are met', (done) => {
      request.post('/api/v1/recipes')
        .set('x-access-token', userOneToken.token)
        .send(data.validData1)
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect('Successfully added new recipe')
            .to.equal(response.body.message);
          expect(Object.keys(response.body.recipe).length).to.equal(12);
          expect(response.body.recipe.title).to.equal(data.validData1.title);
          expect(response.body.recipe.hasOwnerViewed).to.equal(false);
          if (error) done(error);
          done();
        });
    });
    it('should be able to create another recipe when all' +
      'validations are met', (done) => {
      request.post('/api/v1/recipes')
        .set('x-access-token', userOneToken.token)
        .send(data.validData2)
        .end((error, response) => {
          expect(response.status).to.equal(201);
          expect('Successfully added new recipe')
            .to.equal(response.body.message);
          expect(Object.keys(response.body.recipe).length).to.equal(12);
          expect(response.body.recipe.title).to.equal(data.validData2.title);
          expect(response.body.recipe.hasOwnerViewed).to.equal(false);
          if (error) done(error);
          done();
        });
    });
  });
  describe('test cases for creating recipe negative operations', () => {
    it('should not be able to create recipe when one or more field(s)' +
      'is(are) undefined(missing)', (done) => {
      request.post('/api/v1/recipes')
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
    it('should not be able to create recipe with empty input fields', (done) => {
      request.post('/api/v1/recipes')
        .set('x-access-token', userOneToken.token)
        .send(data.emptyData)
        .end((error, response) => {
          expect(response.status).to.equal(400);
          expect(response.body.errors).deep.equal({
            title: 'Recipe title is required',
            ingredients: 'Recipe ingredients are required',
            procedures: 'Recipe procedures are required'
          });
          if (error) done(error);
          done();
        });
    });
    it(`Should not be able to create recipe when recipe title contains
      number(s), ingredients characters length is less than 20 and procedures
      characters length is less than 20`, (done) => {
        request.post('/api/v1/recipes')
          .set('x-access-token', userOneToken.token)
          .send(data.improperData1)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.errors).deep.equal({
              title: 'Recipe title must contain only alphabets',
              ingredients: 'Recipe ingredients provided must be ' +
              'at least 20 characters',
              procedures: 'Recipe procedures provided must ' +
              'be at least 20 characters'
            });
            if (error) done(error);
            done();
          });
      });
    it('should not be able to create recipe with an already exiting' +
      'recipe title', (done) => {
      request.post('/api/v1/recipes')
        .set('x-access-token', userOneToken.token)
        .send(data.validData2)
        .end((error, response) => {
          expect(response.status).to.equal(409);
          expect(response.body.message)
            .to.equal(`Recipe with title:${data.validData2.title}, already\
 exist in your catalog`);
          if (error) done(error);
          done();
        });
    });
  });
  describe('test cases for updating a recipe negative operations', () => {
    it('should not be able to update a recipe with Id not a number', (done) => {
      request.put('/api/v1/recipes/yes')
        .set('x-access-token', userOneToken.token)
        .send(data.validData1)
        .end((error, response) => {
          expect(response.status).to.equal(406);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Recipe ID must be a number'
          });
          done();
        });
    });

    it('should not be able to update recipe when no field(s) is(are)' +
      'provided', (done) => {
      request.put('/api/v1/recipes/2')
        .set('x-access-token', userOneToken.token)
        .send({ recipeImage: 'oracle.png' })
        .end((error, response) => {
          expect(response.status).to.equal(422);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Provide a field to update'
          });
          if (error) done(error);
          done();
        });
    });
    it(`Should not be able to update recipe when recipe title contains
      number(s), ingredients characters length is less than 20 and procedures
      characters length is less than 20`, (done) => {
        request.put('/api/v1/recipes/1')
          .set('x-access-token', userOneToken.token)
          .send(data.improperData2)
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.errors).deep.equal({
              title: 'Recipe title must contain only alphabets',
              ingredients: 'Recipe ingredients provided must ' +
              'be atleast 20 characters',
              procedures: 'Recipe procedures provided must ' +
              'be atleast 20 characters'
            });
            if (error) done(error);
            done();
          });
      });
    it('should be able to login to account created with valid' +
      'credentials', (done) => {
      request.post('/api/v1/users/signin')
        .send(userData.userTwoLogin)
        .end((error, response) => {
          userTwoToken.token = response.body.token;
          expect(response.status).to.equal(200);
          expect('You are now logged In').to.equal(response.body.message);
          expect(response.body.user).deep.equal({
            id: 2,
            username: 'annie',
            email: 'annie@yahoo.com'
          });
          done();
        });
    });
    it('should not be able to update a recipe a user did not create', (done) => {
      request.put('/api/v1/recipes/1')
        .set('x-access-token', userTwoToken.token)
        .send(data.validData1)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Can not update a recipe not created by you'
          });
          if (error) done(error);
          done();
        });
    });
    it('should not be able to update a recipe that is not found', (done) => {
      request.put('/api/v1/recipes/66')
        .set('x-access-token', userTwoToken.token)
        .send(data.validData1)
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Recipe not found or has been deleted'
          });
          done();
        });
    });
    describe('test cases for updating a recipe positive operations', () => {
      it('should be able to update an existing recipe with only title' +
        'and ingredients fields changed', (done) => {
        request.put('/api/v1/recipes/1')
          .set('x-access-token', userOneToken.token)
          .send(data.validUpdateData1)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully updated recipe')
              .to.equal(response.body.message);
            expect(response.body.recipe).deep.equal({
              id: 1,
              title: 'Sweet African Salad',
              ingredients: 'onions, vegetables, carrots, salt',
              procedures: 'Boil water for about 20 minutes. ' +
              'Cut carrots into considerable sizes...',
              recipeImage: 'recipeOne.png',
              viewsCount: 0,
              upvotes: 0,
              downvotes: 0,
              hasOwnerViewed: false,
              userId: 1,
              createdAt: response.body.recipe.createdAt,
              updatedAt: response.body.recipe.updatedAt
            });
            done();
          });
      });
      it('should be able to update the same existing recipe with only' +
        'procedures and recipe image fields changed', (done) => {
        request.put('/api/v1/recipes/1')
          .set('x-access-token', userOneToken.token)
          .send(data.validUpdateData2)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully updated recipe')
              .to.equal(response.body.message);
            expect(response.body.recipe).deep.equal({
              id: 1,
              title: 'Sweet African Salad',
              ingredients: 'onions, vegetables, carrots, salt',
              procedures: 'Boil water for about 20 minutes. ' +
              'Cut carrots into considerable sizes...',
              recipeImage: 'recipeOne.png',
              viewsCount: 0,
              upvotes: 0,
              downvotes: 0,
              hasOwnerViewed: false,
              userId: 1,
              createdAt: response.body.recipe.createdAt,
              updatedAt: response.body.recipe.updatedAt
            });
            done();
          });
      });
    });
  });
  describe('test cases for deleting user recipe operations', () => {
    it('should not be able to delete a recipe with id not a number', (done) => {
      request.delete('/api/v1/recipes/yes')
        .set('x-access-token', userOneToken.token)
        .end((error, response) => {
          expect(response.status).to.equal(406);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Recipe ID must be a number'
          });
          done();
        });
    });
    it('should not be able to delete a recipe that a user did not' +
      'create', (done) => {
      request.delete('/api/v1/recipes/1')
        .set('x-access-token', userTwoToken.token)
        .end((error, response) => {
          expect(response.status).to.equal(401);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'You can not delete a recipe not created by you'
          });
          done();
        });
    });
    it('should not be able to delete a recipe that is not available' +
      'in the application', (done) => {
      request.delete('/api/v1/recipes/4')
        .set('x-access-token', userTwoToken.token)
        .end((error, response) => {
          expect(response.status).to.equal(404);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: 'Recipe not found or has been deleted'
          });
          done();
        });
    });
    it('should be able to delete a recipe by its author', (done) => {
      request.delete('/api/v1/recipes/1')
        .set('x-access-token', userOneToken.token)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect('Successfully delected recipe')
            .to.equal(response.body.message);
          expect(response.body.recipe).deep.equal({
            id: 1,
            title: 'Sweet African Salad',
            ingredients: 'onions, vegetables, carrots, salt',
            procedures: 'Boil water for about 20 minutes. ' +
            'Cut carrots into considerable sizes...',
            recipeImage: 'recipeOne.png',
            viewsCount: 0,
            upvotes: 0,
            downvotes: 0,
            hasOwnerViewed: false,
            userId: 1,
            createdAt: response.body.recipe.createdAt,
            updatedAt: response.body.recipe.updatedAt
          });
          done();
        });
    });
  });
  describe('test cases for retrieving all recipes operations', () => {
    describe('test cases for retrieving all recipes positive operations', () => {
      it('should be able to retrieve all recipes in the application', (done) => {
        request.get('/api/v1/recipes')
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved all recipes')
              .to.equal(response.body.message);
            expect(response.body.recipes).to.have.length(1);
            expect(response.body.recipes[0].id).to.equal(2);
            expect(response.body.recipes[0].title)
              .to.equal('French Tasty Fries');
            done();
          });
      });
      it('should be able to retrive all recipes by most upvote in' +
        'descending order', (done) => {
        request.get('/api/v1/recipes?page=1&&sort=upvotes&&order=desc')
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved all recipes by upvote or downvote')
              .to.equal(response.body.message);
            expect(response.body.recipes).to.have.length(1);
            expect(response.body.recipes[0].id).to.equal(2);
            expect(response.body.recipes[0].title)
              .to.equal('French Tasty Fries');
            done();
          });
      });
      it('should be able to retrive all recipes by most upvote in' +
        'ascending order', (done) => {
        request.get('/api/v1/recipes?page=1&&sort=upvotes&&order=asc')
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved all recipes by upvote or downvote')
              .to.equal(response.body.message);
            expect(response.body.recipes).to.have.length(1);
            expect(response.body.recipes[0].id).to.equal(2);
            expect(response.body.recipes[0].title)
              .to.equal('French Tasty Fries');
            done();
          });
      });
    });
    describe('test cases for retrieving all recipes negative operations', () => {
      it('should not be able to retrieve all recipes when page query' +
        'is not a number', (done) => {
        request.get('/api/v1/recipes?page=yes&&sort=upvotes&&order=desc')
          .end((error, response) => {
            expect(response.status).to.equal(406);
            expect(response.body).deep.equal({
              status: 'Failed',
              message: 'Page query must be a number'
            });
            done();
          });
      });
      it('should not be able to retrieve all recipes when page query' +
        'is zero(0)', (done) => {
        request.get('/api/v1/recipes?page=0&&sort=upvotes&&order=desc')
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body).deep.equal({
              status: 'Failed',
              message: 'Page query of 0 is invalid'
            });
            done();
          });
      });
      it('should not be able to retrieve all recipes when database queried' +
        'with page query number returns no recipes', (done) => {
        request.get('/api/v1/recipes?page=3&&sort=upvotes&&order=desc')
          .end((error, response) => {
            expect(response.status).to.equal(404);
            expect(response.body).deep.equal({
              status: 'Failed',
              message: 'Requested page is not available'
            });
            done();
          });
      });
      it('should not be able to retrieve all recipes when either sort or' +
        'oder query is missing(undefined)', (done) => {
        request.get('/api/v1/recipes?page=1&&sort=upvotes')
          .end((error, response) => {
            expect(response.status).to.equal(422);
            expect('Sort or(and) order query parameter(s) is(are) not defined')
              .to.equal(response.body.message);
            done();
          });
      });
      it('should not be able to retrieve all recipes when order query' +
        'is empty', (done) => {
        request.get('/api/v1/recipes?page=1&&sort=upvotes&&order=')
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.errors).deep.equal({
              order: 'Order query is required'
            });
            done();
          });
      });
      it('should not be able to retrieve all recipes when sort query' +
        'is empty', (done) => {
        request.get('/api/v1/recipes?page=1&&sort=&&order=desc')
          .end((error, response) => {
            expect(response.status).to.equal(400);
            expect(response.body.errors).deep.equal({
              sortType: 'Sort query is required'
            });
            done();
          });
      });
      it(`should not be able to retrieve all recipes when sort or/and
          order query have invalid valuesasides upvotes/downvotes and
          desc/asc`, (done) => {
          request.get('/api/v1/recipes?page=0&&sort=sgs&&order=hsgs')
            .end((error, response) => {
              expect(response.status).to.equal(400);
              expect(response.body.errors).deep.equal({
                sortType: 'Sort query must be either upvotes or downvotes',
                order: 'Order query must be either asc or desc'
              });
              done();
            });
        });
      it('should be able to delete a recipe by its author', (done) => {
        request.delete('/api/v1/recipes/2')
          .set('x-access-token', userOneToken.token)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully delected recipe')
              .to.equal(response.body.message);
            expect(response.body.recipe).deep.equal({
              id: 2,
              title: 'French Tasty Fries',
              ingredients: 'onions, vegetables, carrots, salt',
              procedures: 'Boil water for about 20 minutes. ' +
              'Cut carrots into considerable sizes...',
              recipeImage: 'recipeTwo.png',
              viewsCount: 0,
              upvotes: 0,
              downvotes: 0,
              hasOwnerViewed: false,
              userId: 1,
              createdAt: response.body.recipe.createdAt,
              updatedAt: response.body.recipe.updatedAt
            });
            done();
          });
      });
      it('should not be able to retrieve all recipes when no recipe is' +
        'available in the application', (done) => {
        request.get('/api/v1/recipes?page=1&&sort=upvotes&&order=desc')
          .end((error, response) => {
            expect(response.status).to.equal(404);
            expect(response.body).deep.equal({
              status: 'Failed',
              message: 'There are no available recipes'
            });
            done();
          });
      });
    });
  });
  describe('test cases for retrieving all user recipes', () => {
    describe('test cases for retrieving all user recipes negative' +
      'operation', () => {
      it('should not be able to retrieve all user recipes when he/she' +
        'has no recipe available in the application', (done) => {
        request.get('/api/v1/user/recipes')
          .set('x-access-token', userOneToken.token)
          .end((error, response) => {
            expect(response.status).to.equal(404);
            expect(response.body).deep.equal({
              status: 'Failed',
              message: 'You have no available recipes'
            });
            done();
          });
      });
    });
    describe('test cases for retrieving all user recipes positive' +
      'operations', () => {
      it('should be able to create recipe when all validations are' +
        'met', (done) => {
        request.post('/api/v1/recipes')
          .set('x-access-token', userOneToken.token)
          .send(data.validData1)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect('Successfully added new recipe')
              .to.equal(response.body.message);
            expect(Object.keys(response.body.recipe).length).to.equal(12);
            expect(response.body.recipe.title).to.equal(data.validData1.title);
            expect(response.body.recipe.hasOwnerViewed).to.equal(false);
            if (error) done(error);
            done();
          });
      });
      it('should be able to create another recipe when all validations' +
        'are met', (done) => {
        request.post('/api/v1/recipes')
          .set('x-access-token', userOneToken.token)
          .send(data.validData2)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect('Successfully added new recipe')
              .to.equal(response.body.message);
            expect(Object.keys(response.body.recipe).length).to.equal(12);
            expect(response.body.recipe.title).to.equal(data.validData2.title);
            expect(response.body.recipe.hasOwnerViewed).to.equal(false);
            if (error) done(error);
            done();
          });
      });
      it('should be able to retrieve all user recipes in the' +
        'application', (done) => {
        request.get('/api/v1/user/recipes')
          .set('x-access-token', userOneToken.token)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved your recipe(s)')
              .to.equal(response.body.message);
            expect(response.body.recipes).to.have.length(2);
            expect(response.body.numberOfRecipes).to.equal(2);
            expect(response.body.recipes[1].title)
              .to.equal('American Salad');
            if (error) done(error);
            done();
          });
      });
    });
  });
  describe('test cases for retrieving a single user recipe', () => {
    describe('test cases for retrieving a single user recipe' +
      'negative operations', () => {
      it('should not be able to retrieve a recipe when recipe id is' +
        'not a number', (done) => {
        request.get('/api/v1/recipes/yes')
          .set('x-access-token', userOneToken.token)
          .end((error, response) => {
            expect(response.status).to.equal(406);
            expect('Recipe ID must be a number')
              .to.equal(response.body.message);
            expect(response.body).deep.equal({
              status: 'Failed',
              message: 'Recipe ID must be a number'
            });
            if (error) done(error);
            done();
          });
      });
      it('should not be able to retrieve a recipe when the recipe' +
        'dose not exit', (done) => {
        request.get('/api/v1/recipes/5')
          .set('x-access-token', userOneToken.token)
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
    describe('test cases for retrieving a single user recipe' +
      'positive operations', () => {
      it('should be able to retrieve a recipe when a valid token' +
      'is supplied', (done) => {
        request.get('/api/v1/recipes/3')
          .set('x-access-token', userOneToken.token)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved recipe')
              .to.equal(response.body.message);
            if (error) done(error);
            done();
          });
      });
      it('should be able to retrieve a recipe when a valid token from' +
        'another user is supplied', (done) => {
        request.get('/api/v1/recipes/3')
          .set('x-access-token', userTwoToken.token)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved recipe')
              .to.equal(response.body.message);
            expect(response.body.isFavorited).to.equal(false);
            expect(response.body.vote).to.equal('');
            expect(response.body.recipe.viewsCount).to.equal(2);
            expect(response.body.recipe.Reviews).to.have.length(0);
            expect(response.body.recipe.title).to.equal('American Salad');
            if (error) done(error);
            done();
          });
      });
      it('should be able to retrieve a recipe when a wrong or expired' +
        'token is supplied', (done) => {
        request.get('/api/v1/recipes/4')
          .set('x-access-token', wrongToken)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved recipe')
              .to.equal(response.body.message);
            expect(response.body.isFavorited).to.equal(false);
            expect(response.body.vote).to.equal('');
            expect(response.body.recipe.viewsCount).to.equal(1);
            expect(response.body.recipe.Reviews).to.have.length(0);
            expect(response.body.recipe.title).to.equal('French Tasty Fries');
            if (error) done(error);
            done();
          });
      });
      it('should be able to retrieve a recipe when no token is' +
        'supplied', (done) => {
        request.get('/api/v1/recipes/4')
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect('Successfully retrieved recipe')
              .to.equal(response.body.message);
            expect(response.body.isFavorited).to.equal(false);
            expect(response.body.vote).to.equal('');
            expect(response.body.recipe.viewsCount).to.equal(2);
            expect(response.body.recipe.Reviews).to.have.length(0);
            expect(response.body.recipe.title).to.equal('French Tasty Fries');
            if (error) done(error);
            done();
          });
      });
    });
  });
  describe('test cases for checking if a user recipe title already' +
    'existing', () => {
    it('should return `409` when the recipe title already exist for' +
      'a particular user', (done) => {
      request.post('/api/v1/recipes/checkTitle')
        .set('x-access-token', userOneToken.token)
        .send(data.validData1)
        .end((error, response) => {
          expect(response.status).to.equal(409);
          expect(response.body).deep.equal({
            status: 'Failed',
            message: `Recipe with title: ${data.validData1.title},\
 already exist in your catalog`
          });
          if (error) done(error);
          done();
        });
    });
    it('should return `200` when the recipe title does not exist for' +
      'a particular', (done) => {
      request.post('/api/v1/recipes/checkTitle')
        .set('x-access-token', userOneToken.token)
        .send(data.validData3)
        .end((error, response) => {
          expect(response.status).to.equal(200);
          expect(response.body).deep.equal({
            status: 'Success',
            message: 'This title does not exit in your catalog'
          });
          if (error) done(error);
          done();
        });
    });
  });
});

export default userTwoToken;
