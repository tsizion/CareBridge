const express = require("express");
const router = express.Router();
const {
  Create,
  ReadAll,
  ReadOne,
  Update,
  Delete,
  GoogleSignUp,
  ReadOneByUser,
} = require("../controllers/userController");
const { protectUser, protectAdmin } = require("../../middleware/authorization");
router.post("/GoogleSignUp", GoogleSignUp);
router.post("/", Create);
router.get("/", protectAdmin, ReadAll);
router.get("/ReadMine", protectUser, ReadOneByUser);
router.get("/:id", ReadOne);

router.patch("/:id", protectUser, Update);
router.delete("/:id", Delete);

module.exports = router;
