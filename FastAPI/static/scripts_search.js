let inp_search = document.querySelector('.input_head2')
let res_search = document.querySelector('#res_search_div')
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
let input = document.querySelector('.input_head2')
const params = new URLSearchParams(window.location.search)
const value = params.get('value')
if (value){
    input.value = value
    search_info(input)
    history.replaceState({}, '', '/search-page')
}

input.addEventListener('keydown', e=>{
    if (e.key == "Enter"){
        if (input.value !== ''){
            search_info(input)
        }
    }
})

document.querySelector('#back_div').addEventListener('click', e=>{
    location.href = '/static/index.html'
})