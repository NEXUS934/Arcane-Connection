async function loadNodes(){

  const snapshot = await window.getDocs(

    window.collection(
      window.db,
      "blocos"
    )

  );

  nodes = [];

  snapshot.forEach(doc=>{

    nodes.push({

      id: doc.id,

      ...doc.data()

    });

  });

console.log("Blocos carregados:", nodes);

console.log(
  "Primeiro bloco:",
  nodes[0]
);

console.log(
  "X:",
  nodes[0].x
);

console.log(
  "Y:",
  nodes[0].y
);

  updateFolders();

  renderNodes();

}

async function saveNodeToFirebase(node){

  try{

    await window.addDoc(

      window.collection(
        window.db,
        "blocos"
      ),

      node

    );

    console.log(
      "Bloco salvo no Firebase"
    );

  }

  catch(error){

    console.error(error);

  }

}

const canvas =
document.getElementById(
  "canvas"
);

const newNodeBtn =
document.getElementById(
  "newNodeBtn"
);

console.log("Script carregado");
console.log(window.addDoc);

let nodes = [];

/* SALVAR */

function saveNodes(){}

/* RENDER */

const folderFilter =
document.getElementById(
  "folderFilter"
);


function updateFolders(){

  const folders = [

    ...new Set(

      nodes.map(

        node =>

        node.folder || "Geral"

      )

    )

  ];

  folderFilter.innerHTML =

  `
  <option value="Todos">
    Todos
  </option>
  `;

  folders.forEach(folder=>{

    folderFilter.innerHTML +=

    `
    <option value="${folder}">
      📂 ${folder}
    </option>
    `;

  });

}

async function updateNodeInFirebase(node){

  try{

    await window.updateDoc(

      window.doc(
        window.db,
        "blocos",
        node.id
      ),

      {
        title: node.title,
        content: node.content,
        folder: node.folder,
        x: node.x,
        y: node.y,
        files: node.files,
        links: node.links
      }

    );

  }

  catch(error){

    console.error(error);

  }

}

async function deleteNodeInFirebase(id){

  try{

    await window.deleteDoc(

      window.doc(
        window.db,
        "blocos",
        id
      )

    );

  }

  catch(error){

    console.error(error);

  }

}

function renderNodes(){

  const selectedFolder =

folderFilter.value;

  canvas.innerHTML = "";

  nodes
  
  .filter(node=>{

  return (

    selectedFolder === "Todos"

    ||

    node.folder === selectedFolder

  );

})


  .forEach(node=>{

    if(!node.folder)
  node.folder = "Geral";

if(!node.files)
  node.files = [];

if(!node.links)
  node.links = [];

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

updateNodeInFirebase(node);

      }

    );

    /* CONTEÚDO */

    contentInput.addEventListener(

      "input",

      ()=>{

node.content =
contentInput.value;

updateNodeInFirebase(node);

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

          updateFolders();

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

        updateFolders();

        renderNodes();

      }

    );

    enableDrag(

      div,

      node.id

    );

    console.log("Renderizando:", node);

    canvas.appendChild(
      div
    );

  });


}

/* NOVO BLOCO */

newNodeBtn.addEventListener(

  "click",

 async ()=>{

    const title =

    prompt(
      "Título:"
    );

    if(!title) return;

   const content =
prompt("Conteúdo:") || "";

const folder =
prompt(
  "Pasta:"
) || "Geral";

const newNode = {

  title,

  content,

  folder,

  x:300,

  y:150,

  files:[],

  links:[]

};

await saveNodeToFirebase(
  newNode
);

await loadNodes();

updateFolders();

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

const toggleSidebar =
document.getElementById(
  "toggleSidebar"
);

const sidebar =
document.querySelector(
  ".sidebar"
);

toggleSidebar.addEventListener(

  "click",

  ()=>{

    sidebar.classList.toggle(
      "closed"
    );

  }

);

const waitFirebaseLoad = setInterval(()=>{

  if(window.firebaseReady){

    clearInterval(waitFirebaseLoad);

    loadNodes();


  }

},100);

async function testFirebase(){

  try{

   await window.addDoc(

  window.collection(
    window.db,
    "teste"
  ),

  {
    mensagem:
    "Arcane funcionando"
  }

);

    console.log(
      "Firebase conectado!"
    );

  }

  catch(error){

    console.error(
      error
    );

  }

}


const waitFirebase = setInterval(() => {

  if(window.firebaseReady){

    clearInterval(waitFirebase);

    testFirebase();

  }

}, 100);