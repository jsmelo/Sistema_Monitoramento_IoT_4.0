// Define os itens do menu dropdown
const CADASTRAR = "Cadastrar";
const LISTAR = "Listar";
const empresasDropdownLinks = [
    { href: "/empresa.html", text: CADASTRAR },
    { href: "/empresas.html", text: LISTAR }
];

const usuariosDropdownLinks = [
    { href: "/usuario.html", text: CADASTRAR },
    { href: "/usuarios.html", text: LISTAR }
];

const perfisDropdownLinks = [
    { href: "/perfil.html", text: CADASTRAR },
    { href: "/perfis.html", text: LISTAR }
];

const setoresDropdownLinks = [
    { href: "/setor.html", text: CADASTRAR },
    { href: "/setores.html", text: LISTAR }
];

const sensoresDropdownLinks = [
    { href: "/sensor.html", text: CADASTRAR },
    { href: "/sensores.html", text: LISTAR }
];

const usuarioLogadoDropdownLinks = [
    { href: localStorage.getItem("URL_SERVER")+"/usuario.html?id=", text: "Editar" },
    { href: "#", text: "Logout" }
];

//logout
logout = function() {
    localStorage.clear();
    window.location.href = "http://matrixprovedor.net:9152/login.html";
}

// Permissao de acesso a tela
permissaoAcesso = function() {
    if (!localStorage.getItem("projetao-iot-token")) {
        window.location.href = "http://matrixprovedor.net:9152/login.html";
    }
    //if (getUsuarioLogado().tipoUsuario==2) {
        // caso tente acessar tela x, y ou z via url o usuario é redirecionado para a tela de dashboard
        //window.location.href = "/dashboard.html";
    //}
}

