import '../css/app.css'

document.getElementById('closebtn').addEventListener('click',()=>{
    document.getElementById('side_nav').classList.add('activeSide')
    document.getElementById('side_nav').classList.add('inactiveSide')
    document.getElementById('navbar').style.marginTop='0'
})
    
document.getElementById('openbtn').addEventListener('click',()=>{ 
    document.getElementById('side_nav').classList.remove('activeSide')
    document.getElementById('side_nav').classList.remove('inactiveSide')
    document.getElementById('navbar').style.marginTop='-150px'
})
