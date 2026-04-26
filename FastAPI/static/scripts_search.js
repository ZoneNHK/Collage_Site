let inp_search = document.querySelector('.input_head2')
let res_search = document.querySelector('#res_search_div')
const params = new URLSearchParams(window.location.search)
const value = params.get('value')
async function search_info(param) {
    let html = ''
    const [teacher, specialty, post] = await Promise.all([
        fetch(`http://127.0.0.1:8000/search/teachers?surname=${inp_search.value}`).then(async r => {
            let teach = await r.json()
            html += teach.map(post => `
                <div id="posts">
                    <h3 class="h2_js">Преподаватель - ${post.surname} ${post.name}</h3>
                </div>
                `).join('')
        }),
        fetch(`http://127.0.0.1:8000/search/specialty?title=${inp_search.value}`).then(async r =>{
            let special = await r.json()
            html += special.map(post=>`
                <div id="posts">
                    <h3 class="h2_js">Специальность - ${post.title}</h3>
                    <p class="news_text">${post.description}</p>
                </div>
                `).join('')
        }),
        fetch(`http://127.0.0.1:8000/search/posts?head=${inp_search.value}`).then(async r=>{
            let posts = await r.json()
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

if (value){
    inp_search.value = value
    search_info(inp_search)
    history.replaceState({}, '', '/search-page')
}

const keywords = {
    'преподаватели': {
        fetch: () => fetch('/search/teachers'),
        template: item => `
            <div id="posts">
                <h3 class="h2_js">${item.surname} ${item.name}</h3>
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
        const inp = inp_search.value.toLowerCase().trim()
        if (keywords[inp]) {
            const resp = await keywords[inp].fetch()
            const data = await resp.json()
            res_search.innerHTML = data.map(keywords[inp].template).join('')
        } else {
            search_info(inp)
        }   
        }
})
document.querySelector('#back_div').addEventListener('click', e=>{
    location.href = '/static/index.html'
})
