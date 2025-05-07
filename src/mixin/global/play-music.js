import { _getMusicUrl, _getSongsDetail } from "network/detail";
import { Song } from "player/init-songs";
import { formatDate } from "utils/tool";

export const playMusic = {
    methods: {
        /**全局音乐播放方法
         * @param this.musicList 音乐列表
         * 
         * musicList 暂存音乐列表
         * playList  处理后的音乐播放列表
         */
        playMusic(index = 0) {
            /**播放列表唯一标识处理，防止一个页面中多个songList播放标时出错
             * 使用songList时一定要加ref="songList"，歌单详情页面id是歌单ID，这样才能获取到正确的唯一标识
             */
            let listId = this.$refs.songList && this.$refs.songList.id || this.id || 'no-id';

            let musicList = this.musicList;
            let url = null;
            let playList = [];
            let nowMusic = musicList[index];
            
            for (let i = 0, length = musicList.length; i < length; i++) {
                /**Song 构造函数参数：1.下标、2.歌曲、3.歌曲路径、4.歌曲id */
                let song = new Song(i, musicList[i], musicList[i].url, musicList[i].id);
                song.updateTime = (new Date()).getTime();// 记录当前播放时间
                playList.push(song);
            }
            // 考虑到因为会获取本地地址，所有无论何种资源都需要走接口
            _getMusicUrl(nowMusic).then(res => {
                url = res.data.data[0].url;
                playList[index].src = playList[index].url = nowMusic.url = url;
                if (res.data.data[0].local) {
                    playList[index].time = res.data.data[0].time;
                    playList[index].local = true;
                    nowMusic.local = true;
                } else {
                    playList[index].local = false;
                    nowMusic.local = false;
                    if (res.data.data[0].time == null || res.data.data[0].time == '-:-' || res.data.data[0].time == 'aN:aN') {
                        playList[index].time = '-:-';
                    } else if (res.data.data[0].time.toString().indexOf(":") < 0) {// 返回的neteasy的time为long类型，但是如果为migu已经存在的time是正常的time
                        playList[index].time = formatDate(new Date(res.data.data[0].time), 'mm:ss');
                    }
                }
                nowMusic.time = playList[index].time;

                if (url == null) {
                    this.$Toast.error(playList[index].name + " 播放地址为空");
                    console.error(playList[index].name + " 播放地址为空");
                } else {
                    nowMusic.updateTime = (new Date()).getTime();// 记录当前播放时间
                    playList[index].updateTime = (new Date()).getTime();// 记录当前播放时间
                    if (nowMusic.pic == null || nowMusic.pic == "") {
                        // 获取图片地址，肯定是neteasy
                        _getSongsDetail(nowMusic.id).then((res) => {
                            playList[index].pic = res.data.songs[0].al.picUrl;
                            nowMusic.pic = playList[index].pic;
                        });
                    }
                }
                /**全局播放事件
                 * @playList         处理后的播放列表
                 * @index            音乐列表中音乐开始播放的位置
                 * @musicList        歌曲列白，用于播放器中歌单展示
                 * @listId               唯一标识，用于显示当前播放歌曲的列表
                 */
                this.$bus.$emit("playMusic", playList, index, musicList, listId);
            });
            // for (let i = 0, length = musicList.length; i < length; i++) {
            //     _getMusicUrl(musicList[i].id).then(res => {
            //         url = res.data.data[0].url;
            //         /**Song 构造函数参数：1.下标、2.歌曲、3.歌曲路径、4.歌曲id */
            //         let song = new Song(i, musicList[i], url, musicList[i].id);
            //         playList.push(song);
            //         if (i == musicList.length - 1) {
            //             /**全局播放事件
            //              * @playList         处理后的播放列表
            //              * @index            音乐列表中音乐开始播放的位置
            //              * @musicList        歌曲列白，用于播放器中歌单展示
            //              * @listId               唯一标识，用于显示当前播放歌曲的列表
            //              */
            //             this.$bus.$emit("playMusic", playList, index,musicList,listId);
            //         }
            //     });
            // }
        },
    }
}