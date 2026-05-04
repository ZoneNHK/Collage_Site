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
        <div class="post">
            <div class="du_info">
                <div>
                    <h3 id="head_${p.id_post}" class="h2_js">${p.headerP}</h3>  
                    <p id="lik_${p.id_post}" class="h2_js">${p.links}</p>
                </div>
                <div id="post_${p.id_post}" data-foto="${p.foto}" class="div_crud">             
                    <button onclick="editPost(${p.id_post})" class="db_but">Редактировать</button>
                    <button onclick="deletePost(${p.id_post})" class="db_but">Удалить</button>
                    <button id="save_${p.id_post}" class="db_but" style="display:none">Сохранить</button>
                </div>
            </div>
            <div class="card_info">
                <img id="img_${p.id_post}" class="news_img" src="${p.foto}">
                <input type="file" id="foto_inp_${p.id_post}" accept=".jpg,.jpeg,.png" style="display:none" class="news_img">
                <p id="con_${p.id_post}" class="news_text">${p.contentP}</p>
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
                <div id="teacher_${t.id_teacher}" data-specialty="${t.id_specialty}">
                    <h3 id="surname_${t.id_teacher}" class="h2_js">${t.surname}</h3>
                    <div>
                        <h3 id="name_${t.id_teacher}">${t.name}</h3>
                        <h3 id="ot_${t.id_teacher}">${t.otch}</h3>
                    </div>
                </div>
                <div class="div_crud">
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
                <h3 id="title_${s.id_specialty}" class="h2_js">${s.title}</h3>
                <div class="div_crud">
                    <button onclick="editSpecialty(${s.id_specialty})" class="db_but">Редактировать</button>
                    <button onclick="deleteSpecialty(${s.id_specialty})" class="db_but">Удалить</button>
                </div>
            </div>
            <p id=desc_${s.id_specialty} class="news_text">${s.description}</p>
        </div>      
        <hr id="hr_div">
    `).join('')
}

document.querySelector('#but_post').addEventListener('click', () => loadPosts())
document.querySelector('#but_teach').addEventListener('click', () => loadTeachers())
document.querySelector('#but_spec').addEventListener('click', () => loadSpecialties())

async function editPost(id) {
    const hd = document.querySelector(`#head_${id}`)
    const ct = document.querySelector(`#con_${id}`)
    const lk = document.querySelector(`#lik_${id}`)
    const img = document.querySelector(`#img_${id}`)
    const fotoInp = document.querySelector(`#foto_inp_${id}`)
    const saveBtn = document.querySelector(`#save_${id}`)
    img.style.display = 'none'
    fotoInp.style.display = 'inline'
    hd.setAttribute('contenteditable', 'true')
    ct.setAttribute('contenteditable', 'true')
    lk.setAttribute('contenteditable', 'true')
    hd.focus()
    saveBtn.style.display = 'inline'
    saveBtn.addEventListener('click', async () => {
        hd.removeAttribute('contenteditable')
        ct.removeAttribute('contenteditable')
        lk.removeAttribute('contenteditable')
        const formData = new FormData()
        if (fotoInp.files.length > 0){
            formData.append('foto', fotoInp.files[0]) 
        }
        formData.append('hedP', hd.innerHTML)
        formData.append('contP', ct.innerHTML)
        formData.append('lk', lk.innerHTML)
        saveBtn.style.display = 'none'
        img.style.display = 'inline'
        fotoInp.style.display = 'none'
        const res = await fetch(`http://127.0.0.1:8000/admin/posts?id=${id}`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
        })
        console.log(res.status)
        loadPosts()
    }, {once: true})
}

