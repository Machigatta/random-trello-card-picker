import Controller from '@ember/controller';

export default Controller.extend({
    beforeModel() {
        this._super(...arguments);
        this.checkLoginState();
    },
    actions: {
        authentificateWithTrello(event) {
            console.log(Trello.authorize("popup", "RTCPick", true, true));
            this.checkLoginState();
        }
    },
    userObj: {
        isLoggedIn: false,
        userName: null
    },
    checkLoginState() {
        this._super(...arguments);
        const promise = Trello.get("/members/me");
        promise.then(() => {
            this.set("userObj.userName", "Armin");
            this.set("userObj.isLoggedIn", true);
        });
    }
});
