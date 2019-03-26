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
                this.applicationController.getAllBoards();
            }
            
        }
    },
    actions:{
        onBoardChange(val){
            this.applicationController.onBoardChange(val);
        },
        pickCard(val) {
            this.applicationController.pickCard(val);
        },
        onChangeColumn(val){
            this.applicationController.onChangeColumn(val);
        },
        updateLabelSelection(val){
            this.applicationController.updateLabelSelection(val);
        }
    }
    
});