async function editTeacher(id) {
    const sn = document.querySelector(`#surname_${id}`)
    const nm = document.querySelector(`#name_${id}`)
    const ot = document.querySelector(`#ot_${id}`)
    const sp_id = document.querySelector(`#teacher_${id}`).dataset.specialty
    sn.setAttribute('contenteditable', 'true')
    nm.setAttribute('contenteditable', 'true')
    ot.setAttribute('contenteditable', 'true')
    sn.focus()
    ot.addEventListener('blur', async ()=>{
        sn.removeAttribute('contenteditable')
        nm.removeAttribute('contenteditable')
        ot.removeAttribute('contenteditable')
        await fetch(`http://127.0.0.1:8000/admin/teacher?id=${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                surname: sn.innerHTML,
                name: nm.innerHTML,
                otch: ot.innerHTML,
                id_specialty: parseInt(sp_id)
            })
        })
        loadTeachers()
    }, {once: true})
}

async function editSpecialty(id) {
    const title = document.querySelector(`#title_${id}`)
    const desc = document.querySelector(`#desc_${id}`)
    title.setAttribute('contenteditable', 'true')
    desc.setAttribute('contenteditable', 'true')
    title.focus()
    desc.addEventListener('blur', async ()=>{
        title.removeAttribute('contenteditable')
        desc.removeAttribute('contenteditable')
        await fetch(`http://127.0.0.1:8000/admin/specialty?id=${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                title: title.innerHTML,
                description: desc.innerHTML
            })
        })
        loadSpecialties()
    }, {once: true})
}

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
    const fotoFile = document.querySelector('#post_foto').files[0]
    const formData = new FormData()
    formData.append('foto', fotoFile)
    formData.append('hedP', document.querySelector('#post_head').value)
    formData.append('contP', document.querySelector('#post_cont').value)
    formData.append('lk', document.querySelector('#post_link').value)
    const res = await fetch('http://127.0.0.1:8000/admin/posts', {
        method: 'POST',
        credentials: 'include',
        body: formData
    })
    if (res.ok){
        console.log('message:', 'Запись успешно добавлена')
        loadPosts()
        document.querySelector('#post_foto').value = ""
        document.querySelector('#post_head').value = ""
        document.querySelector('#post_cont').value = ""
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
        document.querySelector('#teach_surn').value = ""
        document.querySelector('#teach_name').value = ""
        document.querySelector('#teach_spec').value = ""
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
        document.querySelector('#spec_title').value = ""
        document.querySelector('#spec_desc').value = ""
    }
})


const post_search = document.querySelector('#search_post')
document.querySelector('#res_seach_post').addEventListener('click', async e=>{
    if (post_search.value != ''){
        const res = await fetch(`http://127.0.0.1:8000/admin/search/post?hdP=${post_search.value.trim()}&ctP=${post_search.value.trim()}`,{
            method: 'GET',
            credentials: 'include'
        })
        const json = await res.json()
        document.querySelector('#post_list').innerHTML = json.map(p => `
            <div class="post">
                <div class="du_info">
                    <h3 id="head_${p.id_post}" class="h2_js">${p.headerP}</h3>  
                    <div id="post_${p.id_post}" data-foto="${p.foto}">             
                        <button onclick="editPost(${p.id_post})" class="db_but">Редактировать</button>
                        <button onclick="deletePost(${p.id_post})" class="db_but">Удалить</button>
                        <button id="save_${p.id_post}" class="db_but" style="display:none">Сохранить</button>
                    </div>
                </div>
                <div class="card_info">
                    <img id="img_${p.id_post}" class="news_img" src="${p.foto}">
                    <input type="file" id="foto_inp_${p.id_post}" accept=".jpg,.jpeg,.png" style="display:none" class="news_img">                
                    <p id="con_${p.id_post}" class="news_text">${p.contentP}</p>
                </div>
            </div>
        `).join('')  
    }
    else {
        document.querySelector('#post_list').innerHTML = "<h2>По вашему запросу ничего не найдено</h2>"
    }
})

const teach_search = document.querySelector('#search_teach')
document.querySelector('#res_seach_teach').addEventListener('click', async e=>{
    if (teach_search.value != ''){
        const res = await fetch(`http://127.0.0.1:8000/admin/search/teacher?surname=${teach_search.value.trim()}&name=${teach_search.value.trim()}`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await res.json()
        document.querySelector('#teach_list').innerHTML = json.map(t => `
            <div class="posts">
                <div class="du_info">
                    <div id="teacher_${t.id_teacher}" data-specialty="${t.id_specialty}">
                        <h3 id="surname_${t.id_teacher}" class="h2_js">${t.surname}</h3>
                        <h3 id="name_${t.id_teacher}">${t.name}</h3>
                    </div>
                    <div>
                        <button onclick="editTeacher(${t.id_teacher})" class="db_but">Редактировать</button>
                        <button onclick="deleteTeacher(${t.id_teacher})" class="db_but">Удалить</button>
                    </div>
                </div>
            </div>
            <hr id="hr_div">
        `).join('')
    }
    else{
        document.querySelector('#teach_list').innerHTML = "<h2>По вашему запросу ничего не найдено</h2>"
    }
})

const spec_search = document.querySelector('#search_spec')
document.querySelector('#res_seach_spec').addEventListener('click', async e=>{
    if (spec_search.value != ''){
        const res = await fetch(`http://127.0.0.1:8000/admin/search/specialty?tit=${spec_search.value.trim()}&desc=${spec_search.value.trim()}`, {
            method: 'GET',
            credentials: 'include'
        })
        const json = await res.json()
        document.querySelector('#special_list').innerHTML = json.map(s => `
            <div class="posts"> 
                <div class="du_info">
                    <h3 id="title_${s.id_specialty}" class="h2_js">${s.title}</h3>
                    <div>
                        <button onclick="editSpecialty(${s.id_specialty})" class="db_but">Редактировать</button>
                        <button onclick="deleteSpecialty(${s.id_specialty})" class="db_but">Удалить</button>
                    </div>
                </div>
                <p id=desc_${s.id_specialty} class="news_text">${s.description}</p>
            </div>      
            <hr id="hr_div">
        `).join('')
    }
    else {
        document.querySelector('#special_list').innerHTML = "<h2>По вашему запросу ничего не найдено</h2>"
    }
})