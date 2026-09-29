const inputText = document.getElementById("inputText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const translateBtn = document.getElementById("translateBtn");
const translatedText = document.getElementById("translatedText");
const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");


translateBtn.addEventListener("click", async function () {

    const text = inputText.value.trim();

    if (text === "") {
        translatedText.textContent = "Please enter some text to translate.";
        return;
    }

    if (sourceLanguage.value === targetLanguage.value) {
        translatedText.textContent = text;
        return;
    }

    translatedText.textContent = "Translating...";

    try {

        const source = sourceLanguage.value;
        const target = targetLanguage.value;

        const url = "https://api.mymemory.translated.net/get?q="
            + encodeURIComponent(text)
            + "&langpair="
            + source
            + "|"
            + target;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation request failed");
        }

        const data = await response.json();

        if (data.responseData &&
            data.responseData.translatedText) {

            translatedText.textContent =
                data.responseData.translatedText;

        } else {

            translatedText.textContent =
                "Translation could not be completed.";

        }

    } catch (error) {

        console.error(error);

        translatedText.textContent =
            "Something went wrong. Please try again.";

    }

});


copyBtn.addEventListener("click", async function () {

    const text = translatedText.textContent;

    if (
        text === "" ||
        text === "Your translation will appear here..."
    ) {
        alert("There is no translated text to copy.");
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        alert("Translation copied successfully!");

    } catch (error) {

        alert("Unable to copy the text.");

    }

});


speakBtn.addEventListener("click", function () {

    const text = translatedText.textContent;

    if (
        text === "" ||
        text === "Your translation will appear here..."
    ) {
        alert("There is no translated text to speak.");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = targetLanguage.value;

    window.speechSynthesis.speak(speech);

});
const swapBtn = document.getElementById("swapBtn");

swapBtn.addEventListener("click", function () {

    const oldSource = sourceLanguage.value;

    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = oldSource;

    inputText.value = translatedText.textContent !==
        "Your translation will appear here..."
        ? translatedText.textContent
        : inputText.value;

    translatedText.textContent =
        "Your translation will appear here...";
});