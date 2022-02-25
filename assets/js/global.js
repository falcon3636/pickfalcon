function saveCookie(name, value, expires, path) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + '=' + escape(value) + ((expires) ? ';expires=' + expires_date.toUTCString() : '') + ';path=' + path;
}

function getCookie(name) {
    var start = document.cookie.indexOf(name + '=');
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length))) {
        return null;
    }
    if (start == -1) return null;
    var end = document.cookie.indexOf(';', len);
    if (end == -1) end = document.cookie.length;
    return unescape(document.cookie.substring(len, end));
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function queryString(name) {
    hu = window.location.search.substring(1);
    r = '';
    if (hu != '') {
        gy = hu.split('&');
        for (i = 0; i < gy.length; i++) {
            ft = gy[i].split('=');
            if (ft[0] == name) {
                r = ft[1];
            }
        }
        return r;
    } else { return ''; }
}

function parseQueryString(queryString, name) {
    r = '';
    if (queryString != '') {
        gy = queryString.split('&');
        for (i = 0; i < gy.length; i++) {
            ft = gy[i].split('=');
            if (ft[0] == name) {
                r = ft[1];
            }
        }
        return r;
    } else { return ''; }
}

function queryStringMvc(name) {
    var re = new RegExp("\\/" + name + "\\.(.+?)\\/", "i");
    var m = re.exec(window.location.href);
    if (m) {
        return m[1];
    } else { return ''; }
}

function regExMatch(regex, text, group) {
    var m = regex.exec(text);
    if (m) {
        return m[group];
    } else {
        return "";
    }
}

function getFormVal(id) {
    var r = encodeURIComponent($.trim($("#" + id).val()));
    if (r == "undefined") {
        return "";
    } else {
        return r;
    }
}

function getCurrentUrl() {
    var w = window.location;
    var p = window.location.port;
    return w.protocol + "//" + w.hostname + ((p != "" && p != "80" && p != "443") ? ":" + p : "") + w.pathname;
}

function getCheckVal(id) {
    var check = $("#" + id);
    if (check.is(":checked")) {
        return encodeURIComponent(check.val());
    } else {
        return "";
    }
}

function getCheckValGroup(groupName) {
    var vals = "";
    $("input[name='" + groupName + "']:checked").each(function () {
        vals += vals ? "," + $(this).val() : $(this).val();
    });
    return vals;
}

function getRadioVal(groupName) {
    var r = $("input[name='" + groupName + "']:checked").val();
    if (r == undefined) {
        return "";
    } else {
        return encodeURIComponent(r);
    }
}

function disableButton(id, text) {
    var btn = $("#" + id);
    btn.attr("data-orig-text", btn.html());
    btn.html(text);
    btn.attr("disabled", "disabled").addClass("disabled");
}

function reenableButton(id) {
    var btn = $("#" + id);
    btn.html(btn.attr("data-orig-text"));
    btn.removeAttr("data-orig-text").removeAttr("disabled").removeClass("disabled");
}

function getSecToken() {
    return encodeURIComponent($("input[name=__RequestVerificationToken]").val());
}

function getSecTokenRaw() {
    return $("input[name=__RequestVerificationToken]").val();
}

function serializeSecToken(onlyParameter) {
    if (onlyParameter == true) {
        return "__RequestVerificationToken=" + getSecToken();
    } else {
        return "&__RequestVerificationToken=" + getSecToken();
    }
}

function bindEnterKeyEvent(ctrl, trigger) {
    $(ctrl).bind('keypress', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $(trigger).click();
        }
    });
}

function handleResponseError(resp) {
    isAdmin = (window.location.toString().indexOf("/admin") > -1) ? true : false;
    if (resp.errType) {
        window.location = ((isAdmin) ? "/admin" : "") + "/error/?err=" + resp.errType;
    } else if (resp.redirect) {
        window.location = resp.redirect;
    }
}

