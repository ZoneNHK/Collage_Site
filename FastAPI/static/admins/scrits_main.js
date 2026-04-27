let lists = document.querySelectorAll('#left button')
for (let lst of lists){
    lst.addEventListener('click', e=>{
        if (e.target.dataset.target){
            document.querySelectorAll('.links').forEach(block =>{block.classList.remove('actLink')})
            document.querySelector('#' + e.target.dataset.target).classList.add('actLink');
        }
    })
}
let teach = document.querySelector('#teach_list')
let post = document.querySelector('#post_list')
let special = document.querySelector('#special_list')

async function loadPosts() {
    const res = await fetch('http://127.0.0.1:8000/admin/posts', {
        method: "GET",
        credentials: 'include'
    })
    const json = await res.json()
    document.querySelector('#post_list').innerHTML = json.map(p => `
        <div id="post">
            <div class="du_info">
                <h3 class="h2_js">${p.headerP}</h3>  
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
}

async function loadTeachers() {
    const res = await fetch('http://127.0.0.1:8000/admin/teacher', {
        method: 'GET',
        credentials: 'include'
    })
    const json = await res.json()
    document.querySelector('#teach_list').innerHTML = json.map(t => `
        <div id="posts">
            <div class="du_info">
                <h3 class="h2_js">${t.surname} ${t.name}</h3>
                <div>
                    <button onclick="editTeacher(${t.id_teacher})" class="db_but">Редактировать</button>
                    <button onclick="deleteTeacher(${t.id_teacher})" class="db_but">Удалить</button>
                </div>
            </div>
        </div>
        <hr id="hr_div">
    `).join('')
}

async function loadSpecialties() {
    const res = await fetch('http://127.0.0.1:8000/admin/specialty', {
        method: 'GET',
        credentials: 'include'
    })
    const json = await res.json()
    document.querySelector('#special_list').innerHTML = json.map(s => `
        <div id="posts"> 
            <div class="du_info">
                <h3 class="h2_js">${s.title}</h3>
                <div>
                    <button onclick="editSpecialty(${s.id_specialty})" class="db_but">Редактировать</button>
                    <button onclick="deleteSpecialty(${s.id_specialty})" class="db_but">Удалить</button>
                </div>
            </div>
            <p class="news_text">${s.description}</p>
        </div>      
        <hr id="hr_div">
    `).join('')
}

document.querySelector('#but_post').addEventListener('click', () => loadPosts())
document.querySelector('#but_teach').addEventListener('click', () => loadTeachers())
document.querySelector('#but_spec').addEventListener('click', () => loadSpecialties())


async function deletePost(id) {
    const res = await fetch(`http://127.0.0.1:8000/admin/posts?id=${id}`, {
        method: "DELETE",
        credentials: 'include'
    })
    if (res.ok){
        console.log('message:', 'Данные удалены')
        loadPosts()
    }
}
async function deleteTeacher(id) {
    const res = await fetch(`http://127.0.0.1:8000/admin/teacher?id=${id}`, {
        method: "DELETE",
        credentials: 'include'
    })
    if (res.ok){
        console.log('message:', 'Данные удалены')
        loadTeachers()
    }
}
async function deleteSpecialty(id) {
    const res = await fetch(`http://127.0.0.1:8000/admin/specialty?id=${id}`, {
        method: "DELETE",
        credentials: 'include'
    })
    if (res.ok){
        console.log('message:', 'Данные удалены')
        loadSpecialties()
    }
}

document.querySelector('#addPost').addEventListener('click', async e=> {
    const post = {
        foto: document.querySelector('#post_foto').value,
        headerP: document.querySelector('#post_head').value,
        contentP: document.querySelector('#post_cont').value
    }
    const res = await fetch('http://127.0.0.1:8000/admin/posts', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(post)
    })
    if (res.ok){
        console.log('message:', 'Запись успешно добавлена')
        loadPosts()
    }
})
document.querySelector('#add_Teacher').addEventListener('click', async e=>{
    const teachers = {
        surname: document.querySelector('#teach_surn').value,
        name: document.querySelector('#teach_name').value,
        id_specialty: parseInt(document.querySelector('#teach_spec').value)
    }
    const res = await fetch('http://127.0.0.1:8000/admin/teacher', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(teachers)
    })
    if (res.ok) {
        console.log('message:', 'Запись успешно добавлена')
        loadTeachers()
    }
})
document.querySelector('#addSpecialty').addEventListener('click', async e=>{
    const specialtys = {
        title: document.querySelector('#spec_title').value,
        description: document.querySelector('#spec_desc').value
    }
    const res = await fetch('http://127.0.0.1:8000/admin/specialty',{
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(specialtys)
    })
    if (res.ok) {
        console.log('message:', 'Запись успешно добавлена')
        loadSpecialties()
    }
})