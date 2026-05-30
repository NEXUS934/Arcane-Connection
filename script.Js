const canvas =
document.getElementById(
  "canvas"
);

const newNodeBtn =
document.getElementById(
  "newNodeBtn"
);

let nodes =

JSON.parse(

localStorage.getItem(
  "nexusNodes"
)

) || [];

/* SALVAR */

function saveNodes(){

  localStorage.setItem(

    "nexusNodes",

    JSON.stringify(nodes)

  );

}

/* RENDER */

function renderNodes(){

  canvas.innerHTML = "";

  nodes.forEach(node=>{

    const div =
    document.createElement(
      "div"
    );

    div.classList.add(
      "node"
    );

    div.style.left =
    node.x + "px";

    div.style.top =
    node.y + "px";

    div.innerHTML =

    `
      <input
        value="${node.title}"
        class="title-input"
      >

      <textarea
        class="content-input"
      >${node.content}</textarea>

      <input
        type="file"
        class="file-input"
      >

      <div class="files-list">

        ${
          node.files
          .map(

            file =>

            `
            <a
              href="${file.data}"
              target="_blank"
            >
              📎 ${file.name}
            </a>
            <br>
            `
          )
          .join("")
        }

      </div>

      <input
        class="link-input"
        placeholder="Nova ligação..."
      >

      <div class="links-list">

        ${
          node.links
          .map(

            link =>

            `<p>🔗 ${link}</p>`

          )
          .join("")
        }

      </div>

      <button
        class="delete-btn"
      >
        Excluir
      </button>
    `;

    const titleInput =
    div.querySelector(
      ".title-input"
    );

    const contentInput =
    div.querySelector(
      ".content-input"
    );

    const fileInput =
    div.querySelector(
      ".file-input"
    );

    const linkInput =
    div.querySelector(
      ".link-input"
    );

    const deleteBtn =
    div.querySelector(
      ".delete-btn"
    );

    /* TÍTULO */

    titleInput.addEventListener(

      "input",

      ()=>{

        node.title =
        titleInput.value;

        saveNodes();

      }

    );

    /* CONTEÚDO */

    contentInput.addEventListener(

      "input",

      ()=>{

        node.content =
        contentInput.value;

        saveNodes();

      }

    );

    /* ARQUIVOS */

    fileInput.addEventListener(

      "change",

      ()=>{

        const file =
        fileInput.files[0];

        if(!file) return;

        const reader =
        new FileReader();

        reader.onload =

        function(e){

          node.files.push({

            name:file.name,

            data:e.target.result

          });

          saveNodes();

          renderNodes();

        };

        reader.readAsDataURL(
          file
        );

      }

    );

    /* LIGAÇÕES */

    linkInput.addEventListener(

      "keydown",

      (e)=>{

        if(
          e.key === "Enter"
        ){

          if(
            !linkInput.value
          ) return;

          node.links.push(

            linkInput.value

          );

          saveNodes();

          renderNodes();

        }

      }

    );

    /* EXCLUIR */

    deleteBtn.addEventListener(

      "click",

      ()=>{

        nodes =

        nodes.filter(

          n =>
          n.id !== node.id

        );

        saveNodes();

        renderNodes();

      }

    );

    enableDrag(

      div,

      node.id

    );

    canvas.appendChild(
      div
    );

  });

}

/* NOVO BLOCO */

newNodeBtn.addEventListener(

  "click",

  ()=>{

    const title =

    prompt(
      "Título:"
    );

    if(!title) return;

    const content =

    prompt(
      "Conteúdo:"
    ) || "";

    nodes.push({

      id:Date.now(),

      title,

      content,

      x:300,

      y:150,

      files:[],

      links:[]

    });

    saveNodes();

    renderNodes();

  }

);

/* DRAG */

function enableDrag(

  element,

  nodeId

){

  let offsetX;
  let offsetY;

  element.addEventListener(

    "mousedown",

    (e)=>{

      offsetX =

      e.clientX -

      element.offsetLeft;

      offsetY =

      e.clientY -

      element.offsetTop;

      function move(ev){

        const x =

        ev.clientX -
        offsetX;

        const y =

        ev.clientY -
        offsetY;

        element.style.left =
        x + "px";

        element.style.top =
        y + "px";

        const node =

        nodes.find(

          n =>
          n.id === nodeId

        );

        node.x = x;
        node.y = y;

      }

      function stop(){

        saveNodes();

        document.removeEventListener(
          "mousemove",
          move
        );

        document.removeEventListener(
          "mouseup",
          stop
        );

      }

      document.addEventListener(
        "mousemove",
        move
      );

      document.addEventListener(
        "mouseup",
        stop
      );

    }

  );

}

renderNodes();