    window.addEventListener("DOMContentLoaded",()=>{
        const contenedor=document.getElementById("estrellas");
        if(!contenedor) return;
        const cantidad=200;
        for(let i=0;i<cantidad;i++){
            const estrella=document.createElement("span");
            estrella.classList.add("estrella");
            const tamaño=Math.random()*3+1;
            estrella.style.width=tamaño+"px";
            estrella.style.height=tamaño+"px";
            estrella.style.left=Math.random()*100+"%";
            estrella.style.top=(-Math.random()*100)+"px";
            estrella.style.animationDuration=(Math.random()*8+5)+"s";
            estrella.style.animationDelay=Math.random()*8+"s";
            contenedor.appendChild(estrella);
        }
    });
    