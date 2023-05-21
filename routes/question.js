const express=require('express')
const router=express.Router()
const questionController=require('../controllers/questionController')

router.get('/',questionController.getAll)
router.get('/:id',questionController.get)
router.post('/create',questionController.create)
router.post('/:id/option/create',questionController.createOptions)
router.get('/:id/delete',questionController.delete)
module.exports=router