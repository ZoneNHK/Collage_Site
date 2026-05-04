let wind_menu = document.querySelector('.wind_menu');
document.querySelector('.menu_a').addEventListener('click', ()=>{
    wind_menu.classList.add('active');
    
})

document.querySelector('#exit_but').addEventListener('click', ()=>{
    wind_menu.classList.remove('active');
    document.getElementById('menu_welcome').style.display = 'block';
    document.querySelectorAll('.links_menu').forEach(block => {
        block.classList.remove('active_link')
    });
})

document.addEventListener('keydown', e =>{
    if (e.key === 'Escape'){
        wind_menu.classList.remove('active');  
    }
})


document.querySelector('#studs').addEventListener('mouseover', ()=>{
    let lst = document.querySelector('.stud_list');
    lst.classList.add('active_lst');
})
document.querySelector('#studs').addEventListener('mouseout', ()=>{
    let lst = document.querySelector('.stud_list');
    lst.classList.remove('active_lst');
})


document.querySelector('#abits').addEventListener('mouseover', ()=>{
    let lst = document.querySelector('.abitur_list');
    lst.classList.add('active_lst');
})
document.querySelector('#abits').addEventListener('mouseout', ()=>{
    let lst = document.querySelector('.abitur_list');
    lst.classList.remove('active_lst');
})


let list = document.querySelectorAll('.choice_menu');
for (let lst of list){
    lst.addEventListener('click', e=>{
        if (e.target.dataset.target){
            document.querySelectorAll('.links_menu').forEach(block => {block.classList.remove('active_link')});
            document.querySelector('#' + e.target.dataset.target).classList.add('active_link');
            document.getElementById('menu_welcome').style.display = 'none'; 
        }
        
    }
)}


document.querySelector('.input_head').addEventListener('keydown', e=>{
    if (e.key == "Enter"){
        location.href = `/static/search.html?value=${document.querySelector('.input_head').value}`
    }
})

let page = 1
const limit = 4
let total = 1
async function pages(param){
    const resp = await fetch(`http://127.0.0.1:8000/posts?page=${param}&limit=${limit}`)
    const posts = await resp.json()
    total = Math.ceil(posts.total / limit)
    const container = document.querySelector('#posts_container')
    console.log(posts)
    container.innerHTML = posts.posts.map(post => `
        <div id="post">
            <a id="links_a" href="${post.links}" target="_blank">${post.headerP}</a>
            <div id="card_info">
                <img class="news_img" src="${post.foto}" alt="фото">
                <p class="news_text">${post.contentP}</p>
            </div>
        </div>
    `).join('')  
}
addEventListener('load', e=>{
    pages(1)
})
document.querySelector('#left_but').addEventListener('click', e=>{
    if (page-1 != 0) {
        page--
        pages(page)
    }
    else {
        pages(1)
    }
})

document.querySelector('#rigth_but').addEventListener('click', e=>{
    if (page < total) {
        page++
        pages(page)
    }
        else {
            page++
            pages(page)
        }
})
let inp = document.querySelector('#enter_inp')
inp.addEventListener('keydown', e=>{
    if (e.key === 'Enter'){
        let val = parseInt(inp.value)
        if (val && val > 0 && val <= total){
            page = val 
            pages(page)
        }
        else {
        inp.value = 1
        pages(inp.value)
        }
    }
})
const bottom = document.querySelector('#bottom')
const prevBtn = document.querySelector('#prev_btn')
const nextBtn = document.querySelector('#next_btn')

const cardWidth = 550 + 35 // ширина карточки + gap
let current = 0
const totals = document.querySelectorAll('.card_info').length

nextBtn.addEventListener('click', () => {
    if (current < totals - 4) { 
        current++
        bottom.style.transform = `translateX(-${current * cardWidth}px)`
    }
})

prevBtn.addEventListener('click', () => {
    if (current > 0) {
        current--
        bottom.style.transform = `translateX(-${current * cardWidth}px)`
    }
})


let but_show = document.querySelector('#show_dialog')
but_show.addEventListener('click', e=>{
    but_show.style.display = 'none'
    document.querySelector('#card_bot').classList.add('active')
})
document.querySelector('#exit_bot_but').addEventListener('click', e=>{
    document.querySelector('#card_bot').classList.remove('active')
    but_show.style.display = 'block'
})

const question_answer = {
    'привет' : 'Здравствуйте! Чем я могу вам помочь?',
    'пока': 'До свидания! Обращайтесь в любое время.',
    'стипендия': 'На данные момент стипендия составляет:<br> 4,0-4,49 - 1362,00<br> 4,5-4,99 - 1702,00<br> 5,0 - 2043,00',
    'адрес': "Текущий адрес колледжа: респ.ЛНР, г.Алчевск, ул.Дунауйварошская, 14",
    'контакты': 'Телефон для справок:<br> - +7 (85742) 5-23-88<br> - +7 (959) 171-28-92',
}
question_answer['здравствуй'] = question_answer['привет']
question_answer['здравствуйте'] = question_answer['привет']
question_answer['до свидания'] = question_answer['пока']


function answer(params) {
    const messages = document.querySelector('#messages')
    messages.innerHTML += `
        <div class="user_message">
            <div class="bubble_user">${params}</div>
        </div>`
    let find = ''
    let func = Object.keys(question_answer).some(key => {
        if (params.toLowerCase().includes(key.toLowerCase())){
            find = key.toLowerCase()
            return true
        }
        else return false
    })
    if (func){
        messages.innerHTML += `
        <div class="bot_message">
            <div class="avatar"><p>🤖</p></div>
            <div class="bubble_bot">${question_answer[find]}</div>
        </div> ` 
        }
    else if(!func){
        messages.innerHTML += `
        <div class="bot_message">
            <div class="avatar"><p>🤖</p></div>
            <div class="bubble_bot">Извините! Я не понял ваше сообщение.</div>
        </div> `   
        }
        messages.scrollTop = messages.scrollHeight
}

let user_inputs = document.querySelector('#send_input')
user_inputs.addEventListener('keydown', e=>{
    if (user_inputs.value != ''){
        if (e.key == 'Enter'){
            answer(user_inputs.value)
            user_inputs.value = ''
        }
    }
    
})
document.querySelector('#send_but').addEventListener('click', e=>{
    if (user_inputs.value != ''){
        answer(user_inputs.value)
        user_inputs.value = ''
    }
})
