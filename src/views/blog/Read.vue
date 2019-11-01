<template>
    <div id="blog-read" class="blog-read">
        <div class="back">
            <button @click="goBack">
                <i class="iconfont akback"></i>
            </button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button @click="drawer = true">同分类的其他文章</button>
        </div>
        <header>
            <div class="title">
                {{ article.name }}
                <el-tag v-if="article.type == 1" size="mini" type="success">原创</el-tag>
                <el-tag v-if="article.type == 2" size="mini">转载</el-tag>
                <el-tag v-if="article.type == 3" size="mini" type="info">翻译</el-tag>
            </div>
            <div class="info">{{ article.username }}&nbsp;&nbsp;&nbsp;&nbsp;{{ article.date }}</div>
        </header>
        <hr style="height:2px;border:none;border-top:2px dashed #aaa;" />
        <div class="article markdown-body" v-html="article.html"></div>
        <span class="go-back" @click="goBack">
            <i class="iconfont akback">&nbsp;&nbsp;返回</i>
        </span>
        <br />
        <br />
        <div class="comment" v-show="article.comment">
            <div class="filter">
                <el-input v-model="filterByUser" placeholder="输入用户名过滤"></el-input>
                <el-input v-model="filterByContent" placeholder="输入内容过滤"></el-input>
            </div>
            <transition
                name="fade"
                v-for="i in comment.filter(com => (!filterByUser || com.user.includes(filterByUser))&&(!filterByContent || com.comment.includes(filterByContent)))"
            >
                <div class="item">
                    <div class="avatar">
                        <img :src="i.avatar" alt />
                    </div>
                    <div class="text">
                        <div class="user">
                            <span class="name">
                                <el-tag
                                    v-if="article.username == i.username"
                                    type="success"
                                    style="font-size: 12px;height: 28px;"
                                >作者</el-tag>
                                &nbsp;{{ i.username }}
                            </span>
                            <span class="date">{{ i.date }}</span>
                            <el-button
                                v-if="article.username == user.username || user.role > 90"
                                style="float: right;padding: 5px;"
                                type="text"
                                @click="deleteMsg(i)"
                            >删除</el-button>
                        </div>
                        <div class="container" v-html="i.comment"></div>
                        <div class="reply">
                            <div class="i" v-for="j in i.reply">
                                <div class="userinfo">
                                    <span class="name">
                                        <el-tag
                                            v-if="j.name == article.username"
                                            size="mini"
                                            type="success"
                                        >作者</el-tag>
                                        <el-tag
                                            v-if="j.name == i.username"
                                            size="mini"
                                            type="warning"
                                        >层主</el-tag>
                                        &nbsp;{{ j.name }}
                                    </span>
                                    <span class="date">{{ j.date }}</span>
                                    <el-button
                                        v-if="article.username == i.username || user.role > 90"
                                        style="float: right;padding: 5px;"
                                        type="text"
                                        @click="deleteReply(i, j)"
                                    >删除</el-button>
                                </div>
                                <div class="content">{{ j.content }}</div>
                            </div>
                        </div>
                        <div class="btn">
                            <el-button type="text" v-show="!i.show" @click="i.show = true">回复</el-button>
                            <el-button type="text" v-show="i.show" @click="add_reply(i)">提交</el-button>
                            <el-button
                                type="text"
                                v-show="i.show"
                                @click="i.show = false,i.re_cont = ''"
                            >取消</el-button>
                        </div>
                        <el-input
                            style="width: 730px;float: right;margin-right: 25px"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入回复内容"
                            v-model="i.re_cont"
                            v-show="i.show"
                        ></el-input>
                    </div>
                </div>
            </transition>
            <div style="padding: 0 22px 0 24px">
                <div id="editor" v-show="user.role > 0 && showEditor" class="editor"></div>
                <br />
                <div v-if="article.comment" class="opera" style="text-align: right">
                    <el-button
                        v-show="showEditor"
                        plain
                        @click="commit"
                    >{{ user.role > 0?'提交':'登录' }}</el-button>
                    <el-button v-show="showEditor" plain @click="showEditor = false">取消</el-button>
                    <el-button v-show="!showEditor" plain @click="showEditor = true">留言</el-button>
                </div>
            </div>
        </div>
        <el-drawer title="文章列表" :visible.sync="drawer" direction="rtl">
            <div class="art-list" style="padding: 0 50px;">
                <div
                    v-for="i in art_list"
                    style="white-space: nowrap;overflow: hidden;cursor: pointer;padding: 4px;color: #333"
                    @click="read(i)"
                    @mouseenter="over($event, 1)"
                    @mouseleave="over($event, 2)"
                >{{ i.name }}</div>
            </div>
        </el-drawer>
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
                                <el-button type="primary" @click="submitForm('ruleForm')">Sign in</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import E from "wangeditor";
