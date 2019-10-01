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
                    </div> -->
                    <div class="item" @click="goto('blog-category')">
                        <span class="icon">
                            <i class="iconfont akcategory"></i>分类
                        </span>
                        <span class="label">{{ n }}</span>
                    </div>
                    <div class="item" @click="goto('blog-article')">
                        <span class="icon">
                            <i class="iconfont akicon-articles"></i>文章
                        </span>
                        <span class="label">{{ m }}</span>
                    </div>
                    <div class="item" @click="goto('blog-search')">
                        <span class="icon">
                            <i class="iconfont akSearch"></i>搜索
                        </span>
                    </div>
                    <div class="item" @click="goto('blog-about')">
                        <span class="icon">
                            <i class="iconfont akabout"></i>关于
                        </span>
                    </div>
                    <div class="item" @click="goto('book-bookshelf')">
                        <span class="icon">
                            <i class="iconfont akbook"></i>文档
                        </span>
                        <span class="label">{{ x }}</span>
                    </div>
                </div>
                <div class="contact">
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
                <div class="link">
                    <a href="https://admin.ahriknow.com" target="_black">Ahriknow Admin</a>
                </div>
            </aside>
            <section ref="section">
                <div class="content">
                    <div id="top"></div>
                    <router-view />
                    <footer>
                        <hr style="height:2px;border:none;border-top:2px dashed #aaa;" />
                        <div class="msg" @click="smoothscroll">狸知 - Ahriknow</div>
                    </footer>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: "home",
    data() {
        return {
            user: {
                role: 0
            },
            m: 0,
            n: 0,
            x: 0
        };
    },
    methods: {
        goto(path) {
            if (this.$route.name != path) this.$router.push({ name: path, params: {from: this.$route.name} });
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
        this.axios
            .get(self.url + "/data/ahriblog/count/")
            .then(response => {
                self.m = response.data.data.article;
                self.n = response.data.data.category;
                self.x = response.data.data.book;
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
        width: 1200px;
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
                height: 160px;
                background: #222;
                text-align: center;
                padding-top: 40px;
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
                height: 320px;
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
                margin: 15px 0;
                a {
                    text-decoration: none;
                    color: #888;
                    transition: 0.2s;
                    &:hover {
                        color: #444;
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
                min-height: 100%;
                position: relative;
                padding-bottom: 100px;
                footer {
                    position: absolute;
                    width: 100%;
                    height: 80px;
                    bottom: 0;
                    left: 0;
                    .msg {
                        text-align: center;
                        line-height: 70px;
                        font-size: 26px;
                        color: #aaa;
                        cursor: pointer;
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
