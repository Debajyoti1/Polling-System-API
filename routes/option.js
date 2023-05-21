const express=require('express')
const router=express.Router()
const optionController=require('../controllers/optionController')

router.get('/',optionController.getAll)
router.get('/:id/delete',optionController.delete)
router.get('/:id/add_vote',optionController.addVote)

module.exports=router