import { _getMusicUrl, _downMusic } from "network/detail";
import { formatDate } from "utils/tool";

export const downMusic = {
    methods: {
        /**音乐下载方法
         * @param this.musicList 音乐列表
         * 
         * musicList 暂存音乐列表
         */
        downMusic(index) {
            let music = this.musicList[index];
            let url = null;
            _getMusicUrl(music).then(res => {
                url = res.data.data[0].url;
                if (url == null) {
                    this.$Toast.error(music.name + " 下载地址为空");
                    console.error(music.name + " 下载地址为空");
                    return;
                }
                let realtime = formatDate(new Date(res.data.data[0].time), 'mm:ss');
                music.time = realtime;
                music.longtime = res.data.data[0].time;
                music.url = url;
                // 执行下载并保存
                // saveAs(url, music.name + " - "  +  music.artist + ".mp3");
                _downMusic(music).then(res2 => {
                    // console.log(res2);
                    // 下载完成，更新logo
                    // music.local = true;
                    this.$set(music, "local", true);
                });
            });
        },
    }
}