function formObj() {
    var button, disabledText, service, data, callback, resp;
    var formRedirects = false;
    var isAdmin = false;
    var timeout = 90000;
    this.onStart = function () {
        disableButton(this.button, this.disabledText);
    };
    this.reenableForm = function () {
        reenableButton(this.button);
    };
    this.clearFields = function () {
        $("#" + this.button).closest("form").find("input").each(function () {
            var field = $(this);
            field.val("");
            if (field.attr("type") == "password") {
                var tempField = $("#" + field.attr("id") + "-temp");
                if (tempField.length > 0) {
                    field.hide();
                    tempField.show();
                }
            }
        });
    };
    this.onSuccess = function () {
        var resp = this.resp;
        if (resp.errType) {
            window.location = ((this.isAdmin) ? "/admin" : "") + "/error/?err=" + resp.errType;
        } else if (resp.redirect) {
            window.location = resp.redirect;
        } else {
            this.callback(resp);
        }
        if (resp.IsValid) {
            if (!this.formRedirects) {
                this.reenableForm();
            }
            unhideCode(this.button);
            if (!resp.Data || (resp.Data && !resp.Data.overrideReset == true)) resetAction(this.button);
        } else {
            this.reenableForm();
        }
        return false;
    }
    this.initForm = function (confirmMsg) {
        var f = this;
        $("#" + f.button).click(function (e) {
            if (!$(this).is(":visible")) {
                return false;
            }
            if (confirmMsg && !confirm(confirmMsg)) {
                return false;
            }
            try {
                removeFeedback();
                f.onStart();
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    url: f.service,
                    data: f.data() + serializeSecToken(),
                    timeout: f.timeout,
                    success: function (resp) {
                        f.resp = resp;
                        f.onSuccess();
                    },
                    error: function (e) {
                        alert("An error occurred");
                        f.reenableForm();
                    }
                });
                return false;
            } catch (err) {
                f.reenableForm();
                return false;
            }
        });
    };
}

function showPopover(id, msg, altid, altid2) {
    var el = $("#" + id);
    if (altid && !el.is(":visible")) el = $("#" + altid);
    if (altid2 && !el.is(":visible")) el = $("#" + altid2);
    var current = el.data("popover");
    if (current) {
        current.$tip.find(".content p").html(msg);
        current.$tip.show();
    } else {
        el.popover({
            content: msg,
            trigger: "manual"
        });
        el.popover("show");
        if (window.pageYOffset > 0) {
            var tip = el.data("popover").$tip
            var top = parseInt(tip.css("top").replace("px", ""));
            top = top - window.pageYOffset;
            tip.css("top", top + "px");
        }
    }
}

function showAlert(msg, icon, type, idoverride) {
    if (!type) type = "alert-error";
    if (!icon) icon = "fa fa-times-circle fa-spacer";
    if (!idoverride) idoverride = "alert";

    $("#" + idoverride).after("<div class=\"alert " + type + "\"><i class=\"" + icon + "\"></i>&nbsp;" + msg + "</div>");
    window.location = "#";
}

// admin only
function hideValidationError(id) {
    var field = $("#" + id + "");
    if (document.location.href.indexOf("/admin/") > -1) {
        field.closest(".control-group").removeClass("error");
        field.next(".help-inline").remove();
        field.closest(".controls").children(".code").show();
    }
}

function showValidationError(id, message) {
    var field = $("#" + id + "");
    if (document.location.href.indexOf("/admin/") > -1) {
        field.closest(".control-group").addClass("error");
        if (message) {
            field.after("<span class=\"help-inline\">" + message + "</span>");
            var controls = field.closest(".controls");
            controls.children(".code").hide();
        }
    } else {
        field.closest(".form-group").addClass("has-error");
        if (field.is("input")) {
            if (!field.is("input[type=hidden],input[type=checkbox]")) {
                field.closest(".form-group").addClass("has-feedback");
                field.closest(".form-group").append("<span class=\"fa fa-remove form-control-feedback\" aria-hidden=\"true\"></span>");
            }
        }
    }
}

function showValidationErrorField(id) {
    var field = $("#" + id + "");
    field.addClass("error");
}

function showUploaderValidationError(message) {
    var obj = $(".uploadify-button-text");
    //obj.text(message);
    obj.css("color", "#B94A48");
    obj.closest(".control-group").addClass("error");
}

function showEditorValidationError(message, obj) {
    if (!obj) obj = $(".redactor_box");
    obj.css("border", "1px solid #B94A48");
    obj.closest(".control-group").addClass("error");
    if (message) obj.after("<span class=\"help-inline\">" + message + "</span>");
}

