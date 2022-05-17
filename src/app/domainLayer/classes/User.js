const PersistenceCtrl = require("../../persistenceLayer/PersistenceCtrl");
persistCtrl = new PersistenceCtrl();
class User {
    
    //Constructors
    constructor (name, email, password, birthdate) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.points = 0;
        this.language = "Catalan"; // "Spanish", "English"
        this.healthStatus = [false, false, false]; //cardiorespiratory problems, pregnant, elderly
        this.notifications = true;
        this.profilePicture = "https://www.congresodelasemfyc.com/assets/imgs/default/default-logo.jpg";
    }

    async register (confirmPassword) {
        return await persistCtrl.postRequest("/register", {
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "confirmPassword": confirmPassword,
            "birthdate": this.birthdate
        });
    }

    async login () {
        return await persistCtrl.getRequest("/login", {
            "email": this.email,
            "password": this.password
        });
    }

    async delete () {
        return await persistCtrl.postRequest("/deleteUser", {
            "email": this.email
        });
    }

    async changePassword (oldPassword, newPassword) {
        return await persistCtrl.putRequest("/changePassword", {
            "email": this.email,
            "oldPassword": oldPassword,
            "newPassword": newPassword
        });
    }

    async restorePassword () {
        return await persistCtrl.putRequest("/restorePassword", {
            "email": this.email
        });
    }

    async update (name, points, language, healthStatus, notifications, profilePicture) {
        return await persistCtrl.postRequest("/updateUser", {
            "name": name,
            "email": this.email,
            "points": points,
            "language": language,
            "healthStatus": healthStatus,
            "notifications": notifications,
            "profilePicture": profilePicture
        });
    }

}

module.exports = User;
