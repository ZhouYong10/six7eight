<template>
    <div class="wrapper">
        <section id="content">
            <form action="/platform/admin" method="post">
                <h1>678平台管理</h1>
                <div>
                    <input type="text" placeholder="账户名" name="username" required>
                </div>
                <div>
                    <input type="password" placeholder="密码" name="password" required>
                </div>
                <div>
                    <!-- <input type="submit" value="Log in" /> -->
                    <input type="submit" value="登录" class="btn btn-primary" id="js-btn-login">
                    <a href="##">忘记密码?</a>
                    <!-- <a href="#">Register</a> -->
                </div>
            </form><!-- form -->
        </section><!-- content -->
    </div>
</template>

<script>
    export default {
        name: "login"
    }
</script>

<style lang="scss">
    a{ text-decoration: none; }
    a:hover{ text-decoration: underline; }
    .clearfix:after,form:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
    #content {
        background: #f9f9f9;
        background: linear-gradient(top,  rgba(248,248,248,1) 0%,rgba(249,249,249,1) 100%);
        box-shadow: 0 1px 0 #fff inset;
        border: 1px solid #c4c6ca;
        margin: 0 auto;
        padding: 25px 0 0;
        position: relative;
        text-align: center;
        text-shadow: 0 1px 0 #fff;
        width: 400px;
    }
    #content h1 {
        color: #7E7E7E;
        font: bold 25px Helvetica, Arial, sans-serif;
        letter-spacing: -0.05em;
        line-height: 20px;
        margin: 10px 0 30px;
    }
    #content h1:before,
    #content h1:after {
        content: "";
        height: 1px;
        position: absolute;
        top: 10px;
        width: 27%;
    }
    #content h1:after {
        background: rgb(126,126,126);
        background: linear-gradient(left,  rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
        right: 0;
    }
    #content h1:before {
        background: rgb(126,126,126);
        background: linear-gradient(right,  rgba(126,126,126,1) 0%,rgba(255,255,255,1) 100%);
        left: 0;
    }
    #content:after,
    #content:before {
        background: #f9f9f9;
        background: linear-gradient(top,  rgba(248,248,248,1) 0%,rgba(249,249,249,1) 100%);
        border: 1px solid #c4c6ca;
        content: "";
        display: block;
        height: 100%;
        left: -1px;
        position: absolute;
        width: 100%;
    }
    #content:after {
        transform: rotate(2deg);
        top: 0;
        z-index: -1;
    }
    #content:before {
        transform: rotate(-3deg);
        top: 0;
        z-index: -2;
    }
    #content form {
        margin: 0 20px;
        position: relative;
    }
    #content form input[type="text"],
    #content form input[type="password"] {
        border-radius: 3px;
        box-shadow: 0 1px 0 #fff, 0 -2px 5px rgba(0,0,0,0.08) inset;
        transition: all 0.5s ease;
        background: #eae7e7 url(login-icon.png) no-repeat;
        border: 1px solid #c8c8c8;
        color: #777;
        font: 13px Helvetica, Arial, sans-serif;
        margin: 0 0 10px;
        padding: 15px 10px 15px 40px;
        width: 80%;
    }
    #content form input[type="text"]:focus,
    #content form input[type="password"]:focus {
        box-shadow: 0 0 2px #ed1c24 inset;
        background-color: #fff;
        border: 1px solid #ed1c24;
        outline: none;
    }
    #username { background-position: 10px 10px !important }
    #password { background-position: 10px -53px !important }
    #content form input[type="submit"] {
        background: rgb(254,231,154);
        background: linear-gradient(top,  rgba(254,231,154,1) 0%,rgba(254,193,81,1) 100%);
        border-radius: 30px;
        box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset;
        border: 1px solid #D69E31;
        color: #85592e;
        cursor: pointer;
        float: left;
        font: bold 15px Helvetica, Arial, sans-serif;
        height: 35px;
        margin: 20px 0 35px 15px;
        position: relative;
        text-shadow: 0 1px 0 rgba(255,255,255,0.5);
        width: 120px;
    }
    #content form input[type="submit"]:hover {
        background: rgb(254,193,81);
        background: linear-gradient(top,  rgba(254,193,81,1) 0%,rgba(254,231,154,1) 100%);
    }
    #content form div a {
        color: #004a80;
        float: right;
        font-size: 12px;
        margin: 30px 15px 0 0;
        text-decoration: underline;
    }
    .button {
        background: rgb(247,249,250);
        background: linear-gradient(top,  rgba(247,249,250,1) 0%,rgba(240,240,240,1) 100%);
        box-shadow: 0 1px 2px rgba(0,0,0,0.1) inset;
        border-radius: 0 0 5px 5px;
        border-top: 1px solid #CFD5D9;
        padding: 15px 0;
    }

    @keyframes animate-cloud{
        from {
            background-position: 600px 100%;
        }
        to {
            background-position: 0 100%;
        }
    }

    .wrapper{
        background:url(cloud.jpg) 0 bottom repeat-x  #049ec4;
        animation: animate-cloud 20s linear infinite;
        width: auto;
        height: 100%;
        position: relative;
        z-index: -1;
        padding-top: 100px;
    }
</style>