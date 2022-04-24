const express = require("express");
const router = express.Router();
module.exports = router;

//Middleware
const licenseMiddleware = require("../middlewares/license.middleware");
const authorizationMiddleware = require("../middlewares/authorization.middleware");

//Controllers
//const UserController = require("../controllers/user.controller");
const UserController = require("../controllers/user.controller");
const MeasureStationController = require("../controllers/measureStation.controller");
const PollutantDayMeasureController = require("../controllers/pollutantDayMeasure.controller");
const PinController = require("../controllers/pin.controller");
const MessageController = require("../controllers/messages.controller");
const ConversationController = require("../controllers/conversation.controller");

/*  User */
router.post(
    "/register",
    licenseMiddleware.validate,
    UserController.register
);

router.get(
    "/login",
    licenseMiddleware.validate,
    UserController.login
);

router.get(
    "/user",
    licenseMiddleware.validate,
    UserController.find
);

router.put(
    "/changePassword",
    licenseMiddleware.validate,
    //authorizationMiddleware.validate,
    UserController.changePassword
);

/*  MeasureStation  */
router.get(
    "/measureStation",
    licenseMiddleware.validate,
    //authorizationMiddleware.validate,
    MeasureStationController.find
);
router.post(
    "/newMeasureStation",
    licenseMiddleware.validate,
    //authorizationMiddleware.validate,
    MeasureStationController.create
);
router.post(
    "/insertMultipleMeasureStation",
    licenseMiddleware.validate,
    //authorizationMiddleware.validate,
    MeasureStationController.insertMultiple
);
/* /MeasureStation */

/* PollutantDayMeasure */
router.get(
    "/pollutantDayMeasure",
    licenseMiddleware.validate,
    //authorizationMiddleware.validate,
    PollutantDayMeasureController.find
);
router.post(
    "/newPollutantDayMeasure",
    licenseMiddleware.validate,
    //authorizationMiddleware.validate,
    PollutantDayMeasureController.create
);
router.post(
    "/insertMultiplePollutantDayMeasure",
    licenseMiddleware.validate,
    PollutantDayMeasureController.insertMultiple
);
/* /PollutantDayMeasure */

/*  Pin */
router.post(
    "/newPin",
    licenseMiddleware.validate,
    PinController.create
);
router.get(
    "/pin",
    licenseMiddleware.validate,
    PinController.find
);
router.put(
    "/pin",
    licenseMiddleware.validate,
    PinController.validate("updatePin"),
    PinController.update
);

/*  /Message */

router.post(
    "/message",
  //  licenseMiddleware.validate,

    MessageController.create
);
router.get(
    "/message",
    MessageController.find
);


/*  /Conversation */

router.post(
    "/conversation",
  //  licenseMiddleware.validate,

  ConversationController.create
);
router.get(
    "/conversation",
    ConversationController.find
);
