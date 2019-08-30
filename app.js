const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.listen(8000, () => {
    console.log(`Express Server began on port 8000`);
});

app.get('/', (req, res) => {
    res.send(`Node App is running`);
})

// Sum Endpoint which requires two parameters a and b in the query
app.get('/sum', (req, res) => {
    let {a,b} = req.query;
    if(!a){
        return res
                .status(404)
                .send(`A is required`);
    }
    if(!b){
        return res
                .status(404)
                .send(`B is required`);
    }

    // convert both to Decimal Integers
    a = parseInt(a, 10);
    b = parseInt(b, 10);

    // Check if both are numbers or not
    if(isNaN(a)){
        return res
                .status(404)
                .send(`A must be a number`);
    }
    if(isNaN(b)){
        return res
                .status(404)
                .send(`B must be a number`);
    }

    res.send(`The sum of ${a} and ${b} is ${a+b}`);
});


// Cipher Path (currently work only for capital letters)
// requires two parameters text and shift
app.get(`/cipher`, (req,res) => {
    let {text, shift} = req.query;
    let cipherString = '';

    if(!text){
        return res
                .status(404)
                .send(`Text is required`);
    }
    if(!shift){
        return res  
                .status(404)
                .send(`Shift key is requried`);
    }

    // Converting shift to a decimal integer
    shift = parseInt(shift, 10);

    // Check is shift is a number
    if(isNaN(shift)){
        return res      
                .status(404)
                .send(`Shift key must be a number`);
    }

    for(let i = 0; i < text.length; i++){
        let charCode = text[i].charCodeAt(0);
        if(shift > 26){
            shift %= 26;
        }
        charCode += shift;
    }
    res.send(`String Entered: ${text} <br /> Cipher String: ${cipherString}`);
})

