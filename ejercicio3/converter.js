class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl=apiUrl;
        this.currencies=[];
    }
    async getCurrencies() {
        const response= await fetch(`${this.apiUrl}/currencies`);
        const data= await response.json();
        for(const [key, value] of Object.entries(data)){
            // console.log(key,":",value)
            const currency= new Currency(key,value);
            this.currencies.push(currency);
          }
    }
    async convertCurrency(amount, fromCurrency, toCurrency) {
        // console.log(amount, fromCurrency, toCurrency)   //2,Currency {code: 'EUR', name: 'Euro'}, {..}
        try {
            if(fromCurrency.code != toCurrency.code){
                const response= await fetch(`${this.apiUrl}/latest`)
                const data= await response.json();
                // console.log(data)
                const valorMonedas=data["rates"];//todas las conversiones (cantidad=1) {key:value, key:value, ......}
                if (toCurrency.code in valorMonedas){
                    let valor= valorMonedas[toCurrency.code];
                    amount=amount*valor;
                    console.log(amount)
                }
                return amount;
            }
            return amount
        } catch (error) {
            return null;
        }
    };
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
