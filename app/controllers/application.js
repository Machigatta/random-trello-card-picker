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
        todoCard: null
    },
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
    bindFList(val){
        this.set("fList",val);
    },
    logout(){
        Trello.deauthorize();
        this.set("userObj",  {
            isLoggedIn: false,
            userName: null,
            avatarUrl: null,
            authState: "Authentificate"
        });
        this.set("trelloObj", {
            boards: [],
            columns: [],
            cards: [],
            todoCard: null
        });
        this.set("fList", null);
        this.set("token", null);
        
    },
    retrieveBoards(){
        this._super(...arguments);
        const promise = Trello.get("/members/me/boards");
        promise.then((res) => {
            this.set("trelloObj.boards", res);
        });
    },
    getColumns(val){
        this._super(...arguments);
        const promiseList = Trello.get("/boards/"+val+"/lists");
        promiseList.then((res) => {
            this.set("trelloObj.columns", res);
        });

    },
    pickCard(){
        const promiseCard = Trello.get("/lists/" + this.fList + "/cards");
        promiseCard.then((res) => {
            this.set("trelloObj.cards", res);
            this.set("trelloObj.todoCard", res[Math.floor(Math.random() * res.length)]);
        });
    }
});
