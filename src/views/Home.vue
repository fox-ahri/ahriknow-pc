<template>
    <div class="home">
        <div class="view">
            <aside>
                <div class="logo nocopy">
                    <div class="title1">谦受益，满招损</div>
                    <div class="title2">Pride hurts,&nbsp;modesty benefits.</div>
                </div>
                <div class="nav nocopy">
                    <div class="item" @click="goto('blog-home')">
                        <span class="icon">
                            <i class="iconfont akhome"></i>首页
                        </span>
                    </div>
                    <div class="item" @click="goto('blog-file')">
                        <span class="icon">
                            <i class="iconfont akbook1"></i>归档
                        </span>
                    </div>
                    <!-- <div class="item">
                        <span class="icon">
                            <i class="iconfont aklabel"></i>标签
                        </span>
                        <span class="label">12</span>
                    </div>-->
                    <div class="item" @click="goto('blog-search')">
                        <span class="icon">
                            <i class="iconfont akSearch"></i>搜索
                        </span>
                    </div>
                    <div class="item" @click="goto('blog-category')">
                        <span class="icon">
                            <i class="iconfont akcategory"></i>分类
                        </span>
                        <span class="label">{{ n - 1 }}</span>
                    </div>
                    <div class="item" @click="goto('blog-article')">
                        <span class="icon">
                            <i class="iconfont akicon-articles"></i>文章
                        </span>
                        <span class="label">{{ m }}</span>
                    </div>
                    <div class="item" @click="goto('blog-collection')">
                        <span class="icon">
                            <i class="iconfont akcollection"></i>收藏
                        </span>
                        <span class="label">{{ y }}</span>
                    </div>
                    <div class="item" @click="goto('book-bookshelf')">
                        <span class="icon">
                            <i class="iconfont akbook"></i>文档
                        </span>
                        <span class="label">{{ x }}</span>
                    </div>
                    <div class="item" @click="goto('blog-about')">
                        <span class="icon">
                            <i class="iconfont akabout"></i>关于
                        </span>
                    </div>
                </div>
                <div class="contact nocopy">
                    <el-tooltip content="https://github.com/fox-ahri" placement="top">
                        <a href="https://github.com/fox-ahri" target="_black">
                            <span>
                                <i class="iconfont akgithub"></i>
                            </span>
                        </a>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content" class="qq">
                            <img src="../assets/qq.jpg" style="width: 180px" alt />
                        </div>
                        <span>
                            <i class="iconfont akqq"></i>
                        </span>
                    </el-tooltip>
                    <el-tooltip placement="top">
                        <div slot="content" class="wx">
                            <img src="../assets/wx.png" style="width: 180px" alt />
                        </div>
                        <span>
                            <i class="iconfont akweixin"></i>
                        </span>
                    </el-tooltip>
                    <el-tooltip content="myfsnow@163.com" placement="top">
                        <span>
                            <i class="iconfont akemail"></i>
                        </span>
                    </el-tooltip>
                </div>
                <div class="link nocopy">
                    <a
                        class="a"
                        href="https://admin.ahriknow.com/#/notebook/book"
                        target="_black"
                    >写笔记</a>
                    <a class="a" href="https://admin.ahriknow.com/#/blog/survey" target="_black">发文章</a>
                    <a class="a" href="https://admin.ahriknow.com" target="_black">后台</a>
                    <span class="a" @click="exit">退出</span>
                </div>
                <div class="link nocopy" v-show="link" v-if="link.length > 0">
                    <div class="friend">
                        <h4>友情链接：</h4>
                        <div class="item" v-for="i in link">
                            <el-tooltip placement="top">
                                <div slot="content">
                                    <span style="font-size: 16px">{{ i.name }}</span>:
                                    <br />
                                    {{ i.desc }}
                                </div>
                                <a :href="i.url" target="_black">
                                    <div class="left">
                                        <img :src="i.image" alt />
                                    </div>
                                    <div class="right">
                                        <span class="name">{{ i.name }}</span>
                                        <span class="desc">{{ i.desc }}</span>
                                    </div>
                                </a>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
                <div class="link2 nocopy">
                    <div class="c">© 2019 - 2021 ahriknow.com</div>
                    <div class="b">
                        <a
                            href="http://beian.miit.gov.cn/publish/query/indexFirst.action"
                        >吉ICP备 19000749号-5</a>
                    </div>
                </div>
            </aside>
            <section ref="section">
                <div class="content">
                    <div id="top"></div>
                    <router-view />
                    <footer class="nocopy">
                        <div class="info">
                            <div class="c">© 2019 吉ICP备 19000749号-5 版权所有</div>
                            <div class="b">
                                <a href="http://www.beian.gov.cn/portal/registerSystemInfo">
                                    <img src="../assets/TB2.gif" alt />
                                    <img src="../assets/TB1.png" alt />
                                    <span>吉公网安备 xxx号</span>
                                </a>
                            </div>
                        </div>
                        <hr style="height:2px;border:none;border-top:2px dashed #aaa;" />
                        <div class="msg" @click="smoothscroll">
                            <span style="font-size: 12px">Top</span>
                            <i class="el-icon-top"></i>&nbsp;
                            <i class="el-icon-top"></i>&nbsp;
                            <i class="el-icon-top"></i>&nbsp;
                            <span>狸知 - Ahriknow</span>&nbsp;
                            <i class="el-icon-top"></i>&nbsp;
                            <i class="el-icon-top"></i>&nbsp;
                            <i class="el-icon-top"></i>
                            <span style="font-size: 12px">Top</span>
                        </div>
                    </footer>
                </div>
            </section>
        </div>
        <el-dialog style="z-index: 9999" title="登录" :visible.sync="dialogFormVisible">
            <div slot="footer" class="dialog-footer">
                <el-card class="box-card">
                    <div class="form">
                        <el-form
                            :model="ruleForm"
                            status-icon
                            :rules="rules"
                            ref="ruleForm"
                            label-width="100px"
                            class="demo-ruleForm"
                        >
                            <el-form-item label="用户名" prop="username">
                                <el-input
                                    type="text"
                                    v-model="ruleForm.username"
                                    autocomplete="off"
                                    placeholder="Username"
                                    @keyup.enter.native="submitForm('ruleForm')"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                                <el-input
                                    type="password"
                                    v-model="ruleForm.password"
                                    autocomplete="off"
                                    placeholder="Password"
                                    @keyup.enter.native="submitForm('ruleForm')"
                                ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="submitForm('ruleForm')">登 录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        var validateUsername = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            user: {
                role: 0
            },
            m: 0,
            n: 0,
            x: 0,
            y: "N",
            link: [],
            dialogFormVisible: false,
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
                username: [{ validator: validateUsername, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let self = this;
                    this.axios({
                        url: self.url + "/verification/auth/login/",
                        method: "post",
                        data: JSON.stringify(self.ruleForm),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).then(
                        function(response) {
                            if (response.data.code === 200) {
                                self.$message({
                                    showClose: true,
                                    message: "登陆成功",
                                    type: "success"
                                });
                                self.user = JSON.parse(response.data.data);
                                self.$store.commit(
                                    "SAVE_USER",
                                    response.data.data
                                );
                                self.getCount();
                                self.dialogFormVisible = false;
                                window.location.reload();
                            } else if (response.data.code === 300) {
                                self.$message({
                                    showClose: true,
                                    message: "用户被禁用",
                                    type: "error"
                                });
                            } else if (response.data.code === 301) {
                                localStorage.setItem(
                                    "username",
                                    self.ruleForm.username
                                );
                                self.$router.push({
                                    name: "auth-verification",
                                    params: self.ruleForm.username
                                });
                            } else if (response.data.code === 400) {
                                self.$message({
                                    showClose: true,
                                    message: "用户名或密码错误",
                                    type: "warning"
                                });
                            } else {
                                console.log(response);
                                self.$message({
                                    showClose: true,
                                    message: "服务器内部错误"
                                });
                            }
                        },
                        function(response) {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "客户端错误，请求失败"
                            });
                        }
                    );
                } else {
                    return false;
                }
            });
        },
        exit() {
            localStorage.removeItem("auth");
            this.user = {
                role: 0
            };
            this.y = "N";
            window.location.reload();
        },
        goto(path) {
            if (path == "blog-collection") {
                if (this.user.role <= 0) {
                    this.dialogFormVisible = true;
                    return;
                }
            }
            if (this.$route.name != path)
                this.$router.push({
                    name: path,
                    params: { from: this.$route.name }
                });
        },
        smoothscroll() {
            let currentScroll = this.$refs.section.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(this.smoothscroll);
                this.$refs.section.scrollTo(
                    0,
                    currentScroll - currentScroll / 5
                );
            }
        },
        getCount() {
            let self = this;
            this.axios
                .get(self.url + "/data/ahriblog/count/", {
                    params: {
                        user_id: self.user.role > 0 ? self.user._id : ""
                    }
                })
                .then(response => {
                    self.m = response.data.data.article;
                    self.n = response.data.data.category;
                    self.x = response.data.data.book;
                    if (self.user.role > 0)
                        self.y = response.data.data.collection;
                })
                .catch(response => {
                    console.log(response);
                });
        }
    },
    mounted() {
        if (this.$store.state.user != null) {
            this.user = this.$store.state.user;
        } else {
            this.user = {
                role: 0
            };
        }
        let self = this;
        this.getCount();
        this.axios
            .get(self.url + "/data/ahriblog/friend/")
            .then(response => {
                self.link = response.data.data;
            })
            .catch(response => {
                console.log(response);
            });
    },
    watch: {
        $route(to, from) {
            this.smoothscroll();
        }
    }
};
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    background: rgb(246, 254, 255);
    .view {
        width: 1300px;
        height: 100%;
        margin: 0 auto;
        display: flex;
        aside {
            padding: 0 26px 0 6px;
            width: 320px;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
            float: left;
            .logo {
                height: 140px;
                background: #222;
                text-align: center;
                padding-top: 30px;
                .title1 {
                    font-size: 26px;
                    color: #eee;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .title2 {
                    font-size: 18px;
                    color: #eee;
                    font-weight: bold;
                }
            }
            .nav {
                height: 350px;
                box-shadow: inset #ccc 0 0 4px;
                margin-bottom: 15px;
                padding: 15px;
                background: #fff;
                .item {
                    margin: 6px 10px;
                    cursor: pointer;
                    transition: 0.2s;
                    padding: 4px 10px;
                    display: flex;
                    justify-content: space-between;
                    &:hover {
                        background: #eee;
                    }
                    &:active {
                        background: #ccc;
                    }
                    .icon {
                        display: flex;
                        i {
                            font-size: 24px;
                            margin-right: 6px;
                        }
                    }
                    .label {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0 4px;
                        height: 24px;
                        background: #ccc;
                        border-radius: 13px;
                        font-size: 14px;
                    }
                }
            }
            .contact {
                background: #fff;
                padding: 20px;
                box-shadow: inset #ccc 0 0 4px;
                display: flex;
                justify-content: space-around;
                a {
                    text-decoration: none;
                }
                span {
                    cursor: pointer;
                    i {
                        font-size: 28px;
                        color: #666;
                    }
                    &:hover {
                        i {
                            color: #333;
                        }
                    }
                }
                .qq {
                    background: #fff;
                    width: 160px;
                    height: 160px;
                }
            }
            .link {
                background: #fff;
                padding: 20px;
                box-shadow: inset #ccc 0 0 4px;
                display: flex;
                justify-content: space-around;
                margin: 10px 0;
                .a {
                    text-decoration: none;
                    color: #888;
                    transition: 0.2s;
                    cursor: pointer;
                    &:hover {
                        color: #444;
                    }
                }
                .friend {
                    width: 100%;
                    .item {
                        margin: 10px;
                        a {
                            display: flex;
                            .left {
                                width: 34px;
                                height: 34px;
                                img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }
                            .right {
                                width: 170px;
                                display: flex;
                                flex-direction: column;
                                .name {
                                    font-size: 14px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                                .desc {
                                    font-size: 12px;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                }
                            }
                        }
                    }
                }
            }
            .link2 {
                background: #fff;
                padding: 20px;
                box-shadow: inset #ccc 0 0 4px;
                margin: 10px 0;
                .c {
                    font-size: 16px;
                    color: #666;
                }
                .b {
                    a {
                        color: #666;
                        transition: 0.2s;
                        &:hover {
                            color: #888;
                        }
                    }
                }
            }
        }
        section {
            flex: 1;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0 6px;
            margin-left: -15px;
            background: #fff;
            box-shadow: inset #ccc 0 0 4px;
            .content {
                width: 100%;
                min-height: 96%;
                position: relative;
                padding-bottom: 100px;
                footer {
                    position: absolute;
                    width: 100%;
                    height: 80px;
                    bottom: 0;
                    left: 0;
                    .info {
                        display: flex;
                        justify-content: space-between;
                        height: 40px;
                        line-height: 40px;
                        padding: 0 100px;
                        color: #aaa;
                        .c {
                            font-size: 14px;
                        }
                        .b {
                            a {
                                color: #aaa;
                                transition: 0.2s;
                                &:hover {
                                    color: #666;
                                }
                                img {
                                    width: 20px;
                                    height: 20px;
                                    transform: translateY(5px);
                                }
                            }
                        }
                    }
                    .msg {
                        text-align: center;
                        line-height: 70px;
                        font-size: 26px;
                        color: #aaa;
                        cursor: pointer;
                        transition: 0.2s;
                        &:hover {
                            color: #666;
                        }
                    }
                }
            }
        }
    }
}
</style>
