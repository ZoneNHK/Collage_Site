let lists = document.querySelectorAll('#left button')
for (let lst of lists){
    lst.addEventListener('click', e=>{
        if (e.target.dataset.target){
            document.querySelectorAll('.links').forEach(block =>{block.classList.remove('actLink')})
            document.querySelector('#' + e.target.dataset.target).classList.add('actLink');
        }
    })
}