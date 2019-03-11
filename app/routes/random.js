import Route from '@ember/routing/route';

export default Route.extend({
    actions: {
        authentificateWithTrello(event) {
            var route = this;

            Trello.authorize("popup", "RTCPick", true, true);
            this.checkLoginState();
            route.session.set('user', null);
            console.log(this.userObj.userName);
        }
    },
    didRender() {
        this._super(...arguments);
        this.checkLoginState();
    },
    actions: {
        authentificateWithTrello(event) {

            Trello.authorize("popup", "RTCPick", true, true);
            this.checkLoginState();
            console.log(this.userObj.userName);
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
