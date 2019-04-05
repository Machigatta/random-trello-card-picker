/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
/* eslint-disable no-undef */
import Controller from '@ember/controller';

export default Controller.extend({
    queryParams: ['token'],
    token: null,
    beforeModel() {
        this._super(...arguments);
        this.login();
    },
    actions: {
        login() {
            this.login();
        },
        logout() {
            this.logout();
        }
    },
    invalidForm: true,
    requestRunning: false,
    fList: null,
    userObj: {
        isLoggedIn: false,
        userName: null,
        avatarUrl: null,
        authState: "Authentificate"
    },
    trelloObj: {
        boards: [],
        columns: [],
        cards: [],
        labels: [],
        todoCard: null
    },
    filter: {
        boardId: null,
        columnId: null,
        labels: [],
        cards: []
    },
    //ACTIONS
    login(persistent) {
        this._super(...arguments);
        if(!Trello.authorized()){
            if (typeof persistent == 'undefined'){
                persistent = true;
            }
            Trello.authorize("popup", "RTCPick", true, persistent);
        }
        const promise = Trello.get("/members/me");
        this.userObj.authState = "Authentificating...";
        promise.then((res) => {
            this.set("userObj.userName", res.username);
            this.set("userObj.avatarUrl", res.avatarUrl+'/30.png');
            this.set("userObj.isLoggedIn", true);
            this.set("userObj.authState", "Authentificated");
        });
    },
    logout(){
        Trello.deauthorize();
        this.resetMeta();
        this.set("token", null);
        this.set("userObj", {
            isLoggedIn: false,
            userName: null,
            avatarUrl: null,
            authState: "Authentificate"
        });
        this.set("trelloObj.boards", []);
    },
    pickCard() {
        this.set("trelloObj.todoCard", this.filter.cards[Math.floor(Math.random() * this.filter.cards.length)]);
    },
    filterCardObj() {
        
        this.set("filter.cards", []);
        this.trelloObj.cards.forEach(cElement => {
            if(cElement.labels.length > 0){
                cElement.labels.forEach(lElement => {
                    this.filter.labels.forEach(fElement => {
                        if (lElement.id == fElement.id) {
                            //remove
                            this.filter.cards.push(cElement);
                        }
                    });
                });
            }else{
                this.filter.cards.push(cElement);
            }
            
        });
    },
    //EVENT-HANDLER
    onBoardChange(val){
        this._super(...arguments);
        if (val == "") {
            this.set("invalidForm", true);
            this.set("filter.boardId", null);
            this.resetMeta();
        } else {
            this.set("invalidForm", false);
            this.getAllListsFromBoard(val);
            this.getAllCardsFromBoard(val);
            this.getAllLabelsFromList(val);

            this.set("filter.boardId", val);
        }
        
        this.filterCardObj();
    },
    onChangeColumn(val) {
        if (val == "") {
            this.set("filter.columnId", null);
            this.getAllCardsFromBoard(this.filter.boardId);
        } else {
            this.set("filter.columnId", val);
            this.set("requestRunning", true);
            const promiseCard = Trello.get("/lists/" + this.filter.columnId + "/cards");
            promiseCard.then((res) => {
                this.set("requestRunning", false);
                this.set("trelloObj.cards", res);
                this.set("filter.cards", res.slice(0));
            });
        }
        this.filterCardObj();
    },
    updateLabelSelection(el){
        this.trelloObj.labels.forEach(element => {
            if (element.id == el.value){                
                if (el.checked){
                    this.filter.labels.push(element)
                }else{
                    this.filter.labels.splice(this.filter.labels.indexOf(element), 1);
                }
            }
        });
        this.filterCardObj();
    },
    //DATA-HANDLER
    getAllListsFromBoard(val){
        this.set("requestRunning", true);
        const colPromiseList = Trello.get("/boards/" + val + "/lists");
        colPromiseList.then((res) => {
            this.set("requestRunning", false);
            this.set("trelloObj.columns", res);
        });  
    },
    getAllCardsFromBoard(val) {
        this.set("requestRunning", true);
        const cardPromiseList = Trello.get("/boards/" + val + "/cards");
        cardPromiseList.then((res) => {
            this.set("requestRunning", false);
            this.set("trelloObj.cards", res);
            this.set("filter.cards", res.slice(0));
        });   
    },
    getAllLabelsFromList(val){
        this.set("requestRunning", true);
        const labelPromiseList = Trello.get("/boards/" + val + "/labels");
        labelPromiseList.then((res) => {
            this.set("requestRunning", false);
            this.set("trelloObj.labels", res);
            this.set("filter.labels", res.slice(0));
        });
    },
    getAllBoards() {
        this._super(...arguments);
        this.set("requestRunning", true);
        const promise = Trello.get("/members/me/boards");
        promise.then((res) => {
            this.set("requestRunning", false);
            this.set("trelloObj.boards", res);
        });
    },
    resetMeta() {
        this.set("trelloObj.columns", []);
        this.set("trelloObj.cards", []);
        this.set("trelloObj.labels", []);
        this.set("trelloObj.todoCard", null);
        this.set("filter", {
            boardId: null,
            columnId: null,
            labels: [],
            cards: []
        });
    },
});
