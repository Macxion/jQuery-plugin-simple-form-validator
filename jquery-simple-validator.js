/**
 * -----------------------------------------------------------------------------
 * jquery-simple-validator.js
 * -----------------------------------------------------------------------------
 * @version v1
 * @author Macxion <macxionallan@gmai.com>
 *
 * Plugin de validação de formulários para jQuery!
 * A utilização requer apenas marcações HTML, nada de Javascript!
 * Testado com o jquery 3.3.1
 *
 * Copyright (c) 2018-2019 Macxion Moreira
 *
 * Sobre a Licença MIT @link https://opensource.org/licenses/mit-license.php
 * -----------------------------------------------------------------------------
 */


/**
 * Plugin de validação
 *
 * @param {object} $ Objeto jQuery
 * @returns {Boolean}
 */
(function($) {

    'use strict';

    /**
     * CSS do input quando validado
     *
     * @type {Object}
     */
    var validatedInputCSS = {border: '1.3px solid green'};

    /**
     * CSS do input quando invalidado
     *
     * @type {Object}
     */
    var invalidatedInputCSS = {border: '1.3px solid red'};

    /**
     * CSS do texto do input quando invalidado
     *
     * @type {Object}
     */
    var invalidatedTextCSS = {color: 'red'};

    /**
     * Status de validação dos inputs
     *
     * @type {Array}
     */
    var inputStatus = [];

    /**
     * Mime types, utilizados na função "ext", para a função "ext" não retornar
     * um falso positivo, o tipo requerido informado no input deve ser suportado,
     * ou seja, deve existir neste objeto
     *
     * @type {Object}
     */
    var mimes = {
        'hqx': ['application/mac-binhex40', 'application/mac-binhex', 'application/x-binhex40', 'application/x-mac-binhex40'],
        'cpt': 'application/mac-compactpro',
        'csv': ['text/x-comma-separated-values', 'text/comma-separated-values', 'application/octet-stream', 'application/vnd.ms-excel', 'application/x-csv', 'text/x-csv', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.msexcel', 'text/plain'],
        'bin': ['application/macbinary', 'application/mac-binary', 'application/octet-stream', 'application/x-binary', 'application/x-macbinary'],
        'dms': 'application/octet-stream',
        'lha': 'application/octet-stream',
        'lzh': 'application/octet-stream',
        'exe': ['application/octet-stream', 'application/x-msdownload'],
        'class': 'application/octet-stream',
        'psd': ['application/x-photoshop', 'image/vnd.adobe.photoshop'],
        'so': 'application/octet-stream',
        'sea': 'application/octet-stream',
        'dll': 'application/octet-stream',
        'oda': 'application/oda',
        'pdf': ['application/pdf', 'application/force-download', 'application/x-download', 'binary/octet-stream'],
        'ai': ['application/pdf', 'application/postscript'],
        'eps': 'application/postscript',
        'ps': 'application/postscript',
        'smi': 'application/smil',
        'smil': 'application/smil',
        'mif': 'application/vnd.mif',
        'xls': ['application/vnd.ms-excel', 'application/msexcel', 'application/x-msexcel', 'application/x-ms-excel', 'application/x-excel', 'application/x-dos_ms_excel', 'application/xls', 'application/x-xls', 'application/excel', 'application/download', 'application/vnd.ms-office', 'application/msword'],
        'ppt': ['application/powerpoint', 'application/vnd.ms-powerpoint', 'application/vnd.ms-office', 'application/msword'],
        'pptx': ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/x-zip', 'application/zip'],
        'wbxml': 'application/wbxml',
        'wmlc': 'application/wmlc',
        'dcr': 'application/x-director',
        'dir': 'application/x-director',
        'dxr': 'application/x-director',
        'dvi': 'application/x-dvi',
        'gtar': 'application/x-gtar',
        'gz': 'application/x-gzip',
        'gzip': 'application/x-gzip',
        'php': ['application/x-httpd-php', 'application/php', 'application/x-php', 'text/php', 'text/x-php', 'application/x-httpd-php-source'],
        'php4': 'application/x-httpd-php',
        'php3': 'application/x-httpd-php',
        'phtml': 'application/x-httpd-php',
        'phps': 'application/x-httpd-php-source',
        'js': ['application/x-javascript', 'text/plain'],
        'swf': 'application/x-shockwave-flash',
        'sit': 'application/x-stuffit',
        'tar': 'application/x-tar',
        'tgz': ['application/x-tar', 'application/x-gzip-compressed'],
        'z': 'application/x-compress',
        'xhtml': 'application/xhtml+xml',
        'xht': 'application/xhtml+xml',
        'zip': ['application/x-zip', 'application/zip', 'application/x-zip-compressed', 'application/s-compressed', 'multipart/x-zip'],
        'rar': ['application/x-rar', 'application/rar', 'application/x-rar-compressed'],
        'mid': 'audio/midi',
        'midi': 'audio/midi',
        'mpga': 'audio/mpeg',
        'mp2': 'audio/mpeg',
        'mp3': ['audio/mpeg', 'audio/mpg', 'audio/mpeg3', 'audio/mp3'],
        'aif': ['audio/x-aiff', 'audio/aiff'],
        'aiff': ['audio/x-aiff', 'audio/aiff'],
        'aifc': 'audio/x-aiff',
        'ram': 'audio/x-pn-realaudio',
        'rm': 'audio/x-pn-realaudio',
        'rpm': 'audio/x-pn-realaudio-plugin',
        'ra': 'audio/x-realaudio',
        'rv': 'video/vnd.rn-realvideo',
        'wav': ['audio/x-wav', 'audio/wave', 'audio/wav'],
        'bmp': ['image/bmp', 'image/x-bmp', 'image/x-bitmap', 'image/x-xbitmap', 'image/x-win-bitmap', 'image/x-windows-bmp', 'image/ms-bmp', 'image/x-ms-bmp', 'application/bmp', 'application/x-bmp', 'application/x-win-bitmap'],
        'gif': 'image/gif',
        'jpeg': ['image/jpeg', 'image/pjpeg'],
        'jpg': ['image/jpeg', 'image/pjpeg'],
        'jpe': ['image/jpeg', 'image/pjpeg'],
        'jp2': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'j2k': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'jpf': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'jpg2': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'jpx': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'jpm': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'mj2': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'mjp2': ['image/jp2', 'video/mj2', 'image/jpx', 'image/jpm'],
        'png': ['image/png', 'image/x-png'],
        'tiff': 'image/tiff',
        'tif': 'image/tiff',
        'css': ['text/css', 'text/plain'],
        'html': ['text/html', 'text/plain'],
        'htm': ['text/html', 'text/plain'],
        'shtml': ['text/html', 'text/plain'],
        'txt': 'text/plain',
        'text': 'text/plain',
        'log': ['text/plain', 'text/x-log'],
        'rtx': 'text/richtext',
        'rtf': 'text/rtf',
        'xml': ['application/xml', 'text/xml', 'text/plain'],
        'xsl': ['application/xml', 'text/xsl', 'text/xml'],
        'mpeg': 'video/mpeg',
        'mpg': 'video/mpeg',
        'mpe': 'video/mpeg',
        'qt': 'video/quicktime',
        'mov': 'video/quicktime',
        'avi': ['video/x-msvideo', 'video/msvideo', 'video/avi', 'application/x-troff-msvideo'],
        'movie': 'video/x-sgi-movie',
        'doc': ['application/msword', 'application/vnd.ms-office'],
        'docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/msword', 'application/x-zip'],
        'dot': ['application/msword', 'application/vnd.ms-office'],
        'dotx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/msword'],
        'xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/vnd.ms-excel', 'application/msword', 'application/x-zip'],
        'word': ['application/msword', 'application/octet-stream'],
        'xl': 'application/excel',
        'eml': 'message/rfc822',
        'json': ['application/json', 'text/json'],
        'pem': ['application/x-x509-user-cert', 'application/x-pem-file', 'application/octet-stream'],
        'p10': ['application/x-pkcs10', 'application/pkcs10'],
        'p12': 'application/x-pkcs12',
        'p7a': 'application/x-pkcs7-signature',
        'p7c': ['application/pkcs7-mime', 'application/x-pkcs7-mime'],
        'p7m': ['application/pkcs7-mime', 'application/x-pkcs7-mime'],
        'p7r': 'application/x-pkcs7-certreqresp',
        'p7s': 'application/pkcs7-signature',
        'crt': ['application/x-x509-ca-cert', 'application/x-x509-user-cert', 'application/pkix-cert'],
        'crl': ['application/pkix-crl', 'application/pkcs-crl'],
        'der': 'application/x-x509-ca-cert',
        'kdb': 'application/octet-stream',
        'pgp': 'application/pgp',
        'gpg': 'application/gpg-keys',
        'sst': 'application/octet-stream',
        'csr': 'application/octet-stream',
        'rsa': 'application/x-pkcs7',
        'cer': ['application/pkix-cert', 'application/x-x509-ca-cert'],
        '3g2': 'video/3gpp2',
        '3gp': ['video/3gp', 'video/3gpp'],
        'mp4': 'video/mp4',
        'm4a': 'audio/x-m4a',
        'f4v': ['video/mp4', 'video/x-f4v'],
        'flv': 'video/x-flv',
        'webm': 'video/webm',
        'aac': 'audio/x-acc',
        'm4u': 'application/vnd.mpegurl',
        'm3u': 'text/plain',
        'xspf': 'application/xspf+xml',
        'vlc': 'application/videolan',
        'wmv': ['video/x-ms-wmv', 'video/x-ms-asf'],
        'au': 'audio/x-au',
        'ac3': 'audio/ac3',
        'flac': 'audio/x-flac',
        'ogg': ['audio/ogg', 'video/ogg', 'application/ogg'],
        'kmz': ['application/vnd.google-earth.kmz', 'application/zip', 'application/x-zip'],
        'kml': ['application/vnd.google-earth.kml+xml', 'application/xml', 'text/xml'],
        'ics': 'text/calendar',
        'ical': 'text/calendar',
        'zsh': 'text/x-scriptzsh',
        '7z': ['application/x-7z-compressed', 'application/x-compressed', 'application/x-zip-compressed', 'application/zip', 'multipart/x-zip'],
        '7zip': ['application/x-7z-compressed', 'application/x-compressed', 'application/x-zip-compressed', 'application/zip', 'multipart/x-zip'],
        'cdr': ['application/cdr', 'application/coreldraw', 'application/x-cdr', 'application/x-coreldraw', 'image/cdr', 'image/x-cdr', 'zz-application/zz-winassoc-cdr'],
        'wma': ['audio/x-ms-wma', 'video/x-ms-asf'],
        'jar': ['application/java-archive', 'application/x-java-application', 'application/x-jar', 'application/x-compressed'],
        'svg': ['image/svg+xml', 'application/xml', 'text/xml'],
        'vcf': 'text/x-vcard',
        'srt': ['text/srt', 'text/plain'],
        'vtt': ['text/vtt', 'text/plain'],
        'ico': ['image/x-icon', 'image/x-ico', 'image/vnd.microsoft.icon'],
        'odc': 'application/vnd.oasis.opendocument.chart',
        'otc': 'application/vnd.oasis.opendocument.chart-template',
        'odf': 'application/vnd.oasis.opendocument.formula',
        'otf': 'application/vnd.oasis.opendocument.formula-template',
        'odg': 'application/vnd.oasis.opendocument.graphics',
        'otg': 'application/vnd.oasis.opendocument.graphics-template',
        'odi': 'application/vnd.oasis.opendocument.image',
        'oti': 'application/vnd.oasis.opendocument.image-template',
        'odp': 'application/vnd.oasis.opendocument.presentation',
        'otp': 'application/vnd.oasis.opendocument.presentation-template',
        'ods': 'application/vnd.oasis.opendocument.spreadsheet',
        'ots': 'application/vnd.oasis.opendocument.spreadsheet-template',
        'odt': 'application/vnd.oasis.opendocument.text',
        'odm': 'application/vnd.oasis.opendocument.text-master',
        'ott': 'application/vnd.oasis.opendocument.text-template',
        'oth': 'application/vnd.oasis.opendocument.text-web'
    };

    /**
     * Hexadecimais mágicos gerados das assinaturas de arquivos, utilizados na
     * função "type", para a função "type" não retornar um falso positivo, o tipo
     * requerido informado no input deve ser suportado, ou seja, deve existir
     * nesta função, se quiser inserir mais assinaturas no switch, pode utilizar
     * este site que usei, ele possui uma vasta listagem de arquivos com seu
     * conjunto (ou conjuntos) de 4 bytes
     *
     * @see https://www.garykessler.net/library/file_sigs.html
     *
     * @param {String} hex
     * @return {String}
     */
    var signatures = function (hex) {
        switch (hex) {
            case '38425053':
                return 'psd';
            case '89504E47':
                return 'png';
            case 'FFD8FFE0':
            case 'FFD8FFE1':
            case 'FFD8FFE2':
            case 'FFD8FFE8':
                return 'jpg';
            case '47494638':
                return 'gif';
            case '25504446':
                return 'pdf';
        }
    };

    /**
     * O plugin de fato, percorre todos os elementos do form aplicando suas
     * rules
     *
     * @return {Boolean}
     */
    $.fn.validated = function () {
        var init = this;
        var form = init[0];
        var els = form.elements;
        if ($(form).hasClass('validate')) {
            $(els).each(function () { //varre elementos do form
                var self = $(this);
                if (self.attr('type') === 'hidden' || self.attr('type') === 'submit') {
                    return;
                } else {
                    if (typeof self.data('vrules') !== typeof undefined && self.data('vrules') !== false) { //Se o atributo data-vrules existir no elemento
                        inputStatus[$(':input').index(self)] = null;
                        var rules = self.data('vrules').split('|');
                        for (var i = 0; i < rules.length; i++) { //varre regras de validação definidas
                            if (rules[i].includes('[')) { //Se a rule tem parâmetro
                                var ruleName = rules[i].split('[')[0];
                                var ruleParam = rules[i].split('[')[1].replace(']', '');
                                if (window.validationRules[ruleName](self, ruleParam)) {
                                    continue; //Se a rule deu certo, vai para a próxima, senão para nela
                                } else {
                                    break;
                                }
                            } else { //Rule não tem parâmetro
                                if (window.validationRules[rules[i]](self)) {
                                    continue; //Se a rule deu certo, vai para a próxima, senão para nela
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
            });
            return !inputStatus.includes(false, 0);
        }
    };

    /**
     * Valida o elemento
     *
     * @param {Object} el Elemento
     */
    var validateElement = function (el) {
        let name = el.attr('name').replace('[]', '');
        if ($('#' + name + 'Res').length)
            $('#' + name + 'Res').remove();
        el.css(validatedInputCSS);
        inputStatus[$(el).parent('form').children(':input:not([type=hidden]):not([type=submit])').index(el)] = true;
    };

    /**
     * Invalida o elemento
     *
     * @param {Object} el Elemento
     * @param {String} msg Mensagem de erro vinda do "validateModel"
     */
    var invalidateElement = function (el, msg) {
        let name = el.attr('name').replace('[]', '');
        if ($('#' + name + 'Res').length)
            $('#' + name + 'Res').remove();
        if (el.attr('type') === 'radio' || el.attr('type') === 'checkbox') {
            $('<div id="' + name + 'Res"></div>').insertAfter($('input[name=' + el.attr('name') + ']').last());
        } else {
            $('<div id="' + name + 'Res"></div>').insertAfter(el);
        }
        el.focus();
        el.css(invalidatedInputCSS);
        $('#' + name + 'Res').css(invalidatedTextCSS).html(msg);
        inputStatus[$(el).parent('form').children(':input:not([type=hidden]):not([type=submit])').index(el)] = false;
    };

    /**
     * Modelo padrão que define como validar/invalidar os elementos, recebe os
     * parâmetros diretamente das rules
     *
     * @param {Object} el Elemento
     * @param {Boolean} condition Teste de validação da rule
     * @param {String} ruleName Nome da rule que chamou o model
     * @param {String} msg Mensagem de erro vinda da rule
     * @returns {Boolean}
     */
    var validateModel = function (el, condition, ruleName, msg) {
        let msgRule = el.data('vmsg-' + ruleName);
        let name = el.data('vname') ? '"' + el.data('vname') + '"' : '';
        if (el.attr('type') === 'radio' || el.attr('type') === 'checkbox') {
            if (ruleName === 'req') {
                let radioCount = $('input[name=' + el.attr('name') + ']').length;
                let notChecked = 0;
                $('input[name=' + el.attr('name') + ']').each(function () {
                    if (!$(this).prop('checked')) {
                        notChecked++;
                    }
                });
                if (notChecked === radioCount) {
                    let formatedMsg = msgRule ? msgRule.replace('{$}', name) : 'O campo ' + name + ' ' + msg;
                    invalidateElement(el, formatedMsg);
                    return false;
                } else {
                    validateElement(el);
                    return true;
                }
            } else {
                return true;
            }
        } else {
            let field = el.attr('type') === 'file' ? 'O arquivo ' : 'O campo ';
            if (!condition) {
                let formatedMsg = msgRule ? msgRule.replace('{$}', name) : field + name + ' ' + msg;
                invalidateElement(el, formatedMsg);
                return false;
            } else {
                validateElement(el);
                return true;
            }
        }
    };

    /**
     * Objeto contendo todas as regras de validação disponíveis
     *
     * @type {Object}
     */
    window.validationRules = {

        /**
         * REQUIRED
         * Aceita somente valores não vazios, também funciona com type=file
         *
         * @example data-vrules="req"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        req: function (el) {
            let condition = false;
            if (el.attr('type') === 'file') {
                condition = el.prop('files').length === 0 ? false : true;
            } else {
                condition = /(.|\s)*\S(.|\s)*/.test(el.val());
            }
            return validateModel(el, condition, 'req', 'n&atilde;o pode estar vazio');
        },

        /**
         * NUMERIC
         * Aceita somente números
         *
         * @example data-vrules="num"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        num: function (el) {
            let condition = /^\d+$/.test(el.val());
            return validateModel(el, condition, 'num', 'deve conter apenas n&uacute;meros');
        },

        /**
         * MIN LENGTH
         * Aceita valores com caracteres maiores ou iguais a length, também
         * funciona com type=file e neste caso, contará arquivos
         *
         * @example data-vrules="min[7]"
         *
         * @param {Object} el Elemento
         * @param {int} length Número de caracteres
         * @returns {Boolean}
         */
        min: function (el, length) {
            let condition = false;
            let sufix = '';
            if (el.attr('type') === 'file') {
                let files = el.prop('files');
                condition = !(parseInt(files.length) < parseInt(length));
                sufix = 'arquivos';
            } else {
                condition = !(parseInt(el.val().length) < parseInt(length));
                sufix = 'caracteres';
            }
            return validateModel(el, condition, 'min',
                    'deve conter no m&iacute;nimo ' + length + ' ' + sufix);
        },

        /**
         * MAX LENGTH
         * Aceita valores com caracteres menores ou iguais a length, também
         * funciona com type=file e neste caso, contará arquivos
         *
         * @example data-vrules="max[7]"
         *
         * @param {Object} el Elemento
         * @param {int} length Número de caracteres
         * @returns {Boolean}
         */
        max: function (el, length) {
            let condition = false;
            let sufix = '';
            if (el.attr('type') === 'file') {
                let files = el.prop('files');
                condition = !(parseInt(files.length) > parseInt(length));
                sufix = 'arquivos';
            } else {
                condition = !(parseInt(el.val().length) > parseInt(length));
                sufix = 'caracteres';
            }
            return validateModel(el, condition, 'max',
                    'deve conter no m&aacute;ximo ' + length + ' ' + sufix);
        },

        /**
         * EQUAL LENGTH
         * Aceita valores com caracteres iguais a length, também functiona com
         * type=files e neste caso, contará arquivos
         *
         * @example data-vrules="eql[7]"
         *
         * @param {Object} el Elemento
         * @param {int} length Número de caracteres
         * @returns {Boolean}
         */
        eql: function (el, length) {
            let condition = false;
            let sufix = '';
            if (el.attr('type') === 'file') {
                let files = el.prop('files');
                condition = !(parseInt(files.length) !== parseInt(length));
                sufix = 'arquivos';
            } else {
                condition = !(parseInt(el.val().length) !== parseInt(length));
                sufix = 'caracteres';
            }
            return validateModel(el, condition, 'eql',
                    'deve ter exatamente ' + length + ' ' + sufix);
        },

        /**
         * DATE BR
         * Aceita datas no formato brasileiro "21/12/2012"
         *
         * @example data-vrules="dbr"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        dbr: function (el) {
            let condition = /^(\d{2})\/(\d{2})\/(\d{4})$/.test(el.val());
            return validateModel(el, condition, 'dbr', 'deve conter uma data no formato dd/mm/aaaa');
        },

        /**
         * DATE SQL
         * Aceita datas no formato do banco de dados "2012-12-21"
         *
         * @example data-vrules="dbd"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        dbd: function (el) {
            let condition = /^(\d{4})\-(\d{2})\-(\d{2})$/.test(el.val());
            return validateModel(el, condition, 'dbd', 'deve conter uma data no formato aaaa-mm-dd');
        },

        /**
         * E-MAIL
         * Aceita um e-mail válido, seguindo a especificação do HTML5 pela W3C
         *
         * @see https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
         *
         * @example data-vrules="mail"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        mail: function (el) {
            let condition = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(el.val());
            return validateModel(el, condition, 'mail', 'deve conter um e-mail v&aacute;lido');
        },

        /**
         * TELEPHONE NUMBER
         * Aceita um telefone válido do Brasil, alguns formatos aceitos:
         * +55 (11) 98888-8888, (61) 98585-8585, (61) 3415-9898, +55(61)98585-8585, 55 (11) 98888-8888
         *
         * @example data-vrules="tel"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        tel: function (el) {
            let condition = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/.test(el.val());
            return validateModel(el, condition, 'tel', 'deve conter um n&uacute;mero de telefone v&aacute;lido');
        },

        /**
         * MONETARY
         * Aceita valores monetários, por exemplo: 1.293,35, 0, 325, 0,8, 0,50, 0.30
         *
         * @example data-vrules="cash"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        cash: function (el) {
            let condition = /(\d{1,3}(\.\d{3})*|\d+)(\,\d{2})?$/.test(el.val());
            return validateModel(el, condition, 'cash', 'deve conter um valor monet&aacute;rio');
        },

        /**
         * REGULAR EXPRESSION
         * Aceita qualquer tipo de expressão regular para mais flexibilidade
         *
         * @example data-vrules="reg" data-vreg="/_expressao_regular_aqui_sem_as_barras_/"
         *
         * @param {Object} el Elemento
         * @returns {Boolean}
         */
        reg: function (el) {
            let streg = el.data('vreg');
            if (streg === undefined) {
                invalidateElement(el, 'data-vreg n&atilde;o definido');
                return false;
            } else {
                var regex = new RegExp(streg, 'gm');
                let condition = regex.test(el.val());
                return validateModel(el, condition, 'reg', 'n&atilde;o est&aacute; no formato correto');
            }
        },

        /**
         * FILE EXTENSION
         * Aceita arquivos com as extensões informadas, checando também seu mime type,
         * os tipos são informados dentro de colchetes, separados por vírgula,
         * esta função utiliza o objeto files, portanto tenha cuidado com arquivos
         * que possuem o mime type em branco, se quer uma função mais confiável,
         * utilize a "type"
         *
         * @example data-vrules="ext[jpg,png,gif]"
         *
         * @param {Object} el Elemento
         * @param {String} extensions String de extensões permitidas
         * @returns {Booolean}
         */
        ext: function (el, extensions) {
            let allowedExt = extensions.split(',');
            let files = el.prop('files');
            $.each(files, function (i, file) {
                if (typeof (file.type) === 'undefined' || file.type === '') {
                    return validateModel(el, false, 'ext', '"' + file.name + '" possui um formato desconhecido');
                } else {
                    $.each(mimes, function (i, item) {
                        let exp = Array.isArray(item) ? Boolean(item.includes(file.type)) : Boolean(item === file.type);
                        if (exp === true) {
                            if (allowedExt.includes(i)) {
                                return false; //sai
                            } else {
                                return validateModel(el, false, 'ext', '"' + file.name + '" possui um formato n&atilde;o permitido');
                            }
                        } else {
                            return;
                        }
                    });
                }
            });
        },

        /**
         * FILE SIGNATURE
         * Aceita arquivos dos tipos informados, ao contrário da função "ext",
         * esta verifica a assinatura do arquivo para saber o seu tipo, mesmo se
         * ele possuir seu mime type em branco
         *
         * @example data-vrules="type[jpg,png,gif]"
         *
         * @param {Object} el Elemento
         * @param {String} types String de extensões permitidas
         * @returns {Boolean}
         */
        type: function (el, types) {
            let allowedTypes = types.split(',');
            let files = el.prop('files');
            function readFile (f, loadCallback) {
                let reader = new FileReader();
                reader.onload = loadCallback;
                let blob = f.slice(0, 4);
                reader.readAsArrayBuffer(blob);
            }
            $.each(files, function (i, file) {
                readFile(file, function (e) {
                    let uint = new Uint8Array(e.target.result);
                    let bytes = [];
                    uint.forEach(function (byte) {
                        bytes.push(byte.toString(16));
                    });
                    const hex = bytes.join('').toUpperCase();
                    let condition = allowedTypes.includes(signatures(hex));
                    if (condition) {
                        return;
                    } else {
                        invalidateElement(el, '"' + file.name + '" possui um formato n&atilde;o permitido');
                        return false;
                    }
                });
            });
        }

    };

})(jQuery);

/**
 * Fica ouvindo qualquer submit, se seu form possuir a classe "validate",
 * valida o form, se o form não possuir a classe, apenas continua
 *
 * @param {object} e Evento
 */
$('form').on('submit', function (e) {
    let form = $(this);
    if (form.hasClass('validate')) {
        if (form.validated()) {
            return true;
        } else {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    } else {
        return true;
    }
});
