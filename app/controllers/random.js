import Controller from '@ember/controller';

export default Controller.extend({
    applicationController: Ember.inject.controller('application'),
    actions:{
        //aTrello: Ember.computed.alias('applicationController.authentificateWithTrello')
    }
    
});
