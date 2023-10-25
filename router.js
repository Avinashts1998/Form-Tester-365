const express = require('express')

const router = express.Router()
const formController = require('./controller')


router.route("/scrap-form")
      .post(formController.scrapeData)

router.route("/get-forms")
      .post(formController.getForms)

router.route('/submit-forms')
      .post(formController.submitForms)

router.route('/submit-forms-cheerios')
      .post(formController.submiteFormsCheerios)

      module.exports = router