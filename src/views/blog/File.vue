<template>
    <div id="blog-file" class="blog-file">
        <div class="file">
            <h1>归档:</h1>
            <br />
            <el-timeline>
                <el-timeline-item v-for="i in data" :timestamp="i.date" placement="top">
                    <el-card>
                        <div
                            class="article"
                            v-for="j in i.allData"
                            @click="read(j)"
                        >{{ j.name }}&nbsp;--&nbsp;{{ j.username }}</div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
export default {
    name: "blog-file",
    data() {
        return {
            data: []
        };
    },
    created() {},
    methods: {
        read(val) {
            localStorage.setItem("article", JSON.stringify(val));
            val.from = "blog-file";
            this.$router.push({ name: "blog-read", params: val });
        },
        classificate(article) {
            let data = this.sort_pro(article, "date");
            data.sort((a, b) => {
                return a.date > b.date ? -1 : 1;
            });
            this.data = data;
        },
        sort_pro(data, name) {
            let c = [];
            let d = {};
            data.forEach(element => {
                if (!d[element[name]]) {
                    c.push({
                        [name]: element[name],
                        allData: [element]
                    });
                    d[element[name]] = element;
                } else {
                    c.forEach(ele => {
                        if (ele[name] == element[name]) {
                            ele.allData.push(element);
                        }
                    });
                }
            });
            return c;
        }
    },
    mounted() {
        let self = this;
        this.axios
            .get(self.url + "/data/ahriblog/articles/")
            .then(response => {
                self.classificate(response.data.data);
            })
            .catch(response => {
                console.log(response);
            });
    }
};
</script>

<style lang="scss" scoped>
#blog-file {
    .file {
        padding: 60px 100px;
        .article {
            margin: 10px;
            font-size: 16px;
            cursor: pointer;
            transition: 0.2s;
            &:hover {
                color: #888;
                text-decoration: underline;
            }
        }
    }
}
</style>