function unhideCode(formButton) {
    $("#" + formButton).closest("form").find(".code").show();
}

function resetAction(formButton) {
    $("#" + formButton).closest("form").find("input[id$='action']").val("edit");
}

function removeFeedback() {
    $(".uploadify-button-text").css("color", "#333333");
    $(".redactor_box").css("border", "1px solid #DDDDDD");
    $(".error").removeClass("error");
    $(".has-error").removeClass("has-error");
    $(".has-feedback").removeClass("has-feedback");
    $(".form-control-feedback").remove();
    $(".help-inline:not([class*='no-clear'])").remove();
    $(".help-block:not([class*='no-clear'])").remove();
    $(".alert:not([class*='no-clear'])").hide();
}

function getSafeHtml(id) {
    var html = $("#" + id).val();
    html = encodeURIComponent(html);
    html = html.replace(/%/g, '~');
    return html;
}

function convertSafeHtml(html) {
    html = encodeURIComponent(html);
    html = html.replace(/%/g, '~');
    return html;
}

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function trim(text, char) {
    while (text.substring(0, 1) == char) {
        text = text.substring(1);
    }
    while (text.substring(text.length - 1) == char) {
        text = text.substring(0, text.length - 1);
    }
    return text;
}

jQuery.fn.extend({
    addToList: function (value, delim) {
        return this.filter(":input").val(function (i, v) {
            if (value == "" || value == null || value == undefined) return v;
            if (v == "") {
                return value;
            } else {
                var arr = v.split(delim);
                arr.push(value);
                return arr.join(delim);
            }
        }).end();
    },
    removeFromList: function (value, delim) {
        return this.filter(":input").val(function (i, v) {
            if (value == "" || value == null || value == undefined) return v;
            return $.grep(v.split(delim), function (val) {
                return val != value;
            }).join(delim);
        }).end();
    }
});


function isHTML5UploadEnabled() {
    return typeof window.FormData !== 'undefined';
}

