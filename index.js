import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
const API_gender = "https://api.genderize.io?name=";
const API_age = "https://api.agify.io?name=";
const API_ethnicity = "https://api.nationalize.io/?name=";

function max_ethnicity(country) {
    let place = country[0].country_id;
    let max = country[0].probability;
    for (let i = 0; i < country.length; i++) {
        if (country[i].probability > max) {
            place = country[i].country_id;
        }
    }
    return place;
}

app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.post("/result", async (req, res) => {
    try {
        const res_gender = await axios.get(API_gender + req.body.fname);
        const res_age = await axios.get(API_age + req.body.fname);
        const res_ethnicity = await axios.get(API_ethnicity + req.body.lname);
        const result = {
            fname: req.body.fname,
            age: res_age.data.age,
            gender: res_gender.data.gender,
            ethinicity: max_ethnicity(res_ethnicity.data.country)
        };
        console.log(result);
        res.render("index.ejs", { content: result });
    } catch (error) {
        console.log(error);
        res.render("index.ejs", { error: error.message });
    }

});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})