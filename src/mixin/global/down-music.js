import { _getMusicUrl, _getSongsDetail, _downMusic } from "network/detail";
import { formatDate } from "utils/tool";

export const downMusic = {
    methods: {
        /**音乐下载方法
         * @param this.musicList 音乐列表
         * 
         * musicList 暂存音乐列表
         */
        async downMusic(index) {
            let music = this.musicList[index];
            // 半小时内不重新获取neteasy地址
            if (music.url == null || music.updateTime == null || music.updateTime <= Date.now() - 30 * 60 * 1000) {
                let url = null;
                await _getMusicUrl(music).then(res => {
                    console.log(res);
                    url = res.data.data[0].url || res.data.data[0].src;
                });

                console.log("获取到下载地址啦：", url);
                music.url = url;
            } else if(music.url == null && music.src != null) {
                music.url = music.src;
            }
            if (music.time == null) {// 需要先播放，此情况应该不存在
                let realtime = formatDate(new Date(res.data.data[0].time), 'mm:ss');
                music.time = realtime;
                music.longtime = res.data.data[0].time;
            } else if (music.time == "-:-") {

            } else {
                const [minutes, seconds] = music.time.split(":");
                const longTime = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
                music.longtime = longTime;
            }

            if (music.url == null) {
                this.$Toast.error(music.name + " 下载地址为空");
                console.error(music.name + " 下载地址为空");
                return;
            } else {
                if (music.pic == null || music.pic == "") {
                    // 获取图片地址
                    await _getSongsDetail(music.id).then((res) => {
                        music.pic = res.data.songs[0].al.picUrl;
                    });
                }
                // 执行下载并保存
                // saveAs(url, music.name + " - "  +  music.artist + ".mp3");
                // 延迟两秒执行，否则会502，猜测是访问太频繁的原因
                console.log("延迟两秒");
                setTimeout(() => {
                    console.log("两秒后开始下载");
                    _downMusic(music).then(res2 => {
                        // console.log(res2);
                        // 下载完成，更新logo
                        // music.local = true;
                        this.$set(music, "local", true);
                    });
                }, 2000);
            }
        },
    }
}