function initUpload(uploadControl, uploadSuccessCallback, uploadLimitCallback) {
    var fileuploaders = (uploadControl ? $(uploadControl) : $(".file-upload"));
    if (fileuploaders.length > 0) {
        fileuploaders.each(function (idx, el) {
            var uploader = $(el);
            var uploaderId = uploader.attr("id");
            if (!uploaderId) {
                uploaderId = "file-upload-" + idx;
                uploader.attr("id", uploaderId);
            }
            var form = uploader.closest("form");
            var queueId = uploader.attr("id") + "-queue";
            var queue = form.find(".file-upload-queue").attr("id", queueId);
            var queueExists = (queue.length > 0) ? true : false;
            var thumbnailId = uploader.attr("id") + "-thumbnail";
            var fileId = uploader.attr("id") + "-file";
            var thumbnail = $("#" + thumbnailId).length ? $("#" + thumbnailId) : uploader.parent().find(".file-upload-thumbnail").attr("id", thumbnailId);
            var thumbnailExists = (thumbnail.length > 0) ? true : false;
            var sizeLimit = uploader.attr("data-size-limit");
            var fileLimit = parseInt(uploader.attr("data-file-limit"));
            var buttonClass = uploader.attr("data-button-class");
            var buttonText = uploader.attr("data-button-text");
            var uploaderPath = uploader.attr("data-uploader-path");
            var fileTypeDesc = uploader.attr("data-filetype-desc");
            var fileTypeExts = uploader.attr("data-filetype-exts");
            var redirect = uploader.attr("data-redirect");
            var noreenable = uploader.attr("data-no-reenable");
            var lastFile;
            if (thumbnail.length && thumbnail.attr("src") == "") {
                thumbnail.hide();
            }

            uploader.hide();

            function getToken() {
                var token;
                $.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    async: false,
                    url: "/ws/file/upload-token/",
                    data: serializeSecToken(),
                    success: function (resp) {
                        if (resp.Ok) {
                            token = resp.token;
                        } else {
                            handleResponseError(resp);
                        }
                    },
                    error: function () {
                        alert("An error occurred");
                    }
                });
                return token;
            }

            var errorCount = 0;
            function writeError(msg) {
                errorCount++;
                if (queueExists) {
                    var randId = Math.random().toString(36).substring(2);
                    queue.append("<div id=\"Err_" + randId + "\" class=\"alert alert-error\" style=\"margin-bottom: 5px; line-height: 150%\">" + msg + "</div>");
                    setTimeout(function () {
                        queue.find("#Err_" + randId).fadeOut("fast", function () {
                            $(this).remove();
                        });
                    }, 5000);
                } else {
                    alert(msg);
                }
            }

            if (isHTML5UploadEnabled()) {

                uploader.after("<label for='" + uploaderId + "' class='btn btn-default uploader-btn " + buttonClass + "'>" + buttonText + "</label>");
                var uploaderBtn = $(".uploader-btn[for='" + uploaderId + "']");

                if (fileLimit > 1) {
                    uploader.attr("multiple", "multiple");
                }

                if (fileTypeExts) {
                    uploader.attr("accept", fileTypeExts.replace(/\*/g, "").replace(/\;/g, ","));
                }

                var uploadLimit = function () {
                    var reachedUploadLimit = false;
                    if (uploadLimitCallback && typeof (uploadLimitCallback) === "function") {
                        reachedUploadLimit = uploadLimitCallback();
                        if (!reachedUploadLimit) {
                            uploaderBtn.removeClass("disabled");
                        }
                    }
                    if (reachedUploadLimit) {
                        uploaderBtn.text(buttonText);
                        uploaderBtn.addClass("disabled");
                    }
                    return reachedUploadLimit;
                }

                function reenable() {
                    uploaderBtn.text(buttonText);
                    if (!uploadLimit()) {
                        uploaderBtn.removeClass("disabled");
                    }
                }

                uploadLimit();

                uploader.on("change",
                    function (evt) {

                        if (uploadLimit()) return;

                        var files = evt.target.files;
                        uploaderBtn.addClass("disabled");
                        uploaderBtn.text("Uploading...");

                        var fileIdx = 0;
                        var filesUploaded = 0;
                        var filesToUpload = 0;
                        $.each(files,
                            function (key, value) {
                                if (uploadLimit()) return;
                                var file = files[fileIdx++];
                                var formdata = new FormData();

                                if (sizeLimit === "" || file.size < (sizeLimit * 1024 * 1024)) {
                                    var token = getToken(function () { });
                                    formdata.append("token", token);
                                    formdata.append("fileId", fileId);
                                    formdata.append("Filename", file.name);
                                    formdata.append("Filedata", value);
                                    filesToUpload++;
                                    $.ajax({
                                        url: uploaderPath,
                                        enctype: 'multipart/form-data',
                                        type: 'POST',
                                        data: formdata,
                                        cache: false,
                                        processData: false,
                                        contentType: false,
                                        success: function (data) {
                                            if (typeof data.error === 'undefined') {
                                                if (uploadSuccessCallback &&
                                                    typeof (uploadSuccessCallback) === "function") {
                                                    uploadSuccessCallback(uploader, file, data);
                                                } else {
                                                    lastFile = file.name;
                                                    if (data === "error") {
                                                        writeError("An error occurred processing " + file.name);
                                                    } else if (data === "size-error") {
                                                        writeError('Incorrect file size(W X H) used.');
                                                    } else if (thumbnailExists) {
                                                        thumbnail.attr("src",
                                                            uploader.attr("data-thumbnail-url") + data);
                                                        thumbnail.attr("data-filename", data);
                                                        thumbnail.show();
                                                    } else if (fileId) {
                                                        $("#" + fileId).data("data-filename", data);
                                                    }
                                                }

                                                uploadLimit();
                                            } else {
                                                writeError("An error occurred processing " + file.name);
                                            }
                                            filesUploaded++;
                                        },
                                        error: function () {
                                            writeError("An error occurred processing " + file.name);
                                        }
                                    });
                                } else {
                                    alert(file.name + " Exceeds file size limit " + sizeLimit + " MB.");
                                }
                            });

                        var checkFilesUploaded = setInterval(function () {
                            if (filesToUpload === filesUploaded) {
                                clearInterval(checkFilesUploaded);
                                if (redirect && redirect !== "") {
                                    if (redirect.indexOf("{lastFile}") > -1) {
                                        if (lastFile) {
                                            redirect = redirect.replace("{lastFile}", lastFile);
                                        } else {
                                            redirect = "";
                                        }
                                    }
                                    window.location = redirect;
                                } else {
                                    reenable();
                                }
                            }
                        }, 1000);
                    });
            } else {

                function reenable() {
                    uploader.uploadify("settings", "buttonText", buttonText);
                    uploader.uploadify("settings", "buttonClass", buttonClass);
                    uploader.uploadify("disable", false);
                }

                uploader.uploadify({
                    "buttonClass": buttonClass,
                    "width": 190,
                    "height": 34,
                    "buttonText": buttonText,
                    "progressData": "percentage",
                    "swf": "/js/uploadify.swf",
                    "uploader": uploaderPath,
                    "queueID": (!queueExists) ? false : queueId,
                    "auto": true,
                    "fileTypeDesc": fileTypeDesc,
                    "fileTypeExts": fileTypeExts,
                    "queueSizeLimit": fileLimit,
                    "multi": (fileLimit > 1) ? true : false,
                    "fileSizeLimit": sizeLimit + "MB",
                    "removeTimeout": 1,
                    "successTimeout": 180,
                    "overrideEvents": ["onDialogClose"],
                    "itemTemplate": (!queueExists) ? null : "<div id=\"${fileID}\" class=\"alert alert-success\" style=\"margin-bottom: 5px; line-height: 150%\"><button type=\"button\" class=\"close\" onclick=\"$('#${instanceID}').uploadify('cancel', '${fileID}')\">&#215;</button><span class=\"fileName\">${fileName} (${fileSize})</span><span class=\"data\"></span></div>",
                    "onFallback": function () {
                        writeError("You need Flash installed to upload files");
                    },
                    "onUploadSuccess": function (file, data) {
                        if (uploadSuccessCallback && typeof (uploadSuccessCallback) === "function") {
                            uploadSuccessCallback(uploader, file, data);
                        } else {
                            lastFile = file.name;
                            if (data === "error") {
                                writeError("An error occurred processing " + file.name);
                            } else if (thumbnailExists) {
                                thumbnail.attr("src", uploader.attr("data-thumbnail-url") + data);
                                thumbnail.attr("data-filename", data);
                                thumbnail.show();
                                uploader.trigger("uploaded", data);
                            } else if (fileId) {
                                $("#" + fileId).data("data-filename", data);
                                uploader.trigger("uploaded", data);
                            }
                        }
                    },
                    "onUploadStart": function (file) {
                        var reachedUploadLimit = false;
                        if (uploadLimitCallback && typeof (uploadLimitCallback) === "function") {
                            reachedUploadLimit = uploadLimitCallback();
                        }

                        if (!reachedUploadLimit) {
                            var token = getToken();
                            uploader.uploadify("settings", "formData", { "token": token, "fileId": fileId });
                            uploader.uploadify("settings", "buttonText", "Uploading...");
                            uploader.uploadify("settings", "buttonClass", buttonClass + " disabled");
                            uploader.uploadify("disable", true);
                        }
                    },
                    "onQueueComplete": function () {
                        if (noreenable != "true") {
                            reenable();
                        }
                        if (uploadLimitCallback && typeof (uploadLimitCallback) === "function") {
                            if (uploadLimitCallback()) {
                                uploader.uploadify("disable", true);
                            }
                        }
                    },
                    "onDialogClose": function (queueData) {
                        if (queueData.filesErrored > 0) {
                            writeError(queueData.errorMsg);
                        };
                        if (queueExists && redirect) {
                            var int = setInterval(function () {
                                var uploadMgsCount = queue.find("div[id^='SWFUpload']").length;
                                var errorMgsCount = queue.find("div[id^='Err_']").length;
                                if (uploadMgsCount == 0 && errorMgsCount == 0) {
                                    clearInterval(int);
                                    if (redirect.indexOf("{lastFile}") > -1) {
                                        if (lastFile) {
                                            redirect = redirect.replace("{lastFile}", lastFile);
                                        } else {
                                            redirect = "";
                                        }
                                    }
                                    if (redirect != "" && errorCount == 0) {
                                        window.location = redirect;
                                    } else {
                                        reenable();
                                    }
                                }
                            }, 100);
                        }
                        return false;
                    },
                    "onSWFReady": function () {
                        if (uploadLimitCallback && typeof (uploadLimitCallback) === "function") {
                            if (uploadLimitCallback()) {
                                uploader.uploadify("disable", true);
                            }
                        }
                    }
                });
            }
        });
    }
}

