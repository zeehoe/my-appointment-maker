const {
create,
cancel,
list,
reschedule
} = require("../controllers/appointmentControllers");

const router = require("express").Router();
router.post("/create", create);
router.post("/cancel", cancel);
router.get("/list/:phoneNumber",list)
router.put("/reschedule",reschedule)

module.exports = router;
