const router = require("express").Router();
const controller = require("../controllers/pasteController");

router.post("/", controller.createPaste);
router.get("/:id", controller.getPaste);

module.exports = router;