function getCombinedAlert(data) {
    var msg = "";
    for (var i in data.ErrFields) {
        msg += ((msg == "") ? "" : "\n") + data.ErrFields[i].replace(/^\*/,"");
    }
    return msg;
}

var submitText = "<i class=\"fa fa-spinner fa-spin\"></i> Submitting..."

var trackOutboundLink = function (category, eventname, url) {
    ga('send', 'event', category, eventname, url);
}

function isIE() {
    var undef, rv = -1;
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');

    if (msie > 0) {
        rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    } else if (trident > 0) {
        var rvNum = ua.indexOf('rv:');
        rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
    }

    return ((rv > -1) ? rv : undef);
}

function parseGoogleAddress(matchedaddress) {
    var address_components = (matchedaddress ? matchedaddress.address_components : null);
    var partialMatch = (matchedaddress ? matchedaddress.partial_match === true ? true : false : false);
    this.address1 = "";
    this.address2 = "";
    this.city = "";
    this.state = "";
    this.zip = "";
    this.country = "";
    this.formatted_address = "";
    if (address_components && partialMatch === false) {
        for (var i = 0; i < address_components.length; i++) {
            var addressType = address_components[i].types[0];
            if (addressType === "street_number") {
                this.address1 = address_components[i]['short_name'];
            } else if (addressType === "route") {
                this.address1 += " " + address_components[i]['short_name'];
            } else if (addressType === "locality") {
                this.city = address_components[i]['short_name'];
            } else if (addressType === "administrative_area_level_1") {
                this.state = address_components[i]['short_name'];
            } else if (addressType === "postal_code") {
                this.zip = address_components[i]['short_name'];
            } else if (addressType === "country") {
                this.country = address_components[i]['short_name'];
                if (this.country === "US") this.country = "USA";
            } else if (addressType === "subpremise") {
                this.address2 = address_components[i]['short_name'];
            }
        }
        this.formatted_address = matchedaddress.formatted_address;
    }
}

