document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById('inputText');
    const transText = document.getElementById('transText');
    const selectedLang = document.getElementById('selectedLang');
    const saveBtn = document.getElementById('saveBtn');
    const dbResult = document.getElementById('dbResult');
    const showBtn = document.getElementById('showBtn');

    // выковыриваем из куки значение дефолтового языка
    const cookieLangValue = document.cookie.replace(/(?:(?:^|.*;\s*)lang\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    //если нет такого значения, то не ставим его списку
    if (cookieLangValue) {
        selectedLang.value = cookieLangValue;
    }

    //после изменении языка в списке очищаем инпут и ставим (меняем) значение lang в куку
    selectedLang.addEventListener("change", () => {
        inputText.value = "";
        document.cookie = `lang=${selectedLang.value}`;
    });

    //после изменения input фетчим запрос на яндекс-транслейт и выводим результат
    inputText.addEventListener("change", async () => {
        const url = new URL('https://translate.yandex.net/api/v1.5/tr.json/translate');
        url.search = new URLSearchParams({
            key: "trnsl.1.1.20181129T142159Z.6244355c0c2a243e.61a7a1248ef538f61bc4c3617d4c03475a704eb2",
            text: inputText.value,
            lang: selectedLang.value,
        });

        const res = await fetch(url);
        const json = await res.json();
        transText.innerText = json.text[0];
    });

    //пост запрос на сервак который умеет json принимать
    saveBtn.addEventListener("click", async () => {
        const res = await fetch("/api/save", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: inputText.value,
                translate: transText.innerText
            })
        });

        if (res.status === 201) {
            dbResult.innerText = "text and transtale saved"
        } else {
            dbResult.innerText = "error"
        }
    });

    //получаем все переводы
    showBtn.addEventListener("click", async () => {
        const res = await fetch("/api/show");
        const json = await res.json();

        console.log(json);
        //и.т.д...

    });

});