export default {
    name: "blog-read",
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
                username: "ahri",
                avatar:
                    "https://aaahri.cn/media/ahriblog/5d8aeda54a6f436e6d34baa4/2019_10_22/20191022UZkLlNdQ.jpg",
                role: 0
            },
            article: {},
            cate: "",
            art_list: [],
            from: "",
            drawer: false,
            text: "",
            editor: {},
            comment: [],
            filterByUser: "",
            filterByContent: "",
            dialogFormVisible: false,
            ruleForm: {
                username: "",
                password: ""
            },
            rules: {
                username: [{ validator: validateUsername, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }]
            },
            showEditor: false
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
                                self.dialogFormVisible = false;
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
        read(val) {
            if (this.$route.query.art != val._id) {
                this.$router.push({
                    name: "blog-read",
                    query: { art: val._id, cate: val.category }
                });
            }
            let self = this;
            this.article = val;
            this.drawer = false;
            if (val.comment)
                this.axios
                    .get(self.url + "/data/ahriblog/comment/", {
                        params: {
                            article: val._id
                        }
                    })
                    .then(response => {
                        if (response.data.code === 200) {
                            self.comment = response.data.data;
                        } else {
                            console.log(response);
                            self.$message({
                                showClose: true,
                                message: "服务器内部错误"
                            });
                        }
                    })
                    .catch(response => {
                        console.log(response);
                        self.$message({
                            showClose: true,
                            message: "客户端错误，请求失败"
                        });
                    });
        },
        goBack() {
            this.$router.push({ name: this.from });
        },
        over(e, o) {
            if (o == 1) e.target.style.color = "#888";
            else e.target.style.color = "#333";
        },
        deleteMsg(val) {
            let self = this;
            this.axios
                .delete(self.url + "/data/ahriblog/comment/", {
                    data: {
                        user_id: self.user._id,
                        _id: val._id
                    }
                })
                .then(response => {
                    if (response.data.code === 0) {
                        self.user = { role: 0 };
                        localStorage.removeItem("auth");
                        self.dialogFormVisible = true;
                    } else if (response.data.code === 200) {
                        self.comment = self.comment.filter(com => {
                            return com._id != val._id;
                        });
                        self.$message({
                            showClose: true,
                            message: "删除成功",
                            type: "success"
                        });
                    } else {
                        console.log(response.data);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                });
        },
        deleteReply(comment, reply) {
            comment.reply = comment.reply.filter(re => {
                return re._id != reply._id;
            });
            this.add_reply(comment, false);
        },
        add_reply(val, add = true) {
            let msg = "删除成功";
            if (add) {
                let reply = {
                    _id: new Date(),
                    name: this.user.username || "匿名",
                    date: this.generateTimeReqestNumber(),
                    content: val.re_cont
                };
                val.reply.push(reply);
                val.re_cont = "";
                val.show = false;
                msg = "回复成功";
            }
            let self = this;
            this.axios
                .put(self.url + "/data/ahriblog/comment/", val)
                .then(response => {
                    if (response.data.code === 0) {
                        localStorage.removeItem("auth");
                        self.$router.push("/auth/login");
                    } else if (response.data.code === 200) {
                        self.$message({
                            showClose: true,
                            message: msg,
                            type: "success"
                        });
                    } else {
                        console.log(response.data);
                        self.$message({
                            showClose: true,
                            message: "服务器内部错误"
                        });
                    }
                })
                .catch(response => {
                    console.log(response);
                    self.$message({
                        showClose: true,
                        message: "客户端错误，请求失败"
                    });
                });
        },
        initEditor() {
            this.editor = new E("#editor");
            this.editor.customConfig.menus = [
                "bold", // 粗体
                "fontSize", // 字号
                "fontName", // 字体
                "italic", // 斜体
                "underline", // 下划线
                "strikeThrough", // 删除线
                "foreColor", // 文字颜色
                "backColor", // 背景颜色
                "link", // 插入链接
                "list", // 列表
                "justify", // 对齐方式
                "quote", // 引用
                "emoticon", // 表情
                "table", // 表格
                "code", // 插入代码
                "undo", // 撤销
                "redo", // 重复
                "fullscreen" // 全屏
            ];
            this.editor.customConfig.emotions = [
                {
                    title: "默认",
                    type: "image",
                    content: [
                        {
                            alt: "[\u8d5e\u554a]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhzan_thumb.gif"
                        },
                        {
                            alt: "[\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png"
                        },
                        {
                            alt: "[\u53ef\u7231]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png"
                        },
                        {
                            alt: "[\u592a\u5f00\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_taikaixin_org.png"
                        },
                        {
                            alt: "[\u9f13\u638c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_guzhang_org.png"
                        },
                        {
                            alt: "[\u563b\u563b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/2018new_xixi_org.png"
                        },
                        {
                            alt: "[\u54c8\u54c8]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/2018new_haha_org.png"
                        },
                        {
                            alt: "[\u7b11cry]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_xiaoku_thumb.png"
                        },
                        {
                            alt: "[\u6324\u773c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png"
                        },
                        {
                            alt: "[\u998b\u5634]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/2018new_chanzui_org.png"
                        },
                        {
                            alt: "[\u9ed1\u7ebf]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a3/2018new_heixian_org.png"
                        },
                        {
                            alt: "[\u6c57]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png"
                        },
                        {
                            alt: "[\u6316\u9f3b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png"
                        },
                        {
                            alt: "[\u54fc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_org.png"
                        },
                        {
                            alt: "[\u6012]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_nu_org.png"
                        },
                        {
                            alt: "[\u59d4\u5c48]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_org.png"
                        },
                        {
                            alt: "[\u53ef\u601c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/2018new_kelian_org.png"
                        },
                        {
                            alt: "[\u5931\u671b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_shiwang_org.png"
                        },
                        {
                            alt: "[\u60b2\u4f24]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ee/2018new_beishang_org.png"
                        },
                        {
                            alt: "[\u6cea]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/2018new_leimu_org.png"
                        },
                        {
                            alt: "[\u5141\u60b2]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018new_kuxiao_org.png"
                        },
                        {
                            alt: "[\u5bb3\u7f9e]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png"
                        },
                        {
                            alt: "[\u6c61]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018new_wu_org.png"
                        },
                        {
                            alt: "[\u7231\u4f60]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/2018new_aini_org.png"
                        },
                        {
                            alt: "[\u4eb2\u4eb2]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/2018new_qinqin_org.png"
                        },
                        {
                            alt: "[\u8272]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/2018new_huaxin_org.png"
                        },
                        {
                            alt: "[\u61a7\u61ac]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png"
                        },
                        {
                            alt: "[\u8214\u5c4f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/2018new_tianping_org.png"
                        },
                        {
                            alt: "[\u574f\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/2018new_huaixiao_org.png"
                        },
                        {
                            alt: "[\u9634\u9669]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/2018new_yinxian_org.png"
                        },
                        {
                            alt: "[\u7b11\u800c\u4e0d\u8bed]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2d/2018new_xiaoerbuyu_org.png"
                        },
                        {
                            alt: "[\u5077\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/2018new_touxiao_org.png"
                        },
                        {
                            alt: "[\u9177]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/2018new_ku_org.png"
                        },
                        {
                            alt: "[\u5e76\u4e0d\u7b80\u5355]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_bingbujiandan_org.png"
                        },
                        {
                            alt: "[\u601d\u8003]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/30/2018new_sikao_org.png"
                        },
                        {
                            alt: "[\u7591\u95ee]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b8/2018new_ningwen_org.png"
                        },
                        {
                            alt: "[\u8d39\u89e3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/2018new_wenhao_org.png"
                        },
                        {
                            alt: "[\u6655]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/2018new_yun_org.png"
                        },
                        {
                            alt: "[\u8870]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_shuai_org.png"
                        },
                        {
                            alt: "[\u9ab7\u9ac5]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_kulou_org.png"
                        },
                        {
                            alt: "[\u5618]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/2018new_xu_org.png"
                        },
                        {
                            alt: "[\u95ed\u5634]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_bizui_org.png"
                        },
                        {
                            alt: "[\u50bb\u773c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dd/2018new_shayan_org.png"
                        },
                        {
                            alt: "[\u5403\u60ca]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/2018new_chijing_org.png"
                        },
                        {
                            alt: "[\u5410]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/2018new_tu_org.png"
                        },
                        {
                            alt: "[\u611f\u5192]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_kouzhao_org.png"
                        },
                        {
                            alt: "[\u751f\u75c5]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_shengbing_org.png"
                        },
                        {
                            alt: "[\u62dc\u62dc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/2018new_baibai_org.png"
                        },
                        {
                            alt: "[\u9119\u89c6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/2018new_bishi_org.png"
                        },
                        {
                            alt: "[\u767d\u773c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/2018new_landelini_org.png"
                        },
                        {
                            alt: "[\u5de6\u54fc\u54fc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_zuohengheng_org.png"
                        },
                        {
                            alt: "[\u53f3\u54fc\u54fc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_youhengheng_org.png"
                        },
                        {
                            alt: "[\u6293\u72c2]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/2018new_zhuakuang_org.png"
                        },
                        {
                            alt: "[\u6012\u9a82]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/2018new_zhouma_org.png"
                        },
                        {
                            alt: "[\u6253\u8138]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_dalian_org.png"
                        },
                        {
                            alt: "[\u9876]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/2018new_ding_org.png"
                        },
                        {
                            alt: "[\u4e92\u7c89]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_hufen02_org.png"
                        },
                        {
                            alt: "[\u94b1]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/2018new_qian_org.png"
                        },
                        {
                            alt: "[\u54c8\u6b20]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/55/2018new_dahaqian_org.png"
                        },
                        {
                            alt: "[\u56f0]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/2018new_kun_org.png"
                        },
                        {
                            alt: "[\u7761]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/2018new_shuijiao_thumb.png"
                        },
                        {
                            alt: "[\u5403\u74dc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/2018new_chigua_org.png"
                        },
                        {
                            alt: "[doge]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_doge02_org.png"
                        },
                        {
                            alt: "[\u4e8c\u54c8]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png"
                        },
                        {
                            alt: "[\u55b5\u55b5]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7b/2018new_miaomiao_org.png"
                        },
                        {
                            alt: "[\u8d5e]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e6/2018new_zan_org.png"
                        },
                        {
                            alt: "[good]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_good_org.png"
                        },
                        {
                            alt: "[ok]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/45/2018new_ok_org.png"
                        },
                        {
                            alt: "[\u8036]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/2018new_ye_org.png"
                        },
                        {
                            alt: "[\u63e1\u624b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/2018new_woshou_org.png"
                        },
                        {
                            alt: "[\u4f5c\u63d6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e7/2018new_zuoyi_org.png"
                        },
                        {
                            alt: "[\u6765]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_guolai_org.png"
                        },
                        {
                            alt: "[\u62f3\u5934]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/2018new_quantou_org.png"
                        },
                        {
                            alt: "[\u8d85\u65b0\u661f\u5168\u8fd0\u4f1a]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/huodong_starsports_org.png"
                        },
                        {
                            alt: "[\u4eba\u4eba\u516c\u76ca\u8282]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/huodong_renrengongyi_org.png"
                        },
                        {
                            alt: "[\u4e2d\u56fd\u8d5e]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/2018new_zhongguozan_org.png"
                        },
                        {
                            alt: "[\u9526\u9ca4]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/94/hbf2019_jinli_org.png"
                        },
                        {
                            alt: "[\u62b1\u62b1]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/2018new_baobao_org.png"
                        },
                        {
                            alt: "[\u644a\u624b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/2018new_tanshou_org.png"
                        },
                        {
                            alt: "[\u8dea\u4e86]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/2018new_gui_org.png"
                        },
                        {
                            alt: "[\u9178]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_org.png"
                        },
                        {
                            alt: "[\u54ea\u5412\u5f00\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/nezha_kaixin02_org.png"
                        },
                        {
                            alt: "[\u54ea\u5412\u59d4\u5c48]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/nezha_weiqu02_org.png"
                        },
                        {
                            alt: "[\u8f9b\u5df4]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/shiziwang_xinba_org.png"
                        },
                        {
                            alt: "[\u5927\u6bdb\u7565\u7565]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/yunying_damaoluelue_org.png"
                        },
                        {
                            alt: "[\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/2018new_xin_org.png"
                        },
                        {
                            alt: "[\u4f24\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_xinsui_org.png"
                        },
                        {
                            alt: "[\u9c9c\u82b1]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/2018new_xianhua_org.png"
                        },
                        {
                            alt: "[\u7537\u5b69\u513f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0a/2018new_nanhai_org.png"
                        },
                        {
                            alt: "[\u5973\u5b69\u513f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/39/2018new_nvhai_org.png"
                        },
                        {
                            alt: "[\u718a\u732b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/aa/2018new_xiongmao_org.png"
                        },
                        {
                            alt: "[\u5154\u5b50]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_tuzi_org.png"
                        },
                        {
                            alt: "[\u732a\u5934]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1c/2018new_zhutou_thumb.png"
                        },
                        {
                            alt: "[\u8349\u6ce5\u9a6c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/2018new_caonima_org.png"
                        },
                        {
                            alt: "[\u5965\u7279\u66fc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/2018new_aoteman_org.png"
                        },
                        {
                            alt: "[\u592a\u9633]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cd/2018new_taiyang_org.png"
                        },
                        {
                            alt: "[\u6708\u4eae]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d5/2018new_yueliang_org.png"
                        },
                        {
                            alt: "[\u6d6e\u4e91]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/2018new_yunduo_org.png"
                        },
                        {
                            alt: "[\u4e0b\u96e8]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/2018new_yu_org.png"
                        },
                        {
                            alt: "[\u6c99\u5c18\u66b4]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b7/2018new_shachenbao_org.png"
                        },
                        {
                            alt: "[\u5fae\u98ce]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/2018new_weifeng_thumb.png"
                        },
                        {
                            alt: "[\u56f4\u89c2]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/2018new_weiguan_org.png"
                        },
                        {
                            alt: "[\u98de\u673a]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4a/2018new_feiji_org.png"
                        },
                        {
                            alt: "[\u7167\u76f8\u673a]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/78/2018new_xiangji_org.png"
                        },
                        {
                            alt: "[\u8bdd\u7b52]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/48/2018new_huatong_org.png"
                        },
                        {
                            alt: "[\u8721\u70db]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/16/2018new_lazhu_org.png"
                        },
                        {
                            alt: "[\u97f3\u4e50]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/2018new_yinyue_org.png"
                        },
                        {
                            alt: "[\u559c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e0/2018new_xizi_org.png"
                        },
                        {
                            alt: "[\u7ed9\u529b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/2018new_geili_org.png"
                        },
                        {
                            alt: "[\u5a01\u6b66]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/2018new_weiwu_org.png"
                        },
                        {
                            alt: "[\u5e72\u676f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/2018new_ganbei_org.png"
                        },
                        {
                            alt: "[\u86cb\u7cd5]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/2018new_dangao_org.png"
                        },
                        {
                            alt: "[\u793c\u7269]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/2018new_liwu_org.png"
                        },
                        {
                            alt: "[\u949f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8e/2018new_zhong_org.png"
                        },
                        {
                            alt: "[\u80a5\u7682]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/2018new_feizao_thumb.png"
                        },
                        {
                            alt: "[\u7eff\u4e1d\u5e26]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cb/2018new_lvsidai_org.png"
                        },
                        {
                            alt: "[\u56f4\u8116]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/64/2018new_weibo_org.png"
                        },
                        {
                            alt: "[\u6d6a]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/46/2018new_xinlang_org.png"
                        },
                        {
                            alt: "[\u7f9e\u55d2\u55d2]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/lxhxiudada_org.gif"
                        },
                        {
                            alt: "[\u597d\u7231\u54e6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/lxhainio_org.gif"
                        },
                        {
                            alt: "[\u5077\u4e50]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhtouxiao_thumb.gif"
                        },
                        {
                            alt: "[\u7b11\u54c8\u54c8]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/32/lxhwahaha_org.gif"
                        },
                        {
                            alt: "[\u597d\u559c\u6b22]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhlike_thumb.gif"
                        },
                        {
                            alt: "[\u6c42\u5173\u6ce8]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhqiuguanzhu_org.gif"
                        },
                        {
                            alt: "[\u80d6\u4e01\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/68/film_pangdingsmile_org.png"
                        },
                        {
                            alt: "[\u5f31]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/2018new_ruo_org.png"
                        },
                        {
                            alt: "[NO]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/2018new_no_org.png"
                        },
                        {
                            alt: "[haha]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1d/2018new_hahashoushi_org.png"
                        },
                        {
                            alt: "[\u52a0\u6cb9]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/2018new_jiayou_org.png"
                        },
                        {
                            alt: "[\u4f69\u5947]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c6/hot_pigpeiqi_org.png"
                        },
                        {
                            alt:
                                "[\u5927\u4fa6\u63a2\u76ae\u5361\u4e18\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/pikaqiu_weixiao_org.png"
                        },
                        {
                            alt: "[\u5723\u8bde\u8001\u4eba]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/xmax_oldman01_org.png"
                        },
                        {
                            alt: "[\u7d2b\u91d1\u8349]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e5/gongjiri_zijinhua_org.png"
                        },
                        {
                            alt: "[\u6587\u660e\u905b\u72d7]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/gongyi_wenminglgnew_org.png"
                        },
                        {
                            alt: "[\u795e\u9a6c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_org.gif"
                        },
                        {
                            alt: "[\u9a6c\u5230\u6210\u529f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/mdcg_org.gif"
                        },
                        {
                            alt: "[\u70b8\u9e21\u5564\u9152]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/zhajibeer_org.gif"
                        },
                        {
                            alt: "[\u6700\u53f3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/remen_zuiyou180605_org.png"
                        },
                        {
                            alt: "[\u7ec7]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/zz2_org.gif"
                        },
                        {
                            alt: "[\u4e94\u4ec1\u6708\u997c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/10/2018zhongqiu_yuebing_org.png"
                        },
                        {
                            alt: "[\u7ed9\u4f60\u5c0f\u5fc3\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/qixi2018_xiaoxinxin_org.png"
                        },
                        {
                            alt: "[\u5403\u72d7\u7cae]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/qixi2018_chigouliang_org.png"
                        },
                        {
                            alt: "[\u5f17\u83b1\u89c1\u94b1\u773c\u5f00]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/2018newyear_richdog_org.gif"
                        },
                        {
                            alt: "[\u770b\u6da8]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fe/kanzhangv2_org.gif"
                        },
                        {
                            alt: "[\u770b\u8dcc]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c5/kandiev2_org.gif"
                        },
                        {
                            alt: "[\u5e26\u7740\u5fae\u535a\u53bb\u65c5\u884c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ec/eventtravel_org.gif"
                        },
                        {
                            alt: "[\u661f\u661f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/76/hot_star171109_org.png"
                        },
                        {
                            alt: "[\u534a\u661f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/hot_halfstar_org.png"
                        },
                        {
                            alt: "[\u7a7a\u661f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ff/hot_blankstar_org.png"
                        },
                        {
                            alt: "[\u5927\u6bdb\u7565\u7565]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/yunying_damaoluelue_org.png"
                        },
                        {
                            alt: "[\u5927\u6bdb\u60ca\u8bb6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/yunying_damaojingya_org.png"
                        },
                        {
                            alt: "[\u5927\u6bdb\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/yunying_damaoweixiao_org.png"
                        },
                        {
                            alt: "[\u54ea\u5412\u59d4\u5c48]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/nezha_weiqu02_org.png"
                        },
                        {
                            alt: "[\u54ea\u5412\u5f97\u610f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1d/nezha_deyi02_org.png"
                        },
                        {
                            alt: "[\u54ea\u5412\u5f00\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/nezha_kaixin02_org.png"
                        },
                        {
                            alt: "[\u80d6\u7ea2\u62fd]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/de/angerbird_panghongzhuai_org.png"
                        },
                        {
                            alt: "[\u80d6\u7ea2\u751f\u6c14]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/angerbird_shengqi_org.png"
                        },
                        {
                            alt: "[\u80d6\u7ea2\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/angerbird_panghongweixiao_org.png"
                        },
                        {
                            alt: "[\u98de\u9556\u9ec4\u8df3\u821e]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d2/angerbird_feibiaohuang_org.png"
                        },
                        {
                            alt: "[\u4e09\u4e09\u8e66\u8df3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/33/angerbird_sansna_org.png"
                        },
                        {
                            alt: "[\u5c0fV\u5f00\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/80/angerbird_xiaovkaixin_org.png"
                        },
                        {
                            alt: "[\u5c0fV\u751f\u6c14]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/01/angerbird_xiaov_org.png"
                        },
                        {
                            alt: "[\u4f50\u4f0a\u5356\u840c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/angerbird_zuoyimaimeng_org.png"
                        },
                        {
                            alt: "[\u5c0f\u732a\u60ca\u8bb6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/56/angerbird_xiaozhujingya_org.png"
                        },
                        {
                            alt: "[\u94a2\u94c1\u4fa0]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/avengers_ironman01_org.png"
                        },
                        {
                            alt: "[\u7f8e\u56fd\u961f\u957f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/avengers_captain01_org.png"
                        },
                        {
                            alt: "[\u96f7\u795e]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/avengers_thor01_org.png"
                        },
                        {
                            alt: "[\u6d69\u514b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_hulk01_org.png"
                        },
                        {
                            alt: "[\u9ed1\u5be1\u5987]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0e/avengers_blackwidow01_org.png"
                        },
                        {
                            alt: "[\u9e70\u773c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/93/avengers_clint01_org.png"
                        },
                        {
                            alt: "[\u60ca\u5947\u961f\u957f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/44/avengers_captainmarvel01_org.png"
                        },
                        {
                            alt: "[\u5965\u514b\u8036]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/avengers_aokeye01_org.png"
                        },
                        {
                            alt: "[\u8681\u4eba]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/avengers_antman01_org.png"
                        },
                        {
                            alt: "[\u706d\u9738]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ce/avengers_thanos01_org.png"
                        },
                        {
                            alt: "[\u8718\u86db\u4fa0]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/avengers_spiderman01_org.png"
                        },
                        {
                            alt: "[\u6d1b\u57fa]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/avengers_locki01_org.png"
                        },
                        {
                            alt: "[\u5947\u5f02\u535a\u58eb]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9c/avengers_drstranger01_org.png"
                        },
                        {
                            alt: "[\u51ac\u5175]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/avengers_wintersolider01_org.png"
                        },
                        {
                            alt: "[\u9ed1\u8c79]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/avengers_panther01_org.png"
                        },
                        {
                            alt: "[\u7329\u7ea2\u5973\u5deb]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/avengers_witch01_org.png"
                        },
                        {
                            alt: "[\u5e7b\u89c6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/07/avengers_vision01_org.png"
                        },
                        {
                            alt: "[\u661f\u7235]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/avengers_starlord01_org.png"
                        },
                        {
                            alt: "[\u683c\u9c81\u7279]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/avengers_gelute01_org.png"
                        },
                        {
                            alt: "[\u87b3\u8782\u59b9]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/avengers_mantis01_org.png"
                        },
                        {
                            alt: "[\u65e0\u9650\u624b\u5957]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/38/avengers_gauntlet01_org.png"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u82b1\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/08/dorahaose_org.gif"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u5bb3\u6015]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/dorahaipa_org.gif"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u5403\u60ca]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f0/dorachijing_org.gif"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u6c57]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/dorahan_org.gif"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/jqmweixiao_org.gif"
                        },
                        {
                            alt: "[\u4f34\u6211\u540c\u884c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ef/jqmbwtxing_org.gif"
                        },
                        {
                            alt: "[\u9759\u9999\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/jiqimaojingxiang_org.gif"
                        },
                        {
                            alt: "[\u5927\u96c4\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8e/jiqimaodaxiong_org.gif"
                        },
                        {
                            alt: "[\u80d6\u864e\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2f/jiqimaopanghu_org.gif"
                        },
                        {
                            alt: "[\u5c0f\u592b\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/21/jiqimaoxiaofu_org.gif"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/54/dora_xiao_org.png"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u65e0\u5948]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/dora_wunai_org.png"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u7f8e\u5473]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/21/dora_meiwei_org.png"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u5f00\u5fc3]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/dora_kaixin_org.png"
                        },
                        {
                            alt: "[\u54c6\u5566A\u68a6\u4eb2\u4eb2]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e0/dora_qinqin_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u5fae\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f0/xhrnew_weixiao_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u526a\u5200\u624b]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/63/xhrnew_jiandaoshou_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u4e0d\u5c51]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b2/xhrnew_buxie_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u9ad8\u5174]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/xhrnew_gaoxing_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u60ca\u8bb6]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/xhrnew_jingya_thumb.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u59d4\u5c48]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/79/xhrnew_weiqu_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u574f\u7b11]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/xhrnew_huaixiao_thumb.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u767d\u773c]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e2/xhrnew_baiyan_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u65e0\u5948]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/xhrnew_wunai_org.png"
                        },
                        {
                            alt: "[\u5c0f\u9ec4\u4eba\u5f97\u610f]",
                            src:
                                "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c8/xhrnew_deyi_org.png"
                        }
                    ]
                },
                {
                    title: "图标",
                    type: "emoji",
                    content: [
                        "🌹",
                        "🍀",
                        "🍎",
                        "💰",
                        "📱",
                        "🌙",
                        "🍁",
                        "🍂",
                        "🍃",
                        "🌷",
                        "💎",
                        "🔪",
                        "🔫",
                        "🏀",
                        "⚽",
                        "⚡",
                        "👄",
                        "👍",
                        "🔥"
                    ]
                },
                {
                    title: "表情",
                    type: "emoji",
                    content: [
                        "😀",
                        "😁",
                        "😂",
                        "😃",
                        "😄",
                        "😅",
                        "😆",
                        "😉",
                        "😊",
                        "😋",
                        "😎",
                        "😍",
                        "😘",
                        "😗",
                        "😙",
                        "😚",
                        "😇",
                        "😐",
                        "😑",
                        "😶",
                        "😏",
                        "😣",
                        "😥",
                        "😮",
                        "😯",
                        "😪",
                        "😫",
                        "😴",
                        "😌",
                        "😛",
                        "😜",
                        "😝",
                        "😒",
                        "😓",
                        "😔",
                        "😕",
                        "😲",
                        "😷",
                        "😖",
                        "😞",
                        "😟",
                        "😤",
                        "😢",
                        "😭",
                        "😦",
                        "😧",
                        "😨",
                        "😬",
                        "😰",
                        "😱",
                        "😳",
                        "😵",
                        "😡",
                        "😠"
                    ]
                }
            ];
            this.editor.customConfig.onchange = html => {
                this.text = html;
            };
            this.editor.create();
        },
        commit() {
            if (this.user.role <= 0) {
                this.user = { role: 0 };
                localStorage.removeItem("auth");
                this.dialogFormVisible = true;
                return;
            }
            let comment = {
                user_id: this.user._id,
                article: this.article._id,
                comment: this.text
            };
            let self = this;
            this.axios({
                url: self.url + "/data/ahriblog/comment/",
                method: "post",
                data: JSON.stringify(comment),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(
                function(response) {
                    if (response.data.code === 0) {
                        self.dialogFormVisible = true;
                    } else if (response.data.code === 200) {
                        self.comment.push(response.data.data);
                        self.editor.txt.html("");
                        self.showEditor = false;
                        self.$message({
                            showClose: true,
                            message: "留言成功",
                            type: "success"
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
        },
        pad2(n) {
            return n < 10 ? "0" + n : n;
        },
        generateTimeReqestNumber() {
            var date = new Date();
            return (
                date.getFullYear().toString() +
                "/" +
                this.pad2(date.getMonth() + 1) +
                "/" +
                this.pad2(date.getDate()) +
                " " +
                this.pad2(date.getHours()) +
                ":" +
                this.pad2(date.getMinutes()) +
                ":" +
                this.pad2(date.getSeconds())
            );
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
        this.from = this.$route.params.from || "home";
        if (this.$route.query.hasOwnProperty("cate")) {
            this.cate = this.$route.query.cate;
        } else {
            this.goBack();
            return;
        }
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/get_by_condition/", {
                params: {
                    category: self.cate
                }
            })
            .then(response => {
                self.art_list = response.data.data;
                self.loading = false;
                if (self.$route.query.hasOwnProperty("art")) {
                    self.art_list.forEach(art => {
                        if (art._id == self.$route.query.art) {
                            self.read(art);
                        }
                    });
                } else {
                    self.$router.push({
                        name: "blog-read",
                        query: {
                            art: self.art_list[0]._id,
                            cate: self.$route.query.cate
                        }
                    });
                    self.article = self.art_list[0];
                }
                self.loading2 = false;
            })
            .catch(response => {
                console.log(response);
                self.$message({
                    showClose: true,
                    message: "客户端错误，请求失败"
                });
                self.loading = false;
            });
        this.initEditor();
    }
};
</script>

<style lang="scss" scoped>
.w-e-menu {
    z-index: 99 !important;
}
.w-e-text-container {
    z-index: 88 !important;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
#blog-read {
    padding: 15px;
    .go-back {
        color: #3272fc;
        cursor: pointer;
        &:hover {
            color: #0e3fa8;
        }
    }
    .back {
        padding: 40px 0 10px 30px;
        button {
            background: none;
            padding: 0 10px;
            min-width: 60px;
            height: 40px;
            border: #ccc solid 1px;
            border-radius: 4px;
            cursor: pointer;
            transition: 0.2s;
            &:hover {
                box-shadow: inset #ccc 0 0 6px;
            }
        }
    }
    header {
        padding: 0 0 15px 40px;
        display: flex;
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 40px 0 10px;
        }
        .info {
            font-size: 18px;
            line-height: 40px;
            margin: 15px 40px 0 10px;
        }
    }
    .article {
        padding: 30px 50px;
    }
    .comment {
        .filter {
            display: flex;
        }
        .item {
            display: flex;
            box-shadow: #ccc 0 0 4px;
            margin: 25px;
            .avatar {
                width: 100px;
                box-shadow: 2px 0 0 #ddd;
                img {
                    width: 80px;
                    margin: 10px;
                    border-radius: 50%;
                }
            }
            .text {
                flex: 1;
                padding: 10px;
                .user {
                    width: 770px;
                    border-bottom: #ccc 1px solid;
                    .name {
                        font-size: 20px;
                        font-weight: 600;
                    }
                    .date {
                        font-size: 16px;
                        margin-left: 20px;
                    }
                }
                .container {
                    padding: 10px 20px;
                }
                .reply {
                    margin: 10px 10px 10px 30px;
                    .i {
                        margin: 15px;
                        width: 730px;
                        word-wrap: break-word;
                        border: #ccc 1px solid;
                        padding: 10px;
                        .userinfo {
                            .name {
                                font-weight: 600;
                                font-size: 18px;
                            }
                            .date {
                                font-size: 16px;
                                margin-left: 20px;
                            }
                        }
                        .content {
                            padding: 10px 0 0 32px;
                        }
                    }
                }
                .btn {
                    width: 770px;
                    text-align: right;
                }
            }
        }
    }
}
</style>