function checkWebNotificationPermission() {
    if (!("Notification" in window)) {
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }
}


function checkIfWebNotificationExists(id) {
    var result = false;
    if ($.lstWebNotification) {
        result = ($.lstWebNotification.map(function (item) { return item.id; }).indexOf(id) > -1);
    }
    return result;
}

function removeWebNotificationFromList(id) {
    if ($.lstWebNotification) {
        var removeIndex = $.lstWebNotification.map(function (item) { return item.id; }).indexOf(id);
        $.lstWebNotification.splice(removeIndex, 1);
    }
}

function closeWebNotification(id) {
    if (checkIfWebNotificationExists(id)) {
        if ($.lstWebNotification) {
            $.each(lstWebNotification, function (i, el) {
                if (el.id == id) {
                    el.notification.close();
                }
            });
        }
    }
}

function showWebNotification(id, title, message, icon, action, timeout) {
    var notified = false;
    if (!("Notification" in window)) {
        notified = false;
    } else if (Notification.permission === "granted") {
        showNotification(id, title, message, icon, action);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                showNotification(id, title, message, icon, action);
            }
        });
    }

    function showNotification(id, title, message, icon, action) {
        notified = true;
        if (checkIfWebNotificationExists(id)) return;
        var notification = new Notification(title, { body: message, icon: icon, requireInteraction: true, tag: id });
        if (action && typeof (action) === "function") {
            notification.onclick = function (event) {
                action();
            };
        }
        if (timeout) {
            setTimeout(function () { notification.close(); }, timeout);
        }
        if (!$.lstWebNotification) $.lstWebNotification = new Array();
        $.lstWebNotification.push({ id: id, notification: notification });
        notification.onclose = function (event) {
            removeWebNotificationFromList(id);
        };
    }
    return notified;
}

function getGoogleMapsAPIKey() {
    var gkey = ""
    $.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        async: false,
        url: "/ws/googlemaps-apikey/",
        data: serializeSecToken(),
        success: function (data) {
            gkey = data;
        }
    });
    return gkey;
}

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
    });
};
