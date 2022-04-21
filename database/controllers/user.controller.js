// load model
const responseObj = {};
const mongodb = require("mongodb");

//Helpers
const errorCodes = require("../helpers/errorCodes.js");
const sendResponse = require("../helpers/sendResponse.helper.js");
const sendResponseHelper = require("../helpers/sendResponse.helper.js");

const userDatalayer = require("./../datalayers/user.datalayer");

exports.find = async (request, response) => {
    console.log(request);
    let id;
    if (request.query._id) {
        id = request.query._id;
    } else {
        sendResponseHelper.sendResponse(response, errorCodes.REQUIRED_PARAMETER_MISSING, "Required parameters missing", {});
        return;
    }
    if (mongodb.ObjectId.isValid(mongodb.ObjectId(id))) {
        const where = {};
        where._id = mongodb.ObjectId(id);
        userDatalayer.findUser(where)
        .then((userData) => {
            if (userData !== null && typeof userData !== undefined) sendResponseHelper.sendResponse(response, errorCodes.SUCCESS, "Success", userData);
            else sendResponseHelper.sendResponse(response, errorCodes.DATA_NOT_FOUND, "No record found", {});
        })
        .catch(error => {
            sendResponseHelper.sendResponse(response, errorCodes.SYNTAX_ERROR, error, {});
        });
    } else {
        sendResponseHelper.sendResponse(response, errorCodes.SYNTAX_ERROR, "Invalid id", {});
    }

};

exports.create = async (request, response) => {
    let params = {};
    if (request.body.params) {
        params = request.body.params;
    } else {
        sendResponseHelper.sendResponse(response, errorCodes.REQUIRED_PARAMETER_MISSING, "Required parameters missing", {});
        return;
    }
    userDatalayer.createUser(params)
    .then((userData) => {
        console.log(userData);
        if (userData !== null && typeof userData !== undefined) {
            sendResponseHelper.sendResponse(response, errorCodes.SUCCESS, "Success", userData);
        } else {
            sendResponseHelper.sendResponse(response, errorCodes.DATA_NOT_FOUND, "No record found", {});
        }
    })
    .catch(error => {
        sendResponseHelper.sendResponse(response, errorCodes.SYNTAX_ERROR, error, {});
    });
    return;
};

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
};

exports.changePassword = async (request, response, next) => {
    let params = {};
    if (request.body.params) {
        params = request.body.params;
    } else {
        sendResponseHelper.sendResponse(response, errorCodes.REQUIRED_PARAMETER_MISSING, "Required parameters missing", {});
        return;
    }
    //Find the user given the id in the params
    userDatalayer.findUser({_id: mongodb.ObjectId(params.id)})
    .then((userData) => {
        if (userData !== null && typeof userData !== undefined) {
            //Check if the password is correct
            if (comparePassword(params.oldPassword, userData.password)) {
                //If the password is correct, update the password, hashed with bcrypt
                userDatalayer.updateUser({_id: mongodb.ObjectId(params.id)}, {password: bcrypt.hashSync(params.newPassword, 10)})
                .then((userData) => {
                    if (userData !== null && typeof userData !== undefined) {
                        sendResponseHelper.sendResponse(response, errorCodes.SUCCESS, "Success", userData);
                    } else {
                        sendResponseHelper.sendResponse(response, errorCodes.DATA_NOT_FOUND, "No record found", {});
                    }
                })
                .catch(error => {
                    sendResponseHelper.sendResponse(response, errorCodes.SYNTAX_ERROR, error, {});
                });
            } else {
                sendResponseHelper.sendResponse(response, errorCodes.UNAUTHORIZED, "Old password is incorrect", {});
            }
        } else {
            sendResponseHelper.sendResponse(response, errorCodes.DATA_NOT_FOUND, "No record found", {});
        }
    })
    return;
}
