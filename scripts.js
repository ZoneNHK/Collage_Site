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