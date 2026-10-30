    window.addEventListener("DOMContentLoaded",()=>{
        const contenedor=document.getElementById("estrellas");
        if(!contenedor) return;
        // con "reducir movimiento" el cielo se queda quieto
        const quieto=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const cantidad=window.innerWidth<700 ? 70 : 140;
        for(let i=0;i<cantidad;i++){
            const estrella=document.createElement("span");
            estrella.classList.add("estrella");
            const tamaño=Math.random()*2.5+1;
            estrella.style.width=tamaño+"px";
            estrella.style.height=tamaño+"px";
            estrella.style.left=Math.random()*100+"%";
            if(quieto){
                estrella.style.top=Math.random()*100+"%";
            }else{
                // las chicas caen más lento: parecen más lejanas
                const duracion=14-tamaño*2.5+Math.random()*6;
                estrella.style.animationDuration=duracion+"s";
                // retraso negativo: al cargar ya hay estrellas en toda la pantalla
                estrella.style.animationDelay=(-Math.random()*duracion)+"s";
                estrella.style.opacity=(.35+tamaño/5).toFixed(2);
            }
            contenedor.appendChild(estrella);
        }
    });
