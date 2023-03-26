const form = document.querySelector('form');
const input = document.querySelector('input');
const search = document.querySelector('.word');
const pos = document.querySelector('.pos');
const definition = document.querySelector('.meaning');
const sound = document.querySelector('.phonetic');
const section = document.querySelector('section');
const formnote = document.querySelector('.formnote');
const err = document.querySelector('.error');
const speak = document.querySelector('.speak');

let audio;

speak.addEventListener('click', function () {
    audio.play();
});

const action = async function (e) {
    e.preventDefault();

    const API_KEY = "your_api_key_here";

    const searchWord = input.value;
    const requestUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}?key=${API_KEY}`;

    try {
        const response = await fetch(requestUrl);
        const data = await response.json();

        const word = data[0].word;
        let audioUrl = '';
        for (const resonate of data[0].phonetics) {
            if (resonate.audio && resonate.audio !== '') {
                audioUrl = resonate.audio;
                break;
            }
        }
        const phonetic = data[0].phonetic;
        const meanings = data[0].meanings
            .map((meaning) => meaning.definitions[0].definition)
            .join('<br>');
        const partOfSpeech = data[0].meanings
            .map((meaning) => meaning.partOfSpeech)
            .join(', ');

        search.innerHTML = word;
        pos.innerHTML = partOfSpeech;
        definition.innerHTML = meanings;
        sound.innerHTML = phonetic;
        if (audioUrl !== '') {
            audio = new Audio(audioUrl);
            speak.classList.remove('hidden');
        } else {
            speak.classList.add('hidden');
        }
        section.classList.remove('hidden');
        formnote.classList.add('hidden');
        err.classList.add('hidden');

    } catch (error) {
        formnote.classList.add('hidden');
        section.classList.add('hidden');
        err.classList.remove('hidden');
        console.error(error);
    }
}

form.addEventListener('submit', action);

document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        action(event)
    }
});
