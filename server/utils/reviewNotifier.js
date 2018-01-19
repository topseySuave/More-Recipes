 import dotenv from 'dotenv';
 import mailer from './mailer';
 import reviewNotifierTemplate from './EmailTemplates/reviewNotifierTemplate';

 dotenv.config();

 /**
  * @description function for sending notification email when a user's recipe gets a review
  * @function
  *
  * @param   {object} modelR      Recipes model
  * @param   {object} modelU      Users model
  * @param   {number} recipeId    ID of the recipe been reviewed
  * @param   {string} reviewBody  Content of the review
  * @param   {string} reviewer    The username of the person who made the review
  *
  */

 const reviewNotifier = (modelR, modelU, recipeId, reviewBody, reviewer) => {
   modelR.findOne({ where: { id: recipeId } })
     .then((recipe) => {
       modelU.findOne({ where: { id: recipe.userId } })
         .then((user) => {
           const mailOptions = {
             from: `"More-Recipes" <${process.env.AUTHORIZED_EMAIL}>`,
             to: user.email,
             subject: `${recipe.title} has a new Review`,
             html: reviewNotifierTemplate(recipe.title, recipe.id, user.username, reviewBody, reviewer)
           };
           mailer(mailOptions);
         });
     });
 };

 export default reviewNotifier;
