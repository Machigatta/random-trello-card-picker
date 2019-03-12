/* eslint-disable no-undef */
/* eslint-disable ember/require-super-in-init */
import Controller from '@ember/controller';
import {inject} from '@ember/controller';

export default Controller.extend({
    applicationController: inject('application'),
    init(){
        if (window.top.location.hash != "" && window.top.location.hash != "#" && window.top.location.hash.split('#token=').pop() != ""){
            this.applicationController.login(false);
        }
        if (localStorage.getItem("trello_token") != null || this.applicationController.token != null) {
            this.applicationController.login();
        }
        if (typeof Trello != 'undefined'){
            if(Trello.authorized()){
                this.applicationController.retrieveBoards();
            }
            
        }
    },
    actions:{
        getColumns(val){
            this.applicationController.getColumns(val);
        },
        pickCard(val) {
            this.applicationController.pickCard(val);
        },
        bindFList(val){
            this.applicationController.bindFList(val);
        }
    }
    
});
