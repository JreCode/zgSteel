// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// let CryptoJS = require('./utils/crypto.js');
let api = 'http://47.104.218.70:16543/';
let CryptoJS = require("crypto-js");
let md5 = require('./utils/MD5.js');
let http=require('http');
const {session} = require('electron')
function Encrypt(word){
    var key = CryptoJS.enc.Utf8.parse("1HvdRQI7MbzyqGhr");
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
}
function Decrypt(word){
    var key = CryptoJS.enc.Utf8.parse("1HvdRQI7MbzyqGhr"); 
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
function MD5(word,ps) {
    return md5.hexMD5(word,ps);
}
function POST(URL,data,successfn){
    console.log(data);
    let that = this;
    let Data = that.Encrypt(JSON.stringify(data));
    console.log(that.Decrypt(Data));
    $.ajax({
        type: 'POST',
        url: api+URL,
        data: Data,
        contentType:'application/json',
        success: function(d, textStatus, request){
            console.log(d);
            console.log(request);
            let req = request.getResponseHeader('token');
            successfn(d,req);
        }
    });
}
function POSTS(URL,data,successfn,token){
    let that = this;
    $.ajax({
        type: 'POST',
        url: api+URL,
        data: data,
        contentType:'application/json',
        beforeSend: function(request){
            request.setRequestHeader("token", token);
        },
        success: function(d, textStatus, request){
            let req = request.getResponseHeader('token');
            successfn(d);
        }
    });
}
function GET(URL,successfn,token){
    let that = this;
    $.ajax({
        type:'GET',
        url:api+URL,
        beforeSend: function(request){
            request.setRequestHeader("token", token);
        },
        success: function(d){
            successfn(d);
        }
    });
}
function dateFormat(fmt,date)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 
module.exports = {
    MD5:MD5,
    POST:POST,
    GET:GET,
    Encrypt:Encrypt,
    Decrypt:Decrypt,
    POSTS:POSTS,
    dateFormat:dateFormat
}