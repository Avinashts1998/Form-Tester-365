// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const fs = require("fs");
const pupeteer = require('puppeteer')
const dotenv = require('dotenv')
dotenv.config({ path: "./config.env" })
const Form_model = require("./formMododel")
// URL of the page we want to scrape
const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";

// Async function which scrapes the data
exports.scrapeData = async (request, response) => {
    try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url);
        //  console.log(data)
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // Select all the list items in plainlist class
        const listItems = $(".plainlist ul li");
        // Stores data for all countries
        const countries = [];
        // Use .each method to loop through the li we selected
        listItems.each((idx, el) => {
            // Object holding data for each country/jurisdiction
            const country = { name: "", iso3: "" };
            // Select the text content of a and span elements
            // Store the textcontent in the above object
            country.name = $(el).children("a").text();
            country.iso3 = $(el).children("span").text();
            // Populate countries array with country data
            countries.push(country);
        });
        // Logs countries array to the console
        response.status(200).json({
            data: countries
        })
        // Write countries array in countries.json file
    } catch (err) {
        console.error(err);
    }
}
// Invoke the above function
/*
  let forms = []
        const url = request.body.url
        axios.get(url).then(response => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html)

                const formElaments = $('form');
                console.log(formElaments)
                formElaments.map((index, elament) => {
                  //  console.log($(elament).html())
                    forms.push($(elament).html())

                    return forms;
                })

                console.log(forms)

            } else {
                console.error('Failed to get forms')
            }
        })


        response.status(200).json({
            data: {forms},
        })
*/


exports.getForms = async (request, response) => {
    try {
        const dbName = process.env.DATABASE
        const formCollection = 'Forms'
        const dbConnection = await global.clientConnection
        const formDb = await dbConnection.useDb(dbName)

        const form_model = formDb.model(formCollection, Form_model.FormSchema, formCollection)

        console.log('Data Scraping...')
        let forms = []
        const url = request.body.url

        const { data } = await axios.get(url)
        console.log(data)

        const condition = 'wpcf7-form-control-wrap'

        /*  const splitResult = data.split(new RegExp(condition, 'i'))
          console.log(splitResult) */

        const wpcf7_forms = 'wpcf7-form-control-wrap'
        let message;

        const paramsData = {
            url : url,
            website_Data: data,
            form_type: wpcf7_forms,
            form_name: 'WordPress Contact Forms 7'
        }

        if (data.includes(wpcf7_forms)) {
            await form_model.create(paramsData).then(() => {
                console.log('Form intseted')
                message = 'wpcf forms'
            })


        } else {
            message = 'Its not a wpcf form'
            console.log('its not a wpcf form')
        }




        const $ = cheerio.load(data)


        const formElaments = $('form');


        const formData = formElaments.map((index, elament) => {
            //   console.log($(elament).html())


        })

        /*  for (let i = 0; i < forms.length; i++) {
              //   console.log(forms[i])
          }
  
          const formsdatas = forms.map((e) => {
              return e;
          }).filter((elament, index, arr) => {
              console.log(elament)
          }) */




        response.status(200).json({
            message: message,
            success: data,


        })
    } catch (error) {
        console.log(error)
    }

}


exports.submitForms = async (request, response) => {
    try {

        const email = request.body.email
        const name = request.body.name

        const url = request.body.url
        const browser = await pupeteer.launch()

        const form_field = request.body.form_fields

        const click_type = request.body.click_type

        const page = await browser.newPage()


        const data = await page.goto(url).then((data) => {
            console.log(data)
        })

        await page.type('input[name="name"]', name)
        await page.type('input[name="email"]', email)

        //  await page.type(`input[name="${form_field}"]`, email)

        await page.click('input[type="submit"]')
        // await page.click(`input[type=${click_type}]`)

        //  await page.waitForNavigation({ waitUntil: 'networkidle2' })


        response.status(200).json({
            message: "Form Submited"
        })

        browser.close()

    } catch (error) {
        console.log(error)
    }

}



exports.submiteFormsCheerios = async (request, response) => {

    const email = request.body.email
    const url = request.body.url
    const form_fields = request.body.form_fields
    console.log(form_fields)


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' }).the((data) => {
            console.log(data)
        })

        // works only for field named email only
        await page.type('input[name="contact[email]"]', formData.email);



        await page.click('input[type="submit"]').then((data) => {
            console.log(data)
        }).response.status(200).json({
            message: "Data lister"
        })

        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        response.status(200).json({
            data: "Form Submitted"
        })

    } catch (error) {
        console.error('Error while filling and submitting form:', error);
    } finally {
        await browser.close();
    }
}





