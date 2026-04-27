let lists = document.querySelectorAll('#left button')
for (let lst of lists){
    lst.addEventListener('click', e=>{
        if (e.target.dataset.target){
            document.querySelectorAll('.links').forEach(block =>{block.classList.remove('actLink')})
            document.querySelector('#' + e.target.dataset.target).classList.add('actLink');
        }
    })
}
let teach = document.querySelector('#teach_link')
let post = document.querySelector('#post_link')
let special = document.querySelector('#special_link')

document.querySelector('#but_post').addEventListener('click', async e=>{
    const res = await fetch('http://127.0.0.1:8000/admin/posts', {
        method: "GET",
        credentials: 'include'})
    const json = await res.json()
    // <img class="news_img" src="/static/${p.foto}" alt="фото">
    post.innerHTML = json.map(p => `
        <div id="post">
            <div class="du_info">
                <h3 class="h2_js">${p.headerP}</h2>  
                <div>              
                    <button onclick="editPost(${p.id_post})" class="db_but">Редактировать</button>
                    <button onclick="deletePost(${p.id_post})" class="db_but">Удалить</button>
                </div>
            </div>
            <div id="card_info">
                <p class="news_text">${p.contentP}</p>
            </div>
        </div>
    `).join('')  
})               
document.querySelector('#but_teach').addEventListener('click', async e=>{
    const res = await fetch('http://127.0.0.1:8000/admin/teacher', {
        method: 'GET',
        credentials: 'include'})
    const json = await res.json()
    teach.innerHTML = json.map(t => `
            <div id="posts">
                <div class="du_info">
                    <h3 class="h2_js">${t.surname} ${t.name}</h3>
                    <div>
                        <button onclick="editPost(${t.id_teacher})" class="db_but">Редактировать</button>
                        <button onclick="deletePost(${t.id_teacher})" class="db_but">Удалить</button>
                    </div>
                </div>
            </div>
            <hr id="hr_div">
        `).join('')
})
document.querySelector('#but_spec').addEventListener('click', async e=>{
    const res = await fetch('http://127.0.0.1:8000/admin/specialty', {
        method: 'GET',
        credentials: 'include'})
    const json = await res.json()
    special.innerHTML = json.map(s => `
            <div id="posts"> 
                <div class="du_info">
                    <h3 class="h2_js">${s.title}</h3>
                    <div>
                        <button onclick="editPost(${s.id_specialty})" class="db_but">Редактировать</button>
                        <button onclick="deletePost(${s.id_specialty})" class="db_but">Удалить</button>
                    </div>
                </div>
            <p class="news_text">${s.description}</p>
            </div>      
            <hr id="hr_div">
        `).join('')
})