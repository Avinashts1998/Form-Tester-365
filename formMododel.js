const mongoose = require('mongoose')


const FormSchema = new mongoose.Schema({
    url: {
        type: String
    },
    website_Data: {
        type: String
    },
    form_type: {
        type: String
    },
    form_name: {
        type: String
    }

})


exports.FormSchema = FormSchema