const fs = require('fs')

var input = fs.readFileSync('./input.txt', 'utf8')

var debug = false

function cl(text) {
    if( debug ) console.log(text)
}

function clu(text) {
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
function find_in_relations_by_word(word) {
    return relations.findIndex(x => x.word == word);
}

// Поиск индекса в массиве по ID
function find_in_relations_by_id(id) {
    return relations.findIndex(x => x.id == id);
}

// Парсер списка слов
// Формирует массив со списком слов с отношениями

for( i = words.length-1; i >= 0; i-- ) {
    if( i == words.length-1 ) // first word
    {
        cl('')
        cl(`Первое слово: "${words[i]}"`)
        relations.push({id:i, word: words[i], nexts: []})
    }
    else
    {
        let current = words[i]
        let next = words[i+1]

        cl('')
        cl(`Слово "${current}" на барабане, а после него идёт "${next}"`)

        if ( find_in_relations_by_word(current) > -1 ) // Already exist
        {
            cl(`= Слово "${current}" уже есть в массиве Relations`)

            let next_id = relations[find_in_relations_by_word(next)].id

            cl("А вот его nexts:")
            cl(relations[find_in_relations_by_word(current)].nexts)

            cl(`Попробуем найти слово "${next}" среди его nexts...`)
            let isExist = relations[find_in_relations_by_word(current)].nexts.findIndex(x => x.word == next)
            cl(isExist)

            if( isExist > -1 ) {
                cl(`У слова "${current}" уже есть следующее слово "${next}"`)
                cl(`Нужно прибавить к count 1...`)
                relations[find_in_relations_by_word(current)].nexts[isExist].count++
                cl(`Готово`)
                cl(relations[find_in_relations_by_word(current)].nexts)
            } else {
                cl(`Добавляем новый next`)
                relations[find_in_relations_by_word(current)].nexts.push({
                    id: next_id,
                    word: next,
                    count: 1
                })
            }

        }
        else // New next word
        {
            cl(`+ Слово "${current}" улетает в массив Relations`)

            // cl('+ not exist: ' + find_in_relations_by_word(current) )
            relations.push({id:i, word: current, nexts: []})
            let next_id = relations[find_in_relations_by_word(next)].id
            // relations[find_in_relations_by_word(current)].nexts.push(next_id)
            relations[find_in_relations_by_word(current)].nexts.push({
                id: next_id,
                word: next,
                count: 1
            })
        }
    }
}

// Сортируем все nexts по популярности слов

function compare(a, b) {
    if (a.count > b.count) return -1;
    if (b.count > a.count) return 1;

    return 0;
}

relations.forEach((word) => {
    word.nexts.sort(compare)
})

// clu(relations)
// clu(relations[5].nexts)
// return false


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
    let index = find_in_relations_by_word(word)
    // cl('Индекс текущего слова = ' + index)
    cl(`Слово "${word}", индекс ${index}`)
    let countNexts = relations[index].nexts.length
    cl(`Количество nexts для текущего слова = ${countNexts}`)
    if ( countNexts < 1 )
    {
        return selectRandomWord()
    }
    else
    {
        // let random
        // if( countNexts > 1 ) {
        //     random = Math.round(Math.random() * Math.floor(1));
        // } else {
        //     random = 0;
        // }
        // cl(`RANDOM = ${random}`)
        // let random_word = relations[index].nexts[random];
        // cl(`Ищу ID следующего слова, выбирая его случайно из лучших вариантов...`)
        // cl(`ID = ${index}`)
        // cl(`Слово:`)
        // cl(random_word)
        // return random_word.word

        let id = relations[index].nexts[Math.floor(Math.random()*countNexts)].id;
        return relations[find_in_relations_by_id(id)].word


    }
}

function sort_nexts(index)
{
    function compare(a, b) {
        if (a > b) return 1;
        if (b > a) return -1;

        return 0;
    }
    relations[index].nexts.sort(compare);
}

clu("")
clu("=============================================")
clu("")

var output, word
for( line=0; line < 10; line++ )
{
    var output = ""
    var word = selectRandomWord()
    for( i=0; i<16; i++ ) {
        word = findNext(word)
        output += word + " "
    }
    clu(output)
}
