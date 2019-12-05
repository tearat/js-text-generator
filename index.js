const fs = require('fs')

var input = fs.readFileSync('./input.txt', 'utf8')

function cl(text) {
    console.log(text)
}

// ==============
// Обработка исходного текста, удаление всего, кроме текстовых символов
// Формирование чистого последовательного списка слов

var re = /\n/gi;
input = input.replace(re, ' ');
var re = /[^ a-zа-яё\d]/gi;
input = input.replace(re, '');

var array = input.split(' ')
var words = []

array.forEach((word, index) => {
    if (word != '') {
        words.push(word.toLowerCase())
    }
})

// cl(words)


var relations = []


// Поиск индекса в массиве по слову
function findIndexByWord(word) {
    return relations.findIndex(x => x.word == word);
}

// Поиск индекса в массиве по ID
function findIndexById(id) {
    return relations.findIndex(x => x.id == id);
}

// Парсер списка слов
// Формирует массив со списком слов с отношениями

for( i = words.length-1; i >= 0; i-- ) {
    // cl(i)
    if( i == words.length-1 )
    {
        // cl("first: " + words[i])
        relations.push({id:i, word: words[i], nexts: []})
    }
    else
    {
        let current = words[i]
        let next = words[i+1]
        // cl("current: " + current)
        // cl("next: " + next)
        if ( findIndexByWord(current) > -1 )
        {
            // cl('+ already exist: ' + findIndexByWord(current) )
            let next_id = relations[findIndexByWord(next)].id
            relations[findIndexByWord(current)].nexts.push(next_id)
        }
        else
        {
            // cl('+ not exist: ' + findIndexByWord(current) )
            relations.push({id:i, word: current, nexts: []})
            let next_id = relations[findIndexByWord(next)].id
            relations[findIndexByWord(current)].nexts.push(next_id)
        }
    }
}

// cl(relations)

// Генератор текста не основе обучения

function selectRandomWord()
{
    // cl('Ищу случайное слово...')
    let random = Math.floor(Math.random()*relations.length)
    // cl('Случайный индекс = ' + random)
    return relations[random].word;
}

function findNext(word)
{
    let index = findIndexByWord(word)
    // cl('Индекс текущего слова = ' + index)
    // cl('word = ' + word)
    // cl('Текущее слово: ')
    // cl(relations[index])
    let countNexts = relations[index].nexts.length
    // cl('Количество nexts для текущего слова = ' + countNexts + " : " + relations[index].nexts)
    if ( countNexts < 1 )
    {
        return selectRandomWord()
    }
    else
    {
        let id = relations[index].nexts[Math.floor(Math.random()*countNexts)];
        // cl('Ищу ID следующего слова, выбирая его случайно из ' + countNexts + ' вариантов...')
        // cl('ID = ' + id)
        return relations[findIndexById(id)].word
    }
}

var output, word
for( line=0; line < 10; line++ )
{
    var output = ""
    var word = selectRandomWord()
    for( i=0; i<10; i++ ) {
        word = findNext(word)
        output += word + " "
    }
    cl(output)
}
