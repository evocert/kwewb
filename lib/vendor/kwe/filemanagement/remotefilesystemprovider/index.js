define([
	"module"
],function(
	module
){
	"use strict";
	/*
	dateModifiedExpr	Specifies which data field provides timestamps that indicate when a file was last modified.
	endpointUrl		Specifies the URL of an endpoint used to access and modify a file system located on the server.
	hasSubDirectoriesExpr	Specifies which data field provides information about whether a directory has subdirectories.
	isDirectoryExpr		Specifies which data field provides information about whether a file system item is a directory.
	keyExpr			Specifies the data field that provides keys.
	nameExpr		Specifies which data field provides file and directory names.
	sizeExpr		Specifies which data field provides file sizes.
	thumbnailExpr		Specifies which data field provides icons to be used as thumbnails.
	*/
	var logger={
		log:function(val){
			console.log(val);
		}
	};
	function RemoteFileSystemProvider(options){
		options=typeof(options)=="object"?options:{};
		options.dateModifiedExpr=typeof(options.dateModifiedExpr)=="string"?options.dateModifiedExpr:"dateModified";
		options.endpointUrl=typeof(options.endpointUrl)=="string"?options.endpointUrl:"";
		options.hasSubDirectoriesExpr=typeof(options.hasSubDirectoriesExpr)=="string"?options.hasSubDirectoriesExpr:"";//???
		options.isDirectoryExpr=typeof(options.isDirectoryExpr)=="string"?options.isDirectoryExpr:"isDirectory";
		options.keyExpr=typeof(options.keyExpr)=="string"?options.keyExpr:"key";
		options.nameExpr=typeof(options.nameExpr)=="string"?options.nameExpr:"name";
		options.sizeExpr=typeof(options.sizeExpr)=="string"?options.sizeExpr:"size";
		options.thumbnailExpr=typeof(options.thumbnailExpr)=="string"?options.thumbnailExpr:"";//???
		/*
		*/
		this.options=options;
		this._dateModifiedGetter-function(e,n){
			logger.log("_dateModifiedGetter");
		}
		this._endpointUrl=this.options.endpointUrl
		this._hasSubDirsGetter=function(e,n){
			logger.log("_hasSubDirsGetter");
		}
		this._isDirGetter=function(e,n){
			logger.log("_isDirGetter");
		}
		this._keyGetter=function(e,n){
			logger.log("_keyGetter");
		}
		this._nameGetter=function(e,n){
			logger.log("_nameGetter");
		}
		this._sizeGetter=function(e,n){
			logger.log("_sizeGetter");
		}
		this._thumbnailGetter=function(e,n){
			logger.log("_thumbnailGetter");
		}
		//_executeActionAsDeferred(e,t)
		//--------------------------------------------------------------------------------
                this.getItems=function(pathInfo) {
			logger.log("getItems");
			logger.log(pathInfo);
			/*
                    var _this2 = this;
                    return this._getEntriesByPath(pathInfo).then(function(result) {
                        return _this2._convertDataObjectsToFileItems(result.result, pathInfo)
                    })
			*/
                }
                this.renameItem=function(item, name) {
			logger.log("renameItem");
			logger.log(item);
			logger.log(name);
			/*
                    return this._executeRequest("Rename", {
                        pathInfo: item.getFullPathInfo(),
                        name: name
                    })
			*/
                }
                this.createFolder=function(parentDir, name) {
			logger.log("createFolder");
			logger.log(parentDir);
			logger.log(name);
			/*
                    return this._executeRequest("CreateDir", {
                        pathInfo: parentDir.getFullPathInfo(),
                        name: name
                    }).done(function() {
                        if (parentDir && !parentDir.isRoot) {
                            parentDir.hasSubDirs = true
                        }
                    })
			*/
                }
                this.deleteItems=function(items) {
			logger.log("deleteItems");
			logger.log(items);
			/*
                    var _this3 = this;
                    return items.map(function(item) {
                        return _this3._executeRequest("Remove", {
                            pathInfo: item.getFullPathInfo()
                        })
                    })
			*/
                }
                this.moveItems=function(items, destinationDirectory) {
			logger.log("moveItems");
			logger.log(items);
			logger.log(destinationDirectory);
			/*
                    var _this4 = this;
                    return items.map(function(item) {
                        return _this4._executeRequest("Move", {
                            sourcePathInfo: item.getFullPathInfo(),
                            destinationPathInfo: destinationDirectory.getFullPathInfo()
                        })
                    })
			*/
                }
                this.copyItems=function(items, destinationFolder) {
			logger.log("");
			/*
                    var _this5 = this;
                    return items.map(function(item) {
                        return _this5._executeRequest("Copy", {
                            sourcePathInfo: item.getFullPathInfo(),
                            destinationPathInfo: destinationFolder.getFullPathInfo()
                        })
                    })
			*/
                }
                this.uploadFileChunk=function(fileData, chunksInfo, destinationDirectory) {
			logger.log("uploadFileChunk");
			logger.log(fileData);
			logger.log(chunksInfo);
			logger.log(destinationDirectory);
			/*
                    if (0 === chunksInfo.chunkIndex) {
                        chunksInfo.customData.uploadId = new _guid2.default
                    }
                    var args = {
                        destinationId: destinationDirectory.relativeName,
                        chunkMetadata: JSON.stringify({
                            UploadId: chunksInfo.customData.uploadId,
                            FileName: fileData.name,
                            Index: chunksInfo.chunkIndex,
                            TotalCount: chunksInfo.chunkCount,
                            FileSize: fileData.size
                        })
                    };
                    var formData = new window.FormData;
                    formData.append(FILE_CHUNK_BLOB_NAME, chunksInfo.chunkBlob);
                    formData.append("arguments", JSON.stringify(args));
                    formData.append("command", "UploadChunk");
                    var deferred = new _deferred.Deferred;
                    _ajax2.default.sendRequest({
                        url: this._endpointUrl,
                        method: "POST",
                        dataType: "json",
                        data: formData,
                        upload: {
                            onprogress: _common.noop,
                            onloadstart: _common.noop,
                            onabort: _common.noop
                        },
                        cache: false
                    }).done(function(result) {
                        !result.success && deferred.reject(result) || deferred.resolve()
                    }).fail(deferred.reject);
                    return deferred.promise()
			*/
                }
                this.abortFileUpload=function(fileData, chunksInfo, destinationDirectory) {
			logger.log("abortFileUpload");
			logger.log(fileData);
			logger.log(chunksInfo);
			logger.log(destinationDirectory);
			/*
                    return this._executeRequest("AbortUpload", {
                        uploadId: chunksInfo.customData.uploadId
                    })
			*/
                }
                this.downloadItems=function(items) {
			logger.log("downloadItems");
			logger.log(items);
			/*
                    var args = this._getDownloadArgs(items);
                    var $form = (0, _renderer2.default)("<form>").css({
                        display: "none"
                    }).attr({
                        method: "post",
                        action: args.url
                    });
                    ["command", "arguments"].forEach(function(name) {
                        (0, _renderer2.default)("<input>").attr({
                            type: "hidden",
                            name: name,
                            value: args[name]
                        }).appendTo($form)
                    });
                    $form.appendTo("body");
                    _events_engine2.default.trigger($form, "submit");
                    setTimeout(function() {
                        return $form.remove()
                    })
			*/
                }
                this.getItemContent=function(items) {
			logger.log("getItemContent");
			logger.log(items);
			/*
                    var args = this._getDownloadArgs(items);
                    var formData = new window.FormData;
                    formData.append("command", args.command);
                    formData.append("arguments", args.arguments);
                    return _ajax2.default.sendRequest({
                        url: args.url,
                        method: "POST",
                        responseType: "arraybuffer",
                        data: formData,
                        upload: {
                            onprogress: _common.noop,
                            onloadstart: _common.noop,
                            onabort: _common.noop
                        },
                        cache: false
                    })
			*/
                }
                this._getDownloadArgs=function(items) {
			logger.log("_getDownloadArgs");
			logger.log(items);
			/*
                    var pathInfoList = items.map(function(item) {
                        return item.getFullPathInfo()
                    });
                    var args = {
                        pathInfoList: pathInfoList
                    };
                    var argsStr = JSON.stringify(args);
                    return {
                        url: this._endpointUrl,
                        arguments: argsStr,
                        command: "Download"
                    }
			*/
                }
                this._getItemsIds=function(items) {
			logger.log("_getItemsIds");
			logger.log(items);
			/*
                    return items.map(function(it) {
                        return it.relativeName
                    })
			*/
                }
                this._getEntriesByPath=function(pathInfo) {
			logger.log("_getEntriesByPath");
			logger.log(pathInfo);
			/*
                    return this._executeRequest("GetDirContents", {
                        pathInfo: pathInfo
                    })
			*/
                }
                this._executeRequest=function(command, args) {
			logger.log("_executeRequest");
			logger.log(command);
			logger.log(args);
			/*
                    var method = "GetDirContents" === command ? "GET" : "POST";
                    var deferred = new _deferred.Deferred;
                    _ajax2.default.sendRequest({
                        url: this._getEndpointUrl(command, args),
                        method: method,
                        dataType: "json",
                        cache: false
                    }).then(function(result) {
                        !result.success && deferred.reject(result) || deferred.resolve(result)
                    }, function(e) {
                        return deferred.reject(e)
                    });
                    return deferred.promise()
			*/
                }
                this._getEndpointUrl=function(command, args) {
			logger.log("_getEndpointUrl");
			logger.log(command);
			logger.log(arg);
			/*
                    var queryString = this._getQueryString({
                        command: command,
                        arguments: JSON.stringify(args)
                    });
                    var separator = this._endpointUrl && this._endpointUrl.indexOf("?") > 0 ? "&" : "?";
                    return this._endpointUrl + separator + queryString
			*/
                }
                this._getQueryString=function(params) {
			logger.log("_getQueryString");
			logger.log(params);
			/*
                    var pairs = [];
                    var keys = Object.keys(params);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        var value = params[key];
                        if (void 0 === value) {
                            continue
                        }
                        if (null === value) {
                            value = ""
                        }
                        if (Array.isArray(value)) {
                            this._processQueryStringArrayParam(key, value, pairs)
                        } else {
                            var pair = this._getQueryStringPair(key, value);
                            pairs.push(pair)
                        }
                    }
                    return pairs.join("&")
			*/
                }
                this._processQueryStringArrayParam=function(key, array, pairs) {
			logger.log("_processQueryStringArrayParam");
			logger.log(key);
			logger.log(array);
			logger.log(pairs);
			/*
                    var _this6 = this;
                    (0, _iterator.each)(array, function(_, item) {
                        var pair = _this6._getQueryStringPair(key, item);
                        pairs.push(pair)
                    })
			*/
                }
                this._getQueryStringPair=function(key, value) {
			logger.log("_getQueryStringPair");
			logger.log(key);
			logger.log(value);
			/*
                    return encodeURIComponent(key) + "=" + encodeURIComponent(value)
			*/
                }
                this._hasSubDirs=function(dataObj) {
			logger.log("_hasSubDirs");
			logger.log(dataObj);
			/*
                    var hasSubDirs = this._hasSubDirsGetter(dataObj);
                    return "boolean" === typeof hasSubDirs ? hasSubDirs : true
			*/
                }
	}
	module.exports=RemoteFileSystemProvider;
});
