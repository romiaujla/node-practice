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
        
        // if shift is bigger then mod it by 26 
        if(shift > 26){
            shift %= 26;
        }

        // If it is a capital letter
        if(charCode < 97){
            charCode += shift;
            if(charCode > 90){
                charCode -= 26;
            }
        }else{// if it is a small cap letter
            charCode += shift;
            if(charCode > 122){
                charCode -= 26;
            }
        }
        cipherString += String.fromCharCode(charCode);   
    }
    res.send(`String Entered: ${text} <br /> Cipher String: ${cipherString}`);
});


// Lotto Path
// requires an array as a query parameter
app.get('/lotto', (req, res) => {
    let {arr} = req.query;
    let randomArray = [];
    let match = 0;

    // Validate the query
    if(!arr){
        return res
                .status(404)
                .send(`Array is required`);
    }

    if(arr.length !== 6){
        return res
                .status(404)
                .send(`Array should have 6 numbers`);
    }

    // check if all are numbers and map it to change it to integers
    arr = arr.map((strNum) => {
        let intNum = 0;
        intNum = parseInt(strNum, 10);

        // Check if every value in the array is a number
        if(isNaN(intNum)){
            return res
                    .status(404)
                    .send(`All values in the arrat must be a number`);
        }

        return intNum;
    })

    // Creates an with random numbers from 1-20, with no duplicate numbers
    let i = 0;
    do{
        const randomNum = Math.ceil(Math.random() * 20);
        if(!randomArray.includes(randomNum)){
            randomArray.push(randomNum);
            i++;
        }
    }while(i < 6)

    for(let i = 0; i < arr.length; i++){
        // increment match if there is a same number in both array
        if(randomArray.includes(arr[i]))
            match++;
    }

    // Return the Result
    switch(match){
        case 6:
            res.send(`Wow! Unbelievable! You could have won the mega millions!`);
            break;
        case 5:
            res.send(`Congratulations! You win $100!`);
            break;
        case 4:
            res.send(`Congratulations, you win a free ticket`);
            break;
        default:
            res.send(`Sorry, you lose`);
            break;
    }
})

