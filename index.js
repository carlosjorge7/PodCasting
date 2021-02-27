window.onload = descargarXML;

document.getElementById('boton_acerca').addEventListener('click', function() {
    document.getElementById('acerca').style.display = 'block';
    document.getElementById('podcast').style.display = 'none';
});

document.getElementById('boton_podcast').addEventListener('click', function() {
    document.getElementById('acerca').style.display = 'none';
    document.getElementById('podcast').style.display = 'block';
});

function descargarXML() {

    if(window.XMLHttpRequest) {
        http = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
        http = new ActiveXObject("Microsoft.XMLHTTP");
    }

    http.onreadystatechange = muestraContenido;

    // Problema de cors en
    var API = 'https://anchor.fm/s/106db04/podcast/rss';
    http.open('GET', API, true);
    http.send(null);

    function muestraContenido() {
        if(http.readyState == 4 && http.status == 200) {
            var documento_xml = http.responseXML;
            console.log(documento_xml);
            var root = documento_xml.getElementsByTagName('rss')[0];
            var channel = root.getElementsByTagName('channel')[0];
          
            // sacamos la imagen e la API y la enlazamos al img del HTML
            var image = channel.getElementsByTagName('image')[0];

            var titulo = image.getElementsByTagName('title')[0].firstChild.nodeValue;
            document.getElementById('title').innerHTML = titulo;

            var url = image.getElementsByTagName('url')[0].firstChild.nodeValue;
            document.getElementById('img_podcast').src = url;

            var web = image.getElementsByTagName('link')[0].firstChild.nodeValue;
            document.getElementById('link_url').href = web;

            // sacamos los podcast
            var n_items = channel.getElementsByTagName('item').length;
            console.log(n_items);

            var contenido = document.getElementById('contenido');

            // Voy hacer un tercio de las peticiones por que si no el servidor peta. Debe ser que tiene un limite en las peticiones

            for(let i = 0; i < n_items / 3; i++){
                var item = channel.getElementsByTagName('item')[i];
                var tit = item.getElementsByTagName('title')[0].firstChild.nodeValue;
                var des = item.getElementsByTagName('description')[0].firstChild.nodeValue;
                var uri = item.getElementsByTagName('enclosure')[0].getAttribute('url');
                var fecha = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;

                
               
                contenido.innerHTML += `<div class="card" style="background-color: #e3f2fd;">
                                                <div class="card-header" style="text-align:center;">
                                                <i class="fas fa-podcast"></i><strong> ${tit}</strong>
                                                </div>
                                                <div class="card-body" style="text-align:center;">
                                                    <audio controls>
                                                        <source src="${uri}" type="audio/mp3">
                                                    </audio>
                                                    <div><i class="fas fa-eject"></i><strong> Descripción</strong> ${des}</div>
                                                    <div><i class="fas fa-clock"></i><strong> Fecha</strong> ${fecha}</div>
                                                </div>
                                            </div> <br>`;
            }
           
           

         
        
        }

    }


}