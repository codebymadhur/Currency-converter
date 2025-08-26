const fromCur = document.querySelector(".from select");
const toCur = document.querySelector(".to select");
const getBtn = document.querySelector("form button");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const dropdowns = document.querySelectorAll(".dropdown select");

// Add event listeners to dropdowns for flag updates
for (let select of dropdowns) {
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Function to update the flag image
const updateFlag = (element) => {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    element.previousElementSibling.src = newSrc;
};

// Event listener for button click
getBtn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    
    let amount = amountInput.value;
    if (amount === "" || amount < 1) {
        amount = 1;
        amountInput.value = "1";
    }

    const fromCurrency = fromCur.value;
    const toCurrency = toCur.value;

    // Using the free and CORS-enabled Frankfurter API
    const API_URL = `https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`;
    
    try {
        let response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();

        // Frankfurter API returns rates in a slightly different format
        let rate = data.rates[toCurrency];
        
        if (rate) {
            let finalAmount = (amount * rate).toFixed(2);
            msg.innerText = `${amount} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
        } else {
            msg.innerText = "Error: Currency rate not found.";
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        msg.innerText = "Something went wrong. Please try again later.";
    }
});

// Initial call to set flags and populate dropdowns on page load
for (let code in countryList) {
    let newOption = document.createElement("option");
    newOption.value = code;
    newOption.textContent = code;
    fromCur.append(newOption);
    
    let newOptionTo = document.createElement("option");
    newOptionTo.value = code;
    newOptionTo.textContent = code;
    toCur.append(newOptionTo);
}
fromCur.value = "USD";
toCur.value = "INR";
updateFlag(fromCur);
updateFlag(toCur);