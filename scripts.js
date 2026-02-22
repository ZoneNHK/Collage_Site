let wind_menu = document.querySelector('.wind_menu');
document.querySelector('.menu_a').addEventListener('click', ()=>{
    wind_menu.classList.add('active');
    
})

document.querySelector('#exit_but').addEventListener('click', ()=>{
    wind_menu.classList.remove('active');
})

document.addEventListener('keydown', e =>{
    if (e.key === 'Escape'){
        wind_menu.classList.remove('active');  
    }
})

search_dv = document.querySelector('.div_search');
document.querySelector('.input_head').addEventListener('click', ()=>{
    search_dv.classList.toggle('activeSearch');
})
document.querySelector('.input_head').addEventListener('blur', ()=>{
    search_dv.classList.remove('activeSearch');
})
document.addEventListener('keydown', e =>{
    if (e.key === 'Escape'){
        search_dv.classList.remove('activeSearch');
    }
})

let i = 1;
let img_src = document.querySelector('#img_src');
let func_img = setInterval(()=>{
    img_src.style.opacity = '0.5'; 
    setTimeout(()=>{
        img_src.src = "image/zavod" + i + ".jpg";
        img_src.style.opacity = '1';
        i += 1;
        if (i > 4){
            i = 1;
        }
    }, 500);
}, 5000)

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


async function getNews() {
    const response = await fetch("http://127.0.0.1:8000/news");
    const posts = await response.json();
    
    const container = document.querySelector('.news');
    
    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'news_card';
        card.innerHTML = `
            ${post.photo ? `<img src="${post.photo}" class="news_img">` : ""}
            <p class="news_text">${post.text}</p>
            <p class="news_date">${post.date}</p>
        `;
        container.appendChild(card);
    });
}

getNews();