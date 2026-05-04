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

let inp_search = document.querySelector('.input_head2')
let res_search = document.querySelector('#res_search_div')
const params = new URLSearchParams(window.location.search)
const value = params.get('value')
async function search_info(param) {
    if (param != ''){
        let html = ''
        const [teacher, specialty, post] = await Promise.all([
            fetch(`http://127.0.0.1:8000/search/teachers?name=${param}&surname=${param}&otch=${param}`).then(async r => {
                let teach = await r.json()
                console.log(teach)
                html += teach.map(post => `
                    <div id="posts">
                        <h3 class="h2_js">Преподаватель - ${post.surname} ${post.name} ${post.otch}</h3>
                    </div>
                    `).join('')
            }),
            fetch(`http://127.0.0.1:8000/search/specialty?title=${param}`).then(async r =>{
                let special = await r.json()
                html += special.map(post=>`
                    <div id="posts">
                        <h3 class="h2_js">Специальность - ${post.title}</h3>
                        <p class="news_text">${post.description}</p>
                    </div>
                    `).join('')
            }),
            fetch(`http://127.0.0.1:8000/search/posts?head=${param}`).then(async r=>{
                let posts = await r.json()
                console.log(posts)
                html += posts.map(post=>`
                    <div id="posts">
                        <h3 class="h2_js">Пост - ${post.headerP}</h3>
                        <p class="news_text">${post.contentP}</p> 
                    </div>
                    `).join('')
            })
        ])
        res_search.innerHTML = html
    }
    else {
        res_search.innerHTML = "<h2>По вашему запросу ничего не найдено</h2>"
    }
}

if (value){
    inp_search.value = value
    search_info(value)
    history.replaceState({}, '', '/search-page')
}

const keywords = {
    'преподаватели': {
        fetch: () => fetch('/search/teachers'),
        template: item => `
            <div id="posts">
                <h3 class="h2_js">${item.surname} ${item.name} ${item.otch}</h3>
            </div><br><br>`   
    },
    'специальности': {
        fetch: () => fetch('/search/specialty'),
        template: item => `
            <div id="posts">
                <h3 class="h2_js">${item.title}</h3>
                <p class="news_text">${item.description}</p>
            </div><br><br>`
    },
    'новости': {
        fetch: () => fetch('/search/posts'),
        template: item => `
            <div id="posts">
                <h3 class="h2_js">${item.headerP}</h3>
                <p class="news_text">${item.contentP}</p> 
            </div><br><br>`
    }
}
keywords['учителя'] = keywords['преподаватели']
keywords['педагоги'] = keywords['преподаватели']

inp_search.addEventListener('keydown', async e=>{
    if (e.key == "Enter"){
        const inp = inp_search.value.trim()
        if (keywords[inp.toLowerCase()]) {
            const resp = await keywords[inp.toLowerCase()].fetch()
            const data = await resp.json()
            res_search.innerHTML = data.map(keywords[inp.toLowerCase()].template).join('')
        } else {
            search_info(inp)
        }   
        }
})
document.querySelector('#back_div').addEventListener('click', e=>{
    location.href = 'http://127.0.0.1:8000/'
})
