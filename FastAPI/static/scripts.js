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

// search_dv = document.querySelector('.div_search');
// document.querySelector('.input_head').addEventListener('click', ()=>{
//     search_dv.classList.toggle('activeSearch');
// })
// document.querySelector('.input_head').addEventListener('blur', ()=>{
//     search_dv.classList.remove('activeSearch');
// })
// document.addEventListener('keydown', e =>{
//     if (e.key === 'Escape'){
//         search_dv.classList.remove('activeSearch'); 
//     }
// })

// let i = 1;
// let img_src = document.querySelector('#img_src');
// let func_img = setInterval(()=>{
//     img_src.style.opacity = '0.5'; 
//     setTimeout(()=>{
//         img_src.src = "image/zavod" + i + ".jpg";
//         img_src.style.opacity = '1';
//         i += 1;
//         if (i > 4){
//             i = 1;
//         }
//     }, 500);
// }, 5000)

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

async function getPosts() {
    const resp = await fetch("http://127.0.0.1:8000/posts");
    const posts = await resp.json();
    const container = document.querySelector('#posts_container')
    container.innerHTML = posts.map(post => `
        <div id="post">
            <h3 class="h2_js">${post.headerP}</h2>
            <div id="card_info">
                <img class="news_img" src="${post.foto}" alt="фото">
                <p class="news_text">${post.contentP}</p>
            </div>
        </div>
    `).join('')
    console.log('container:', container)
    console.log('posts:', posts)
}
getPosts();

document.querySelector('.input_head').addEventListener('keydown', e=>{
    if (e.key == "Enter"){
        location.href = `/static/search.html?value=${document.querySelector('.input_head').value}`
    }
})
