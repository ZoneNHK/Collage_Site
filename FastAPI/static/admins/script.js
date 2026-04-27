let inp_login = document.querySelector('#inp1')
let inp_password = document.querySelector('#inp2')
let div_message = document.querySelector('#message')
document.querySelector('#log_but').addEventListener('click', async e=>{
    try{
        const resp = await fetch(`http://127.0.0.1:8000/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                login: inp_login.value,
                password: inp_password.value
            })
        })
        if (resp.ok != true){
            if (resp.status === 401 | resp.status === 404){
               throw "Данные введены неверно" 
            }
        }
        else {
            console.log("response:", resp)
            const login = await resp.json()
            console.log("json:", login)
            location.href = 'http://127.0.0.1:8000/admin_site'
        }
    }
    catch(err){
        div_message.classList.add('active')
    }
})