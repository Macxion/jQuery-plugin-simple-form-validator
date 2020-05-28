# jQuery-simple-form-validator
Plugin de validação de formulários para jQuery que utiliza apenas marcações em HTML.

## Utilização
Basta referenciar o jQuery e este plugin, a versão **3.1.1** é a que foi testada.
```html
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="/jquery-simple-validator.js"></script>
```

## Inicialização
Se quiser que o plugin funcione em determinado form, basta que o mesmo tenha a classe **validate**.
```html
<form class="validate">
```

## Rules
Atualmente, o plugin conta com uma lista singela de regras de validação, porém muito úteis, são elas:
* **req** (required)
* **num** (numeric)
* **min** (min length)
* **max** (max length)
* **eql** (equal length)
* **dbr** (data no format brasileiro)
* **dbd** (data no formato database)
* **mail** (e-mail)
* **tel** (nº de telefone)
* **cash** (valor monetário)
* **reg** (expressão regular)
* **ext** (file extension)
* **type** (file type)

## Aplicação das rules nos inputs
Basta que o input tenha o atributo **data-vrules**, ele pode receber várias, separadas por **pipe**, com exceção da rule **reg**, que precisa de um atributo **data-vreg** separadamente.
```html
<input type="text" name="nome" data-vrules="req|min[10]|max[90]">
<input type="text" name="numero" data-vrules="req|reg" data-vreg="\d">
```
