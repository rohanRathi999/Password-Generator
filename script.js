const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = ' !~`@#$%&*(){}[]?_-<>,|./+^ '

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText = passwordLength;
    // const min =inputSlider.min;
    // const max =inputSlider.max;
    // inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInt(0,9);
}

function generateLowercase(){
    return String.fromCharCode(getRandomInt(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInt(65,91));
}

function generateSymbol(){
    const randomSymbol = getRandomInt(0,symbols.length);
    return symbols.charAt(randomSymbol);
}

function sufflePassword(array){
    for(let i = array.length - 1;i > 0 ; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNum = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked) hasSymbol = true;
    if(numbersCheck.checked) hasNum = true;

    if((hasLower || hasUpper) && hasSymbol && hasNum && passwordLength>=9){
        setIndicator("#0f0");
    }
    else if((hasLower|| hasUpper) && (hasSymbol || hasNum) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML = "Copied";
    }
    catch (e){
        copyMsg.innerHTML = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },1500);
}

function handleCheckboxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
           checkCount++;
           if(passwordLength<checkCount){
              lengthDisplay.innerText=checkCount;
              inputSlider.value=checkCount;
           }
        }
    })
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckboxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value)
       copyContent();
});

generateBtn.addEventListener('click', ()=>{
    if(checkCount==0) return;
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    password = "";
    
    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
       funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
       funcArr.push(generateLowercase);
    if(numbersCheck.checked)
       funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
       funcArr.push(generateSymbol);

    for(let i =0;i<funcArr.length;i++){
        password+= funcArr[i]();
    }
    for(let i=0;i<passwordLength - funcArr.length;i++){
        let randomIndex = getRandomInt(0,funcArr.length);
        password += funcArr[randomIndex]();
    }

    password = sufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
})