// Obtem os dados do usuario logado
getUsuarioLogado = function() {
    //return {id: 1, nome: "Usuario teste", tipoUsuario: 1};
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

// Função para criar um item de menu
function createMenuItem(iconClass, text, href) {
    const li = document.createElement('li');
    li.classList.add('nav-item');

    const a = document.createElement('a');
    a.classList.add('nav-link');
    a.href = href;

    const icon = document.createElement('i');
    if (iconClass.split(' ').length > 1) {
        iconClass.split(' ').forEach(classes => {
            icon.classList.add(classes);
        });
    }

    a.appendChild(icon);
    a.appendChild(document.createTextNode(text));

    li.appendChild(a);

    return li;
}

// Função para criar itens de menu dropdown
function createDropdownMenu(id, iconClass, text, links) {
    const liElement = document.createElement("li");
    liElement.className = "nav-item dropdown";

    const aElement = document.createElement("a");
    aElement.className = "nav-link dropdown-toggle";
    aElement.href = "#";
    aElement.id = id;
    aElement.setAttribute("role", "button");
    aElement.setAttribute("data-bs-toggle", "dropdown");
    aElement.setAttribute("aria-haspopup", "true");
    aElement.setAttribute("aria-expanded", "false");

    const iconElement = document.createElement("i");
    iconElement.className = iconClass;

    const textNode = document.createTextNode(text);

    aElement.appendChild(iconElement);
    aElement.appendChild(textNode);

    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown-menu";
    dropdownDiv.setAttribute("aria-labelledby", id);

    for (const link of links) {
        const dropdownItem = document.createElement("a");
        dropdownItem.className = "dropdown-item";
        dropdownItem.href = link.href;
        dropdownItem.innerText = link.text;
        dropdownDiv.appendChild(dropdownItem);
    }

    liElement.appendChild(aElement);
    liElement.appendChild(dropdownDiv);

    return liElement;
}

function createDropdownUserMenu(id, iconClass, links, usuarioLogado) {
    const divElement = document.createElement("div");
    divElement.className = "nav-item dropdown p-2 me-5";

    const aElement = document.createElement("a");
    aElement.className = "nav-link dropdown-toggle";
    aElement.href = "#";
    aElement.id = id;
    aElement.setAttribute("role", "button");
    aElement.setAttribute("data-bs-toggle", "dropdown");
    aElement.setAttribute("aria-haspopup", "true");
    aElement.setAttribute("aria-expanded", "false");

    const iconElement = document.createElement("i");
    iconElement.className = iconClass;

    const textNode = document.createTextNode(usuarioLogado.nome);

    aElement.appendChild(iconElement);
    aElement.appendChild(textNode);

    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "dropdown-menu";
    dropdownDiv.setAttribute("aria-labelledby", id);

    for (const link of links) {
        const dropdownItem = document.createElement("a");
        dropdownItem.className = "dropdown-item";
        dropdownItem.href = link.href == "#" ? link.href : link.href + usuarioLogado.id;
        dropdownItem.innerText = link.text;
        if (link.text=="Logout") {
            dropdownItem.addEventListener('click', function handleClick(event) {
                logout()
            });
        }
        dropdownDiv.appendChild(dropdownItem);
    }

    divElement.appendChild(aElement);
    divElement.appendChild(dropdownDiv);

    return divElement;
}

document.addEventListener("DOMContentLoaded", function () {

    // Função para criar um item de menu com ícone Bootstrap
    // Criação do elemento <nav>
    const navElement = document.createElement('nav');
    navElement.classList.add('navbar', 'navbar-expand-lg', 'd-flex', 'justify-content-between', 'navbar-light', 'bg-light');

    // Criação do elemento <ul> com a classe "navbar-nav ms-5"
    const ulElement = document.createElement('ul');
    ulElement.classList.add('navbar-nav', 'ms-5');

    // Cria os itens de menu dropdown
    const empresasDropdown = createDropdownMenu("empresasDropdown", "bi bi-buildings-fill", "Empresas", empresasDropdownLinks);
    const usuariosDropdown = createDropdownMenu("usuariosDropdown", "bi bi-people-fill", "Usuários", usuariosDropdownLinks);
    //const perfisDropdown = createDropdownMenu("perfisDropdown", "bi bi-person-badge-fill", "Perfis", perfisDropdownLinks);
    const setoresDropdown = createDropdownMenu("setoresDropdown", "bi bi-file-spreadsheet-fill", "Setores", setoresDropdownLinks);
    const sensoresDropdown = createDropdownMenu("sensoresDropdown", "bi bi-thermometer-half", "Sensores", sensoresDropdownLinks);

    // Cria o item de menu de usuário
    var userDropdown = createDropdownUserMenu("userDropdown", "bi bi-person-fill", usuarioLogadoDropdownLinks, getUsuarioLogado());

    // Cria o item de menu de home
    ulElement.appendChild(createMenuItem('bi bi-house-fill', 'Home', '/dashboard.html'));

    // Adiciona os itens de menu à <ul> element
    if (isAdminMaster()) {
        ulElement.appendChild(empresasDropdown);
    }
    ulElement.appendChild(usuariosDropdown);
    ulElement.appendChild(setoresDropdown);
    ulElement.appendChild(sensoresDropdown);

    // Cria o último item de menu
    const lastNavItem = document.createElement("div");
    lastNavItem.className = "nav-item dropdown p-2 me-5";
    lastNavItem.appendChild(userDropdown);

    // Adiciona a <ul> element e o último item de menu à <nav> element
    navElement.appendChild(ulElement);
    navElement.appendChild(lastNavItem);

    // Adicionando o <nav> ao corpo do documento
    document.getElementById('navbar').appendChild(navElement);
});

//checa permissao de acesso a tela
permissaoAcesso();

//para acessar as paginas sem login: comentar a linha 211 e descomentar a linha 53

isAdminMaster = function() {
    if (getUsuarioLogado().tipoUsuario == "AdminMaster" || getUsuarioLogado().tipoUsuario == 4) {
        return true;
    } else {
        return false;
    }
}
