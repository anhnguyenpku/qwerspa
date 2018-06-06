Meteor.methods({
   lottie_animationData(agrs){
       let animationData = Assets.getText(agrs || 'assets/animationData.json');
       return JSON.parse(animationData);
   }
});